// src/components/Navbar.js
"use client";

export default function Navbar({ isMapHovered, showSidebar, showPopup, onOpenSearch }) {
  // Logic: The title ONLY shows if the mouse is on the map AND all sidebars/popups are closed
  const showTitle = isMapHovered && !showSidebar && !showPopup;

  return (
    <>
      {/* --- STANDALONE SEARCH ICON (Always visible on the right) --- */}
      <div className="absolute top-8 right-8 z-40 pointer-events-auto">
        <button className="bg-slate-900/40 backdrop-blur-sm border border-slate-600/50 p-4 rounded-full text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 hover:scale-110 transition-all duration-300 shadow-2xl cursor-pointer group" onClick={onOpenSearch}>
         <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l5.197-5.197M15 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
</svg>
        </button>
      </div>

      {/* --- CURVED TITLE BANNER (Slides in and out) --- */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 z-40 transition-transform duration-700 ease-in-out pointer-events-none ${
          showTitle ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* 
          The 'rounded-b-[50px]' gives it that sweeping curve from your image.
          'border-b-2' and 'border-x' create the thin outline effect.
        */}
        <div className="bg-slate-900/70 backdrop-blur-sm px-7 pt-2 pb-2 rounded-b-[90px] border-b-2 border-amber-400 shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex items-center justify-center">
          <h1 className="text-xl sm:text-xl font-serif font-bold text-amber-400 tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            Mahabharat
          </h1>
        </div>
      </div>
    </>
  );
}
