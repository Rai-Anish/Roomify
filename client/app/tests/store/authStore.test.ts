import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "~/store/authStore";

// Ensure we are using the real store logic and not a mock from a setup file
vi.unmock("~/store/authStore");

const mockUser = {
    id: 1,
    email: "test@example.com",
    username: "testuser",
    provider: "google",
    avatar: null,
    isVerified: true,
};

describe("authStore", () => {
    beforeEach(() => {
        // Manually reset the store to a clean state before each test
        // This prevents state leakage between tests
        useAuthStore.setState({
            accessToken: null,
            user: null,
            _hasHydrated: true, // We set this to true so the UI doesn't think it's loading
        });
    });

    it("should have initial state", () => {
        const state = useAuthStore.getState();
        expect(state.accessToken).toBeNull();
        expect(state.user).toBeNull();
    });

    it("should set access token", () => {
        useAuthStore.getState().setAccessToken("test-token");
        expect(useAuthStore.getState().accessToken).toBe("test-token");
    });

    it("should set user", () => {
        useAuthStore.getState().setUser(mockUser);
        expect(useAuthStore.getState().user).toEqual(mockUser);
    });

    it("should update hydration status", () => {
        useAuthStore.getState().setHasHydrated(false);
        expect(useAuthStore.getState()._hasHydrated).toBe(false);
        
        useAuthStore.getState().setHasHydrated(true);
        expect(useAuthStore.getState()._hasHydrated).toBe(true);
    });

    it("should clear token and user on logout", () => {
        const store = useAuthStore.getState();
        
        // Fill store
        store.setAccessToken("test-token");
        store.setUser(mockUser);
        
        // Perform logout
        store.logout();

        expect(useAuthStore.getState().accessToken).toBeNull();
        expect(useAuthStore.getState().user).toBeNull();
    });
});