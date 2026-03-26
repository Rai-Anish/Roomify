import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import userRoutes from "./routes/user.routes.js";   
import { globalLimiter } from "./middlewares/rateLimit.middleware.js";

const app: Application = express();

// COOP header for Google Sign-In popup
app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy necessary behind a reverse proxy (like Render/DigitalOcean/Docker)
app.set("trust proxy", 1);
app.use(globalLimiter);// Health check
app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/user", userRoutes);


// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use(errorHandler);

export default app;
