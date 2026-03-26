import { prisma } from "../config/db.js";
import { CreateProjectInput, UpdateProjectInput } from "../types/project.types.js";
import { Visibility } from "@prisma/client";


import { uploadToCloudinary, getPublicIdFromUrl, deleteFromCloudinary } from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import { projectQueue } from "../jobs/queue.js";

export const createProject = async (
    userId: number,
    input: CreateProjectInput,
    file: Express.Multer.File
) => {
    const originalImageUrl = await uploadToCloudinary(
        file.buffer,
        file.mimetype,
        "roomify/originals"
    );

    const project = await prisma.project.create({
        data: {
            title: input.title,
            prompt: input.prompt ?? "",
            visibility: input.visibility,
            originalImageUrl,
            imageUrl: '', 
            userId,
        },
    });

    await projectQueue.add("render-project", {
        projectId: project.id,
        provider: input.provider,
        fileBuffer: file.buffer.toString("base64"),
        mimeType: file.mimetype
    });

    return project;
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

export const updateProject = async (id: number, input: UpdateProjectInput, userId: number) => {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new ApiError(404, "Project not found");
    if (project.userId !== userId) throw new ApiError(403, "You do not have permission to update this project");

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

export const deleteProject = async (id: number, userId: number) => {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new ApiError(404, "Project not found");
    if (project.userId !== userId) throw new ApiError(403, "You do not have permission to delete this project");

    if (project.imageUrl && !project.imageUrl.startsWith("FAILED")) {
        const publicId = getPublicIdFromUrl(project.imageUrl);
        if (publicId) await deleteFromCloudinary(publicId).catch(console.error);
    }
    if (project.originalImageUrl) {
        const publicId = getPublicIdFromUrl(project.originalImageUrl);
        if (publicId) await deleteFromCloudinary(publicId).catch(console.error);
    }

    return prisma.project.delete({ where: { id } });
};