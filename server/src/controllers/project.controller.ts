import { Request, Response } from "express";
import * as projectService from "../services/project.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const createProject = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new ApiError(400, "Floor plan image is required");

    const project = await projectService.createProject(
        req.user!.id,
        req.body,
        req.file  // ← pass file to service
    );

    res.status(201).json(new ApiResponse(201, { project }, "Project created successfully"));
});

export const getMyProjects = asyncHandler (async (req: Request, res: Response) => {
    const projects = await projectService.getUserProjects(req.user!.id);
    res.status(200).json(new ApiResponse(200,{ projects },"Project fetched successfully"));
});

export const getCommunityProjects = asyncHandler (async (req: Request, res: Response) => {
        const projects = await projectService.getCommunityProjects();
        res.status(200).json(new ApiResponse(200,{ projects },"Community project fetched successfully"));
});

export const getProject = asyncHandler (async (req: Request, res: Response) => {
        const project = await projectService.getProjectById(
            parseInt(req.params.id),
            req.user?.id
        );
        res.status(200).json(new ApiResponse(200,{ project },"Project fetched successfully"));
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.updateProject(parseInt(req.params.id), req.body, req.user!.id);
    res.status(200).json(new ApiResponse(200, { project }, "Project updated successfully"));
});

export const deleteProject = asyncHandler (async (req: Request, res: Response) => {
    await projectService.deleteProject(parseInt(req.params.id), req.user!.id);
    res.status(200).json(new ApiResponse(200,{},"Project deleted successfully"));
});