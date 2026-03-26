import { Queue } from "bullmq";
import { env } from "../config/env.js";

export const connection = {
    url: env.REDIS_URL
};

export const projectQueue = new Queue("project-render-queue", { connection });
