import React from "react";
import { MoveHorizontal } from "lucide-react";

interface SliderProps {
  original: string;
  render: string;
  sliderPos: number;
  setSliderPos: (val: number) => void;
}

export const ComparisonSlider = ({ original, render, sliderPos, setSliderPos }: SliderProps) => {
  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-white border border-zinc-200 shadow-2xl group">
      {/* Background: Original Blueprint */}
      <div className="absolute inset-0 w-full h-full bg-zinc-100">
        <img src={original} className="w-full h-full object-contain p-4 select-none" alt="Original" />
        <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          Original Blueprint
        </div>
      </div>

      {/* Foreground: AI Render (Clipped) */}
      <div 
        className="absolute inset-0 w-full h-full bg-zinc-900 pointer-events-none" 
        style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
      >
        <img src={render} className="w-full h-full object-contain p-4 select-none" alt="Render" />
        <div className="absolute bottom-6 right-6 bg-orange-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          3D AI Render
        </div>
      </div>

      {/* Range Input for interaction */}
      <input 
        type="range" min="0" max="100" value={sliderPos} 
        onChange={(e) => setSliderPos(Number(e.target.value))} 
        className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-30" 
      />

      {/* Visual Divider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white z-20 pointer-events-none shadow-[0_0_20px_rgba(0,0,0,0.3)]" 
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center text-zinc-800 border border-zinc-100">
          <MoveHorizontal size={20} />
        </div>
      </div>
    </div>
  );
};