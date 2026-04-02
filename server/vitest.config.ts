import { defineConfig } from "vitest/config";
import "dotenv/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        setupFiles: ["./src/tests/setup.ts"],
        env: {
            NODE_ENV: "test",
            DATABASE_URL: "postgresql://test:test@localhost:5432/test",
            JWT_ACCESS_SECRET: "test-access-secret-key-for-testing",
            JWT_REFRESH_SECRET: "test-refresh-secret-key-for-testing",
        },
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov"],
            include: ["src/**/*.ts"],
            exclude: ["src/tests/**", "src/server.ts"],
        },
    },
});