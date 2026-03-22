import { ArrowUpRight, Clock } from "lucide-react";
import { useNavigate } from "react-router";

interface Project {
    id: number;
    title: string;
    imageUrl: string | null;
    originalImageUrl: string | null;
    visibility: "PRIVATE" | "COMMUNITY";
    createdAt: string;
    user: {
        username: string;
        avatar: string | null;
    };
}

interface ProjectCardProps {
    project: Project;
    showAuthor?: boolean;
}

export const ProjectCard = ({ project, showAuthor = true }: ProjectCardProps) => {
    const navigate = useNavigate();

    return (
        <div
            className="project-card group"
            onClick={() => navigate(`/visualize/${project.id}`)}
            style={{ cursor: "pointer" }}
        >
            <div className="preview">
                <img
                    src={project.imageUrl || project.originalImageUrl || ''}
                    alt={project.title}
                />
                <div className="badge">
                    <span>{project.visibility}</span>
                </div>
            </div>
            <div className="card-body">
                <div>
                    <h3>{project.title}</h3>
                    <div className="meta">
                        <Clock size={12} />
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                        {showAuthor && <span>By {project.user.username}</span>}
                    </div>
                </div>
                <div className="arrow">
                    <ArrowUpRight size={18} />
                </div>
            </div>
        </div>
    );
};