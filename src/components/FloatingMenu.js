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
  isArmoryOpen,
  setIsArmoryOpen,
  selectedWeapon,
  setSelectedWeapon,
}) {
  const [activeButton, setActiveButton] = useState(null);
  const [hoveredWeaponId, setHoveredWeaponId] = useState(null);

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
    setActiveButton(null);
    setTimeout(() => rotation.set(0), 500);
  };

  const mantraTextArray = [
    ...weaponsData,
    ...weaponsData,
    ...weaponsData,
    ...weaponsData,
  ];

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
        {/* 1.1 Chapters Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleButtonPress("chapters", () => setShowDrawer(true));
          }}
          className={`relative group bg-gradient-to-r from-slate-900/40 via-slate-900/70 to-slate-900 backdrop-blur-none shadow-[inset_0_2px_5px_rgba(255,255,255,0.1),_0_10px_30px_rgba(0,0,0,1)] transition-all duration-700 ease-in-out overflow-hidden cursor-pointer pointer-events-auto ${
            activeButton === "chapters"
              ? "w-48 h-14 rounded-r-full shadow-[0_0_30px_rgba(245,158,11,0.5)]"
              : "w-14 h-17 rounded-r-full hover:w-35 hover:h-17 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]"
          } ${isArmoryOpen ? "opacity-0 pointer-events-none absolute" : ""}`}
        >
          <div
            className={`absolute inset-0 rounded-r-full pointer-events-none border-y border-r border-l-0 transition-colors duration-700 ${activeButton === "chapters" ? "border-amber-500" : "border-amber-700/30 group-hover:border-amber-500"}`}
          />
          <div
            className="absolute inset-0 rounded-r-full pointer-events-none z-0"
            style={{
              padding: "2px 3px 1px 0px",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          >
            <div className="absolute top-1/2 left-1/2 w-[300%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_75%,#fbbf24_100%)]" />
          </div>

          <div
            className={`absolute inset-0 mr-3 flex items-center justify-center transition-opacity duration-300 ease-out ${activeButton === "chapters" ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}
          >
            <span className="text-lg text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">
              📜
            </span>
          </div>
          <div
            className={`absolute top-0 left-0 w-30 h-17 flex items-center transition-opacity duration-500 delay-200 ease-in ${activeButton === "chapters" ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          >
            <div className="w-12 flex items-center justify-center flex-shrink-0">
              <span className="text-lg text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">
                📜
              </span>
            </div>
            <div className="flex flex-col justify-center whitespace-nowrap text-left pr-4 z-10">
              <span className="text-xs font-serif font-bold text-amber-300 tracking-wider uppercase">
                Chapters
              </span>
              <span className="text-[9px] font-sans text-slate-400 tracking-widest uppercase">
                Chronicles
              </span>
            </div>
          </div>
        </button>

        {/* 1.2 Dynasty Lineage Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleButtonPress("familyTree", () => setShowFamilyTree(true));
          }}
          className={`relative group bg-gradient-to-r from-[#1c110685] via-slate-800/70 to-slate-900 shadow-[inset_0_2px_5px_rgba(255,255,255,0.2),_0_0_15px_rgba(245,158,11,0.2)] transition-all duration-700 ease-in-out overflow-hidden cursor-pointer pointer-events-auto ${
            activeButton === "familyTree"
              ? "w-72 h-24 rounded-r-full shadow-[0_0_40px_rgba(245,158,11,0.7)]"
              : "w-20 h-32 rounded-r-full hover:w-68 hover:h-24 hover:shadow-[0_0_35px_rgba(245,158,11,0.5)]"
          } ${isArmoryOpen ? "opacity-0 pointer-events-none absolute" : ""}`}
        >
          <div
            className={`absolute inset-0 rounded-r-full pointer-events-none border-y border-r border-l-0 transition-colors duration-700 ${activeButton === "familyTree" ? "border-amber-300" : "border-amber-700/30 group-hover:border-amber-400"}`}
          />
          <div
            className="absolute inset-0 rounded-r-full pointer-events-none z-0"
            style={{
              padding: "2px 3px 1px 0px",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          >
            <div className="absolute top-1/2 left-1/2 w-[300%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_120deg,transparent_75%,#fcd34d_100%)]" />
          </div>

          <div
            className={`absolute inset-0 mr-4 flex items-center justify-center transition-opacity duration-300 ease-out ${activeButton === "familyTree" ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}
          >
            <svg
              className="w-8 h-8 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,1)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="5" r="3"></circle>
              <circle cx="6" cy="16" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
              <path d="M10.5 7.5L8 13.5"></path>
              <path d="M13.5 7.5L16 13.5"></path>
            </svg>
          </div>
          <div
            className={`absolute top-0 left-0 w-72 h-24 flex items-center transition-opacity duration-500 delay-200 ease-in ${activeButton === "familyTree" ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          >
            <div className="w-20 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-8 h-8 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,1)]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="5" r="3"></circle>
                <circle cx="6" cy="16" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
                <path d="M10.5 7.5L8 13.5"></path>
                <path d="M13.5 7.5L16 13.5"></path>
              </svg>
            </div>
            <div className="flex flex-col justify-center whitespace-nowrap text-left pr-4 z-10">
              <span className="text-[14px] font-serif font-bold text-amber-300 tracking-widest uppercase drop-shadow-sm">
                Dynasty Lineage
              </span>
              <span className="text-[11px] font-sans text-amber-500/80 tracking-widest uppercase">
                Royal Bloodlines
              </span>
            </div>
          </div>
        </button>

        {/* 1.3 Ancient Arsenal Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleButtonPress("arsenal", () => {
              if (isArmoryOpen) closeArmory();
              else setIsArmoryOpen(true);
            });
          }}
          className={`relative group bg-gradient-to-r from-slate-900/40 via-slate-900/70 to-slate-900 shadow-[inset_0_2px_5px_rgba(255,255,255,0.1),_0_10px_30px_rgba(0,0,0,1)] transition-all duration-700 ease-in-out overflow-hidden cursor-pointer pointer-events-auto ${
            activeButton === "arsenal"
              ? "w-48 h-14 rounded-r-full shadow-[0_0_30px_rgba(245,158,11,0.5)]"
              : "w-14 h-17 rounded-r-full hover:w-50 hover:h-17 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]"
          } ${isArmoryOpen ? "opacity-0 scale-50 pointer-events-none absolute" : ""}`}
        >
          <div
            className={`absolute inset-0 rounded-r-full pointer-events-none border-y border-r border-l-0 transition-colors duration-700 ${activeButton === "arsenal" ? "border-amber-700" : "border-amber-700/30 group-hover:border-amber-500"}`}
          />
          <div
            className="absolute inset-0 rounded-r-full pointer-events-none z-0"
            style={{
              padding: "2px 3px 1px 0px",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          >
            <div className="absolute top-1/2 left-1/2 w-[300%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_4.5s_linear_infinite] bg-[conic-gradient(from_240deg,transparent_75%,#fbbf24_100%)]" />
          </div>

          <div
            className={`absolute inset-0 flex mr-3 items-center justify-center transition-opacity duration-300 ease-out ${activeButton === "arsenal" ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}
          >
            <span className="text-lg text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">
              ⚔️
            </span>
          </div>
          <div
            className={`absolute top-0 left-0 w-48 h-14 flex items-center transition-opacity duration-500 delay-200 ease-in ${activeButton === "arsenal" ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          >
            <div className="w-12 flex items-center justify-center flex-shrink-0">
              <span className="text-lg text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">
                ⚔️
              </span>
            </div>
            <div className="flex flex-col justify-center whitespace-nowrap text-left pr-4 z-10">
              <span className="text-xs font-serif font-bold text-amber-300 tracking-wider uppercase">
                Ancient Arsenal
              </span>
              <span className="text-[9px] font-sans text-slate-400 tracking-widest uppercase">
                Legendary Astras
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* 2. THE REALISTIC WEAPON DIAL WITH CIRCULAR TEXT */}
      <AnimatePresence>
        {isArmoryOpen && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-40 pointer-events-none">
            <div className="relative w-142.5 h-142.5 -ml-67.25">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 rounded-full shadow-[0_0_150px_rgba(245,158,11,0.15)] bg-transparent"
              />

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
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.5 },
                  }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 rounded-full pointer-events-auto bg-black/60 shadow-[inset_0_0_700px_70px_rgba(0,0,0,0.9),_0_30px_60px_rgba(0,0,0,0)]"
                  style={{
                    cursor: "grab",
                    border: "3px solid rgba(139, 90, 43, 0.7)",
                  }}
                >
                  <div className="absolute inset-2 rounded-full border border-[#8b5a2b]/20 pointer-events-none" />
                </motion.div>

                {/* 2.1 THE DUAL-LAYER CIRCULAR TEXT RIM */}
                <svg
                  className="absolute inset-0 scale-[0.98] w-full h-full pointer-events-none"
                  viewBox="0 0 570 570"
                >
                  <defs>
                    <path
                      id="textCurve"
                      d="M 285, 20 a 265,265 0 1,1 0,530 a 265,265 0 1,1 0,-530"
                    />
                  </defs>

                  {/* LAYER A: The Ambient Background Mantra (Cluttered, continuous, dim) */}
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 285 285"
                      to="360 285 285"
                      dur="50s"
                      repeatCount="indefinite"
                    />
                    <text
                      fontSize="13"
                      fontFamily="serif"
                      letterSpacing="2px"
                      className="uppercase font-bold"
                      fill="rgba(139, 90, 43, 0.4)"
                    >
                      <textPath href="#textCurve" startOffset="0%">
                        {mantraTextArray.map((weapon, index) => (
                          <tspan key={`bg-mantra-${index}`}>
                            {weapon.name}
                            <tspan fill="transparent">{"  "}</tspan>
                          </tspan>
                        ))}
                      </textPath>
                    </text>
                  </g>

                  {/* LAYER B: The Exact Hover Alignments (Hidden until hovered, perfectly aligned over coins) */}
                  <text
                    fontSize="13"
                    fontFamily="serif"
                    letterSpacing="2px"
                    className="uppercase font-black"
                    textAnchor="middle" /* Centers the text exactly on the startOffset percentage */
                  >
                    {weaponsData.map((weapon, index) => {
                      const isHovered = hoveredWeaponId === weapon.id;
                      const percent = (index / weaponsData.length) * 100;
                      return (
                        <textPath
                          key={`hover-mantra-${weapon.id}`}
                          href="#textCurve"
                          startOffset={`${percent}%`}
                          className="transition-colors duration-200 ease-out"
                          fill={isHovered ? "#ffedb3" : "transparent"}
                          style={{
                            // Dark shadow masks the cluttered text behind it, gold shadow creates the glow
                            textShadow: isHovered
                              ? "0 0 6px #000, 0 0 12px #000, 0 0 20px rgba(212,175,55,1), 0 0 30px rgba(212,175,55,0.8)"
                              : "none",
                          }}
                        >
                          {weapon.name}
                        </textPath>
                      );
                    })}
                  </text>
                </svg>

                {/* 2.2 The Weapons Launch & 3D Sockets */}
                {weaponsData.map((weapon, index) => {
                  const total = weaponsData.length;
                  const angle = (360 / total) * index - 90;
                  const radius = 225;
                  const targetX = Math.cos(angle * (Math.PI / 180)) * radius;
                  const targetY = Math.sin(angle * (Math.PI / 180)) * radius;
                  const animationDelay = 0.4 + index * 0.12;

                  return (
                    <div
                      key={weapon.id}
                      className={`absolute left-1/2 top-1/2 w-14 h-14 -ml-7 -mt-7 pointer-events-auto group transition-all duration-200 ${
                        selectedWeapon?.id === weapon.id
                          ? "z-[100]"
                          : "z-10 hover:z-[120]"
                      }`}
                      style={{
                        x: targetX,
                        y: targetY,
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full bg-transparent shadow-[inset_0_15px_25px_rgba(0,0,0,0.95),_inset_0_4px_8px_rgba(0,0,0,0.9),_0_1px_1px_rgba(255,255,255,0.2)] border border-black"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        style={{ x: targetX, y: targetY }}
                      />

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
                            onMouseEnter={() => setHoveredWeaponId(weapon.id)}
                            onMouseLeave={() => setHoveredWeaponId(null)}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedWeapon(weapon);
                            }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 pointer-events-auto 
                              bg-gradient-to-b from-[#6b4a23] via-[#22160a] to-[#050301] border border-[#a67c47]
                              shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),_inset_0_-4px_8px_rgba(0,0,0,0.8),_0_10px_20px_rgba(0,0,0,0.9)]
                              group-hover:border-[#d4af37] group-hover:from-[#8a602d] group-hover:via-[#36230f]
                              ${
                                selectedWeapon?.id === weapon.id
                                  ? "scale-110 !border-[#ffd700] !from-[#9c6a28] shadow-[inset_0_2px_6px_rgba(255,255,255,0.4),_0_0_30px_rgba(245,158,11,0.6)]"
                                  : ""
                              }`}
                          >
                            <span className="relative text-[22px] z-10 opacity-80 group-hover:opacity-100 group-hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] transition-all duration-300">
                              {weapon.icon}
                            </span>
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
                className="absolute top-1/2 left-1/2 w-20 h-20 -ml-10 -mt-10 z-60 pointer-events-auto cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  closeArmory();
                }}
                title="Close Arsenal"
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#4a351f] via-[#1a1108] to-[#0a0703] border-[2px] border-[#8b5a2b] shadow-[0_10px_25px_rgba(0,0,0,0.9),_inset_0_2px_4px_rgba(255,255,255,0.15)] flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-black shadow-[inset_0_5px_15px_rgba(0,0,0,1)] border border-[#3d2914] flex items-center justify-center transition-transform hover:scale-110">
                    <span className="text-xs text-[#a67c47] font-black drop-shadow-sm pb-[1px]">
                      ✕
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. DEDICATED WEAPON DETAILS SLIDER (CINEMATIC UPGRADE) */}
      <AnimatePresence mode="wait">
        {selectedWeapon && isArmoryOpen && (
          <motion.div
            key={selectedWeapon.id} // Forces re-render of animations when weapon changes
            className="fixed inset-0 z-[150] pointer-events-none flex justify-end"
          >
            {/* Darker, moodier backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWeapon(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto"
            />

            {/* Cinematic Slider Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="relative w-full sm:w-[500px] h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0703] to-black border-l border-[#8b5a2b]/40 shadow-[-30px_0_80px_rgba(0,0,0,1)] pointer-events-auto overflow-y-auto"
            >
              {/* Internal Content wrapped in a staggered animation block */}
              <motion.div
                className="p-10 flex flex-col h-full relative z-10"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
                  },
                }}
              >
                <button
                  onClick={() => setSelectedWeapon(null)}
                  className="absolute top-8 left-8 text-[#a67c47] hover:text-amber-300 text-xs font-bold tracking-[0.2em] uppercase transition-colors flex items-center gap-2"
                >
                  <span className="text-lg leading-none">&larr;</span> Return
                </button>

                <div className="mt-16 flex flex-col items-center">
                  {/* Cinematic Glowing Orb Icon Box */}
                  <motion.div
                    variants={{
                      hidden: { scale: 0.8, opacity: 0 },
                      visible: { scale: 1, opacity: 1 },
                    }}
                    className="relative w-36 h-36 flex justify-center items-center mb-8"
                  >
                    {/* Glowing Backlight */}
                    <div className="absolute inset-0 bg-amber-600/20 blur-[40px] rounded-full animate-pulse" />

                    <div className="absolute inset-0 bg-gradient-to-br from-[#2a1b0c] to-black border border-[#a67c47]/50 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,1),_0_20px_40px_rgba(0,0,0,0.8)]" />
                    <span className="relative z-10 text-7xl drop-shadow-[0_0_25px_rgba(251,191,36,0.8)]">
                      {selectedWeapon.icon}
                    </span>
                  </motion.div>

                  <motion.h2
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      visible: { y: 0, opacity: 1 },
                    }}
                    className="text-4xl sm:text-5xl font-serif font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-400 to-amber-700 text-center mb-4 drop-shadow-[0_5px_15px_rgba(0,0,0,1)]"
                  >
                    {selectedWeapon.name}
                  </motion.h2>

                  <motion.div
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      visible: { y: 0, opacity: 1 },
                    }}
                    className="flex flex-wrap gap-3 mb-10 w-full justify-center"
                  >
                    <span className="px-4 py-2 bg-black/50 border border-[#a67c47]/30 text-amber-400 text-[10px] uppercase tracking-[0.2em] rounded shadow-inner backdrop-blur-sm">
                      {selectedWeapon.type}
                    </span>
                    <span className="px-4 py-2 bg-black/50 border border-slate-800 text-slate-300 text-[10px] uppercase tracking-[0.2em] rounded shadow-inner backdrop-blur-sm">
                      Wielder:{" "}
                      <span className="font-bold text-amber-100 drop-shadow-md">
                        {selectedWeapon.wielder}
                      </span>
                    </span>
                  </motion.div>
                </div>

                <motion.div
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 },
                  }}
                  className="relative flex-grow bg-black/40 border border-[#8b5a2b]/20 rounded-xl p-8 text-slate-300 leading-relaxed shadow-[inset_0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-sm"
                >
                  {/* Ornate Corners */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#a67c47]/40 rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#a67c47]/40 rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[#a67c47]/40 rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#a67c47]/40 rounded-br-xl" />

                  {/* Description Text */}
                  <p className="relative z-10 font-serif font-light text-justify tracking-wide text-sm leading-8 first-letter:text-5xl first-letter:font-black first-letter:text-amber-500 first-letter:float-left first-letter:mr-3 first-letter:mt-[-4px] drop-shadow-md">
                    {selectedWeapon.description}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
