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
      const allowed = extensionGroups[type].join(", ");
      const err = new Error(
        `Invalid file type${ext ? ` (${ext})` : ""}. Please upload only these formats: ${allowed}`
      );
      err.isFileError = true;
      err.statusCode = 400;
      throw err;
    }
  },

  saveFile(file, folderName = "files") {
    const uploadDir = path.join(process.cwd(), "uploads", folderName);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const isImage = extensionGroups.image.includes(ext);

    // ✨ Convert only images to webp but keep logic same
    if (isImage) {
      const fileName = `${Date.now()}.webp`;
      const fullPath = path.join(uploadDir, fileName);

      // convert using sharp but BLOCK sync return via fallback
      try {
        sharp(file.buffer)
          .webp({ quality: 80 })
          .toFile(fullPath);
      } catch (err) {
        console.error("Error converting to webp:", err.message);
        fs.writeFileSync(fullPath, file.buffer);
      }

      return {
        fileName,
        fullPath,
        relativePath: `/uploads/${folderName}/${fileName}`,
      };
    }

    // All non-images behave exactly like before
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
