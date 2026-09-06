// src/components/Sidebar.js
"use client";

import { motion } from "framer-motion";
import AudioLorePlayer from "./AudioLorePlayer"; 

export default function Sidebar({
  showSidebar,
  setShowSidebar,
  showPopup,
  setShowPopup,
  currentData,
  isWarMode,
  onOpenKurukshetra,
  onNextChapter,
  onPrevChapter,
  hasNextChapter,
  hasPrevChapter,
}) {
  const isChapter43 = currentData.era === "Chapter 43" || currentData.title === "The Death of Kichaka";

  const handleDragEnd = (e, info) => {
    const swipeThreshold = 60; 
    if (info.offset.x > swipeThreshold) {
      setShowSidebar(false);
    }
  };

  return (
    <>
      {/* --- LORE SIDEBAR WITH SWIPE SUPPORT --- */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: showSidebar ? 0 : "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.05, right: 0.5 }}
        onDragEnd={handleDragEnd}
        className="absolute top-0 right-0 h-full w-[90vw] md:w-[480px] bg-[#050301] opacity-100 border-l border-[#8b5a2b]/40 shadow-[-30px_0_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-50 flex flex-col overflow-y-auto cursor-grab active:cursor-grabbing"
      >
        {/* Floating Glass Close Button */}
        <button
          onClick={() => setShowSidebar(false)}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/40 border border-[#8b5a2b]/40 backdrop-blur-md flex items-center justify-center text-[#a67c47] hover:text-[#fbbf24] hover:border-[#fbbf24]/60 hover:bg-black/60 transition-all z-50 shadow-[0_4px_15px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          ✕
        </button>

        {/* --- MASSIVE EDGE-TO-EDGE HERO IMAGE --- */}
        {currentData.sidebarImage ? (
          // Fixed height ensures the text block is always anchored consistently. 
          // Landscape images will zoom to fill this height.
          <div className="relative w-full h-[400px] sm:h-[480px] shrink-0 pointer-events-none">
            <img
              src={currentData.sidebarImage}
              alt={currentData.title}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            
            {/* The Vignette: Restricted to the bottom 2/3rds to leave the top bright and clear */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#050301] via-[#050301]/70 to-transparent" />
            <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#050301]/80 to-transparent" />
          </div>
        ) : (
          // Fallback Spacer if no image exists
          <div className="h-24 shrink-0" />
        )}

        {/* --- TEXT CONTENT & BUTTONS --- */}
        <div className="relative px-8 pb-8 flex flex-col flex-1 z-10 -mt-24 sm:-mt-28">
          
          {/* Unified Title Block */}
          <div className="mb-6">
            <h3 className="text-[10px] font-black tracking-[0.3em] text-[#fbbf24] uppercase mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              {currentData.era}
            </h3>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fff6d6] via-[#fbbf24] to-[#a67c47] leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,1)] pb-1">
              {currentData.title}
            </h2>
          </div>

          <p className="text-base text-[#d1bfae] leading-relaxed mb-8 font-light text-justify drop-shadow-sm">
            {currentData.summary}
          </p>

          <div className="flex flex-col gap-4 mt-auto">
            
            {/* Read Full Scripture - Glowing Glass Button */}
            <button
              onClick={() => setShowPopup(true)}
              className="relative overflow-hidden w-full bg-gradient-to-b from-[#8b5a2b]/20 to-[#0a0703] border border-[#8b5a2b]/50 hover:border-[#fbbf24]/60 text-[#fbbf24] py-4 rounded-xl transition-all duration-300 uppercase tracking-[0.2em] text-[11px] font-black shadow-[0_10px_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] group cursor-pointer flex justify-center items-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fbbf24]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              Read Full Scripture &rarr;
            </button>

            {/* Previous and Next buttons side by side */}
            {!isWarMode && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onPrevChapter}
                  disabled={!hasPrevChapter}
                  className={`relative py-3.5 px-3 rounded-xl uppercase tracking-[0.15em] text-[10px] font-black transition-all flex items-center justify-center gap-2 overflow-hidden ${
                    hasPrevChapter
                      ? "bg-[#0a0703] border border-[#8b5a2b]/40 text-[#a67c47] hover:border-[#fbbf24]/50 hover:text-[#fbbf24] hover:bg-[#1a1108] hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] cursor-pointer"
                      : "bg-black border border-slate-900 text-slate-700 cursor-not-allowed opacity-50"
                  }`}
                >
                  &larr; Previous
                </button>

                <button
                  onClick={onNextChapter}
                  disabled={!hasNextChapter}
                  className={`relative py-3.5 px-3 rounded-xl uppercase tracking-[0.15em] text-[10px] font-black transition-all flex items-center justify-center gap-2 overflow-hidden ${
                    hasNextChapter
                      ? "bg-[#0a0703] border border-[#8b5a2b]/40 text-[#a67c47] hover:border-[#fbbf24]/50 hover:text-[#fbbf24] hover:bg-[#1a1108] hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] cursor-pointer"
                      : "bg-black border border-slate-900 text-slate-700 cursor-not-allowed opacity-50"
                  }`}
                >
                  <span>Next</span> &rarr;
                </button>
              </div>
            )}

            {/* Kurukshetra War Button on Chapter 43 */}
            {!isWarMode && isChapter43 && (
              <button
                onClick={() => {
                  if (onOpenKurukshetra) onOpenKurukshetra(0);
                }}
                className="mt-2 relative overflow-hidden w-full bg-gradient-to-br from-[#4a0909]/90 to-black hover:from-[#5e0a0a] border border-red-500/50 text-[#ffedb3] py-4 rounded-xl transition-all duration-300 uppercase tracking-[0.2em] text-[11px] font-black shadow-[0_10px_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(185,28,28,0.5)] cursor-pointer flex justify-center items-center gap-2"
              >
                <span>Enter Kurukshetra War</span> &rarr;
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* --- DEEP LORE ANCIENT MANUSCRIPT MODAL --- */}
      {showPopup && (
        <div className="absolute inset-0 z-80 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
          {/* THE GLIDING AUDIO PLAYER */}
          <AudioLorePlayer 
            textToRead={currentData.deepLore}
            hasNextChapter={hasNextChapter}
            hasPrevChapter={hasPrevChapter}
            onNextChapter={() => {
              onNextChapter();
              setShowSidebar(false); 
              setShowPopup(true);    
            }}
            onPrevChapter={() => {
              onPrevChapter();
              setShowSidebar(false);
              setShowPopup(true);
            }}
          />
          {/* ========================================= */}
          {/* 1. PC / DESKTOP VIEW (Landscape proportions) */}
          {/* ========================================= */}
          <div className="hidden sm:flex relative w-full max-w-4xl h-[88vh] max-h-[920px] flex-col items-center justify-center my-auto">
            <img
              src="/Page.png"
              alt="Ancient Scripture Page"
              className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0 filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
            />
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-[-40px] right-0 text-[#885200] hover:text-[#ffa012] text-2xl font-black z-30 transition-transform hover:scale-110 drop-shadow-sm cursor-pointer"
            >
              ✕
            </button>
            <div className="relative z-20 w-full h-full flex flex-col px-28 pt-20 pb-32 overflow-hidden">
              <div className="flex flex-col items-center border-b border-[#5c351b]/50 pt-3 pb-2 mb-2 shrink-0 text-center">
                <span className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#422600]">
                  {currentData.era}
                </span>
                <h4 className="text-[#6b4306] font-serif font-black text-3xl uppercase tracking-wider">
                  {currentData.title}
                </h4>
              </div>
              
              <div className="flex-1 overflow-y-auto mb-4 pr-6 font-sans text-base leading-[2] text-justify text-[#261005] font-semibold whitespace-pre-wrap [scrollbar-width:thin] [scrollbar-color:#5c3a21_transparent]">
                {currentData.deepLore}
              </div>
              {!isWarMode && isChapter43 && (
                <div className="mt-auto pt-4 flex justify-center shrink-0">
                  <button
                    onClick={() => {
                      setShowPopup(false);
                      if (onOpenKurukshetra) onOpenKurukshetra(0);
                    }}
                    className="bg-red-900 hover:bg-red-950 text-white font-serif uppercase tracking-widest text-xs py-2 px-6 rounded shadow-lg transition cursor-pointer"
                  >
                    Proceed to Kurukshetra War &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ========================================= */}
          {/* 2. MOBILE / PHONE VIEW */}
          {/* ========================================= */}
          <div className="flex sm:hidden relative w-full max-w-md aspect-[3/4] max-h-[85vh] flex-col items-center justify-center my-auto">
            <img
              src="/Page.png"
              alt="Ancient Scripture Page"
              className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
            />
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-[-25px] right-4 text-[#885200] hover:text-[#ffa012] text-lg font-black z-30 cursor-pointer"
            >
              ✕
            </button>
            
            <div className="relative z-20 w-full h-full flex flex-col px-14 pt-13 pb-21 overflow-hidden">
              <div className="flex flex-col items-center border-b border-[#5c351b]/50 pt-1 pb-1 mb-1 shrink-0 text-center">
                <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#422600]">
                  {currentData.era}
                </span>
                <h4 className="text-[#6b4306] font-serif font-bold text-sm sm:text-base uppercase tracking-wide">
                  {currentData.title}
                </h4>
              </div>
              
              <div className="flex-1 overflow-y-auto mb-2 pr-2 font-sans text-[11px] leading-relaxed text-justify text-[#261005] font-semibold whitespace-pre-wrap [scrollbar-width:thin]">
                {currentData.deepLore}
              </div>

              {!isWarMode && isChapter43 && (
                <div className="mt-auto pt-1 flex justify-center shrink-0">
                  <button
                    onClick={() => {
                      setShowPopup(false);
                      if (onOpenKurukshetra) onOpenKurukshetra(0);
                    }}
                    className="bg-red-900 hover:bg-red-950 text-white font-serif uppercase tracking-widest text-[9px] py-1 px-3 rounded shadow-md cursor-pointer"
                  >
                    Proceed to Kurukshetra War &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}