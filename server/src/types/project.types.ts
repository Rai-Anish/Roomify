import { z } from "zod";
import { Visibility } from "@prisma/client";

export const createProjectSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    prompt: z.string().optional(), 
    visibility: z.enum(Visibility).default(Visibility.PRIVATE),
    provider: z.enum(["comfyui", "gemini"]).default("comfyui"),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;