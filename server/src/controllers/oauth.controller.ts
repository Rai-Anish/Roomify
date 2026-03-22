import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { getGoogleAuthUrl, handleGoogleCallback } from "../services/oauth.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../config/db.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils.js";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

export const googleAuth = asyncHandler(async (_req: Request, res: Response) => {
    const url = getGoogleAuthUrl();
    res.redirect(url);
});

export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
    const { code, error } = req.query as { code: string; error?: string };

    if (error || !code) {
        return res.redirect(`${CLIENT_URL}/login?error=google_failed`);
    }

    const { accessToken, refreshToken } = await handleGoogleCallback(code);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${CLIENT_URL}/auth/callback?token=${accessToken}`);
});

// For google provided login button

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleTokenAuth = asyncHandler(async (req: Request, res: Response) => {
    const { credential } = req.body;

    if (!credential) throw new ApiError(400, "No credential provided");

    // verify the ID token from frontend
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) throw new ApiError(400, "Invalid token");
    if (!payload.email_verified) throw new ApiError(400, "Email not verified");

    const { sub: googleId, email, name, picture } = payload;

    let user = await prisma.user.findFirst({
        where: { OR: [{ googleId }, { email }] }
    });

    if (!user) {
        let username = (name ?? email.split("@")[0])
            .replace(/\s+/g, "_")
            .toLowerCase();

        const exists = await prisma.user.findUnique({ where: { username } });
        if (exists) username = `${username}_${Date.now().toString().slice(-4)}`;

        user = await prisma.user.create({
            data: {
                email,
                username,
                avatar: picture,
                googleId,
                provider: "GOOGLE",
                isVerified: true,
            }
        });
    } else if (!user.googleId) {
        user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId, isVerified: true, avatar: user.avatar ?? picture }
        });
    }

    const accessToken = generateAccessToken({ id: user.id, email: user.email, username: user.username });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email, username: user.username });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(new ApiResponse(200, { user, accessToken }, "Google login successful"));
});