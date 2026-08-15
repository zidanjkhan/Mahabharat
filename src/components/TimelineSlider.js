// src/components/TimelineSlider.js
"use client";

export default function TimelineSlider({
  activeEra,
  handleSliderChange,
  totalEras,
}) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[85vw] max-w-4xl bg-slate-900/90 border border-slate-700 rounded-full py-4 px-6 sm:px-10 z-40 shadow-2xl backdrop-blur-md flex items-center gap-6">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
        Start
      </span>
      <input
        type="range"
        min="0"
        max={totalEras - 1}
        step="1"
        value={activeEra}
        onChange={handleSliderChange}
        className="flex-1 accent-amber-500 cursor-pointer h-2 bg-slate-700 rounded-lg appearance-none"
      />
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
        End
      </span>
    </div>
  );
}
