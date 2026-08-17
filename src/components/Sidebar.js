// src/components/Sidebar.js
"use client";

export default function Sidebar({
  showSidebar,
  setShowSidebar,
  showPopup,
  setShowPopup,
  currentData,
}) {
  return (
    <>
      {/* --- LORE SIDEBAR (SUMMARY) --- */}
      <aside
        className={`absolute top-0 right-0 h-full w-[90vw] md:w-[480px] bg-slate-900/95 opacity-80 border-l border-slate-700 shadow-2xl backdrop-blur-md z-40 p-8 flex flex-col justify-center transition-transform duration-500 ease-in-out overflow-y-auto ${
          showSidebar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setShowSidebar(false)}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors p-2 text-xl z-50"
        >
          ✕
        </button>

        <div className="mt-8 mb-6 pb-6 border-b border-slate-700">
          <h3 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3">
            {currentData.era}
          </h3>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-amber-500 leading-tight">
            {currentData.title}
          </h2>
        </div>

        <p className="text-lg text-slate-300 leading-relaxed mb-8">
          {currentData.summary}
        </p>

        <button
          onClick={() => setShowPopup(true)}
          className="bg-amber-600/20 border border-amber-500/50 text-amber-400 py-4 px-4 rounded hover:bg-amber-600/40 transition-colors uppercase tracking-widest text-sm font-bold shadow-lg"
        >
          Read Full Scripture
        </button>
      </aside>

      {/* --- DEEP LORE ANCIENT MANUSCRIPT MODAL --- */}
      {showPopup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-none p-4 sm:p-6 overflow-y-auto">
          {/* Main Ancient Page Container Wrapper */}
          <div className="relative w-full max-w-4xl h-[88vh] max-h-[920px] flex flex-col items-center justify-center my-auto">
            
            {/* Ancient Page Background Image */}
            <img
              src="/Page.png"
              alt="Ancient Scripture Page"
              className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0 filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
            />

            {/* Close Button Positioned Safely in the Top-Right Corner */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-[-40] right-5 sm:right-0 text-[#885200] hover:text-[#ffa012] text-2xl font-black z-30 transition-transform hover:scale-110 drop-shadow-sm"
              title="Close Manuscript"
            >
              ✕
            </button>

            {/* Content Layer with expanded left/right padding */}
            <div className="relative z-20 w-full h-full flex flex-col px-16 sm:px-28 pt-20 pb-25 overflow-hidden">
              
              {/* Header Section inside the manuscript (Replaced subtitle, deep bronze-red title for maximum visibility) */}
              <div className="flex flex-col items-center border-b border-[#5c351b]/50 pb-4 mb-6 shrink-0 text-center">
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.3em] text-[#422600]">
                  {currentData.era}
                </span>
                <h4 className="text-[#6b4306] font-serif font-black text-2xl sm:text-3xl uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]">
                  {currentData.title}
                </h4>
              </div>

              {/* Scrollable Ancient Text Body (Clean sans-serif or crisp font for ultimate legibility, deep dark brown-black tone) */}
              <div className="flex-1 overflow-y-auto pr-4 sm:pr-6 font-sans text-sm sm:text-base leading-relaxed sm:leading-[2] text-justify text-[#261005] font-semibold selection:bg-amber-900/30 whitespace-pre-wrap [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#5c3a21]/50 [&::-webkit-scrollbar-thumb]:rounded-full">
                {currentData.deepLore}
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}