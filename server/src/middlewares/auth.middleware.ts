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

        const decoded = verifyAccessToken(token) as any;

        req.user = { id: decoded.id, email: decoded.email, username: decoded.username };
        next();

    } catch (error) {
        next(new ApiError(401, "Invalid or expired token"));
    }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return next();

        const decoded = verifyAccessToken(token) as any;
        req.user = { id: decoded.id, email: decoded.email, username: decoded.username };
        next();
    } catch {
        next(); // expired or invalid token, just continue without user
    }
};