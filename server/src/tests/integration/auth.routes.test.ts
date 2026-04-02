import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../app.js";
import { prisma } from "../../config/db.js";

beforeEach(() => {
    vi.clearAllMocks();
});

const mockUser = {
    id: 1,
    email: "test@example.com",
    username: "testuser",
    password: "",
    avatar: null,
    isVerified: true,
    verificationToken: null,
    verificationTokenExpiry: null,
    provider: "LOCAL",
    googleId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe("POST /api/auth/register", () => {
    it("should register a new user and return 201", async () => {
        vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
        vi.mocked(prisma.user.create).mockResolvedValue({
            ...mockUser,
            isVerified: false,
        } as any);

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                email: "test@example.com",
                username: "testuser",
                password: "Password123",
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.email).toBe("test@example.com");
    });

    it("should return 400 if required fields are missing", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ email: "test@example.com" });

        expect(res.status).toBe(400);
    });

    it("should return 409 if email already exists", async () => {
        vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as any);

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                email: "test@example.com",
                username: "newuser",
                password: "Password123",
            });

        expect(res.status).toBe(409);
    });
});

describe("POST /api/auth/login", () => {
    it("should login and return access token + set cookie", async () => {
        const hashedPassword = await bcrypt.hash("Password123", 12);
        vi.mocked(prisma.user.findUnique).mockResolvedValue({
            ...mockUser,
            password: hashedPassword,
        } as any);

        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@example.com", password: "Password123" });

        expect(res.status).toBe(200);
        expect(res.body.data.accessToken).toBeDefined();
        expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should return 401 with wrong password", async () => {
        const hashedPassword = await bcrypt.hash("correctpassword", 12);
        vi.mocked(prisma.user.findUnique).mockResolvedValue({
            ...mockUser,
            password: hashedPassword,
        } as any);

        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@example.com", password: "wrongpassword" });

        expect(res.status).toBe(401);
    });

    it("should return 400 if fields are missing", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@example.com" });

        expect(res.status).toBe(400);
    });
});

describe("GET /api/auth/me", () => {
    it("should return user when authenticated", async () => {
        const { generateAccessToken } = await import("../../utils/jwt.utils.js");
        vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

        const token = generateAccessToken({
            id: 1,
            email: "test@example.com",
            username: "testuser",
        });

        const res = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data.user).toBeDefined();
    });

    it("should return 401 without token", async () => {
        const res = await request(app).get("/api/auth/me");
        expect(res.status).toBe(401);
    });

    it("should return 401 with invalid token", async () => {
        const res = await request(app)
            .get("/api/auth/me")
            .set("Authorization", "Bearer invalidtoken");

        expect(res.status).toBe(401);
    });
});

describe("POST /api/auth/logout", () => {
    it("should clear the refresh token cookie", async () => {
        const res = await request(app).post("/api/auth/logout");

        expect(res.status).toBe(200);

        // Supertest's .get() returns string[] | undefined for Set-Cookie
        const cookies = res.get('Set-Cookie');
        
        // Find the specific cookie and verify it's being cleared
        const refreshCookie = cookies?.find((c) => c.includes("refreshToken"));
        
        expect(refreshCookie).toBeDefined();
        // Standard behavior for res.clearCookie()
        expect(refreshCookie).toMatch(/Expires=Thu, 01 Jan 1970|Max-Age=0/);
    });
});