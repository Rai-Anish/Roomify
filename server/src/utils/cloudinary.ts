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

export const getPublicIdFromUrl = (url: string): string | null => {
    try {
        const parts = url.split("/upload/");
        if (parts.length < 2) return null;
        
        let path = parts[1]; 
        path = path.replace(/^v\d+\//, ''); 
        return path.replace(/\.[^/.]+$/, ""); 
    } catch {
        return null;
    }
};

export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) reject(error);
            else resolve(result.result === 'ok');
        });
    });
};