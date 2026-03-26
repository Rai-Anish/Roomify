import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "~/components/navbar/Navbar";
import { ArrowRight, Layers } from "lucide-react";
import { Button } from "~/components/ui/Button";
import Upload from "~/components/Upload";
import { ProjectSettingsModal } from "~/components/project/ProjectSettingsModal";
import { ProjectCard } from "~/components/project/ProjectCard";
import { useCommunityProjects, useCreateProject, useMyProjects } from "~/hooks/useProject";
import { useAuthStore } from "~/store/authStore";

export default function Home() {
    const navigate = useNavigate();
    const createProjectMutation = useCreateProject();
    const { data: communityProjects, isLoading: communityLoading } = useCommunityProjects();
    const user = useAuthStore((state) => state.user);

    const [pendingImage, setPendingImage] = useState<string | null>(null);
    const [pendingFile, setPendingFile] = useState<File | null>(null);

    const handleUploadComplete = async (base64Image: string) => {
        const res = await fetch(base64Image);
        const blob = await res.blob();
        const file = new File([blob], "floorplan.png", { type: "image/png" });
        setPendingImage(base64Image);
        setPendingFile(file);
    };

    const handleConfirm = async ({ provider, visibility, title }: {
        provider: "comfyui" | "gemini";
        visibility: "PRIVATE" | "COMMUNITY";
        title: string;
    }) => {
        if (!pendingFile) return;

        const formData = new FormData();
        formData.append("floorPlan", pendingFile);
        formData.append("title", title);
        formData.append("provider", provider);
        formData.append("visibility", visibility);

        createProjectMutation.mutate(formData, {
            onSuccess: (newProject) => {
                setPendingImage(null);
                setPendingFile(null);
                navigate(`/visualize/${newProject.id}`);
            },
        });
    };

    const handleCancel = () => {
        setPendingImage(null);
        setPendingFile(null);
    };

    return (
        <div className="home">
            <Navbar />

            {pendingImage && (
                <ProjectSettingsModal
                    imagePreview={pendingImage}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    isPending={createProjectMutation.isPending}
                />
            )}

            <section className="hero">
                <div>
                    <h2 className="announce">
                        <div className="dot"><div className="pulse"></div></div>
                        <p>Introducing FP3D 2.0</p>
                    </h2>
                </div>
                <h1>Build beautiful spaces at the speed of thoughts with FloorPlan3D</h1>
                <p className="subtitle">
                    RoomMod is AI-first design environment which helps you design and customize your rooms with ease.
                </p>
                <div className="actions">
                    <Link to="/signup" className="cta">
                        Get Started <ArrowRight className="icon" />
                    </Link>
                </div>
                <div className="upload-shell">
                    <div className="grid-overlay" />
                    <div className="upload-card">
                        <div className="upload-head">
                            <div className="upload-icon">
                                <Layers className="icon" />
                            </div>
                            <h3>Upload your floor plan</h3>
                            <p>Supports JPG, PNG, SVG formats up to 10MB</p>
                        </div>
                        <Upload onComplete={handleUploadComplete} />
                    </div>
                </div>
            </section>

            <section className="projects">
                <div className="section-inner">
                    <div className="section-head">
                        <div className="copy">
                            <h2>Community</h2>
                            <p>Projects shared by the community</p>
                        </div>
                    </div>
                    <div className="projects-grid">
                        {communityLoading ? (
                            <p>Loading community projects...</p>
                        ) : communityProjects?.length === 0 ? (
                            <p>No community projects yet.</p>
                        ) : (
                            communityProjects?.map((proj) => (
                                <ProjectCard
                                    key={proj.id}
                                    project={proj}
                                    showAuthor={true}
                                />
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

