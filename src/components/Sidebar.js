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

      {/* --- DEEP LORE BOOK MODAL --- */}
      {showPopup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-none p-4 sm:p-10">
          <div className="bg-slate-900 opacity-80 border border-amber-600/50 p-8 sm:p-12 max-w-4xl w-full h-[85vh] shadow-2xl relative flex flex-col rounded-lg">
            <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-6 shrink-0">
              <h4 className="text-amber-500 font-bold font-serif text-2xl uppercase tracking-widest">
                Ancient Records: {currentData.title}
              </h4>
              <button
                onClick={() => setShowPopup(false)}
                className="text-slate-400 hover:text-white text-3xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto pr-4 custom-scrollbar text-slate-300 font-serif leading-loose text-lg whitespace-pre-wrap">
              {currentData.deepLore}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
