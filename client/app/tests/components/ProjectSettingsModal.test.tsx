import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectSettingsModal } from "~/components/project/ProjectSettingsModal";

const mockOnConfirm = vi.fn();
const mockOnCancel = vi.fn();

const defaultProps = {
    imagePreview: "https://example.com/preview.jpg",
    onConfirm: mockOnConfirm,
    onCancel: mockOnCancel,
    isPending: false,
};

describe("ProjectSettingsModal", () => {
    it("should render the modal", () => {
        render(<ProjectSettingsModal {...defaultProps} />);
        expect(screen.getByText("Project settings")).toBeInTheDocument();
    });

    it("should show image preview", () => {
        render(<ProjectSettingsModal {...defaultProps} />);
        const img = screen.getByAltText("Floor plan preview");
        expect(img).toHaveAttribute("src", defaultProps.imagePreview);
    });

    it("should call onCancel when X is clicked", () => {
        render(<ProjectSettingsModal {...defaultProps} />);
        fireEvent.click(screen.getByRole("button", { name: /close/i }));
        expect(mockOnCancel).toHaveBeenCalledOnce();
    });

    it("should show ComfyUI as default provider", () => {
        render(<ProjectSettingsModal {...defaultProps} />);
        const comfyButton = screen.getByText("ComfyUI").closest("button");
        expect(comfyButton).toHaveClass("bg-zinc-800");
    });

    it("should switch to Gemini when clicked", async () => {
        render(<ProjectSettingsModal {...defaultProps} />);
        const geminiButton = screen.getByText("Gemini").closest("button");
        await userEvent.click(geminiButton!);
        expect(geminiButton).toHaveClass("bg-zinc-800");
    });

    it("should call onConfirm with correct settings", async () => {
        render(<ProjectSettingsModal {...defaultProps} />);

        await userEvent.type(
            screen.getByPlaceholderText("My floor plan"),
            "Test Project"
        );

        fireEvent.click(screen.getByText("Generate render"));

        expect(mockOnConfirm).toHaveBeenCalledWith({
            title: "Test Project",
            provider: "comfyui",
            visibility: "PRIVATE",
        });
    });

    it("should disable button when isPending is true", () => {
        render(<ProjectSettingsModal {...defaultProps} isPending={true} />);
        expect(screen.getByText("Generating...")).toBeDisabled();
    });

    it("should toggle visibility between PRIVATE and COMMUNITY", async () => {
        render(<ProjectSettingsModal {...defaultProps} />);
        const communityButton = screen.getByText("Community").closest("button");
        await userEvent.click(communityButton!);
        expect(communityButton).toHaveClass("bg-zinc-800");
    });
});