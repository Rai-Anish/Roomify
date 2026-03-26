import React from "react";
import { Share2, Download, Loader2 } from "lucide-react";

interface ActionProps {
  title: string;
  isDownloading: boolean;
  isProcessing: boolean;
  onShare: () => void;
  onDownload: () => void;
}

export const VisualizerActions = ({ title, isDownloading, isProcessing, onShare, onDownload }: ActionProps) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="space-y-1">
      <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{title}</h1>
      <p className="text-zinc-500 font-medium">Visualization by FloorPlan3D</p>
    </div>
    
    <div className="flex gap-3 w-full md:w-auto">
      <button 
        onClick={onShare}
        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-zinc-200 text-zinc-900 rounded-2xl font-bold hover:bg-zinc-50 transition-all active:scale-95 shadow-sm"
      >
        <Share2 size={18} /> Share
      </button>
      
      <button 
        onClick={onDownload}
        disabled={isProcessing || isDownloading}
        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-black transition-all active:scale-95 shadow-lg shadow-zinc-200 disabled:opacity-50"
      >
        {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
        {isDownloading ? "Exporting..." : "Export"}
      </button>
    </div>
  </div>
);