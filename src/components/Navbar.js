// src/components/Navbar.js
"use client";
import { motion } from "framer-motion";

export default function Navbar({
  isMapHovered,
  showSidebar,
  showPopup,
  onOpenSearch,
}) {
  // Logic: The title ONLY shows if the mouse is on the map AND all sidebars/popups are closed
  const showTitle = isMapHovered && !showSidebar && !showPopup;

  return (
    <>
      {/* --- STANDALONE SEARCH ICON (Always visible on the right) --- */}
      <div className="absolute top-8 right-8 z-50 pointer-events-auto">
        <div className="relative group bg-gradient-to-tr from-slate-900/40 via-slate-900/70 to-slate-900 backdrop-blur-md rounded-full shadow-[inset_0_2px_5px_rgba(255,255,255,0.1),_0_10px_30px_rgba(0,0,0,1)] transition-all duration-700 ease-in-out cursor-pointer hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:scale-110">
          {/* Static Thin Border */}
          <div className="absolute inset-0 rounded-full pointer-events-none border border-amber-700/30 group-hover:border-amber-500 transition-colors duration-700" />

          {/* Sharp Animated Trail */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none z-0"
            style={{
              padding: "1px",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          >
            <div className="absolute top-1/2 left-1/2 w-[300%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg,transparent_75%,#fbbf24_100%)]" />
          </div>

          <button
            className="relative z-10 p-4 text-amber-400/80 group-hover:text-amber-400 transition-colors"
            onClick={onOpenSearch}
          >
            <svg
              className="w-6 h-6 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] transition-all"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 21l5.197-5.197M15 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* --- CURVED TITLE BANNER (Imperial Plaque Style) --- */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 z-40 transition-transform duration-700 ease-in-out pointer-events-none ${
          showTitle ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Heavy Obsidian Background with Metallic Bevel */}
        <div className="relative bg-gradient-to-b from-[#0a0703] via-[#1a1108] to-[#0f0a05] px-12 pt-4 pb-3 rounded-b-[60px] shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex items-center justify-center border-b-[3px] border-x border-[#8b5a2b] overflow-hidden">
          {/* Inner Golden Highlight (Creates the 3D Bevel) */}
          <div className="absolute inset-0 rounded-b-[60px] pointer-events-none border-b border-[#fcd34d]/30" />

          {/* Subtle Inner Noise/Texture Overlay */}
          <div className="absolute inset-0 opacity-20 rounded-b-[60px] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

          {/* Visible Sheen Sweep */}
          <div 
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <motion.div
              initial={{ x: "-150%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
          </div>

          {/* Text Container with Flanking Accents */}
          <div className="relative z-10 flex items-center gap-4">
            {/* Left Ornament */}
            <div className="flex items-center gap-1 opacity-70">
              <div className="w-6 h-[1px] bg-gradient-to-l from-amber-500 to-transparent" />
              <div className="w-1.5 h-1.5 rotate-45 bg-amber-500" />
            </div>

            <h1 className="text-xl sm:text-2xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-400 to-amber-700 tracking-[0.25em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              Mahabharat
            </h1>

            {/* Right Ornament */}
            <div className="flex items-center gap-1 opacity-70">
              <div className="w-1.5 h-1.5 rotate-45 bg-amber-500" />
              <div className="w-6 h-[1px] bg-gradient-to-r from-amber-500 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
