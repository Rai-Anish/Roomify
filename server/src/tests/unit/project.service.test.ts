import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../../config/db.js";
import {
    createProject,
    getUserProjects,
    getCommunityProjects,
    getProjectById,
    deleteProject,
} from "../../services/project.service.js";

beforeEach(() => {
    vi.clearAllMocks();
});

const mockProject = {
    id: 1,
    title: "My Floor Plan",
    prompt: "",
    originalImageUrl: "https://cloudinary.com/original.jpg",
    imageUrl: "https://cloudinary.com/render.jpg",
    visibility: "PRIVATE" as const,
    provider: "comfyui",
    userId: 1,
    user: { username: "testuser", avatar: null },
    createdAt: new Date(),
    updatedAt: new Date(),
};

const mockFile = {
    buffer: Buffer.from("fake-image-data"),
    mimetype: "image/png",
    originalname: "floorplan.png",
} as unknown as Express.Multer.File;

describe("project.service", () => {
    describe("createProject", () => {
        it("should create a project and start async processing", async () => {
            vi.mocked(prisma.project.create).mockResolvedValue(mockProject as any);

            const result = await createProject(
                1,
                { title: "My Floor Plan", visibility: "PRIVATE", provider: "comfyui" },
                mockFile
            );

            expect(result.title).toBe("My Floor Plan");
            expect(prisma.project.create).toHaveBeenCalledOnce();
        });
    });

    describe("getUserProjects", () => {
        it("should return projects for a user", async () => {
            vi.mocked(prisma.project.findMany).mockResolvedValue([mockProject] as any);

            const result = await getUserProjects(1);

            expect(result).toHaveLength(1);
            expect(prisma.project.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { userId: 1 } })
            );
        });

        it("should return empty array if no projects", async () => {
            vi.mocked(prisma.project.findMany).mockResolvedValue([]);

            const result = await getUserProjects(999);
            expect(result).toHaveLength(0);
        });
    });

    describe("getCommunityProjects", () => {
        it("should only return COMMUNITY projects", async () => {
            vi.mocked(prisma.project.findMany).mockResolvedValue([
                { ...mockProject, visibility: "COMMUNITY" },
            ] as any);

            await getCommunityProjects();

            expect(prisma.project.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { visibility: "COMMUNITY" },
                })
            );
        });
    });

    describe("getProjectById", () => {
        it("should return a community project without auth", async () => {
            vi.mocked(prisma.project.findUnique).mockResolvedValue({
                ...mockProject,
                visibility: "COMMUNITY",
            } as any);

            const result = await getProjectById(1, undefined);
            expect(result.id).toBe(1);
        });

        it("should return a private project for the owner", async () => {
            vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as any);

            const result = await getProjectById(1, 1);
            expect(result.id).toBe(1);
        });

        it("should throw 403 for private project viewed by non-owner", async () => {
            vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as any);

            await expect(getProjectById(1, 99)).rejects.toMatchObject({ statusCode: 403 });
        });

        it("should throw 404 if project not found", async () => {
            vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

            await expect(getProjectById(999, 1)).rejects.toMatchObject({ statusCode: 404 });
        });
    });

    describe("deleteProject", () => {
        it("should delete a project", async () => {
            vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as any);
            vi.mocked(prisma.project.delete).mockResolvedValue(mockProject as any);

            await deleteProject(1,1);
            expect(prisma.project.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });
    });
});