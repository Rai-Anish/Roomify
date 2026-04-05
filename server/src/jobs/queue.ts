import { Queue } from "bullmq";
import { env } from "../config/env.js";

export const connection = env.REDIS_URL ? {
    url: env.REDIS_URL
} : undefined;

export const projectQueue = connection 
    ? new Queue("project-render-queue", { connection })
    : null;
