import fs from "fs";
import path from "path";

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

  saveFile(file, folderName = "files") {
    const uploadDir = path.join(process.cwd(), "uploads", folderName);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueName = `${Date.now()}-${file.originalname}`;
    const fullPath = path.join(uploadDir, uniqueName);

    fs.writeFileSync(fullPath, file.buffer);

    return {
      fileName: uniqueName,
      fullPath,
      relativePath: `/uploads/${folderName}/${uniqueName}`,
    };
  },
};
