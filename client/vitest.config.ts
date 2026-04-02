import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./app/tests/setup.tsx"],
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov"],
            include: ["app/**/*.tsx", "app/**/*.ts"],
            exclude: ["app/tests/**", "app/root.tsx"],
        },
    },
});