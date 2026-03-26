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
            const proj = await prisma.project.update({
                where: { id: job.data.projectId },
                data: { imageUrl: "FAILED" },
            });
            sendSseEvent(proj.userId, "project_failed", { id: job.data.projectId, status: "failed" });
        }
    });

    console.log("✓ BullMQ Project Worker initialized");
};