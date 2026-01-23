import fs from "fs";
import path from "path";
import sharp from "sharp";

const extensionGroups = {
  image: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  document: [".pdf", ".doc", ".docx", ".txt"],
  video: [".mp4", ".mov", ".avi"],
};

export const fileHandler = {
  validateExtension(filename, type) {
    const ext = path.extname(filename).toLowerCase();
    if (!extensionGroups[type]?.includes(ext)) {
      throw new Error(`Invalid file type. Allowed: ${extensionGroups[type].join(", ")}`);
    }
  },

  async saveFile(file, folderName = "files") {
    const uploadDir = path.join(process.cwd(), "uploads", folderName);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const isImage = extensionGroups.image.includes(ext);

    let fileName;
    let fullPath;
    let relativePath;

    if (isImage) {
      fileName = `${Date.now()}.webp`;
      fullPath = path.join(uploadDir, fileName);

      await sharp(file.buffer)
        .webp({ quality: 80 }) // adjustable
        .toFile(fullPath);

      relativePath = `/uploads/${folderName}/${fileName}`;
    } else {
      fileName = `${Date.now()}-${file.originalname}`;
      fullPath = path.join(uploadDir, fileName);
      fs.writeFileSync(fullPath, file.buffer);
      relativePath = `/uploads/${folderName}/${fileName}`;
    }

    return {
      fileName,
      fullPath,
      relativePath,
      isImage,
    };
  },
};
