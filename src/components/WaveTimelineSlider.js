// // src/components/WaveTimelineSlider.js
// "use client";

// import { useState } from "react";
// import ChapterDrawer from "./ChapterDrawer"; // Reusing the clean search drawer from earlier!

// export default function WaveTimelineSlider({ 
//   chapters, 
//   currentChapterIndex, 
//   onSelectChapter, 
//   isWarMode, 
//   onEnterWar, 
//   onSwitchBackToChapters 
// }) {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const currentItem = chapters[currentChapterIndex];

//   return (
//     <>
//       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 pointer-events-auto w-[92%] max-w-xl">
        
//         {/* Left Control: Exit War or Previous Chapter */}
//         {isWarMode ? (
//           <button
//             onClick={onSwitchBackToChapters}
//             className="px-4 py-4 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 rounded-2xl text-amber-200 text-xs font-bold uppercase tracking-wider shadow-2xl backdrop-blur-xl transition cursor-pointer shrink-0"
//           >
//             &larr; Exit War
//           </button>
//         ) : (
//           <button
//             onClick={() => onSelectChapter(Math.max(0, currentChapterIndex - 1))}
//             disabled={currentChapterIndex === 0}
//             className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-2xl backdrop-blur-xl transition shrink-0 text-xl font-bold ${
//               currentChapterIndex === 0 
//                 ? "bg-slate-950/40 border-slate-800 text-slate-700 cursor-not-allowed" 
//                 : "bg-slate-950/80 hover:bg-slate-900 border-amber-500/30 text-amber-400 cursor-pointer"
//             }`}
//           >
//             &larr;
//           </button>
//         )}

//         {/* Center Cinematic Card Deck */}
//         <div
//           onClick={() => setIsDrawerOpen(true)}
//           className="flex-1 group relative px-6 py-3.5 bg-slate-950/90 hover:bg-slate-900 border border-amber-500/40 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col items-center text-center cursor-pointer transition-all duration-200 hover:scale-[1.02]"
//         >
//           <div className="flex items-center gap-2 mb-0.5">
//             <span className={`w-2 h-2 rounded-full ${isWarMode ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]" : "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,1)]"}`} />
//             <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
//               {isWarMode ? currentItem.era : `Chapter ${currentChapterIndex + 1} of ${chapters.length}`}
//             </span>
//           </div>

//           <h4 className="text-sm sm:text-base font-serif font-bold text-amber-200 group-hover:text-amber-300 truncate w-full">
//             {currentItem.title}
//           </h4>

//           <span className="text-[9px] text-amber-500/70 uppercase tracking-widest mt-0.5 font-medium">
//             Click to browse all chapters ▼
//           </span>
//         </div>

//         {/* Right Control: Next Chapter or Kurukshetra Trigger */}
//         {!isWarMode && currentChapterIndex < chapters.length - 1 ? (
//           <button
//             onClick={() => onSelectChapter(currentChapterIndex + 1)}
//             className="w-14 h-14 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-2xl backdrop-blur-xl transition shrink-0 text-xl font-bold cursor-pointer"
//           >
//             &rarr;
//           </button>
//         ) : !isWarMode && currentChapterIndex === chapters.length - 1 ? (
//           <button
//             onClick={onEnterWar}
//             className="px-5 py-4 rounded-2xl bg-red-900/90 hover:bg-red-950 border border-red-500/60 text-white text-xs font-bold uppercase tracking-widest shadow-2xl backdrop-blur-xl transition shrink-0 cursor-pointer flex items-center gap-1.5"
//           >
//             <span>War</span> &rarr;
//           </button>
//         ) : null}

//       </div>

//       {/* Chapter Selection Drawer Modal */}
//       <ChapterDrawer
//         isOpen={isDrawerOpen}
//         onClose={() => setIsDrawerOpen(false)}
//         chapters={chapters}
//         currentChapterIndex={currentChapterIndex}
//         onSelectChapter={onSelectChapter}
//         onEnterWar={onEnterWar}
//       />
//     </>
//   );
// }