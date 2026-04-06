import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useProject, useProjectUpdates } from "~/hooks/useProject";
import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import FullPageLoader from "~/components/ui/FullPageLoader";
import { toast } from "sonner";

// Import our new chunks
import { ComparisonSlider } from "~/components/visualizer/ComparisonSlider";
import { VisualizerActions } from "~/components/visualizer/VisualizerActions";

const VisualizerId = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const projectId = Number(id);
  
  const [sliderPos, setSliderPos] = useState(50);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: project, isLoading } = useProject(projectId, true);
  useProjectUpdates();

  // 2. Logic: Native Share / Clipboard Fallback
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: `Roomify: ${project?.title}`, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch {
      toast.error("Share canceled");
    }
  };

  // 3. Logic: Fetch Blob for Clean Download
  const handleDownload = async () => {
    if (!project?.imageUrl) return;
    setIsDownloading(true);
    try {
      const response = await fetch(project.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Roomify-${project.title || 'Render'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed. Right-click the image to save.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading && !project) return <FullPageLoader label="Fetching Project Data..." />;
  if (!project) return <div className="p-20 text-center font-bold">Project not found.</div>;

  const isProcessing = !project.imageUrl || project.imageUrl === "";
  const isFailed = project.imageUrl === "FAILED";

  return (
    <section className="min-h-screen bg-zinc-50 pb-20 pt-6 px-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-zinc-500 hover:text-black mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Projects</span>
        </button>

        <div className="grid grid-cols-1 gap-10">
          {isFailed ? (
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-red-50 flex flex-col items-center justify-center text-red-900 border border-red-200">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4 opacity-80" />
              <p className="text-xl font-bold tracking-tight">Generation Failed</p>
              <p className="text-red-700/70 text-sm mt-1 max-w-sm text-center">
                We couldn't connect to the AI generator. This might be due to service maintenance or high load.
              </p>
              <button 
                onClick={() => navigate(-1)}
                className="mt-6 px-6 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
              >
                Try Again with Different Provider
              </button>
            </div>
          ) : isProcessing ? (
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-zinc-900 flex flex-col items-center justify-center text-white border border-zinc-800">
              <RefreshCcw className="w-12 h-12 animate-spin text-orange-500 mb-4 opacity-80" />
              <p className="text-lg font-medium tracking-tight">AI is crafting your space...</p>
              <p className="text-zinc-500 text-sm mt-1">This usually takes 10-15 seconds.</p>
            </div>
          ) : (
            <ComparisonSlider 
              original={project.originalImageUrl || ""} 
              render={project.imageUrl || ""} 
              sliderPos={sliderPos} 
              setSliderPos={setSliderPos} 
            />
          )}

          {/* Action Footer Chunk */}
          <VisualizerActions 
            title={project.title || "Untitled Project"}
            onShare={handleShare}
            onDownload={handleDownload}
            isDownloading={isDownloading}
            isProcessing={isProcessing || isFailed}
          />
        </div>
      </div>
    </section>
  );
};

export default VisualizerId;