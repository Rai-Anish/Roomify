import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "~/components/ui/Button"

type Provider = "comfyui" | "gemini";
type Visibility = "PRIVATE" | "COMMUNITY";

type Props = {
    imagePreview: string;
    onConfirm: (settings: { provider: Provider; visibility: Visibility; title: string }) => void;
    onCancel: () => void;
    isPending: boolean;
};

export const ProjectSettingsModal = ({ imagePreview, onConfirm, onCancel, isPending }: Props) => {
    const [provider, setProvider] = useState<Provider>("comfyui");
    const [visibility, setVisibility] = useState<Visibility>("PRIVATE");
    const [title, setTitle] = useState<string>("");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Project settings</h2>
                    <button onClick={onCancel} className="text-zinc-400 hover:text-zinc-600" aria-label="Close">
                        <X size={20} />
                    </button>
                </div>

                <img
                    src={imagePreview}
                    alt="Floor plan preview"
                    className="w-full h-40 object-cover rounded-lg mb-4 border border-zinc-100"
                />

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-zinc-700 mb-1 block">
                            Project title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="My floor plan"
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-700 mb-2 block">
                            AI model
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setProvider("comfyui")}
                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                                    provider === "comfyui"
                                        ? "border-zinc-800 bg-zinc-800 text-white"
                                        : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                                }`}
                            >
                                ComfyUI
                                <span className="block text-xs font-normal mt-0.5 opacity-70">
                                    Local · Free
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setProvider("gemini")}
                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                                    provider === "gemini"
                                        ? "border-zinc-800 bg-zinc-800 text-white"
                                        : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                                }`}
                            >
                                Gemini
                                <span className="block text-xs font-normal mt-0.5 opacity-70">
                                    Cloud · Google AI
                                </span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-700 mb-2 block">
                            Visibility
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setVisibility("PRIVATE")}
                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                                    visibility === "PRIVATE"
                                        ? "border-zinc-800 bg-zinc-800 text-white"
                                        : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                                }`}
                            >
                                Private
                                <span className="block text-xs font-normal mt-0.5 opacity-70">
                                    Only you can see
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setVisibility("COMMUNITY")}
                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                                    visibility === "COMMUNITY"
                                        ? "border-zinc-800 bg-zinc-800 text-white"
                                        : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                                }`}
                            >
                                Community
                                <span className="block text-xs font-normal mt-0.5 opacity-70">
                                    Visible to everyone
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={() => onConfirm({ provider, visibility, title: title || `Project ${Date.now()}` })}
                            disabled={isPending}
                            className="flex-1 text-white"
                        >
                            {isPending ? "Generating..." : "Generate render"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};