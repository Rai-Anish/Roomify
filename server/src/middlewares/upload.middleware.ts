// src/middlewares/upload.middleware.ts
import multer from "multer";
import ApiError from "../utils/ApiError.js";

const storage = multer.memoryStorage(); // store in memory as buffer, not on disk

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml", "image/webp"];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError(400, "Only JPG, PNG, SVG and WebP images are allowed") as any);
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    }
});