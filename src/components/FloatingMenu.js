// src/components/FloatingMenu.js
"use client";

import { useState } from "react";

export default function FloatingMenu({ setShowFamilyTree, setShowDrawer }) {
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonPress = (buttonName, action) => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    if (isTouchDevice) {
      if (activeButton !== buttonName) {
        // First tap: Slide open the label
        setActiveButton(buttonName);
      } else {
        // Second tap: Trigger the action
        action();
        setActiveButton(null);
      }
    } else {
      // PC Click: Trigger action immediately
      action();
    }
  };

  return (
    <div 
      className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40 pointer-events-auto"
      onClick={() => {
        // Tap outside buttons on mobile resets open labels
        const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
        if (isTouchDevice) setActiveButton(null);
      }}
    >
      
      {/* 1. Dynasty Lineage Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleButtonPress("familyTree", () => setShowFamilyTree(true));
        }}
        className={`group relative flex items-center h-14 bg-gradient-to-r from-[#070b14]/95 via-[#0f172a]/90 to-[#070b14]/95 backdrop-blur-xl border rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out overflow-hidden cursor-pointer ${
          activeButton === "familyTree" ? "w-50 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]" : "w-14 border-amber-500/40 hover:w-50 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]"
        }`}
      >
        <div className="flex items-center justify-center min-w-[3.5rem] h-full text-amber-400 group-hover:text-amber-300 transition-transform duration-300 group-hover:scale-110">
          <svg className="w-5 h-5 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 3H14V7H10V3ZM11 8H13V13H18V15H22V19H18V17H13V21H11V17H6V19H2V15H6V13H11V8Z" />
          </svg>
        </div>

        <div className={`flex flex-col justify-center transition-opacity duration-300 whitespace-nowrap pr-4 ${
          activeButton === "familyTree" ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}>
          <span className="text-xs font-serif font-bold text-amber-300 tracking-wider uppercase">
            Dynasty Lineage
          </span>
          <span className="text-[9px] font-sans text-slate-400 tracking-widest uppercase">
            Explore Kuru Tree
          </span>
        </div>
      </button>

      {/* 2. Chapters Drawer Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleButtonPress("chapters", () => setShowDrawer(true));
        }}
        className={`group relative flex items-center h-14 bg-gradient-to-r from-[#070b14]/95 via-[#0f172a]/90 to-[#070b14]/95 backdrop-blur-xl border rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out overflow-hidden cursor-pointer ${
          activeButton === "chapters" ? "w-40 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]" : "w-14 border-amber-500/40 hover:w-40 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]"
        }`}
      >
        <div className="flex items-center justify-center min-w-[3.5rem] h-full text-amber-400 group-hover:text-amber-300 transition-transform duration-300 group-hover:scale-110">
          <span className="text-lg drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">📜</span>
        </div>

        <div className={`flex flex-col justify-center transition-opacity duration-300 whitespace-nowrap pr-4 ${
          activeButton === "chapters" ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}>
          <span className="text-xs font-serif font-bold text-amber-300 tracking-wider uppercase">
            Chapters
          </span>
          <span className="text-[9px] font-sans text-slate-400 tracking-widest uppercase">
            Browse Archive
          </span>
        </div>
      </button>

    </div>
  );
}