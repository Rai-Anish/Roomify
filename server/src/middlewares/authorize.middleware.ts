import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";

export const authorizeProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = parseInt(req.params.id);
        const userId = req.user!.id;

        const project = await prisma.project.findUnique({
            where: { id: projectId }
        });

        if (!project) throw new ApiError(404, "Project not found");

        if (project.userId !== userId) throw new ApiError(403, "You do not have permission to perform this action");

        next();

    } catch {
        return res.status(500).json({ error: "Internal server error" });
    }
};