// src/components/CinematicCardDeck.js

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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

  const hasImage = (src) => typeof src === "string" && src.trim() !== "";

  const armSwitchLock = () => {
    isSwitchingRef.current = true;
    if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    lockTimeoutRef.current = setTimeout(() => {
      isSwitchingRef.current = false;
    }, 400); 
  };

  const handleCardSwitch = (targetIndex, direction, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    armSwitchLock();
    setSlideDir(direction);
    onSelectChapter(targetIndex);
    setTimeout(() => setSlideDir(0), 200); 
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

  const handleHorizontalDragEnd = (e, info) => {
    const swipeThreshold = 40; 
    if (info.offset.x > swipeThreshold) {
      if (currentChapterIndex > 0) {
        handleCardSwitch(currentChapterIndex - 1, -1);
      } else if (isWarMode && currentChapterIndex === 0) {
        onSwitchBackToChapters();
        handleCardSwitch(38, -1);
      }
    } else if (info.offset.x < -swipeThreshold && currentChapterIndex < chapters.length - 1) {
      handleCardSwitch(currentChapterIndex + 1, 1);
    }
  };

  const handleVerticalDragEnd = (e, info) => {
    const verticalThreshold = 30; 
    if (info.offset.y < -verticalThreshold) {
      setIsExpanded(true);
    } else if (info.offset.y > verticalThreshold) {
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
      className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center pointer-events-auto"
      onMouseLeave={() => setIsExpanded(false)}
    >
      <motion.div
        animate={{ x: slideDir * 20 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }} 
        className="relative flex items-center justify-center"
      >
        
        {(currentChapterIndex > 0 || (isWarMode && currentChapterIndex === 0)) && (
          <motion.button
            animate={{ opacity: isExpanded ? 0 : 1, scale: isExpanded ? 0.8 : 1 }}
            pointerEvents={isExpanded ? "none" : "auto"}
            {...(currentChapterIndex > 0 
              ? makeSwitchHandler(currentChapterIndex - 1, -1) 
              : { 
                  onPointerUp: (e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    onSwitchBackToChapters();
                    handleCardSwitch(38, -1);
                  },
                  onClick: (e) => { e.preventDefault(); e.stopPropagation(); },
                  style: { touchAction: "manipulation" } 
                }
            )}
            className="absolute -left-12 sm:-left-16 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#050301]/80 border border-[#8b5a2b]/50 text-amber-500 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.9)] backdrop-blur-md hover:bg-[#1c1106]/90 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:scale-110 transition-all cursor-pointer text-base sm:text-lg font-bold z-30"
            title={isWarMode && currentChapterIndex === 0 ? "Return to Main Chapters" : "Previous"}
          >
            &larr;
          </motion.button>
        )}

        <AnimatePresence mode="popLayout">
          {isExpanded && (
            <motion.div
              key={`deck-${currentChapterIndex}`}
              initial={{ opacity: 0, x: slideDir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: slideDir * -40 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }} 
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
            >
              {/* PREVIOUS CARD */}
              {prevItem && (
                <motion.div
                  whileHover={{ scale: 0.98, x: -4 }}
                  onMouseEnter={() => setIsExpanded(true)}
                  {...makeSwitchHandler(currentChapterIndex - 1, -1)}
                  className="absolute -left-[140px] sm:-left-44 top-0 sm:top-[-20px] w-40 sm:w-64 h-[280px] sm:h-[380px] rounded-2xl sm:rounded-[2rem] bg-[#050301] border border-[#8b5a2b]/20 flex flex-col justify-between -rotate-6 scale-90 opacity-40 blur-[2px] hover:blur-none hover:opacity-100 shadow-[0_20px_50px_rgba(0,0,0,1)] pointer-events-auto cursor-pointer backdrop-blur-xl group/prev transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute top-0 inset-x-0 h-32 sm:h-48 w-full z-0 overflow-hidden rounded-t-2xl sm:rounded-t-[2rem]">
                    {hasImage(prevItem.cardImg || prevItem.image) && (
                      <Image 
                        src={prevItem.cardImg || prevItem.image} 
                        alt={prevItem.title} 
                        fill
                        sizes="(max-width: 768px) 160px, 256px"
                        className="object-cover object-top opacity-50 group-hover/prev:scale-110 group-hover/prev:opacity-80 transition-all duration-700" 
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050301] via-[#050301]/60 to-transparent pointer-events-none" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full justify-end p-4 sm:p-5">
                    <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#a67c47] font-bold drop-shadow-sm mb-1">Previous</div>
                    <h5 className="text-xs sm:text-sm font-serif font-black text-[#d1bfae] line-clamp-2 drop-shadow-md">{prevItem.title}</h5>
                  </div>
                </motion.div>
              )}

              {/* NEXT CARD */}
              {nextItem && (
                <motion.div
                  whileHover={{ scale: 0.98, x: 4 }}
                  onMouseEnter={() => setIsExpanded(true)}
                  {...makeSwitchHandler(currentChapterIndex + 1, 1)}
                  className="absolute -right-[140px] sm:-right-44 top-0 sm:top-[-20px] w-40 sm:w-64 h-[280px] sm:h-[380px] rounded-2xl sm:rounded-[2rem] bg-[#050301] border border-[#8b5a2b]/20 flex flex-col justify-between rotate-6 scale-90 opacity-40 blur-[2px] hover:blur-none hover:opacity-100 shadow-[0_20px_50px_rgba(0,0,0,1)] pointer-events-auto cursor-pointer backdrop-blur-xl group/next transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute top-0 inset-x-0 h-32 sm:h-48 w-full z-0 overflow-hidden rounded-t-2xl sm:rounded-t-[2rem]">
                    {hasImage(nextItem.cardImg || nextItem.image) && (
                      <Image 
                        src={nextItem.cardImg || nextItem.image} 
                        alt={nextItem.title} 
                        fill
                        sizes="(max-width: 768px) 160px, 256px"
                        className="object-cover object-top opacity-50 group-hover/next:scale-110 group-hover/next:opacity-80 transition-all duration-700" 
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050301] via-[#050301]/60 to-transparent pointer-events-none" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col items-end h-full justify-end p-4 sm:p-5 text-right">
                    <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#a67c47] font-bold drop-shadow-sm mb-1">Next</div>
                    <h5 className="text-xs sm:text-sm font-serif font-black text-[#d1bfae] line-clamp-2 drop-shadow-md">{nextItem.title}</h5>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          drag
          style={{ willChange: "width, height, border-radius, transform" }}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.1} 
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
            borderRadius: isExpanded ? 32 : 36,
          }}
          transition={{ type: "spring", stiffness: 450, damping: 30 }} 
          className={`relative cursor-pointer transform-gpu shadow-[0_30px_70px_rgba(0,0,0,0.95)] backdrop-blur-xl border border-[#8b5a2b]/60 bg-[#050301] z-20 overflow-hidden flex flex-col justify-between p-0 group/card select-none ${
            isExpanded 
              ? "w-[300px] sm:w-[380px] h-[380px] sm:h-[460px]" 
              : "w-[240px] sm:w-[300px] h-[56px] sm:h-[72px]"
          }`}
        >
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#fbbf24]/60 to-transparent opacity-90 pointer-events-none z-30" />
          <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_50px_rgba(0,0,0,0.9)] pointer-events-none z-20" />

          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }} 
              className="flex items-center gap-3 sm:gap-4 h-full px-4 sm:px-5 relative z-10 bg-gradient-to-b from-[#1a1108]/90 to-black/95"
            >
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full shrink-0 animate-pulse ${isWarMode ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]" : "bg-[#fbbf24] shadow-[0_0_15px_rgba(251,191,36,1)]"}`} />
              
              <div className="flex flex-col text-left overflow-hidden flex-1 justify-center">
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest sm:tracking-[0.25em] text-[#a67c47] font-black drop-shadow-sm truncate">
                  {isWarMode ? currentItem.era : `Chapter ${currentChapterIndex + 1}`}
                </span>
                <span className="text-xs sm:text-base font-serif font-bold text-[#ffedb3] group-hover/card:text-amber-400 transition-colors truncate drop-shadow-md">
                  {currentItem.title}
                </span>
              </div>
              
              <span className="text-[8px] sm:text-[9px] text-amber-500 font-bold tracking-widest uppercase opacity-70 group-hover/card:opacity-100 transition-opacity">
                <span className="hidden sm:inline">Slide </span>&uarr;
              </span>
            </motion.div>
          )}

          {isExpanded && (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentChapterIndex}
                initial={{ opacity: 0, x: slideDir * 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: slideDir * -40, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 450, damping: 30 }} 
                className="flex flex-col h-full w-full relative z-10"
              >
                
                <div className="relative w-full h-[180px] sm:h-[220px] shrink-0 overflow-hidden">
                  {hasImage(currentItem.cardImg || currentItem.image) && (
                    <Image
                      src={currentItem.cardImg || currentItem.image}
                      alt={currentItem.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 300px, 380px"
                      className="object-cover object-top transition-transform duration-1000 group-hover/card:scale-105 pointer-events-none"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050301] via-[#050301]/40 to-transparent pointer-events-none" />
                  
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#fbbf24] px-2.5 py-1 rounded-full bg-black/60 border border-[#8b5a2b]/50 backdrop-blur-md shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                      {isWarMode ? currentItem.era : `Ch. ${currentChapterIndex + 1} / ${chapters.length}`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-1 px-4 sm:px-6 pt-1 sm:pt-2 pb-4 sm:pb-5 z-10 justify-between text-center">
                  <div>
                    <h4 className="text-xl sm:text-2xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fff6d6] via-[#fbbf24] to-[#a67c47] mb-1.5 drop-shadow-[0_2px_15px_rgba(251,191,36,0.2)]">
                      {currentItem.title}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-[#a39485] font-light leading-relaxed line-clamp-3 sm:line-clamp-4">
                      {currentItem.summary}
                    </p>
                  </div>

                  <div className="mt-3 flex justify-center">
                    <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-b from-[#8b5a2b]/20 to-black border border-[#8b5a2b]/60 text-[9px] sm:text-[10px] uppercase tracking-widest sm:tracking-[0.2em] text-[#fbbf24] font-black shadow-[0_0_20px_rgba(245,158,11,0.1)] group-hover/card:shadow-[0_0_30px_rgba(245,158,11,0.25)] group-hover/card:border-[#fbbf24]/50 transition-all duration-300">
                      Unveil Scripture &rarr;
                    </div>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

        {currentChapterIndex < chapters.length - 1 && (
          <motion.button
            animate={{ opacity: isExpanded ? 0 : 1, scale: isExpanded ? 0.8 : 1 }}
            pointerEvents={isExpanded ? "none" : "auto"}
            {...makeSwitchHandler(currentChapterIndex + 1, 1)}
            className="absolute -right-12 sm:-right-16 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#050301]/80 border border-[#8b5a2b]/50 text-amber-500 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.9)] backdrop-blur-md hover:bg-[#1c1106]/90 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:scale-110 transition-all cursor-pointer text-base sm:text-lg font-bold z-30"
            title="Next"
          >
            &rarr;
          </motion.button>
        )}
      </motion.div>

      {!isWarMode && currentChapterIndex === chapters.length - 1 && (
        <button
          onClick={onEnterWar}
          className="absolute -right-24 sm:-right-36 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full bg-gradient-to-br from-[#4a0909]/90 to-black hover:from-[#5e0a0a] border border-red-500/60 text-[#ffedb3] text-[10px] sm:text-xs font-black uppercase tracking-widest sm:tracking-[0.2em] shadow-[0_0_30px_rgba(185,28,28,0.5)] backdrop-blur-xl transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>War</span> &rarr;
        </button>
      )}
    </div>
  );
}