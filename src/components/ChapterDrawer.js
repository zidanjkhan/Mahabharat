// src/components/ChapterDrawer.js
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChapterDrawer({ isOpen, onClose, chapters, currentChapterIndex, onSelectChapter, onEnterWar, isWarMode, onExitWar }) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filteredChapters = chapters.filter((chap, idx) => 
    chap.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    `chapter ${idx + 1}`.includes(searchTerm.toLowerCase()) ||
    (chap.era && chap.era.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[40] flex items-center justify-start pointer-events-none">

        {/* Drawer Sliding From Left with higher z-index */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative w-full max-w-md h-full bg-slate-900 border-r border-amber-500/30 shadow-2xl flex flex-col overflow-hidden text-slate-200 pointer-events-auto z-10"
        >

          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
            <div>
              <h3 className="text-xl font-serif font-bold text-amber-400">Select Scripture Chapter</h3>
              <p className="text-xs text-slate-400 mt-1">Browse or search through all chapters</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/50">
            <input
              type="text"
              placeholder="Search by chapter name or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Chapter List / Grid */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            
            {/* Dynamic War Mode / Go Back Shortcut Card at the Top */}
            <div
              onClick={() => {
                if (isWarMode) {
                  if (onExitWar) onExitWar();
                } else {
                  if (onEnterWar) onEnterWar();
                }
                onClose(); // Automatically close drawer on click
              }}
              className={`p-4 rounded-xl border flex items-center justify-center cursor-pointer group transition-all shadow-lg mb-4 ${
                isWarMode
                  ? "bg-gradient-to-r from-amber-950/80 to-slate-950 border-amber-500/40 hover:border-amber-500"
                  : "bg-gradient-to-r from-red-950/80 to-slate-950 border-red-500/40 hover:border-red-500"
              }`}
            >
              <div>
                <span className={`text-xs font-bold uppercase tracking-widest ${isWarMode ? "text-amber-400" : "text-red-400"}`}>
                  {isWarMode ? "Active Timeline" : "Special Mode"}
                </span>
                <h4 className="text-base font-serif font-bold text-white group-hover:text-amber-200 transition">
                  {isWarMode ? "← Go back to previous chapters" : "Enter Kurukshetra War Chronicles"}
                </h4>
              </div>
              <span className={`px-3 py-1 rounded text-xs font-bold ml-auto ${isWarMode ? "bg-amber-900/60 text-amber-200" : "bg-red-900/60 text-red-200"}`}>
                {isWarMode ? "Exit" : "18 Days"}
              </span>
            </div>

            {filteredChapters.map((chapter, idx) => {
              const originalIndex = chapters.indexOf(chapter);
              const isSelected = !isWarMode && currentChapterIndex === originalIndex;

              return (
                <div
                  key={originalIndex}
                  onClick={() => {
                    onSelectChapter(originalIndex);
                    onClose(); 
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected 
                      ? "bg-amber-500/10 border-amber-500/60 text-amber-300 shadow-md" 
                      : "bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/60 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isSelected ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-400"
                    }`}>
                      {originalIndex + 1}
                    </span>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 block">{chapter.era || `Chapter ${originalIndex + 1}`}</span>
                      <h4 className="text-sm font-serif font-medium">{chapter.title}</h4>
                    </div>
                  </div>
                  {isSelected && <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">Active</span>}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}