// src/middlewares/upload.ts
import multer from "multer";
import path from "path";
import fs from "fs";

// tạo thư mục tạm nếu chưa có
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

export const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 }, // giới hạn 5MB
});
