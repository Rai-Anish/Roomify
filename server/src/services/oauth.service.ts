import { OAuth2Client } from "google-auth-library";
import { prisma } from "../config/db.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils.js";
import ApiError from "../utils/ApiError.js";

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
);

export const getGoogleAuthUrl = (): string => {
    return client.generateAuthUrl({
        access_type: "offline",
        scope: ["openid", "email", "profile"],
        prompt: "consent",
    });
};

export const handleGoogleCallback = async (code: string) => {
    // exchange code for tokens
    const { tokens } = await client.getToken(code);

    if (!tokens.id_token) {
        throw new ApiError(400, "No ID token received from Google");
    }

    // verify and decode id_token — this is what google-auth-library does best
    const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
        throw new ApiError(400, "Invalid Google token payload");
    }

    if (!payload.email_verified) {
        throw new ApiError(400, "Google email is not verified");
    }

    const { sub: googleId, email, name, picture } = payload;

    // find or create user
    let user = await prisma.user.findFirst({
        where: {
            OR: [{ googleId }, { email }]
        }
    });

    if (!user) {
        // generate unique username
        let username = (name ?? email.split("@")[0])
            .replace(/\s+/g, "_")
            .toLowerCase();

        const usernameExists = await prisma.user.findUnique({ where: { username } });
        if (usernameExists) username = `${username}_${Date.now().toString().slice(-4)}`;

        user = await prisma.user.create({
            data: {
                email,
                username,
                avatar: picture,
                googleId,
                provider: "GOOGLE",
                isVerified: true,
            },
        });
    } else if (!user.googleId) {
        // existing user — link google account
        user = await prisma.user.update({
            where: { id: user.id },
            data: {
                googleId,
                isVerified: true,
                avatar: user.avatar ?? picture,
            },
        });
    }

    const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        username: user.username,
    });

    const refreshToken = generateRefreshToken({
        id: user.id,
        email: user.email,
        username: user.username,
    });

    return { user, accessToken, refreshToken };
};