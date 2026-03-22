import React, { useState } from "react";
import { useParams } from "react-router";
import { useProject } from "~/hooks/useProject";
import { useAuthStore } from "~/store/authStore";

const VisualizerId = () => {
    const { id } = useParams();
    const projectId = Number(id);
    const [isReady, setIsReady] = useState(false);

    // small delay before first fetch — gives server time to create project
    React.useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const { data: project, isLoading, error, refetch } = useProject(projectId, isReady);

    // poll every 3s until imageUrl is available
    React.useEffect(() => {
        if (!isReady) return;
        if (project?.imageUrl && project.imageUrl !== "FAILED") return;

        const interval = setInterval(() => {
            refetch();
        }, 3000);

        return () => clearInterval(interval);
    }, [project, refetch, isReady]);

// check for 403 specifically
const is403 = (error as any)?.response?.status === 403;
const is404 = (error as any)?.response?.status === 404;

if (!isReady || isLoading) {
    return (
        <section className="flex flex-col items-center justify-center min-h-screen gap-4">
            <div className="animate-spin w-8 h-8 border-2 border-zinc-300 border-t-zinc-800 rounded-full" />
            <p className="text-zinc-500">Creating your project...</p>
        </section>
    );
}

if (is404 || !project) {
    return (
        <section className="flex flex-col items-center justify-center min-h-screen gap-4">
            <div className="animate-spin w-8 h-8 border-2 border-zinc-300 border-t-zinc-800 rounded-full" />
            <p className="text-zinc-500">Setting up your project...</p>
        </section>
    );
}

    const isProcessing = !project.imageUrl || project.imageUrl === "";
    const isFailed = project.imageUrl === "FAILED";

    return (
        <section className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">{project.title || "Untitled Project"}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Original floor plan</h2>
                    <div className="relative rounded-xl overflow-hidden border border-zinc-100">
                        <img
                            src={project.originalImageUrl || ''}
                            alt="Original floor plan"
                            className="w-full object-cover"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Generated render</h2>
                    <div className="relative rounded-xl overflow-hidden border border-zinc-100 min-h-48 bg-zinc-50 flex items-center justify-center">
                        {isProcessing && (
                            <>
                                <img
                                    src={project.originalImageUrl || ''}
                                    alt="Processing..."
                                    className="w-full object-cover blur-md opacity-40 absolute inset-0"
                                />
                                <div className="relative flex flex-col items-center gap-3 z-10">
                                    <div className="animate-spin w-8 h-8 border-2 border-white border-t-zinc-400 rounded-full" />
                                    <p className="text-white text-sm font-medium drop-shadow">Generating render...</p>
                                </div>
                            </>
                        )}

                        {isFailed && (
                            <p className="text-red-500 text-sm">Generation failed. Please try again.</p>
                        )}

                        {!isProcessing && !isFailed && (
                            <img
                                src={project.imageUrl || ''}
                                alt="Generated render"
                                className="w-full object-cover"
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VisualizerId;