// src/components/ChapterSelectionDrawer.js
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function ChapterSelectionDrawer({
  isOpen,
  onClose,
  chapters,
  currentChapterIndex,
  onSelectChapter,
  onEnterWar,
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
      />

      {/* Drawer Container */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] bg-slate-950/95 border-t border-amber-500/40 rounded-t-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/50">
          <div>
            <h3 className="text-lg font-serif font-bold text-amber-200">Chapter Archive</h3>
            <p className="text-xs text-slate-400">Select any chapter to jump directly to its timeline</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Chapters Grid / List */}
        <div className="p-6 overflow-y-auto space-y-3 max-h-[calc(85vh-100px)] custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {chapters.map((chapter, index) => {
              const isCurrent = index === currentChapterIndex;
              return (
                <div
                  key={chapter.id || index}
                  onClick={() => {
                    onSelectChapter(index);
                    onClose();
                  }}
                  className={`group relative flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer backdrop-blur-sm ${
                    isCurrent
                      ? "bg-amber-500/15 border-amber-500/60 shadow-[0_0_15px_rgba(251,191,36,0.15)]"
                      : "bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-amber-500/30"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-950 border border-slate-800">
                    <Image
                      src={chapter.image || "/MapMain.png"}
                      alt={chapter.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="text-[9px] uppercase tracking-widest text-amber-400 font-semibold">
                      Chapter {index + 1}
                    </span>
                    <h4 className={`text-xs font-serif font-bold truncate ${isCurrent ? "text-amber-200" : "text-slate-300 group-hover:text-amber-200"}`}>
                      {chapter.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 line-clamp-1 font-light">
                      {chapter.era || chapter.summary}
                    </span>
                  </div>

                  {isCurrent && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,1)]" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Optional War Mode Trigger Card inside Drawer */}
          {onEnterWar && (
            <div
              onClick={() => {
                onEnterWar();
                onClose();
              }}
              className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-red-950/60 to-slate-900 border border-red-500/40 hover:border-red-500/80 transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-red-400 font-bold">Final Stage</span>
                <h4 className="text-sm font-serif font-bold text-white group-hover:text-red-200 transition">Enter Kurukshetra War Mode</h4>
              </div>
              <span className="text-red-400 font-bold text-lg group-hover:translate-x-1 transition">&rarr;</span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}