import rateLimit from "express-rate-limit";
import ApiError from "../utils/ApiError.js";

// Global limiter for all requests
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // max 100 requests per 15 minutes
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new ApiError(429, "Too many requests from this IP. Please try again later."));
    }
});

// Stricter limiter for authentication actions like login and register
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 10, // max 10 attempts per hour
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new ApiError(429, "Too many authentication attempts from this IP. Please try again after an hour."));
    }
});
