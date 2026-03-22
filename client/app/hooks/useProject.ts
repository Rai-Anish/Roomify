import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios.js";
import type { ApiResponse, Project } from "../types/index.js";

// --- QUERIES ---

export const useMyProjects = () => {
    return useQuery({
        queryKey: ["projects", "my"],
        queryFn: async () => {
            // Removed leading slash to match axiosInstance baseURL
            const response = await axiosInstance.get<ApiResponse<{ projects: Project[] }>>(
                "projects/my"
            );
            return response.data.data.projects;
        },
    });
};

export const useCommunityProjects = () => {
    return useQuery({
        queryKey: ["projects", "community"],
        queryFn: async () => {
            const response = await axiosInstance.get<ApiResponse<{ projects: Project[] }>>(
                "projects/community"
            );
            return response.data.data.projects;
        },
    });
};

export const useProject = (id: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: ["projects", id],
        queryFn: async () => {
            const response = await axiosInstance.get<ApiResponse<{ project: Project }>>(
                `projects/${id}`
            );
            return response.data.data.project;
        },
        enabled: !!id && enabled,
        retryDelay: 1000,
    });
};

// --- MUTATIONS ---

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await axiosInstance.post<ApiResponse<{ project: Project }>>(
                "projects", 
                formData, 
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data.data.project;
        },
        onSuccess: () => {
            // Refresh "my projects" list so the new project shows up
            queryClient.invalidateQueries({ queryKey: ["projects", "my"] });
            queryClient.invalidateQueries({queryKey:["projects", "community"]})
        },
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number;
            data: { title?: string; visibility?: "PRIVATE" | "COMMUNITY" };
        }) => {
            const response = await axiosInstance.put<ApiResponse<{ project: Project }>>(
                `projects/${id}`, 
                data
            );
            return response.data.data.project;
        },
        onSuccess: (updatedProject, { id }) => {
            // Update the cache for the individual project immediately
            queryClient.setQueryData(["projects", id], updatedProject);
            
            // Invalidate lists to ensure consistency across the app
            queryClient.invalidateQueries({ queryKey: ["projects", "my"] });
            queryClient.invalidateQueries({ queryKey: ["projects", "community"] });
        },
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await axiosInstance.delete(`projects/${id}`);
            return response.data;
        },
        onSuccess: () => {
            // Clear all project queries to ensure deleted data isn't shown anywhere
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
};