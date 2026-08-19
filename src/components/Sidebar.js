// src/components/Sidebar.js
"use client";

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
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors p-2 text-xl z-50 cursor-pointer"
        >
          ✕
        </button>

        <div className="mt-8 mb-6 pb-6 border-b border-slate-700">
          <h3 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3">
            {currentData.era}
          </h3>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-amber-500 leading-tight">
            {currentData.title}
          </h2>
        </div>

        <p className="text-lg text-slate-300 leading-relaxed mb-6">
          {currentData.summary}
        </p>

        <div className="flex flex-col gap-4">
          {/* Read Full Scripture spans full width at the top */}
          <button
            onClick={() => setShowPopup(true)}
            className="bg-amber-600/20 border border-amber-500/50 text-amber-400 py-4 px-4 rounded hover:bg-amber-600/40 transition-colors uppercase tracking-widest text-sm font-bold shadow-lg cursor-pointer text-center"
          >
            Read Full Scripture
          </button>

          {/* Previous and Next buttons side by side underneath */}
          {!isWarMode && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onPrevChapter}
                disabled={!hasPrevChapter}
                className={`py-3 px-3 rounded uppercase tracking-widest text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-1 ${
                  hasPrevChapter
                    ? "bg-slate-800 border border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-amber-500/50 hover:text-amber-400 cursor-pointer"
                    : "bg-slate-900/40 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50"
                }`}
              >
                &larr; Previous
              </button>

              <button
                onClick={onNextChapter}
                disabled={!hasNextChapter}
                className={`py-3 px-3 rounded uppercase tracking-widest text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-1 ${
                  hasNextChapter
                    ? "bg-slate-800 border border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-amber-500/50 hover:text-amber-400 cursor-pointer"
                    : "bg-slate-900/40 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50"
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
              className="bg-red-900 border border-red-500 text-white py-4 px-4 rounded hover:bg-red-950 transition-all uppercase tracking-widest text-sm font-black shadow-xl cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>Enter Kurukshetra War</span> &rarr;
            </button>
          )}
        </div>
      </aside>

      {/* --- DEEP LORE ANCIENT MANUSCRIPT MODAL --- */}
      {showPopup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-none p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-4xl h-[88vh] max-h-[920px] flex flex-col items-center justify-center my-auto">
            <img
              src="/Page.png"
              alt="Ancient Scripture Page"
              className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0 filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
            />
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-[-40] right-5 sm:right-0 text-[#885200] hover:text-[#ffa012] text-2xl font-black z-30 transition-transform hover:scale-110 drop-shadow-sm cursor-pointer"
            >
              ✕
            </button>
            <div className="relative z-20 w-full h-full flex flex-col px-16 sm:px-28 pt-20 pb-32 overflow-hidden">
              <div className="flex flex-col items-center border-b border-[#5c351b]/50 pt-3 pb-2 mb-2 shrink-0 text-center">
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.3em] text-[#422600]">
                  {currentData.era}
                </span>
                <h4 className="text-[#6b4306] font-serif font-black text-2xl sm:text-3xl uppercase tracking-wider">
                  {currentData.title}
                </h4>
              </div>
              <div className="flex-1 overflow-y-auto mb-4 pr-4 sm:pr-6 font-sans text-sm sm:text-base leading-relaxed sm:leading-[2] text-justify text-[#261005] font-semibold whitespace-pre-wrap">
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
        </div>
      )}
    </>
  );
}