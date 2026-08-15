// src/components/FloatingMenu.js
"use client";

// We have updated the function definition to accept the setShowFamilyTree tool as a prop.
// This is "reading the note."
export default function FloatingMenu({ setShowFamilyTree }) {
  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40 pointer-events-auto">
      {/* --- CHAPTERS BUTTON --- */}
      <button
        className="group relative flex items-center h-12 w-12 hover:w-36 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl transition-all duration-300 ease-in-out overflow-hidden cursor-pointer"
        // We will add the onClick handler later when we build the Chapter Popup!
      >
        {/* The Icon stays exactly 3rem (12 units) wide so it stays centered when collapsed */}
        <div className="flex items-center justify-center min-w-[3rem] h-full text-amber-500 group-hover:text-amber-400 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>

        {/* The hidden text that fades in on hover */}
        <span className="text-xs font-bold text-slate-200 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chapters
        </span>
      </button>

      {/* --- FAMILY TREE BUTTON (Trigger) --- */}
      <button
        className="group relative flex items-center h-12 w-12 hover:w-40 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl transition-all duration-300 ease-in-out overflow-hidden cursor-pointer"
        // This is the CRITICAL integration point.
        // We add an onClick event to the button. When clicked, it calls an arrow function '() => {}'
        // which immediately calls the 'setShowFamilyTree(true)' tool we received as a prop.
        // This tool changes the memory in page.js from 'false' to 'true'.
        onClick={() => setShowFamilyTree(true)}
      >
        <div className="flex items-center justify-center min-w-[3rem] h-full text-amber-500 group-hover:text-amber-400 transition-colors">
          {/* A network/branching node icon representing a lineage tree */}
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 3H14V7H10V3ZM11 8H13V13H18V15H22V19H18V17H13V21H11V17H6V19H2V15H6V13H11V8Z" />
          </svg>
        </div>

        <span className="text-xs font-bold text-slate-200 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Family Tree
        </span>
      </button>
    </div>
  );
}
