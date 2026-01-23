import fs from "fs";
import path from "path";
import sharp from "sharp";

const extensionGroups = {
  image: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  document: [".pdf", ".doc", ".docx", ".txt"],
  video: [".mp4", ".mov", ".avi"],
};

// internal async handler only for images
async function convertToWebp(file, uploadDir, folderName) {
  const fileName = `${Date.now()}.webp`;
  const fullPath = path.join(uploadDir, fileName);

  await sharp(file.buffer)
    .webp({ quality: 80 })
    .toFile(fullPath);

  return {
    fileName,
    fullPath,
    relativePath: `/uploads/${folderName}/${fileName}`,
    isImage: true,
  };
}

export const fileHandler = {
  validateExtension(filename, type) {
    const ext = path.extname(filename).toLowerCase();
    if (!extensionGroups[type]?.includes(ext)) {
      throw new Error(`Invalid file type. Allowed: ${extensionGroups[type].join(", ")}`);
    }
  },

  saveFile(file, folderName = "files") {
    const uploadDir = path.join(process.cwd(), "uploads", folderName);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const isImage = extensionGroups.image.includes(ext);

    // If file is image -> convert to webp async BUT return resolved result
    if (isImage) {
      return convertToWebp(file, uploadDir, folderName)
        .then(result => result)
        .catch(err => {
          console.error("Image convert failed, saving original file:", err.message);

          // fallback to original file if conversion fails
          const fileName = `${Date.now()}-${file.originalname}`;
          const fullPath = path.join(uploadDir, fileName);
          fs.writeFileSync(fullPath, file.buffer);

          return {
            fileName,
            fullPath,
            relativePath: `/uploads/${folderName}/${fileName}`,
            isImage: true,
          };
        });
    }

    // non-image — default old behavior
    const fileName = `${Date.now()}-${file.originalname}`;
    const fullPath = path.join(uploadDir, fileName);
    fs.writeFileSync(fullPath, file.buffer);

    return {
      fileName,
      fullPath,
      relativePath: `/uploads/${folderName}/${fileName}`,
      isImage: false,
    };
  },
};
