import { describe, it, expect, vi } from "vitest";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/db.js";
import {
    registerUser,
    loginUser,
    verifyEmail,
} from "../../services/auth.service.js";

const mockUser = {
    id: 1,
    email: "test@example.com",
    username: "testuser",
    password: "$2a$12$hashedpassword",
    avatar: null,
    isVerified: true,
    verificationToken: null,
    verificationTokenExpiry: null,
    provider: "LOCAL",
    googleId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe("auth.service", () => {
    describe("registerUser", () => {
        it("should register a new user successfully", async () => {
            vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
            vi.mocked(prisma.user.create).mockResolvedValue({
                ...mockUser,
                isVerified: false,
            } as any);

            const result = await registerUser({
                email: "test@example.com",
                username: "testuser",
                password: "password123",
            });

            expect(result.user.email).toBe("test@example.com");
            expect(prisma.user.create).toHaveBeenCalledOnce();
        });

        it("should throw 409 if email already exists", async () => {
            vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as any);

            await expect(
                registerUser({
                    email: "test@example.com",
                    username: "newuser",
                    password: "password123",
                })
            ).rejects.toMatchObject({ statusCode: 409, message: "Email already in use" });
        });

        it("should throw 409 if username already exists", async () => {
            vi.mocked(prisma.user.findFirst).mockResolvedValue({
                ...mockUser,
                email: "other@example.com",
            } as any);

            await expect(
                registerUser({
                    email: "new@example.com",
                    username: "testuser",
                    password: "password123",
                })
            ).rejects.toMatchObject({ statusCode: 409, message: "Username already taken" });
        });
    });

    describe("loginUser", () => {
        it("should login successfully with valid credentials", async () => {
            const hashedPassword = await bcrypt.hash("password123", 12);
            vi.mocked(prisma.user.findUnique).mockResolvedValue({
                ...mockUser,
                password: hashedPassword,
                isVerified: true,
            } as any);

            const result = await loginUser({
                email: "test@example.com",
                password: "password123",
            });

            expect(result.user.email).toBe("test@example.com");
            expect(result.accessToken).toBeDefined();
            expect(result.refreshToken).toBeDefined();
        });

        it("should throw 401 if user not found", async () => {
            vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

            await expect(
                loginUser({ email: "notfound@example.com", password: "password123" })
            ).rejects.toMatchObject({ statusCode: 401 });
        });

        it("should throw 403 if email not verified", async () => {
            vi.mocked(prisma.user.findUnique).mockResolvedValue({
                ...mockUser,
                isVerified: false,
            } as any);

            await expect(
                loginUser({ email: "test@example.com", password: "password123" })
            ).rejects.toMatchObject({ statusCode: 403 });
        });

        it("should throw 401 if password is wrong", async () => {
            const hashedPassword = await bcrypt.hash("correctpassword", 12);
            vi.mocked(prisma.user.findUnique).mockResolvedValue({
                ...mockUser,
                password: hashedPassword,
                isVerified: true,
            } as any);

            await expect(
                loginUser({ email: "test@example.com", password: "wrongpassword" })
            ).rejects.toMatchObject({ statusCode: 401 });
        });
    });

    describe("verifyEmail", () => {
        it("should verify email and return tokens", async () => {
            const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
            vi.mocked(prisma.user.findUnique).mockResolvedValue({
                ...mockUser,
                isVerified: false,
                verificationToken: "valid-token",
                verificationTokenExpiry: futureDate,
            } as any);
            vi.mocked(prisma.user.update).mockResolvedValue(mockUser as any);

            const result = await verifyEmail("valid-token");

            expect(result.accessToken).toBeDefined();
            expect(result.refreshToken).toBeDefined();
            expect(prisma.user.update).toHaveBeenCalledOnce();
        });

        it("should throw 400 if token is invalid", async () => {
            vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

            await expect(verifyEmail("invalid-token")).rejects.toMatchObject({
                statusCode: 400,
                message: "Invalid verification token",
            });
        });

        it("should throw 400 if token is expired", async () => {
            const pastDate = new Date(Date.now() - 1000);
            vi.mocked(prisma.user.findUnique).mockResolvedValue({
                ...mockUser,
                isVerified: false,
                verificationToken: "expired-token",
                verificationTokenExpiry: pastDate,
            } as any);

            await expect(verifyEmail("expired-token")).rejects.toMatchObject({
                statusCode: 400,
                message: "Verification token has expired",
            });
        });

        it("should throw 400 if already verified", async () => {
            const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
            vi.mocked(prisma.user.findUnique).mockResolvedValue({
                ...mockUser,
                isVerified: true,
                verificationToken: "token",
                verificationTokenExpiry: futureDate,
            } as any);

            await expect(verifyEmail("token")).rejects.toMatchObject({
                statusCode: 400,
                message: "Email already verified",
            });
        });
    });
});