import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { prisma } from "../../config/db.js";
import { generateAccessToken } from "../../utils/jwt.utils.js";

beforeEach(() => {
    vi.clearAllMocks();
});

const mockUser = {
    id: 1,
    email: "test@example.com",
    username: "testuser",
    avatar: null,
    isVerified: true,
    password: "hashed",
    provider: "LOCAL",
    googleId: null,
    verificationToken: null,
    verificationTokenExpiry: null,
    createdAt: new Date(),
    updatedAt: new Date(),
};

const mockProject = {
    id: 1,
    title: "My Floor Plan",
    prompt: "",
    originalImageUrl: "https://cloudinary.com/original.jpg",
    imageUrl: "https://cloudinary.com/render.jpg",
    visibility: "COMMUNITY",
    provider: "comfyui",
    userId: 1,
    user: { username: "testuser", avatar: null },
    createdAt: new Date(),
    updatedAt: new Date(),
};

const getAuthToken = () =>
    generateAccessToken({ id: 1, email: "test@example.com", username: "testuser" });

describe("GET /api/projects/community", () => {
    it("should return community projects without auth", async () => {
        vi.mocked(prisma.project.findMany).mockResolvedValue([mockProject] as any);

        const res = await request(app).get("/api/projects/community");

        expect(res.status).toBe(200);
        expect(res.body.data.projects).toHaveLength(1);
    });
});

describe("GET /api/projects/my", () => {
    it("should return user projects when authenticated", async () => {
        vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
        vi.mocked(prisma.project.findMany).mockResolvedValue([mockProject] as any);

        const res = await request(app)
            .get("/api/projects/my")
            .set("Authorization", `Bearer ${getAuthToken()}`);

        expect(res.status).toBe(200);
        expect(res.body.data.projects).toHaveLength(1);
    });

    it("should return 401 without auth", async () => {
        const res = await request(app).get("/api/projects/my");
        expect(res.status).toBe(401);
    });
});

describe("GET /api/projects/:id", () => {
    it("should return community project without auth", async () => {
        vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as any);

        const res = await request(app).get("/api/projects/1");

        expect(res.status).toBe(200);
        expect(res.body.data.project.id).toBe(1);
    });

    it("should return 403 for private project without auth", async () => {
        vi.mocked(prisma.project.findUnique).mockResolvedValue({
            ...mockProject,
            visibility: "PRIVATE",
        } as any);

        const res = await request(app).get("/api/projects/1");
        expect(res.status).toBe(403);
    });

    it("should return private project to owner", async () => {
        vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
        vi.mocked(prisma.project.findUnique).mockResolvedValue({
            ...mockProject,
            visibility: "PRIVATE",
            userId: 1,
        } as any);

        const res = await request(app)
            .get("/api/projects/1")
            .set("Authorization", `Bearer ${getAuthToken()}`);

        expect(res.status).toBe(200);
    });

    it("should return 404 for non-existent project", async () => {
        vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

        const res = await request(app).get("/api/projects/999");
        expect(res.status).toBe(404);
    });
});

describe("DELETE /api/projects/:id", () => {
    it("should delete project as owner", async () => {
        vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
        vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as any);
        vi.mocked(prisma.project.delete).mockResolvedValue(mockProject as any);

        const res = await request(app)
            .delete("/api/projects/1")
            .set("Authorization", `Bearer ${getAuthToken()}`);

        expect(res.status).toBe(200);
    });

    it("should return 401 without auth", async () => {
        const res = await request(app).delete("/api/projects/1");
        expect(res.status).toBe(401);
    });
});