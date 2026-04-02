import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectCard } from "~/components/project/ProjectCard";
import { TestQueryClientProvider } from "../setup";

const mockNavigate = vi.fn();
vi.mock("react-router", async () => ({
    ...(await vi.importActual("react-router")),
    useNavigate: () => mockNavigate,
}));

const renderWithProviders = (ui: React.ReactElement) => {
    return render(<TestQueryClientProvider>{ui}</TestQueryClientProvider>);
};

const mockProject = {
    id: 1,
    title: "My Floor Plan",
    imageUrl: "https://cloudinary.com/render.jpg",
    originalImageUrl: "https://cloudinary.com/original.jpg",
    visibility: "COMMUNITY" as const,
    provider: "comfyui",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    user: { username: "testuser", avatar: null },
};

describe("ProjectCard", () => {
    it("should render project title", () => {
        renderWithProviders(<ProjectCard project={mockProject} />);
        expect(screen.getByText("My Floor Plan")).toBeInTheDocument();
    });

    it("should render project image", () => {
        renderWithProviders(<ProjectCard project={mockProject} />);
        const img = screen.getByAltText("My Floor Plan");
        expect(img).toHaveAttribute("src", "https://cloudinary.com/render.jpg");
    });

    it("should fall back to originalImageUrl if imageUrl is null", () => {
        renderWithProviders(<ProjectCard project={{ ...mockProject, imageUrl: null }} />);
        const img = screen.getByAltText("My Floor Plan");
        expect(img).toHaveAttribute("src", "https://cloudinary.com/original.jpg");
    });

    it("should show visibility badge", () => {
        renderWithProviders(<ProjectCard project={mockProject} />);
        expect(screen.getByText("COMMUNITY")).toBeInTheDocument();
    });

    it("should show author when showAuthor is true", () => {
        renderWithProviders(<ProjectCard project={mockProject} showAuthor />);
        expect(screen.getByText("By testuser")).toBeInTheDocument();
    });

    it("should not show author when showAuthor is false", () => {
        renderWithProviders(<ProjectCard project={mockProject} showAuthor={false} />);
        expect(screen.queryByText("By testuser")).not.toBeInTheDocument();
    });

    it("should navigate to visualizer on click", () => {
        renderWithProviders(<ProjectCard project={mockProject} />);
        fireEvent.click(screen.getByText("My Floor Plan").closest("div")!);
        expect(mockNavigate).toHaveBeenCalledWith("/visualize/1");
    });

    it("should show formatted date", () => {
        renderWithProviders(<ProjectCard project={mockProject} />);
        expect(screen.getByText("1/1/2026")).toBeInTheDocument();
    });
});