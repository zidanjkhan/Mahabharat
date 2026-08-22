// src/components/WarAtmosphereOverlay.js
"use client";

import { motion } from "framer-motion";

export default function WarAtmosphereOverlay({ isWarMode }) {
  if (!isWarMode) return null;

  // Rich set of chunky ash flakes drifting everywhere
  const particles = Array.from({ length: 65 });

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      
      {/* 1. BRUTAL COLOR-REMAP & WAR ROOM GRADE */}
      <div className="absolute inset-0 bg-red-950/20 mix-blend-color-burn pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50 pointer-events-none" />

      {/* 2. SCORCHED TORCHLIGHT BORDERS & FIRE BURN FROM ALL SIDES */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-700/50 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-red-950/80 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-red-900/60 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-amber-900/60 via-transparent to-transparent pointer-events-none" />

      {/* 3. BREATHING RED COMMAND PULSE (Simulating heavy war tension) */}
      <motion.div 
        animate={{ 
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.015, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 border-[20px] border-red-950/40 shadow-[inset_0_0_120px_rgba(185,28,28,0.7)] pointer-events-none"
      />

      {/* 4. ROLLING SMOKE & HAZE FOG (Sliding clouds of war smoke) */}
      <motion.div
        initial={{ x: "-15%" }}
        animate={{ x: "15%" }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute inset-[-30%] bg-[radial-gradient(circle_at_center,_rgba(150,40,10,0.2)_0%,_transparent_65%)] pointer-events-none blur-[80px]"
      />

      {/* 5. JAGGED CHUNKY ASH & EMBERS ORIGINATING FROM EVERYWHERE */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((_, i) => {
          const randomLeft = `${Math.random() * 100}%`;
          const randomTop = `${Math.random() * 100}%`;
          const duration = Math.random() * 6 + 3; 
          const delay = Math.random() * 5;
          
          // Jagged, non-circular chunky dimensions
          const width = Math.random() * 10 + 6;  
          const height = Math.random() * 16 + 8; 
          const isGlowingEmber = i % 3 === 0;

          return (
            <motion.div
              key={i}
              initial={{ 
                top: randomTop, 
                left: randomLeft, 
                opacity: 0,
                scale: 0.5 
              }}
              animate={{
                top: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                opacity: [0, 0.9, 0],
                scale: [0.7, 1.2, 0.4],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                width: `${width}px`,
                height: `${height}px`,
              }}
              className={
                isGlowingEmber
                  ? "rounded-none bg-gradient-to-tr from-orange-500 to-amber-300 shadow-[0_0_14px_4px_rgba(245,158,11,0.9)]"
                  : "rounded-sm bg-gradient-to-t from-stone-950 via-orange-950 to-red-600 shadow-[0_0_10px_rgba(234,88,12,0.8)] border border-orange-600/40"
              }
            />
          );
        })}
      </div>
    </div>
  );
}