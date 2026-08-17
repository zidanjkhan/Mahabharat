// src/components/FloatingMenu.js
"use client";

export default function FloatingMenu({ setShowFamilyTree }) {
  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40 pointer-events-auto">
      <button
        onClick={() => setShowFamilyTree(true)}
        className="group relative flex items-center h-14 w-14 hover:w-50 bg-gradient-to-r from-[#070b14]/95 via-[#0f172a]/90 to-[#070b14]/95 backdrop-blur-xl border border-amber-500/40 hover:border-amber-400 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all duration-500 ease-out overflow-hidden cursor-pointer"
      >
        {/* Original Branching Node Icon */}
        <div className="flex items-center justify-center min-w-[3.5rem] h-full text-amber-400 group-hover:text-amber-300 transition-transform duration-300 group-hover:scale-110">
          <svg className="w-5 h-5 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 3H14V7H10V3ZM11 8H13V13H18V15H22V19H18V17H13V21H11V17H6V19H2V15H6V13H11V8Z" />
          </svg>
        </div>

        {/* Expanded Text with Subtitle */}
        <div className="flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pr-4">
          <span className="text-xs font-serif font-bold text-amber-300 tracking-wider uppercase">
            Dynasty Lineage
          </span>
          <span className="text-[9px] font-sans text-slate-400 tracking-widest uppercase">
            Explore Kuru Tree
          </span>
        </div>

        
      </button>
    </div>
  );
}