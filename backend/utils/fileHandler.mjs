import fs from "fs";
import path from "path";
import sharp from "sharp";

const extensionGroups = {
  image: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  document: [".pdf", ".doc", ".docx", ".txt"],
  video: [".mp4", ".mov", ".avi"],
};

// Internal async worker
function convertImage(file, uploadDir, folderName, ext) {
  const fileName = `${Date.now()}.webp`;
  const fullPath = path.join(uploadDir, fileName);

  return sharp(file.buffer)
    .webp({ quality: 80 })
    .toFile(fullPath)
    .then(() => ({
      fileName,
      fullPath,
      relativePath: `/uploads/${folderName}/${fileName}`,
      isImage: true,
    }))
    .catch(err => {
      console.error("Webp conversion failed:", err.message);

      // fallback to original
      const fallbackName = `${Date.now()}-${file.originalname}`;
      const fallbackFull = path.join(uploadDir, fallbackName);
      fs.writeFileSync(fallbackFull, file.buffer);

      return {
        fileName: fallbackName,
        fullPath: fallbackFull,
        relativePath: `/uploads/${folderName}/${fallbackName}`,
        isImage: true,
      };
    });
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

    // IMPORTANT: Ensure return is resolved synchronously
    // using async worker but returning Promise
    if (isImage) {
      return convertImage(file, uploadDir, folderName, ext);
    }

    // non-image → behave same as old
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
