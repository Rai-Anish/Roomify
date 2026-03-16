import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
    buffer: Buffer,
    mimeType: string,
    folder: string = "roomify"
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
                format: mimeType.split("/")[1], // "image/jpeg" → "jpeg"
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result!.secure_url);
            }
        );

        uploadStream.end(buffer);
    });
};