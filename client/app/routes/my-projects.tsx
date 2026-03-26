import { useNavigate } from "react-router";
import { ProjectCard } from "~/components/project/ProjectCard";
import { ProjectCardSkeleton } from "~/components/project/ProjectCardSkeleton"; // Import individual card skeleton
import { useMyProjects, useProjectUpdates } from "~/hooks/useProject";
import { useAuthStore } from "~/store/authStore";
import { useEffect } from "react";
import { Plus } from "lucide-react";

// Helper for the grid layout
const ProjectGridSkeleton = () => (
    <div className="projects-grid">
        {[...Array(6)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
        ))}
    </div>
);

export default function MyProjects() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const hasHydrated = useAuthStore((state) => state._hasHydrated);
    const { data: myProjects, isLoading } = useMyProjects();
    useProjectUpdates();

    useEffect(() => {
        if (!hasHydrated) return;
        if (!user) navigate("/login");
    }, [user, hasHydrated, navigate]);

    // Show nothing until store is hydrated to prevent flash of login page
    if (!hasHydrated) return null;

    return (
        <div className="home">
            <section className="projects" style={{ paddingTop: "6rem" }}>
                <div className="section-inner">
                    <div className="section-head">
                        <div className="copy">
                            <h2>My Projects</h2>
                            <p>All your floor plan renders in one place</p>
                        </div>
                        <button
                            onClick={() => navigate("/")}
                            className="btn btn--primary btn--md flex items-center gap-2"
                        >
                            <Plus size={16} />
                            New Project
                        </button>
                    </div>

                    {isLoading ? (
                        <ProjectGridSkeleton />
                    ) : myProjects?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <p className="text-zinc-500">No projects yet.</p>
                            <button
                                onClick={() => navigate("/")}
                                className="btn btn--primary btn--md"
                            >
                                Create your first project
                            </button>
                        </div>
                    ) : (
                        <div className="projects-grid">
                            {myProjects?.map((proj) => (
                                <ProjectCard
                                    key={proj.id}
                                    project={proj}
                                    showAuthor={false}
                                    showDelete={true}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}