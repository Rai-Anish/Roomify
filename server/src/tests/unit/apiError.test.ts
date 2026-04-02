import { describe, it, expect } from "vitest";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

describe("ApiError", () => {
    it("should create an error with correct properties", () => {
        const error = new ApiError(404, "Not found");
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("Not found");
        expect(error.success).toBe(false);
    });

    it("should include errors array", () => {
        const error = new ApiError(400, "Validation failed", [{ message: "field is required" }]);
        expect(error.errors).toContainEqual({ message: "field is required" });
    });

    it("should be an instance of Error", () => {
        const error = new ApiError(500, "Server error");
        expect(error).toBeInstanceOf(Error);
    });
});

describe("ApiResponse", () => {
    it("should create a success response", () => {
        const response = new ApiResponse(200, { user: { id: 1 } }, "Success");
        expect(response.statusCode).toBe(200);
        expect(response.success).toBe(true);
        expect(response.data).toEqual({ user: { id: 1 } });
        expect(response.message).toBe("Success");
    });
});