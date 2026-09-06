// src/components/IntroAnimation.js
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { mahabharataQuotes } from "../data/mahabharataQuotes"; 
import { timelineData } from "../data/scriptures";
import { kurukshetraWarData } from "../data/kurukshetraData";
import { weaponsData } from "../data/weaponsData";

export default function IntroAnimation({ onStart, onComplete }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [phase, setPhase] = useState(0);
  
  // Slider State
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // --- AAA TRUE PRELOAD ENGINE (Aggressive RAM Preloader) ---
  // Automatically runs in the background when the cinematic starts
  const executeTruePreload = () => {
    const allAssets = [
      ...timelineData.map((d) => d.cardImg),
      ...timelineData.map((d) => d.sidebarImage),
      ...kurukshetraWarData.map((d) => d.cardImg),
      ...kurukshetraWarData.map((d) => d.sidebarImage),
      ...weaponsData.map((w) => w.image),
      "/MainMap1.png",
      "/map-background.png",
      "/Page.png"
    ].filter(Boolean);

    const uniqueAssets = [...new Set(allAssets)];

    // Fire all requests in parallel directly into browser RAM
    uniqueAssets.forEach((url) => {
      const img = new window.Image();
      // Explicitly tell the browser's network layer to prioritize these
      img.fetchPriority = "high"; 
      img.src = url;
    });
  };

  // 1. RANDOMIZE INITIAL QUOTE ON MOUNT
  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * mahabharataQuotes.length));
  }, []);

  // 2. AUTO-PLAY SLIDESHOW TIMER
  useEffect(() => {
    if (hasStarted) return; 

    const slideTimer = setInterval(() => {
      setDirection(1);
      setQuoteIndex((prev) => (prev + 1) % mahabharataQuotes.length);
    }, 6500); 

    return () => clearInterval(slideTimer);
  }, [hasStarted, quoteIndex]); 

  // 3. MAIN CINEMATIC TIMERS & AUTO-PRELOAD
  useEffect(() => {
    if (!hasStarted) return;

    // Trigger the silent download immediately when the cinematic starts
    executeTruePreload();

    const pulseTimer = setTimeout(() => setPhase(1), 1000);
    const igniteTimer = setTimeout(() => setPhase(2), 2200);
    const fadeTimer = setTimeout(() => setPhase(3), 4500);
    const completeTimer = setTimeout(() => onComplete(), 5000);

    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(igniteTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [hasStarted, onComplete]);

  // Slider Handlers
  const handleNext = () => {
    setDirection(1);
    setQuoteIndex((prev) => (prev + 1) % mahabharataQuotes.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setQuoteIndex((prev) => (prev - 1 + mahabharataQuotes.length) % mahabharataQuotes.length);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  const explosiveEase = [0.25, 1, 0.5, 1];

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden ${!hasStarted ? "pointer-events-auto" : "pointer-events-none"}`}>
      
      {/* CUSTOM ANIMATIONS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes breathing-glow {
          0%, 100% { 
            box-shadow: 0 0 20px 2px rgba(245, 158, 11, 0.3), inset 0 0 15px rgba(245, 158, 11, 0.2); 
            border-color: rgba(245, 158, 11, 0.5); 
          }
          50% { 
            box-shadow: 0 0 50px 8px rgba(245, 158, 11, 0.8), inset 0 0 30px rgba(245, 158, 11, 0.5); 
            border-color: rgba(253, 230, 138, 0.9); 
          }
        }
        .btn-epic-glow {
          animation: breathing-glow 2.5s infinite ease-in-out;
        }
      `}} />

      {/* --- THE INTERACTIVE ENTRY SCREEN --- */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <motion.div 
              className="max-w-4xl w-full text-center px-4 sm:px-10 flex flex-col items-center gap-12 sm:gap-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              
              {/* --- QUOTE SLIDER --- */}
              <div className="flex items-center justify-between w-full gap-4 sm:gap-8">
                
                {/* Left Arrow */}
                <button onClick={handlePrev} className="p-2 text-amber-600/50 hover:text-amber-400 transition-colors cursor-pointer hover:scale-110">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Quote Text Area */}
                <div className="relative w-full h-49 sm:h-49 flex items-center justify-center overflow-hidden">
                  <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                      key={quoteIndex}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="absolute flex flex-col gap-6 w-full text-center"
                    >
                      <p className="text-lg sm:text-2xl font-serif text-amber-200/90 leading-relaxed italic drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] px-4">
                        "{mahabharataQuotes[quoteIndex]?.translation}"
                      </p>
                      <div className="flex items-center justify-center gap-4 opacity-70">
                        <div className="w-12 sm:w-16 h-[1px] bg-gradient-to-l from-amber-500 to-transparent" />
                        <p className="text-[10px] sm:text-xs font-sans tracking-[0.3em] text-amber-500 uppercase font-bold whitespace-nowrap">
                          {mahabharataQuotes[quoteIndex]?.source}
                        </p>
                        <div className="w-12 sm:w-16 h-[1px] bg-gradient-to-r from-amber-500 to-transparent" />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Right Arrow */}
                <button onClick={handleNext} className="p-2 text-amber-600/50 hover:text-amber-400 transition-colors cursor-pointer hover:scale-110">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

              </div>

              {/* ACTION AREA */}
              <div className="flex flex-col items-center gap-6 mt-4">
                {/* THE IRRESISTIBLE GLOWING BUTTON */}
                <button
                  onClick={() => {
                    setHasStarted(true);
                    if (onStart) onStart();
                  }}
                  className="group relative px-12 py-5 rounded-full border-[2px] bg-gradient-to-b from-[#3a2008] to-[#0a0703] transition-all duration-300 overflow-hidden btn-epic-glow hover:scale-105 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/30 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                  <span className="relative z-10 text-amber-300 font-serif font-black tracking-[0.3em] uppercase text-sm sm:text-base drop-shadow-[0_0_10px_rgba(251,191,36,0.8)] group-hover:text-white transition-colors duration-300">
                    Witness the Epic
                  </span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- LAYER 1: THE FOG OF WAR --- */}
      <motion.svg 
        className="absolute inset-0 w-full h-full z-10"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase >= 3 ? 0 : 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <defs>
          <mask id="fog-mask">
            <rect width="100%" height="100%" fill="white" />
            <motion.circle 
              cx="50%" cy="50%" 
              initial={{ r: 0 }}
              animate={{ r: phase >= 2 ? "150%" : 0 }}
              transition={{ duration: 2.5, ease: explosiveEase }}
              fill="black"
              filter="blur(80px)"
            />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="#050505" mask="url(#fog-mask)" />
      </motion.svg>

      {/* --- LAYER 3: THE IGNITION & SHOCKWAVE --- */}
      
      {/* The Ambient Pulse */}
      <motion.div
        className="absolute w-[40vw] h-[40vw] bg-amber-600/30 rounded-full blur-[100px] z-20"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: phase === 1 ? 0.8 : phase >= 2 ? 4 : 0, 
          opacity: phase === 1 ? 1 : 0 
        }}
        transition={{ duration: phase === 1 ? 1.2 : 1.5, ease: "easeInOut" }}
      />

      {/* The White-Hot Core */}
      <motion.div
        className="absolute w-32 h-32 bg-white rounded-full blur-[20px] z-20"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: phase === 1 ? 0.5 : phase >= 2 ? 8 : 0, 
          opacity: phase === 1 ? 0.8 : 0 
        }}
        transition={{ duration: phase === 1 ? 1.2 : 0.8, ease: "easeOut" }}
      />

      {/* The Sharp Inner Shockwave Ring */}
      <motion.div
        className="absolute w-[10vw] h-[10vw] border-[1px] border-amber-100 rounded-full z-20"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: phase >= 2 ? 30 : 0, 
          opacity: phase === 2 ? [0, 0.15, 0] : 0
        }}
        transition={{ duration: 2.5, ease: explosiveEase }}
      />

    </div>
  );
}