// src/components/MapAnimationOverlay.js
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function MapAnimationOverlay({ 
  currentData, 
  previousPin = null, 
  isWarMode = false,
  warDayIndex = 0 
}) {
  const [showTrail, setShowTrail] = useState(true);

  const currentPin = currentData?.pins?.[0] || { top: 35, left: 45, name: currentData?.title };

  // Check if the pin is identical to prevent useless zero-distance animations
  const isSameLocation = previousPin && previousPin.top === currentPin.top && previousPin.left === currentPin.left;

  const routeKey = previousPin && !isSameLocation
    ? `${previousPin.top}-${previousPin.left}-${currentPin.top}-${currentPin.left}` 
    : Math.random();

  useEffect(() => {
    if (previousPin && !isSameLocation) {
      setShowTrail(true);
      const timer = setTimeout(() => {
        setShowTrail(false);
      }, 4200);

      return () => clearTimeout(timer);
    }
  }, [routeKey]);

  if (isWarMode) {
    return (
      <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M 48% 35% Q 46% 38%, 45% 42%"
            fill="none"
            stroke="#ef4444"
            strokeWidth="0.4"
            strokeDasharray="0.8 0.8"
            animate={{ strokeDashoffset: [1.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>
    );
  }

  // Calculate smart path: Use a subtle curve or straight line based on distance to avoid awkward loops for nearby points
  const getPathString = (p1, p2) => {
    if (!p1 || !p2) return "";
    const dx = p2.left - p1.left;
    const dy = p2.top - p1.top;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If locations are very close, use a much lighter natural curve instead of a wide arc
    if (distance < 15) {
      const midX = (p1.left + p2.left) / 2 - dy * 0.15;
      const midY = (p1.top + p2.top) / 2 + dx * 0.15;
      return `M ${p1.left} ${p1.top} Q ${midX} ${midY}, ${p2.left} ${p2.top}`;
    }

    // Default balanced arc for distant locations
    return `M ${p1.left} ${p1.top} Q 50 46, ${p2.left} ${p2.top}`;
  };

  const dynamicPath = previousPin ? getPathString(previousPin, currentPin) : "";

  return (
    <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden">
      
      {/* 1. SYNCHRONIZED FOOTPATH TRAIL & TRAVELING CIRCLE (Disabled for same locations) */}
      {showTrail && previousPin && !isSameLocation && typeof previousPin.top === "number" && typeof previousPin.left === "number" && (
        <svg key={routeKey} className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="calligraphyInk" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fef3c7" stopOpacity="1" />
            </linearGradient>

            <path
              id={`scrollArc-${routeKey}`}
              d={dynamicPath}
              fill="none"
            />
          </defs>

          {/* Static Footpath / Dashed Track */}
          <path
            d={dynamicPath}
            fill="none"
            stroke="#d97706"
            strokeWidth="0.3"
            strokeLinecap="round"
            strokeDasharray="0.1 0.5"
            opacity="0.5"
          />

          {/* The Animated Calligraphy Reveal */}
          <motion.path
            d={dynamicPath}
            fill="none"
            stroke="url(#calligraphyInk)"
            strokeWidth="0.25" 
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: [1, 1, 0] }}
            transition={{ duration: 4, ease: [0.25, 0.1, 0.25, 1] }}
          />

          {/* The Traveling Glowing Lead Spark */}
          <circle r="0.6" fill="#fef3c7" filter="drop-shadow(0px 0px 1px #d97706)">
            <animateMotion 
              dur="4s" 
              repeatCount="1" 
              fill="freeze"
              keyTimes="0;1"
              calcMode="spline"
              keySplines="0.25 0.1 0.25 1"
            >
              <mpath href={`#scrollArc-${routeKey}`} />
            </animateMotion>
          </circle>
        </svg>
      )}

      {/* 2. SUBTLE HISTORICAL RUIN / OLD CHECKPOINT */}
      {previousPin && !isSameLocation && typeof previousPin.top === "number" && typeof previousPin.left === "number" && (
        <div 
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 opacity-50"
          style={{ top: `${previousPin.top}%`, left: `${previousPin.left}%` }}
        >
          <div className="w-3 h-3 rotate-45 border border-amber-900 bg-amber-950/80" />
        </div>
      )}

      {/* 3. 3D EMBOSSED SWALLOWTAIL BANNER */}
      <motion.div
        key={`banner-${currentPin.top}-${currentPin.left}`}
        initial={{ scale: 0.3, y: -20, opacity: 0, filter: "brightness(2)" }}
        animate={{ scale: 1, y: 8, opacity: 1, filter: "brightness(1)" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 280, damping: 22 }}
        style={{ top: `${currentPin.top}%`, left: `${currentPin.left}%` }}
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group z-30 flex flex-col items-center mt-10"
      >
        {/* Soft Breathing Golden Aura Ring */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-3 rounded-full bg-gradient-to-r from-teal-500/20 via-cyan-400/30 to-amber-500/20 blur-md pointer-events-none"
        />

        {/* 3D Swallowtail Banner Container */}
        <div className="relative w-12 h-16 drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
          <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 48 64">
            <defs>
              <linearGradient id="metal3DGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="30%" stopColor="#0f172a" />
                <stop offset="70%" stopColor="#090d16" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              <linearGradient id="deepFeather" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#022c22" />
                <stop offset="40%" stopColor="#047857" />
                <stop offset="80%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#2dd4bf" />
              </linearGradient>

              <radialGradient id="exactEye" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="40%" stopColor="#2563eb" />
                <stop offset="80%" stopColor="#1e3a8a" />
                <stop offset="100%" stopColor="#0f172a" />
              </radialGradient>

              <filter id="shadow3D" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.7" />
              </filter>
            </defs>

            {/* Outer Swallowtail Polygon Border */}
            <polygon 
              points="1,1 47,1 47,48 24,62 1,48" 
              fill="url(#metal3DGrad)" 
              stroke="#fbbf24" 
              strokeWidth="2"
              strokeLinejoin="round"
              filter="url(#shadow3D)"
            />

            {/* Inner Double-Stripe Golden Border */}
            <polygon 
              points="3,3 45,3 45,46 24,59 3,46" 
              fill="none" 
              stroke="#f59e0b" 
              strokeWidth="1" 
              strokeOpacity="0.8"
            />
          </svg>

          {/* Dynamic Light Sheen Sweep Effect */}
          <div 
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ clipPath: "polygon(2% 2%, 98% 2%, 98% 78%, 50% 95%, 2% 78%)" }}
          >
            <motion.div
              initial={{ x: "-150%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            />
          </div>

          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center -translate-y-2">
            <svg 
              className="w-10 h-10 drop-shadow-[0_0_8px_rgba(45,212,191,0.9)] overflow-visible" 
              viewBox="0 0 64 64"
            >
              <g fill="url(#deepFeather)" stroke="#115e59" strokeWidth="0.5">
                <path d="M 32 32 Q 18 25 10 32 Q 4 38 8 30 Q 14 20 28 22 Z" />
                <path d="M 32 32 Q 14 18 10 22 Q 6 26 12 18 Q 20 12 30 18 Z" />
                <path d="M 32 32 Q 16 8 22 8 Q 28 8 26 16 Q 25 22 30 26 Z" />
                <path d="M 32 32 Q 46 25 54 32 Q 60 38 56 30 Q 50 20 36 22 Z" />
                <path d="M 32 32 Q 50 18 54 22 Q 58 26 52 18 Q 44 12 34 18 Z" />
                <path d="M 32 32 Q 48 8 42 8 Q 36 8 38 16 Q 39 22 34 26 Z" />
                <path d="M 32 32 Q 32 6 32 2 Q 35 2 34 8 Q 33 16 32 22 Z" />
                <path d="M 32 32 Q 38 8 42 4 Q 45 3 40 9 Q 36 16 32 22 Z" />
                <path d="M 32 32 Q 26 8 22 4 Q 19 3 24 9 Q 28 16 32 22 Z" />
              </g>

              <g transform="translate(32, 9)">
                <ellipse cx="0" cy="0" rx="4.5" ry="6" fill="url(#exactEye)" stroke="#fbbf24" strokeWidth="1" />
                <ellipse cx="0" cy="0" rx="1.8" ry="2.5" fill="#fbbf24" />
                <path d="M 0 6 L 0 35" stroke="#fbbf24" strokeWidth="1.2" />
              </g>

              <circle cx="32" cy="36" r="16" fill="#090d16" stroke="#fbbf24" strokeWidth="2.2" />
              <circle cx="32" cy="36" r="14.5" fill="none" stroke="#38bdf8" strokeWidth="0.8" />

              <circle cx="32" cy="20" r="1.2" fill="#38bdf8" stroke="#fbbf24" strokeWidth="0.4" />
              <circle cx="48" cy="36" r="1.2" fill="#38bdf8" stroke="#fbbf24" strokeWidth="0.4" />
              <circle cx="16" cy="36" r="1.2" fill="#38bdf8" stroke="#fbbf24" strokeWidth="0.4" />
              <circle cx="43.3" cy="24.7" r="1.2" fill="#38bdf8" stroke="#fbbf24" strokeWidth="0.4" />
              <circle cx="20.7" cy="47.3" r="1.2" fill="#38bdf8" stroke="#fbbf24" strokeWidth="0.4" />
              <circle cx="43.3" cy="47.3" r="1.2" fill="#38bdf8" stroke="#fbbf24" strokeWidth="0.4" />
              <circle cx="20.7" cy="24.7" r="1.2" fill="#38bdf8" stroke="#fbbf24" strokeWidth="0.4" />

              <path d="M 32 20 L 32 52" stroke="#fbbf24" strokeWidth="1.8" />
              <path d="M 16 36 L 48 36" stroke="#fbbf24" strokeWidth="1.8" />
              <path d="M 20.7 24.7 L 43.3 47.3" stroke="#fbbf24" strokeWidth="1.8" />
              <path d="M 20.7 47.3 L 43.3 24.7" stroke="#fbbf24" strokeWidth="1.8" />

              <circle cx="32" cy="36" r="5" fill="#090d16" stroke="#fbbf24" strokeWidth="1.5" />
              <circle cx="32" cy="36" r="2.5" fill="url(#exactEye)" stroke="#38bdf8" strokeWidth="0.8" />
            </svg>
          </div>
        </div>

        {/* Royal Parchment Title Scroll */}
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6 px-3.5 py-1 rounded-md bg-[#070b14]/95 border border-amber-400/70 text-amber-100 text-[25px] font-serif tracking-[0.25em] uppercase whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-md"
        >
          {currentPin.name || "Indraprastha"}
        </motion.div>
      </motion.div>
    </div>
  );
}