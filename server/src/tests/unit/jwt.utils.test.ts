import { describe, it, expect } from "vitest";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} from "../../utils/jwt.utils.js";

const mockPayload = { id: 1, email: "test@example.com", username: "testuser" };

describe("jwt.utils", () => {
    describe("generateAccessToken", () => {
        it("should generate a valid access token", () => {
            const token = generateAccessToken(mockPayload);
            expect(token).toBeDefined();
            expect(typeof token).toBe("string");
            expect(token.split(".")).toHaveLength(3);
        });
    });

    describe("generateRefreshToken", () => {
        it("should generate a valid refresh token", () => {
            const token = generateRefreshToken(mockPayload);
            expect(token).toBeDefined();
            expect(typeof token).toBe("string");
        });
    });

    describe("verifyAccessToken", () => {
        it("should verify a valid access token", () => {
            const token = generateAccessToken(mockPayload);
            const decoded = verifyAccessToken(token);
            expect(decoded.id).toBe(1);
            expect(decoded.email).toBe("test@example.com");
        });

        it("should throw on invalid token", () => {
            expect(() => verifyAccessToken("invalid.token.here")).toThrow();
        });

        it("should throw on tampered token", () => {
            const token = generateAccessToken(mockPayload);
            const tampered = token.slice(0, -5) + "xxxxx";
            expect(() => verifyAccessToken(tampered)).toThrow();
        });
    });

    describe("verifyRefreshToken", () => {
        it("should verify a valid refresh token", () => {
            const token = generateRefreshToken(mockPayload);
            const decoded = verifyRefreshToken(token);
            expect(decoded.id).toBe(1);
        });

        it("should throw on invalid refresh token", () => {
            expect(() => verifyRefreshToken("bad-token")).toThrow();
        });
    });
});