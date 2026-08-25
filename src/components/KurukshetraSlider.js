import React, { useState } from "react";
import { kurukshetraWarData } from "@/data/kurukshetraData";
import { motion } from "framer-motion";

export default function KurukshetraSlider({ initialDayIndex = 0, onBackToSidebar }) {
  const [currentIndex, setCurrentIndex] = useState(initialDayIndex);
  const [showDeepLore, setShowDeepLore] = useState(false);
  const [slideDir, setSlideDir] = useState(0);

  const currentDay = kurukshetraWarData[currentIndex];

  const handleCardSwitch = (targetIndex, direction, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSlideDir(direction);
    setCurrentIndex(targetIndex);
    setShowDeepLore(false);
    setTimeout(() => setSlideDir(0), 300);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-3xl mx-auto relative">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-6">
        <button
          onClick={onBackToSidebar}
          className="text-sm font-medium text-amber-200 hover:text-white flex items-center gap-1 cursor-pointer bg-slate-950/80 px-4 py-2 rounded-xl border border-amber-500/30 backdrop-blur-md transition"
        >
          &larr; Back to Sidebar Menu
        </button>
        <span className="text-xs uppercase tracking-widest px-3.5 py-1.5 bg-red-950/90 border border-red-500/50 text-red-200 rounded-xl font-semibold shadow-xl backdrop-blur-md">
          Kurukshetra War Chronicles
        </span>
      </div>

      {/* INLINE FLEX CONTAINER (Guarantees arrows are always visible and never clipped) */}
      <div className="flex items-center justify-center w-full gap-4 relative">
        {/* --- LEFT PREVIOUS ARROW --- */}
        {currentIndex > 0 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => handleCardSwitch(currentIndex - 1, -1, e)}
            className="shrink-0 w-12 h-12 rounded-2xl bg-slate-950/95 border border-amber-500/50 text-amber-400 flex items-center justify-center shadow-2xl backdrop-blur-xl hover:bg-slate-900 transition-all cursor-pointer text-lg font-bold z-30"
            title="Previous Day"
          >
            &larr;
          </motion.button>
        )}

        {/* --- MAIN CARD --- */}
        <motion.div 
          animate={{ x: slideDir * 15 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="flex-1 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-950 border border-amber-500/40 p-6 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] backdrop-blur-3xl flex flex-col justify-between min-h-[380px] text-amber-100 relative overflow-hidden"
        >
          {/* Subtle Ambient Top Lighting Effect */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-75 pointer-events-none" />

          <div>
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-3 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400 px-2.5 py-0.5 rounded-lg bg-red-500/10 border border-red-500/20">
                {currentDay.era}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Day {currentIndex + 1} / {kurukshetraWarData.length}
              </span>
            </div>

            <h2 className="text-xl font-serif font-bold text-amber-100 mb-3 leading-snug">
              {currentDay.title}
            </h2>

            {/* Toggle between Summary and Deep Lore */}
            {!showDeepLore ? (
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400/70">
                  Summary
                </h3>
                <p className="text-slate-300 font-light leading-relaxed text-xs">
                  {currentDay.summary}
                </p>
                <button
                  onClick={() => setShowDeepLore(true)}
                  className="mt-2 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Read Deep Lore &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-3 animate-fade-in max-h-[180px] overflow-y-auto pr-1">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400/70">
                  Deep Lore
                </h3>
                <p className="text-slate-200 font-light leading-relaxed text-xs whitespace-pre-line">
                  {currentDay.deepLore}
                </p>
                <button
                  onClick={() => setShowDeepLore(false)}
                  className="mt-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  &larr; Back to Summary
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* --- RIGHT NEXT ARROW --- */}
        {currentIndex < kurukshetraWarData.length - 1 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => handleCardSwitch(currentIndex + 1, 1, e)}
            className="shrink-0 w-12 h-12 rounded-2xl bg-slate-950/95 border border-amber-500/50 text-amber-400 flex items-center justify-center shadow-2xl backdrop-blur-xl hover:bg-slate-900 transition-all cursor-pointer text-lg font-bold z-30"
            title="Next Day"
          >
            &rarr;
          </motion.button>
        )}
      </div>

      {/* Slider Indicator Dots */}
      <div className="flex items-center gap-1.5 mt-6 overflow-x-auto max-w-xl py-2">
        {kurukshetraWarData.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => handleCardSwitch(idx, idx > currentIndex ? 1 : -1, e)}
            className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
              currentIndex === idx ? "bg-red-500 scale-125 shadow-[0_0_8px_rgba(239,68,68,1)]" : "bg-slate-700 hover:bg-slate-500"
            }`}
            title={`Day ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}