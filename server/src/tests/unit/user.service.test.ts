import { describe, it, expect, vi } from "vitest";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/db.js";
import {
    getUserStats,
    updateProfile,
    changePassword,
} from "../../services/user.service.js";

const mockUser = {
    id: 1,
    email: "test@example.com",
    username: "testuser",
    password: "$2a$12$hashedpassword",
    avatar: null,
    isVerified: true,
    provider: "LOCAL",
    googleId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe("user.service", () => {
    describe("getUserStats", () => {
        it("should return total and community project counts", async () => {
            vi.mocked(prisma.project.count)
                .mockResolvedValueOnce(10)
                .mockResolvedValueOnce(3);

            const stats = await getUserStats(1);

            expect(stats.totalProjects).toBe(10);
            expect(stats.communityProjects).toBe(3);
            expect(prisma.project.count).toHaveBeenCalledTimes(2);
        });
    });

    describe("updateProfile", () => {
        it("should update username", async () => {
            vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
            vi.mocked(prisma.user.update).mockResolvedValue({
                ...mockUser,
                username: "newusername",
            } as any);

            const result = await updateProfile(1, { username: "newusername" });
            expect(result.username).toBe("newusername");
        });

        it("should throw 409 if username is taken by another user", async () => {
            vi.mocked(prisma.user.findFirst).mockResolvedValue({
                ...mockUser,
                id: 2,
            } as any);

            await expect(
                updateProfile(1, { username: "takenusername" })
            ).rejects.toMatchObject({ statusCode: 409 });
        });

        it("should upload avatar if file is provided", async () => {
            vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
            vi.mocked(prisma.user.update).mockResolvedValue({
                ...mockUser,
                avatar: "https://cloudinary.com/avatar.jpg",
            } as any);

            const mockFile = {
                buffer: Buffer.from("fake-image"),
                mimetype: "image/jpeg",
            } as Express.Multer.File;

            const result = await updateProfile(1, {}, mockFile);
            expect(result.avatar).toBe("https://cloudinary.com/avatar.jpg");
        });
    });

    describe("changePassword", () => {
        it("should change password successfully", async () => {
            const hashedPassword = await bcrypt.hash("oldpassword", 12);
            vi.mocked(prisma.user.findUnique).mockResolvedValue({
                ...mockUser,
                password: hashedPassword,
            } as any);
            vi.mocked(prisma.user.update).mockResolvedValue(mockUser as any);

            await changePassword(1, {
                currentPassword: "oldpassword",
                newPassword: "newpassword123",
            });

            expect(prisma.user.update).toHaveBeenCalledOnce();
        });

        it("should throw 401 if current password is wrong", async () => {
            const hashedPassword = await bcrypt.hash("correctpassword", 12);
            vi.mocked(prisma.user.findUnique).mockResolvedValue({
                ...mockUser,
                password: hashedPassword,
            } as any);

            await expect(
                changePassword(1, {
                    currentPassword: "wrongpassword",
                    newPassword: "newpassword123",
                })
            ).rejects.toMatchObject({ statusCode: 401 });
        });

        it("should throw 400 if user has no password (OAuth user)", async () => {
            vi.mocked(prisma.user.findUnique).mockResolvedValue({
                ...mockUser,
                password: null,
            } as any);

            await expect(
                changePassword(1, {
                    currentPassword: "anything",
                    newPassword: "newpassword123",
                })
            ).rejects.toMatchObject({ statusCode: 400 });
        });
    });
});