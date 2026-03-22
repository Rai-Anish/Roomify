import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.utils.js";
import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                username: string;
            };
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) throw new ApiError(401, "No token provided");

        const decoded = verifyAccessToken(token);

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) throw new ApiError(401, "User no longer exists");

        req.user = { id: user.id, email: user.email, username: user.username };
        next();

    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return next();

        const decoded = verifyAccessToken(token);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (user) req.user = { id: user.id, email: user.email, username: user.username };
        next();
    } catch {
        next(); // expired or invalid token, just continue without user
    }
};