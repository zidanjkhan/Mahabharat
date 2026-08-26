// src/components/CinematicCardDeck.js

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function CinematicCardDeck({
  chapters,
  currentChapterIndex,
  onSelectChapter,
  isWarMode,
  onEnterWar,
  onSwitchBackToChapters,
  onOpenSidebar,
  onExpandChange,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [slideDir, setSlideDir] = useState(0);

  const isSwitchingRef = useRef(false);
  const lockTimeoutRef = useRef(null);

  const currentItem = chapters[currentChapterIndex];
  const prevItem = currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;
  const nextItem = currentChapterIndex < chapters.length - 1 ? chapters[currentChapterIndex + 1] : null;

  // Safe validation check to completely prevent empty string / undefined src errors
  const hasImage = (src) => typeof src === "string" && src.trim() !== "";

  const armSwitchLock = () => {
    isSwitchingRef.current = true;
    if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    lockTimeoutRef.current = setTimeout(() => {
      isSwitchingRef.current = false;
    }, 650);
  };

  const handleCardSwitch = (targetIndex, direction, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    armSwitchLock();
    setSlideDir(direction);
    onSelectChapter(targetIndex);
    setTimeout(() => setSlideDir(0), 300);
  };

  const handleMainCardClick = (e) => {
    e.stopPropagation();
    if (isSwitchingRef.current) return;
    onOpenSidebar();
  };

  const makeSwitchHandler = (targetIndex, direction) => ({
    onPointerUp: (e) => handleCardSwitch(targetIndex, direction, e),
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
    },
    style: { touchAction: "manipulation" },
  });

  // Handle horizontal swipe for changing chapters
  const handleHorizontalDragEnd = (e, info) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold && currentChapterIndex > 0) {
      handleCardSwitch(currentChapterIndex - 1, -1);
    } else if (info.offset.x < -swipeThreshold && currentChapterIndex < chapters.length - 1) {
      handleCardSwitch(currentChapterIndex + 1, 1);
    }
  };

  // Handle vertical slide/drag gesture to expand or collapse
  const handleVerticalDragEnd = (e, info) => {
    const verticalThreshold = 40;
    if (info.offset.y < -verticalThreshold) {
      // Swiped/Slid Up -> Expand card
      setIsExpanded(true);
    } else if (info.offset.y > verticalThreshold) {
      // Swiped/Slid Down -> Collapse card
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    if (onExpandChange) {
      onExpandChange(isExpanded);
    }
  }, [isExpanded, onExpandChange]);

  return (
    <div 
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center pointer-events-auto"
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Exit War Button */}
      {isWarMode && (
        <button
          onClick={onSwitchBackToChapters}
          className="absolute -left-45 px-4 py-3 bg-amber-950/20 hover:bg-amber-900 border border-amber-500/50 rounded-2xl text-amber-200 text-xs font-bold uppercase tracking-wider shadow-2xl backdrop-blur-none transition cursor-pointer"
        >
          &larr; Exit War
        </button>
      )}

      {/* CONTAINER WRAPPER */}
      <motion.div
        animate={{ x: slideDir * 25 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative flex items-center justify-center"
      >
        {/* --- LEFT PREVIOUS ARROW (Enabled for both chapters and war mode) --- */}
        {currentChapterIndex > 0 && (
          <motion.button
            animate={{ opacity: isExpanded ? 0 : 1, scale: isExpanded ? 0.8 : 1 }}
            pointerEvents={isExpanded ? "none" : "auto"}
            {...makeSwitchHandler(currentChapterIndex - 1, -1)}
            className="absolute -left-16 w-10 h-10 rounded-2xl bg-slate-950/85 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-xl backdrop-blur-xl hover:bg-slate-900 hover:scale-110 transition-all cursor-pointer text-base font-bold z-30"
            title="Previous"
          >
            &larr;
          </motion.button>
        )}

        {/* --- SYNCHRONIZED SIDE PREVIEW CARDS --- */}
        <AnimatePresence mode="popLayout">
          {isExpanded && (
            <motion.div
              key={`deck-${currentChapterIndex}`}
              initial={{ opacity: 0, x: slideDir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: slideDir * -40 }}
              transition={{ type: "spring", stiffness: 320, damping: 28, delay: 0.10 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
            >
              {prevItem && (
                <motion.div
                  whileHover={{ scale: 0.98, x: -4 }}
                  onMouseEnter={() => setIsExpanded(true)}
                  {...makeSwitchHandler(currentChapterIndex - 1, -1)}
                  className="absolute -left-28 sm:-left-36 top-[-15px] w-56 sm:w-64 h-80 bg-slate-950/90 border border-slate-700/40 rounded-3xl p-3 flex flex-col justify-between -rotate-4 scale-95 opacity-75 hover:opacity-100 shadow-2xl pointer-events-auto cursor-pointer backdrop-blur-sm group/prev"
                >
                  <div className="text-[9px] uppercase tracking-widest text-amber-500/70 font-bold px-2">Previous Chapter</div>
                  <div className="relative w-full h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                    {hasImage(prevItem.cardImg) && (
                      <Image src={prevItem.cardImg} alt={prevItem.title} fill className="object-cover opacity-70 group-hover/prev:scale-105 transition" />
                    )}
                  </div>
                  <h5 className="text-xs font-serif font-bold text-slate-300 line-clamp-1 px-1">{prevItem.title}</h5>
                  <span className="text-[9px] text-amber-400 font-semibold px-2 pb-1">&larr; Click to slide</span>
                </motion.div>
              )}

              {nextItem && (
                <motion.div
                  whileHover={{ scale: 0.98, x: 4 }}
                  onMouseEnter={() => setIsExpanded(true)}
                  {...makeSwitchHandler(currentChapterIndex + 1, 1)}
                  className="absolute -right-28 sm:-right-36 top-[-15px] w-56 sm:w-64 h-80 bg-slate-950/90 border border-slate-700/40 rounded-3xl p-3 flex flex-col justify-between rotate-4 scale-95 opacity-75 hover:opacity-100 shadow-2xl pointer-events-auto cursor-pointer backdrop-blur-sm group/next"
                >
                  <div className="text-[9px] uppercase tracking-widest text-amber-500/70 font-bold px-2 text-right">Next Chapter</div>
                  <div className="relative w-full h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                    {hasImage(nextItem.cardImg) && (
                      <Image src={nextItem.cardImg} alt={nextItem.title} fill className="object-cover opacity-70 group-hover/next:scale-105 transition" />
                    )}
                  </div>
                  <h5 className="text-[10px] font-serif font-bold text-slate-300 line-clamp-1 px-1 text-right">{nextItem.title}</h5>
                  <span className="text-[9px] text-amber-400 font-semibold px-2 pb-1 text-right">Click to slide &rarr;</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MAIN FOREGROUND ACTIVE CARD WITH DUAL DRAG SUPPORT --- */}
        <motion.div
          layout
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.15}
          onDragEnd={(e, info) => {
            if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
              handleHorizontalDragEnd(e, info);
            } else {
              handleVerticalDragEnd(e, info);
            }
          }}
          onMouseEnter={() => setIsExpanded(true)}
          onClick={handleMainCardClick}
          animate={{
            width: isExpanded ? 345 : 280,
            height: isExpanded ? 420 : 64,
            borderRadius: isExpanded ? 32 : 16,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="relative cursor-pointer shadow-[0_30px_90px_rgba(0,0,0,0.95)] backdrop-blur-3xl border border-amber-500/40 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-950 z-20 overflow-hidden flex flex-col justify-between p-4 group/card select-none"
        >
          {/* Subtle Ambient Top Lighting Effect */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-75 pointer-events-none" />

          {/* STATE 1: COLLAPSED PILL VIEW */}
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 h-full px-2"
            >
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 animate-pulse ${isWarMode ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,1)]" : "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,1)]"}`} />
              <div className="flex flex-col text-left overflow-hidden flex-1">
                <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold truncate">
                  {isWarMode ? currentItem.era : `Chapter ${currentChapterIndex + 1}`}
                </span>
                <span className="text-sm font-serif font-bold text-amber-100 group-hover/card:text-amber-300 transition truncate">
                  {currentItem.title}
                </span>
              </div>
              <span className="text-[9px] text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/30 shrink-0">
                Slide Up / Hover
              </span>
            </motion.div>
          )}

          {/* STATE 2: EXPANDED ACTIVE CARD */}
          {isExpanded && (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentChapterIndex}
                initial={{ opacity: 0, x: slideDir * 80, scale: 0.92, rotate: slideDir * 3 }}
                animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, x: slideDir * -80, scale: 0.92, rotate: slideDir * -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.10 }}
                className="flex flex-col h-full justify-between relative w-full"
              >
                {/* Header with Sleek Badge */}
                <div className="flex justify-between items-center border-b border-slate-800/80 pb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    {isWarMode ? currentItem.era : `Chapter ${currentChapterIndex + 1} / ${chapters.length}`}
                  </span>
                  <span className="text-[10px] text-slate-400 font-light tracking-wide italic">
                    Slide down to close / Click for full story
                  </span>
                </div>

                {/* Adaptive Cinematic Image Frame */}
                <div className="w-full flex justify-center my-1">
                  <div className="rounded-2xl overflow-hidden border border-amber-500/30 shadow-[0_10px_25px_rgba(0,0,0,0.8)] bg-black inline-block max-w-full group/img">
                    {hasImage(currentItem.cardImg || currentItem.image) && (
                      <img
                        src={currentItem.cardImg || currentItem.image}
                        alt={currentItem.title}
                        className="w-auto h-auto max-w-full max-h-[190px] object-contain transition-transform duration-700 group-hover/img:scale-105 pointer-events-none block mx-auto"
                      />
                    )}
                  </div>
                </div>

                {/* Title & Summary */}
                <div className="flex flex-col text-center space-y-1.5 px-1">
                  <h4 className="text-base font-serif font-bold text-amber-100 group-hover/card:text-amber-300 transition line-clamp-2 leading-snug">
                    {currentItem.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 font-light leading-relaxed">
                    {currentItem.summary}
                  </p>
                </div>

                {/* Modern Pill Footer Prompt */}
                <div className="pt-2.5 border-t border-slate-800/80 text-center">
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[10px] uppercase tracking-[0.2em] text-amber-300 font-semibold shadow-sm">
                    Click to view full sidebar
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

        {/* --- RIGHT NEXT ARROW (Enabled for both chapters and war mode) --- */}
        {currentChapterIndex < chapters.length - 1 && (
          <motion.button
            animate={{ opacity: isExpanded ? 0 : 1, scale: isExpanded ? 0.8 : 1 }}
            pointerEvents={isExpanded ? "none" : "auto"}
            {...makeSwitchHandler(currentChapterIndex + 1, 1)}
            className="absolute -right-16 w-10 h-10 rounded-2xl bg-slate-950/85 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-xl backdrop-blur-xl hover:bg-slate-900 hover:scale-110 transition-all cursor-pointer text-base font-bold z-30"
            title="Next"
          >
            &rarr;
          </motion.button>
        )}
      </motion.div>

      {/* Special Kurukshetra War Trigger */}
      {!isWarMode && currentChapterIndex === chapters.length - 1 && (
        <button
          onClick={onEnterWar}
          className="absolute -right-28 px-5 py-3.5 rounded-2xl bg-red-900/90 hover:bg-red-950 border border-red-500/60 text-white text-xs font-bold uppercase tracking-widest shadow-2xl backdrop-blur-xl transition cursor-pointer flex items-center gap-1.5"
        >
          <span>War</span> &rarr;
        </button>
      )}
    </div>
  );
}