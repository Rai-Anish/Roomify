import { prisma } from "../config/db.js";
import { CreateProjectInput, UpdateProjectInput } from "../types/project.types.js";
import { Visibility } from "@prisma/client";
import { generateRender as generateWithGemini } from "./gemini.service.js";
import { generateRender as generateWithComfyUI } from "./comfyui.service.js";

import { uploadToCloudinary } from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";

export const createProject = async (
    userId: number,
    input: CreateProjectInput,
    file: Express.Multer.File
) => {
    // 1. upload original floor plan to cloudinary
    const originalImageUrl = await uploadToCloudinary(
        file.buffer,
        file.mimetype,
        "roomify/originals"
    );

    // 2. generate render using selected provider
    let imageBuffer: Buffer;
    let mimeType: string;

    if (input.provider === "gemini") {
        if (!process.env.GEMINI_API_KEY) {
            throw new ApiError(400, "Gemini API key is not configured");
        }
        ({ imageBuffer, mimeType } = await generateWithGemini(file.buffer, file.mimetype));
    } else {
        if (!process.env.COMFYUI_URL) {
            throw new ApiError(400, "ComfyUI URL is not configured");
        }
        ({ imageBuffer, mimeType } = await generateWithComfyUI(file.buffer, file.mimetype));
    }

    // 3. upload generated render to cloudinary
    const imageUrl = await uploadToCloudinary(
        imageBuffer,
        mimeType,
        "roomify/renders"
    );

    // 4. save to db
    return prisma.project.create({
        data: {
            title: input.title,
            prompt: input.prompt ?? "",
            visibility: input.visibility,
            originalImageUrl,
            imageUrl,
            userId,
        },
        include: {
            user: {
                select: { username: true, avatar: true }
            }
        }
    });
};

export const getUserProjects = async (userId: number) => {
    return prisma.project.findMany({
        where: { userId },
        include: {
            user: {
                select: { username: true, avatar: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });
};

export const getCommunityProjects = async () => {
    return prisma.project.findMany({
        where: { visibility: Visibility.COMMUNITY },
        include: {
            user: {
                select: { username: true, avatar: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });
};

export const getProjectById = async (id: number, userId?: number) => {
    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            user: {
                select: { username: true, avatar: true }
            }
        }
    });

    if (!project) throw new ApiError(404,"Project not found");

    // if private, only owner can view
    if (project.visibility === Visibility.PRIVATE && project.userId !== userId) {
        throw new ApiError(403,"You do not have permission to view this project");
    }

    return project;
};

export const updateProject = async (id: number, input: UpdateProjectInput) => {
    return prisma.project.update({
        where: { id },
        data: input,
        include: {
            user: {
                select: { username: true, avatar: true }
            }
        }
    });
};

export const deleteProject = async (id: number) => {
    return prisma.project.delete({ where: { id } });
};