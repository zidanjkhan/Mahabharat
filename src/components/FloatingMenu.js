// src/components/FloatingMenu.js
"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { weaponsData } from "../data/weaponsData";

export default function FloatingMenu({ 
  setShowFamilyTree, 
  setShowDrawer,
  // 👇 NEW: Accepting these from page.js instead of using local state
  isArmoryOpen,
  setIsArmoryOpen,
  selectedWeapon,
  setSelectedWeapon
}) {
  const [activeButton, setActiveButton] = useState(null);
  
  // REMOVED: isArmoryOpen and selectedWeapon are no longer local states here.

  // --- PHYSICS ENGINE FOR THE WHEEL SPIN ---
  const rotation = useMotionValue(0);
  const inverseRotation = useTransform(rotation, (v) => -v);

  const handlePan = (e, info) => {
    rotation.set(rotation.get() + info.delta.y * 0.4);
  };

  const handlePanEnd = (e, info) => {
    animate(rotation, rotation.get() + info.velocity.y * 0.2, {
      type: "inertia",
      velocity: info.velocity.y * 0.2,
      power: 0.5,
      timeConstant: 400,
    });
  };

  const handleButtonPress = (buttonName, action) => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) {
      if (activeButton !== buttonName) setActiveButton(buttonName);
      else {
        action();
        setActiveButton(null);
      }
    } else {
      action();
    }
  };

  const closeArmory = () => {
    setIsArmoryOpen(false);
    setSelectedWeapon(null);
    setActiveButton(null); // FIX: Fully resets the menu state when closing the wheel
    setTimeout(() => rotation.set(0), 500);
  };

  return (
    <>
      {/* 1. MAIN FLOATING MENU BUTTONS (UNIFIED HALF-CIRCLE STACK) */}
      <div 
        className={`absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-start gap-4 z-50 ${isArmoryOpen ? "pointer-events-none" : "pointer-events-auto"}`}
        onClick={() => {
          const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
          if (isTouchDevice) setActiveButton(null);
        }}
      >
        {/* 1.1 Chapters Button (Top - Reduced) */}
        <button
          onClick={(e) => { e.stopPropagation(); handleButtonPress("chapters", () => setShowDrawer(true)); }}
          className={`relative group bg-gradient-to-r from-slate-900/40 via-slate-900/70 to-slate-900 backdrop-blur-none shadow-[inset_0_2px_5px_rgba(255,255,255,0.1),_0_10px_30px_rgba(0,0,0,1)] transition-all duration-700 ease-in-out overflow-hidden cursor-pointer pointer-events-auto ${
            activeButton === "chapters" ? "w-48 h-14 rounded-r-full shadow-[0_0_30px_rgba(245,158,11,0.5)]" : "w-14 h-17 rounded-r-full hover:w-35 hover:h-17 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]"
          } ${isArmoryOpen ? "opacity-0 pointer-events-none absolute" : ""}`}
        >
          {/* Static Thin Border */}
          <div className={`absolute inset-0 rounded-r-full pointer-events-none border-y border-r border-l-0 transition-colors duration-700 ${activeButton === "chapters" ? "border-amber-500" : "border-amber-700/30 group-hover:border-amber-500"}`} />

          {/* Sharp Animated Trail (Starts at 0deg, 4s spin) */}
          <div 
            className="absolute inset-0 rounded-r-full pointer-events-none z-0"
            style={{
              padding: "2px 3px 1px 0px",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude"
            }}
          >
            <div className="absolute top-1/2 left-1/2 w-[300%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_75%,#fbbf24_100%)]" />
          </div>

          <div className={`absolute inset-0 mr-3 flex items-center justify-center transition-opacity duration-300 ease-out ${activeButton === "chapters" ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}>
            <span className="text-lg text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">📜</span>
          </div>
          <div className={`absolute top-0 left-0 w-30 h-17 flex items-center transition-opacity duration-500 delay-200 ease-in ${activeButton === "chapters" ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <div className="w-12 flex items-center justify-center flex-shrink-0">
               <span className="text-lg text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">📜</span>
            </div>
            <div className="flex flex-col justify-center whitespace-nowrap text-left pr-4 z-10">
              <span className="text-xs font-serif font-bold text-amber-300 tracking-wider uppercase">Chapters</span>
              <span className="text-[9px] font-sans text-slate-400 tracking-widest uppercase">Chronicles</span>
            </div>
          </div>
        </button>

        {/* 1.2 Dynasty Lineage Button (Middle - Increased 15%) */}
        <button
          onClick={(e) => { e.stopPropagation(); handleButtonPress("familyTree", () => setShowFamilyTree(true)); }}
          className={`relative group bg-gradient-to-r from-[#1c110685] via-slate-800/70 to-slate-900 shadow-[inset_0_2px_5px_rgba(255,255,255,0.2),_0_0_15px_rgba(245,158,11,0.2)] transition-all duration-700 ease-in-out overflow-hidden cursor-pointer pointer-events-auto ${
            activeButton === "familyTree" ? "w-72 h-24 rounded-r-full shadow-[0_0_40px_rgba(245,158,11,0.7)]" : "w-20 h-32 rounded-r-full hover:w-68 hover:h-24 hover:shadow-[0_0_35px_rgba(245,158,11,0.5)]"
          } ${isArmoryOpen ? "opacity-0 pointer-events-none absolute" : ""}`}
        >
          {/* Static Thin Border */}
          <div className={`absolute inset-0 rounded-r-full pointer-events-none border-y border-r border-l-0 transition-colors duration-700 ${activeButton === "familyTree" ? "border-amber-300" : "border-amber-700/30 group-hover:border-amber-400"}`} />

          {/* Sharp Animated Trail (Golden, Starts at 120deg, 5s spin) */}
          <div 
            className="absolute inset-0 rounded-r-full pointer-events-none z-0"
            style={{
              padding: "2px 3px 1px 0px",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude"
            }}
          >
            <div className="absolute top-1/2 left-1/2 w-[300%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_120deg,transparent_75%,#fcd34d_100%)]" />
          </div>

          <div className={`absolute inset-0 mr-4 flex items-center justify-center transition-opacity duration-300 ease-out ${activeButton === "familyTree" ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}>
            <svg className="w-8 h-8 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,1)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="3"></circle>
              <circle cx="6" cy="16" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
              <path d="M10.5 7.5L8 13.5"></path>
              <path d="M13.5 7.5L16 13.5"></path>
            </svg>
          </div>
          <div className={`absolute top-0 left-0 w-72 h-24 flex items-center transition-opacity duration-500 delay-200 ease-in ${activeButton === "familyTree" ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <div className="w-20 flex items-center justify-center flex-shrink-0">
               <svg className="w-8 h-8 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,1)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                 <circle cx="12" cy="5" r="3"></circle>
                 <circle cx="6" cy="16" r="3"></circle>
                 <circle cx="18" cy="16" r="3"></circle>
                 <path d="M10.5 7.5L8 13.5"></path>
                 <path d="M13.5 7.5L16 13.5"></path>
               </svg>
            </div>
            <div className="flex flex-col justify-center whitespace-nowrap text-left pr-4 z-10">
              <span className="text-[14px] font-serif font-bold text-amber-300 tracking-widest uppercase drop-shadow-sm">Dynasty Lineage</span>
              <span className="text-[11px] font-sans text-amber-500/80 tracking-widest uppercase">Royal Bloodlines</span>
            </div>
          </div>
        </button>

        {/* 1.3 Ancient Arsenal Button (Bottom - Reduced) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleButtonPress("arsenal", () => {
              if (isArmoryOpen) closeArmory();
              else setIsArmoryOpen(true);
            });
          }}
          className={`relative group bg-gradient-to-r from-slate-900/40 via-slate-900/70 to-slate-900 shadow-[inset_0_2px_5px_rgba(255,255,255,0.1),_0_10px_30px_rgba(0,0,0,1)] transition-all duration-700 ease-in-out overflow-hidden cursor-pointer pointer-events-auto ${
            activeButton === "arsenal" ? "w-48 h-14 rounded-r-full shadow-[0_0_30px_rgba(245,158,11,0.5)]" : "w-14 h-17 rounded-r-full hover:w-50 hover:h-17 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]"
          } ${isArmoryOpen ? "opacity-0 scale-50 pointer-events-none absolute" : ""}`}
        >
          {/* Static Thin Border */}
          <div className={`absolute inset-0 rounded-r-full pointer-events-none border-y border-r border-l-0 transition-colors duration-700 ${activeButton === "arsenal" ? "border-amber-700" : "border-amber-700/30 group-hover:border-amber-500"}`} />

          {/* Sharp Animated Trail (Starts at 240deg, 4.5s spin) */}
          <div 
            className="absolute inset-0 rounded-r-full pointer-events-none z-0"
            style={{
              padding: "2px 3px 1px 0px",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude"
            }}
          >
            <div className="absolute top-1/2 left-1/2 w-[300%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_4.5s_linear_infinite] bg-[conic-gradient(from_240deg,transparent_75%,#fbbf24_100%)]" />
          </div>

          <div className={`absolute inset-0 flex mr-3 items-center justify-center transition-opacity duration-300 ease-out ${activeButton === "arsenal" ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}>
            <span className="text-lg text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">⚔️</span>
          </div>
          <div className={`absolute top-0 left-0 w-48 h-14 flex items-center transition-opacity duration-500 delay-200 ease-in ${activeButton === "arsenal" ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <div className="w-12 flex items-center justify-center flex-shrink-0">
               <span className="text-lg text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">⚔️</span>
            </div>
            <div className="flex flex-col justify-center whitespace-nowrap text-left pr-4 z-10">
              <span className="text-xs font-serif font-bold text-amber-300 tracking-wider uppercase">Ancient Arsenal</span>
              <span className="text-[9px] font-sans text-slate-400 tracking-widest uppercase">Legendary Astras</span>
            </div>
          </div>
        </button>
      </div>

      {/* 2. THE REALISTIC WEAPON DIAL (CINEMATIC ARTIFACT) */}

      <AnimatePresence>
        {isArmoryOpen && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-40 pointer-events-none">
            <div className="relative w-[760px] h-[760px] -ml-[380px]">
              {/* STATIC AMBIENT GLOW BEHIND THE WHEEL */}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 rounded-full shadow-[0_0_200px_rgba(245,158,11,0.1)] bg-transparent"
              />

              {/* THE ROTATING WHEEL */}

              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ rotate: rotation }}
                onPan={handlePan}
                onPanEnd={handlePanEnd}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0}
                whileTap={{ cursor: "grabbing" }}
              >
                {/* 2.1 Cinematic Transparent Background with Polished Bronze Rim */}

                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.5 },
                  }}
                  transition={{ duration: 0.5 }}
                  // Deepened the blur and shadow for a heavier glass look
                  className="absolute inset-0 rounded-full pointer-events-auto bg-black/60 shadow-[inset_0_0_950px_90px_rgba(0,0,0,0.9),_0_30px_60px_rgba(0,0,0,0)]"
                  style={{
                    cursor: "grab",
                    border: "3px solid rgba(139, 90, 43, 0.7)", // Thinner, sharper metallic border
                  }}
                >
                  <div className="absolute inset-2 rounded-full border border-[#8b5a2b]/20 pointer-events-none" />
                </motion.div>

                {/* 2.2 The Weapons Launch & 3D Sockets */}
                {weaponsData.map((weapon, index) => {
                  const total = weaponsData.length;
                  const angle = (360 / total) * index - 90;
                  const radius = 300;
                  const targetX = Math.cos(angle * (Math.PI / 180)) * radius;
                  const targetY = Math.sin(angle * (Math.PI / 180)) * radius;

                  const animationDelay = 0.4 + index * 0.12;

                  return (
                    <div
                      key={weapon.id}
                      className="absolute left-1/2 top-1/2 w-20 h-20 -ml-10 -mt-10 pointer-events-none"
                    >
                      {/* CINEMATIC HOLLOW CHAMBER */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-transparent shadow-[inset_0_15px_25px_rgba(0,0,0,0.95),_inset_0_4px_8px_rgba(0,0,0,0.9),_0_1px_1px_rgba(255,255,255,0.2)] border border-black"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        style={{ x: targetX, y: targetY }}
                      />

                      {/* COMET TRAIL */}
                      <motion.div
                        className="absolute top-1/2 left-1/2 h-[5px] origin-left bg-gradient-to-r from-transparent via-amber-400 to-white shadow-[0_0_20px_6px_rgba(251,191,36,0.9)]"
                        style={{
                          borderTopRightRadius: "100%",
                          borderBottomRightRadius: "100%",
                        }}
                        initial={{
                          rotate: angle,
                          width: 0,
                          opacity: 0,
                          x: 0,
                          y: 0,
                        }}
                        animate={{ width: radius, opacity: [0, 1, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{
                          delay: animationDelay,
                          duration: 0.5,
                          ease: "easeOut",
                        }}
                      />

                      {/* CINEMATIC BRASS WEAPON COIN */}
                      <motion.div
                        className="absolute inset-0"
                        initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                        animate={{
                          x: targetX,
                          y: targetY,
                          scale: 1,
                          opacity: 1,
                        }}
                        exit={{
                          x: 0,
                          y: 0,
                          scale: 0,
                          opacity: 0,
                          transition: { duration: 0.3 },
                        }}
                        transition={{
                          delay: animationDelay,
                          duration: 0.5,
                          ease: "easeOut",
                        }}
                      >
                        <motion.div
                          style={{ rotate: inverseRotation }}
                          className="w-full h-full flex justify-center items-center relative group"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedWeapon(weapon);
                            }}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 pointer-events-auto 
                              bg-gradient-to-b from-[#6b4a23] via-[#22160a] to-[#050301] border border-[#a67c47]
                              shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),_inset_0_-4px_8px_rgba(0,0,0,0.8),_0_10px_20px_rgba(0,0,0,0.9)]
                              group-hover:border-[#d4af37] group-hover:from-[#8a602d] group-hover:via-[#36230f]
                              ${
                                selectedWeapon?.id === weapon.id
                                  ? "scale-110 !border-[#ffd700] !from-[#9c6a28] shadow-[inset_0_2px_6px_rgba(255,255,255,0.4),_0_0_30px_rgba(245,158,11,0.6)]"
                                  : ""
                              }`}
                          >
                            <span className="relative text-[26px] z-10 opacity-80 group-hover:opacity-100 group-hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] transition-all duration-300">
                              {weapon.icon}
                            </span>

                            <div className="absolute left-[130%] px-4 py-2 bg-gradient-to-r from-slate-900 to-black border-l-2 border-amber-500 rounded shadow-[0_15px_35px_rgba(0,0,0,0.9)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                              <span className="block font-serif font-bold text-amber-400 text-sm">
                                {weapon.name}
                              </span>
                              <span className="text-[9px] text-slate-400 tracking-widest uppercase">
                                {weapon.type}
                              </span>
                            </div>
                          </button>
                        </motion.div>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>

              {/* 2.3 THE METALLIC CLOSE BUTTON HUB */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.1,
                }}
                className="absolute top-1/2 left-1/2 w-24 h-24 -ml-12 -mt-12 z-60 pointer-events-auto cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  closeArmory();
                }} // FIX: Added stopPropagation
                title="Close Arsenal"
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#4a351f] via-[#1a1108] to-[#0a0703] border-[2px] border-[#8b5a2b] shadow-[0_10px_25px_rgba(0,0,0,0.9),_inset_0_2px_4px_rgba(255,255,255,0.15)] flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-black shadow-[inset_0_5px_15px_rgba(0,0,0,1)] border border-[#3d2914] flex items-center justify-center transition-transform hover:scale-110">
                    <span className="text-sm text-[#a67c47] font-black drop-shadow-sm pb-[1px]">
                      ✕
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. DEDICATED WEAPON DETAILS SLIDER */}
      <AnimatePresence>
        {selectedWeapon && isArmoryOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWeapon(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 pointer-events-auto"
            />

            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-gradient-to-b from-slate-950 via-slate-900 to-black border-l-2 border-amber-900 shadow-[-30px_0_60px_rgba(0,0,0,1)] z-50 pointer-events-auto overflow-y-auto"
            >
              <div className="p-10 flex flex-col h-full relative">
                <button
                  onClick={() => setSelectedWeapon(null)}
                  className="absolute top-8 left-8 text-amber-600 hover:text-amber-400 text-xs font-bold tracking-[0.2em] uppercase transition-colors"
                >
                  &larr; Return to Armory
                </button>

                <div className="mt-16 flex flex-col items-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-slate-800 to-black border border-slate-700 rounded-full flex justify-center items-center text-6xl mb-8 shadow-[inset_0_5px_15px_rgba(0,0,0,1),_0_20px_40px_rgba(0,0,0,0.8)] relative">
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(245,158,11,0.2)] pointer-events-none" />
                    <span className="drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">
                      {selectedWeapon.icon}
                    </span>
                  </div>

                  <h2 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 text-center mb-3 drop-shadow-lg">
                    {selectedWeapon.name}
                  </h2>

                  <div className="flex gap-3 mb-10 w-full justify-center">
                    <span className="px-4 py-1.5 bg-slate-900 border border-amber-700/50 text-amber-400 text-[10px] uppercase tracking-widest rounded shadow-inner">
                      {selectedWeapon.type}
                    </span>
                    <span className="px-4 py-1.5 bg-slate-900 border border-slate-700 text-slate-300 text-[10px] uppercase tracking-widest rounded shadow-inner">
                      Wielder:{" "}
                      <span className="font-bold text-white">
                        {selectedWeapon.wielder}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="relative bg-slate-950/80 border border-slate-800 rounded-xl p-8 text-sm text-slate-300 leading-relaxed shadow-[inset_0_10px_30px_rgba(0,0,0,1)]">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-amber-600/50 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-amber-600/50 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-amber-600/50 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-amber-600/50 rounded-br-lg" />

                  <p className="relative z-10 font-light text-justify tracking-wide text-[13px] leading-7">
                    {selectedWeapon.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}