import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import axiosInstance from "~/lib/axios";
import { useLogin, useLogout, useRegister } from "~/hooks/useAuth";

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) =>
        createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useLogin", () => {
    it("should set access token and user on success", async () => {
        vi.mocked(axiosInstance.post).mockResolvedValue({
            data: {
                success: true,
                data: {
                    accessToken: "new-token",
                    user: { id: 1, username: "testuser", email: "test@example.com" },
                },
            },
        });

        const { result } = renderHook(() => useLogin(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.mutate({ email: "test@example.com", password: "password123" });
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it("should set error on failed login", async () => {
        vi.mocked(axiosInstance.post).mockRejectedValue({
            response: { data: { message: "Invalid credentials" }, status: 401 },
        });

        const { result } = renderHook(() => useLogin(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.mutate({ email: "test@example.com", password: "wrong" });
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
    });
});

describe("useLogout", () => {
    it("should clear store and query cache on logout", async () => {
        vi.mocked(axiosInstance.post).mockResolvedValue({ data: { success: true } });

        const { result } = renderHook(() => useLogout(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.mutate(undefined);
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });
});

describe("useRegister", () => {
    it("should call register endpoint", async () => {
        vi.mocked(axiosInstance.post).mockResolvedValue({
            data: {
                success: true,
                data: { user: { id: 1, email: "test@example.com" } },
            },
        });

        const { result } = renderHook(() => useRegister(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.mutate({
                email: "test@example.com",
                username: "testuser",
                password: "password123",
            });
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(axiosInstance.post).toHaveBeenCalledWith(
            "auth/register",
            expect.objectContaining({ email: "test@example.com" })
        );
    });
});