import "@testing-library/jest-dom";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

export const TestQueryClientProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = createTestQueryClient();
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export const renderWithProviders = (ui: React.ReactElement) => {
    return render(<TestQueryClientProvider>{ui}</TestQueryClientProvider>);
};

// mock react-router
vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
        ...actual,
        useNavigate: () => vi.fn(),
        useParams: () => ({ id: "1" }),
        NavLink: ({ children, to, className }: any) => (
            <a href={to} className={typeof className === "function" ? className({ isActive: false }) : className}>
                {children}
            </a>
        ),
        Link: ({ children, to }: any) => <a href={to}>{children}</a>,
    };
});

// mock axios
vi.mock("~/lib/axios", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() },
        },
    },
}));

// mock zustand auth store
vi.mock("~/store/authStore", () => ({
    useAuthStore: vi.fn((selector) =>
        selector({
            user: null,
            accessToken: null,
            isInitialized: true,
            _hasHydrated: true,
            setAccessToken: vi.fn(),
            setUser: vi.fn(),
            setInitialized: vi.fn(),
            logout: vi.fn(),
        })
    ),
}));

// mock sonner
vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
    Toaster: () => null,
}));