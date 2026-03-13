import { prisma } from "../config/db.js";
import { CreateProjectInput, UpdateProjectInput } from "../types/project.types.js";
import { Visibility } from "@prisma/client";
import ApiError from "../utils/ApiError.js";

export const createProject = async (userId: number, input: CreateProjectInput) => {
    return prisma.project.create({
        data: {
            ...input,
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