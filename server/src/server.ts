import "./config/env.js";
import app from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { initProjectWorker } from "./jobs/project.processor.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        initProjectWorker();

        const server = app.listen(PORT, () => {
            console.log(`✓ Server running on http://localhost:${PORT}`);
        });

        // Graceful shutdown
        const shutdown = async (signal: string) => {
            console.log(`${signal} received, shutting down gracefully...`);
            server.close(async () => {
                await disconnectDB();
                console.log("Server closed");
                process.exit(0);
            });
        };

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();