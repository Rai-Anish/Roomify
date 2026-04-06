import { Worker, Job } from "bullmq";
import { connection } from "./queue.js";
import { generateRender as generateWithGemini } from "../services/gemini.service.js";
import { generateRender as generateWithComfyUI } from "../services/comfyui.service.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { prisma } from "../config/db.js";
import { sendSseEvent } from "../utils/sse.js";

export interface ProjectJobData {
    projectId: number;
    provider: string;
    fileBuffer: string; // Base64 encoded
    mimeType: string;
}

export const initProjectWorker = () => {
    if (!connection) {
        console.log("⚠️ BullMQ Worker disabled - REDIS_URL not configured");
        return;
    }

    const worker = new Worker(
        "project-render-queue",
        async (job: Job<ProjectJobData>) => {
            const { projectId, provider, fileBuffer, mimeType } = job.data;
            const buffer = Buffer.from(fileBuffer, "base64");

            let imageBuffer: Buffer;
            let outputMimeType: string;

            if (provider === "gemini") {
                ({ imageBuffer, mimeType: outputMimeType } = await generateWithGemini(buffer, mimeType));
            } else {
                ({ imageBuffer, mimeType: outputMimeType } = await generateWithComfyUI(buffer, mimeType));
            }

            const imageUrl = await uploadToCloudinary(
                imageBuffer,
                outputMimeType,
                "roomify/renders"
            );

            const proj = await prisma.project.update({
                where: { id: projectId },
                data: { imageUrl },
            });
            
            sendSseEvent(proj.userId, "project_updated", { id: projectId, status: "completed", imageUrl });
            
            return imageUrl;
        },
        { 
            connection,
            concurrency: 2 // Max 2 concurrent image generations to respect ComfyUI limits
        }
    );

    worker.on("failed", async (job, err) => {
        console.error(`❌ Job ${job?.id} failed:`, err);
        if (job) {
            try {
                // Fetch the project to get the original image URL
                const proj = await prisma.project.findUnique({
                    where: { id: job.data.projectId }
                });
                
                if (proj) {
                    // Try to delete original image from cloudinary if it exists
                    if (proj.originalImageUrl) {
                        const { getPublicIdFromUrl, deleteFromCloudinary } = await import("../utils/cloudinary.js");
                        const publicId = getPublicIdFromUrl(proj.originalImageUrl);
                        if (publicId) {
                            await deleteFromCloudinary(publicId).catch(e => console.error("Cloudinary delete error:", e));
                        }
                    }

                    // Delete the project from database
                    await prisma.project.delete({
                        where: { id: job.data.projectId },
                    });
                    
                    // Notify the client that the project failed (so it can display error UI before redirecting/cleaning up)
                    sendSseEvent(proj.userId, "project_failed", { id: job.data.projectId, status: "failed" });
                }
            } catch (dbErr) {
                console.error("Error cleaning up failed project:", dbErr);
            }
        }
    });

    console.log("✓ BullMQ Project Worker initialized");
};