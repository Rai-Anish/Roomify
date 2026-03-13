import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.utils.js";
import { RegisterInput, LoginInput } from "../types/auth.types.js";
import { generateVerificationToken, getVerificationTokenExpiry } from "../utils/token.utils.js";
import { sendVerificationEmail } from "../utils/email.utils.js";
import ApiError from "../utils/ApiError.js";

export const registerUser = async (input: RegisterInput) => {
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ email: input.email }, { username: input.username }]
        }
    });

    if (existingUser) {
        if (existingUser.email === input.email) throw new ApiError(409, "Email already in use");
        throw new ApiError(409, "Username already taken");
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = getVerificationTokenExpiry();

    const user = await prisma.user.create({
        data: {
            email: input.email,
            username: input.username,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiry,
        },
        select: {
            id: true,
            email: true,
            username: true,
            avatar: true,
            isVerified: true,
            createdAt: true,
        }
    });

    await sendVerificationEmail(user.email, user.username, verificationToken);

    return { user };
};

export const verifyEmail = async (token: string) => {
    const user = await prisma.user.findUnique({
        where: { verificationToken: token }
    });

    if (!user) {
        throw new ApiError(400,"Invalid verification token");
    }

    if (!user.verificationTokenExpiry || user.verificationTokenExpiry < new Date()) {
        throw new ApiError(400,"Verification token has expired");
    }

    if (user.isVerified) {
        throw new ApiError(400,"Email already verified");
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            isVerified: true,
            verificationToken: null,      // clear token after use
            verificationTokenExpiry: null,
        }
    });

    // now generate tokens so user is logged in after verification
    const accessToken = generateAccessToken({ id: user.id, email: user.email, username: user.username });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email, username: user.username });

    return {
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            avatar: user.avatar,
            isVerified: true,
        },
        accessToken,
        refreshToken,
    };
};

export const resendVerificationEmail = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new ApiError(404,"User not found");
    if (user.isVerified) throw new ApiError(400,"Email already verified");

    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = getVerificationTokenExpiry();

    await prisma.user.update({
        where: { id: user.id },
        data: { verificationToken, verificationTokenExpiry }
    });

    await sendVerificationEmail(user.email, user.username, verificationToken);
};

export const loginUser = async (input: LoginInput) => {
    const user = await prisma.user.findUnique({ where: { email: input.email } });

    if (!user || !user.password) {
        throw new ApiError(401,"Invalid email or password");
    }

    if (!user.isVerified) {
        throw new ApiError(403,"Please verify your email before logging in");
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401,"Invalid email or password");
    }

    const accessToken = generateAccessToken({ id: user.id, email: user.email, username: user.username });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email, username: user.username });

    return {
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            avatar: user.avatar,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
        },
        accessToken,
        refreshToken,
    };
};

export const refreshAccessToken = (token: string) => {
    const decoded = verifyRefreshToken(token);
    const accessToken = generateAccessToken({
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
    });
    return { accessToken };
};