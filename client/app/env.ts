import { z } from "zod";

const envSchema = z.object({
  VITE_SERVER_URL: z.string().url().default("http://localhost:5000/api"),
  VITE_GOOGLE_CLIENT_ID: z.string().optional(),
});

const _env = envSchema.safeParse({
    VITE_SERVER_URL: import.meta.env.VITE_SERVER_URL,
    VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
});

if (!_env.success) {
  console.error("❌ Invalid Vite Environment Variables:", _env.error.format());
  throw new Error("Invalid Vite Environment Variables");
}

export const env = _env.data;
