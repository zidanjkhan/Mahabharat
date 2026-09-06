// src/components/FloatingMenu.js
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  m,
  LazyMotion,
  domAnimation,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { weaponsData } from "../data/weaponsData";

// Moved outside the component so it only runs once
const mantraTextArray = [
  ...weaponsData,
  ...weaponsData,
  ...weaponsData,
  ...weaponsData,
];

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

  // Tracks which weapon is casting
  const [castingWeaponId, setCastingWeaponId] = useState(null);
  // Tracks the 4 stages of the cinematic (0 = idle, 1 = spin/glow, 2 = chamber load, 3 = fire light-arrow)
  const [castPhase, setCastPhase] = useState(0);

  // The UX Toggle for instant viewing
  const [skipAnimation, setSkipAnimation] = useState(false);

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

  // Tracks if the toggle is temporarily expanded for the user to read
  const [isToggleExpanded, setIsToggleExpanded] = useState(false);

  // The "Peek" Timer
  useEffect(() => {
    // Triggers when the Armory opens OR when you close a weapon details slider
    if (isArmoryOpen && !selectedWeapon) {
      setIsToggleExpanded(true); // Open the pill

      const timer = setTimeout(() => {
        setIsToggleExpanded(false); // Close it after 2.5 seconds
      }, 2500);

      return () => clearTimeout(timer); // Cleanup if the user clicks fast
    }
  }, [isArmoryOpen, selectedWeapon]);

  const closeArmory = () => {
    setIsArmoryOpen(false);
    setSelectedWeapon(null);
    setActiveButton(null);
    setCastPhase(0);
    setCastingWeaponId(null);
    setTimeout(() => rotation.set(0), 500);
  };

  const backgroundMantraLayer = useMemo(
    () => (
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
          fill="currentColor"
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
    ),
    [],
  );

  return (
    <LazyMotion features={domAnimation}>
      <>
        {/* 1. MAIN FLOATING MENU BUTTONS */}
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-start gap-4 z-50 ${isArmoryOpen ? "pointer-events-none" : "pointer-events-auto"}`}
          onClick={() => {
            const isTouchDevice =
              window.matchMedia("(pointer: coarse)").matches;
            if (isTouchDevice) setActiveButton(null);
          }}
        >
          {/* 1.1 Chapters Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleButtonPress("chapters", () => setShowDrawer(true));
            }}
            className={`relative group bg-gradient-to-r from-slate-900/40 via-slate-900/70 to-slate-900 backdrop-blur-none shadow-[inset_0_2px_5px_rgba(255,255,255,0.1),_0_10px_30px_rgba(0,0,0,1)] transition-all duration-700 ease-in-out overflow-hidden cursor-pointer pointer-events-auto ${activeButton === "chapters" ? "w-48 h-14 rounded-r-full shadow-[0_0_30px_rgba(245,158,11,0.5)]" : "w-14 h-17 rounded-r-full hover:w-35 hover:h-17 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]"} ${isArmoryOpen ? "opacity-0 pointer-events-none absolute" : ""}`}
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
            className={`relative group bg-gradient-to-r from-[#1c110685] via-slate-800/70 to-slate-900 shadow-[inset_0_2px_5px_rgba(255,255,255,0.2),_0_0_15px_rgba(245,158,11,0.2)] transition-all duration-700 ease-in-out overflow-hidden cursor-pointer pointer-events-auto ${activeButton === "familyTree" ? "w-72 h-24 rounded-r-full shadow-[0_0_40px_rgba(245,158,11,0.7)]" : "w-20 h-32 rounded-r-full hover:w-68 hover:h-24 hover:shadow-[0_0_35px_rgba(245,158,11,0.5)]"} ${isArmoryOpen ? "opacity-0 pointer-events-none absolute" : ""}`}
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
            className={`relative group bg-gradient-to-r from-slate-900/40 via-slate-900/70 to-slate-900 shadow-[inset_0_2px_5px_rgba(255,255,255,0.1),_0_10px_30px_rgba(0,0,0,1)] transition-all duration-700 ease-in-out overflow-hidden cursor-pointer pointer-events-auto ${activeButton === "arsenal" ? "w-48 h-14 rounded-r-full shadow-[0_0_30px_rgba(245,158,11,0.5)]" : "w-14 h-17 rounded-r-full hover:w-50 hover:h-17 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]"} ${isArmoryOpen ? "opacity-0 scale-50 pointer-events-none absolute" : ""}`}
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

        {/* 2. THE REALISTIC WEAPON DIAL */}
        <AnimatePresence>
          {isArmoryOpen && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-40 pointer-events-none">
              <div className="relative w-142.5 h-142.5 -ml-67.25">
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 rounded-full shadow-[0_0_150px_rgba(245,158,11,0.15)] bg-transparent"
                />

                <m.div
                  className="absolute inset-0 rounded-full"
                  style={{ rotate: rotation }}
                  onPan={handlePan}
                  onPanEnd={handlePanEnd}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0}
                  whileTap={{ cursor: "grabbing" }}
                >
                  <m.div
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
                  </m.div>

                  <m.svg
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.5 },
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 scale-[0.98] w-full h-full pointer-events-none"
                    viewBox="0 0 570 570"
                    style={{ overflow: "visible" }}
                  >
                    <defs>
                      <path
                        id="textCurve"
                        d="M 285, 20 a 265,265 0 1,1 0,530 a 265,265 0 1,1 0,-530"
                      />
                    </defs>

                    {/* LAYER A: Ambient Background Mantra + Mandala (STRICTLY NO ROTATION CHANGES TO TEXT) */}
                    <m.g
                      animate={{
                        color:
                          castPhase >= 1
                            ? "rgb(251, 191, 36)"
                            : "rgba(139, 90, 43, 0.4)",
                        filter:
                          castPhase >= 1
                            ? "drop-shadow(0 0 15px #ea580c) drop-shadow(0 0 25px #fbbf24)"
                            : "drop-shadow(0 0 0px transparent)",
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* THE CINEMATIC MANDALA (Isolated so it doesn't touch your text spin) */}
                      <AnimatePresence>
                        {castPhase === 1 && (
                          <m.g
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            {/* Native spin applied ONLY to the mandala */}
                            <animateTransform
                              attributeName="transform"
                              type="rotate"
                              from="0 285 285"
                              to="360 285 285"
                              dur="4s"
                              repeatCount="indefinite"
                            />

                            {/* STAGE 1: CHAMBER HALOS */}
                            <m.circle
                              cx="285"
                              cy="285"
                              r="50"
                              fill="none"
                              stroke="#fbbf24"
                              strokeWidth="2"
                              strokeDasharray="4 6"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{
                                duration: 1,
                                delay: 0.5,
                                ease: "easeInOut",
                              }}
                            />
                            <m.circle
                              cx="285"
                              cy="285"
                              r="62"
                              fill="none"
                              stroke="#ea580c"
                              strokeWidth="1.5"
                              opacity="0.7"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{
                                duration: 1,
                                delay: 0.6,
                                ease: "easeInOut",
                              }}
                            />

                            {/* STAGE 2: POWER CONDUITS */}
                            <m.g>
                              <m.path
                                d="M 285 223 L 285 135 M 285 347 L 285 435 M 223 285 L 135 285 M 347 285 L 435 285"
                                fill="none"
                                stroke="#ea580c"
                                strokeWidth="2"
                                opacity="0.8"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{
                                  duration: 0.8,
                                  delay: 0.7,
                                  ease: "easeOut",
                                }}
                              />
                              <m.path
                                d="M 285 223 L 285 135 M 285 347 L 285 435 M 223 285 L 135 285 M 347 285 L 435 285"
                                fill="none"
                                stroke="#ea580c"
                                strokeWidth="2"
                                opacity="0.8"
                                transform="rotate(45 285 285)"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{
                                  duration: 0.8,
                                  delay: 0.8,
                                  ease: "easeOut",
                                }}
                              />
                            </m.g>

                            {/* STAGE 3: THE ANCIENT 8-POINTED STAR */}
                            <m.g>
                              <m.rect
                                x="110"
                                y="110"
                                width="350"
                                height="350"
                                fill="none"
                                stroke="#fbbf24"
                                strokeWidth="2.5"
                                opacity="0.85"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{
                                  duration: 1.5,
                                  delay: 0.9,
                                  ease: "easeInOut",
                                }}
                              />
                              <m.rect
                                x="110"
                                y="110"
                                width="350"
                                height="350"
                                fill="none"
                                stroke="#fbbf24"
                                strokeWidth="2.5"
                                opacity="0.85"
                                transform="rotate(45 285 285)"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{
                                  duration: 1.5,
                                  delay: 1.0,
                                  ease: "easeInOut",
                                }}
                              />
                            </m.g>

                            {/* STAGE 4: CONTAINMENT RINGS */}
                            <m.circle
                              cx="285"
                              cy="285"
                              r="250"
                              fill="none"
                              stroke="#fbbf24"
                              strokeWidth="3"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{
                                duration: 1.5,
                                delay: 1.1,
                                ease: "easeInOut",
                              }}
                            />
                            <m.circle
                              cx="285"
                              cy="285"
                              r="280"
                              fill="none"
                              stroke="#ea580c"
                              strokeWidth="4"
                              strokeDasharray="20 15"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{
                                duration: 2,
                                delay: 1.2,
                                ease: "easeInOut",
                              }}
                            />

                            {/* STAGE 5: CELESTIAL SPARKS */}
                            <m.circle
                              cx="285"
                              cy="285"
                              r="265"
                              fill="none"
                              stroke="#ffffff"
                              strokeWidth="4"
                              strokeDasharray="1 103"
                              initial={{ opacity: 0, rotate: -15 }}
                              animate={{ opacity: 0.9, rotate: 0 }}
                              transition={{ duration: 1, delay: 1.4 }}
                              style={{ transformOrigin: "285px 285px" }}
                            />
                          </m.g>
                        )}
                      </AnimatePresence>

                      {/* Your completely untouched, perfectly smooth background text layer */}
                      {backgroundMantraLayer}
                    </m.g>

                    {/* LAYER B: The Fiery Amber Locked Name + Target Lock Mandala Border */}
                    {weaponsData.map((weapon, index) => {
                      const isHovered = hoveredWeaponId === weapon.id;
                      const isCastingTarget =
                        castingWeaponId === weapon.id && castPhase >= 2;
                      const isSelected = selectedWeapon?.id === weapon.id;
                      const showText =
                        isHovered || isSelected || isCastingTarget;
                      const baseAngle = (index / weaponsData.length) * 360;

                      return (
                        <m.g
                          key={`layer-b-${weapon.id}`}
                          animate={{ scale: isCastingTarget ? 1.12 : 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                          style={{ transformOrigin: "285px 285px" }}
                        >
                          <AnimatePresence>
                            {isCastingTarget && (
                              <m.g
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                transform={`rotate(${baseAngle - 180} 285 285)`}
                              >
                                <path
                                  d="M 215 525 Q 285 515 355 525"
                                  fill="none"
                                  stroke="#ea580c"
                                  strokeWidth="2"
                                  strokeDasharray="4 4"
                                />
                                <path
                                  d="M 225 558 Q 285 565 345 558"
                                  fill="none"
                                  stroke="#fbbf24"
                                  strokeWidth="2"
                                />
                                <path
                                  d="M 195 535 L 205 535 L 205 545"
                                  fill="none"
                                  stroke="#fbbf24"
                                  strokeWidth="2.5"
                                />
                                <circle
                                  cx="195"
                                  cy="535"
                                  r="3"
                                  fill="#ea580c"
                                />
                                <path
                                  d="M 375 535 L 365 535 L 365 545"
                                  fill="none"
                                  stroke="#fbbf24"
                                  strokeWidth="2.5"
                                />
                                <circle
                                  cx="375"
                                  cy="535"
                                  r="3"
                                  fill="#ea580c"
                                />
                              </m.g>
                            )}
                          </AnimatePresence>

                          {/* UPGRADED LAYER B: Scales up, spreads out, white core, heavy dark outline */}
                          <text
                            fontSize={isCastingTarget ? "16" : "13"}
                            fontFamily="serif"
                            letterSpacing={isCastingTarget ? "4px" : "2px"}
                            className="uppercase font-black"
                            textAnchor="middle"
                            transform={`rotate(${baseAngle - 180} 285 285)`}
                          >
                            <m.textPath
                              href="#textCurve"
                              startOffset="50%"
                              className="transition-colors duration-300 ease-out"
                              animate={{
                                fill: showText
                                  ? isCastingTarget
                                    ? "#ffffff"
                                    : "#ffedb3"
                                  : "transparent",
                                stroke:
                                  showText && isCastingTarget
                                    ? "#431407"
                                    : "transparent",
                                strokeWidth: isCastingTarget ? "3.5px" : "0px",
                                textShadow: showText
                                  ? isCastingTarget
                                    ? "0 0 15px #fbbf24, 0 0 30px #ea580c, 0 0 45px #9a3412"
                                    : "0 0 6px #000, 0 0 12px #000, 0 0 20px rgba(212,175,55,1), 0 0 30px rgba(212,175,55,0.8)"
                                  : "none",
                              }}
                              style={{ paintOrder: "stroke fill" }}
                            >
                              {weapon.name}
                            </m.textPath>
                          </text>
                        </m.g>
                      );
                    })}
                  </m.svg>

                  {/* 2.2 The Weapons Launch & 3D Sockets */}
                  {weaponsData.map((weapon, index) => {
                    const total = weaponsData.length;
                    const angle = (360 / total) * index - 90;
                    const radius = 225;
                    const targetX = Math.cos(angle * (Math.PI / 180)) * radius;
                    const targetY = Math.sin(angle * (Math.PI / 180)) * radius;

                    return (
                      <m.div
                        key={weapon.id}
                        className={`absolute left-1/2 top-1/2 w-14 h-14 -ml-7 -mt-7 pointer-events-auto group transition-all duration-200 ${
                          selectedWeapon?.id === weapon.id
                            ? "z-[100]"
                            : castingWeaponId === weapon.id
                              ? "z-[110]"
                              : "z-10 hover:z-[120]"
                        }`}
                        // THE TIMELINE DIRECTOR: Chambering
                        animate={{
                          x:
                            castingWeaponId === weapon.id && castPhase >= 2
                              ? 0
                              : targetX, // Phase 2: Load into center chamber
                          y:
                            castingWeaponId === weapon.id && castPhase >= 2
                              ? 0
                              : targetY,
                          // Coin vanishes perfectly inside the chamber when Phase 3 triggers the light-arrow
                          scale:
                            castingWeaponId === weapon.id && castPhase >= 3
                              ? 0
                              : castingWeaponId === weapon.id && castPhase >= 2
                                ? 0.3
                                : 1,
                          opacity:
                            castingWeaponId === weapon.id && castPhase >= 3
                              ? 0
                              : 1,
                        }}
                        transition={{
                          duration: 0.8, // Elegant 0.8s pull to chamber
                          ease: "backInOut",
                        }}
                      >
                        <m.div
                          className="absolute inset-0 rounded-full bg-transparent shadow-[inset_0_15px_25px_rgba(0,0,0,0.95),_inset_0_4px_8px_rgba(0,0,0,0.9),_0_1px_1px_rgba(255,255,255,0.2)] border border-black"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, transition: { duration: 0.2 } }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                        />

                        <m.div
                          className="absolute inset-0"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{
                            scale: 0,
                            opacity: 0,
                            transition: { duration: 0.3 },
                          }}
                          transition={{
                            delay: 0.4 + index * 0.12,
                            duration: 0.5,
                            ease: "easeOut",
                          }}
                        >
                          <m.div
                            style={{ rotate: inverseRotation }}
                            className="w-full h-full flex justify-center items-center relative group"
                          >
                          <button
  onMouseEnter={() => setHoveredWeaponId(weapon.id)}
  onMouseLeave={() => setHoveredWeaponId(null)}
  onClick={(e) => {
    e.stopPropagation();
    if (castPhase > 0 || selectedWeapon?.id === weapon.id) return;
    
    // THE UX BYPASS
    if (skipAnimation) {
      setSelectedWeapon(weapon);
      return;
    }
    
    setCastingWeaponId(weapon.id);
    setCastPhase(1); // Phase 1: Glow, Scale, Spin Mandala
    setTimeout(() => setCastPhase(2), 3500); // Phase 2: Load into chamber
    setTimeout(() => setCastPhase(3), 4700); // Phase 3: Fire Light Arrow
    setTimeout(() => {
      setSelectedWeapon(weapon);
      setCastingWeaponId(null);
      setCastPhase(0);
    }, 5100);
  }}
  className={`relative overflow-hidden w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 pointer-events-auto 
    bg-black border border-[#a67c47] shadow-[0_10px_20px_rgba(0,0,0,0.9)]
    group-hover:border-[#d4af37] 
    ${selectedWeapon?.id === weapon.id || castingWeaponId === weapon.id ? "scale-110 !border-[#fbbf24] shadow-[0_0_30px_rgba(251,191,36,0.8)]" : ""}`}
>
  {/* The Full-Cover Image: 100% Opacity with a slight zoom & brighten on hover */}
  <img 
    src={weapon.image} 
    alt={weapon.name} 
    className="absolute inset-0 w-full h-full object-cover z-0 transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
  />
  
  {/* Lighter 3D Coin Inner Shadow: Reduced the black shadow so it doesn't darken your artwork */}
  <div className="absolute inset-0 rounded-full z-10 pointer-events-none shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),_inset_0_-3px_6px_rgba(0,0,0,0.5)]" />
</button>
                          </m.div>
                        </m.div>
                      </m.div>
                    );
                  })}
                </m.div>

                {/* THE LIGHT ARROW PROJECTILE (Cinematic Astra Firing Sequence) */}
                <AnimatePresence>
                  {castPhase === 3 && (
                    <div className="absolute top-1/2 left-1/2 z-[200] pointer-events-none">
                      {/* 1. THE ORIGIN SHOCKWAVE (The "Boom" of the chamber firing) */}
                      <m.div
                        initial={{ scale: 0, opacity: 1, borderWidth: "8px" }}
                        animate={{ scale: 3, opacity: 0, borderWidth: "1px" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute -ml-12 -mt-12 w-24 h-24 rounded-full border-amber-400 shadow-[0_0_30px_#ea580c]"
                      />

                      {/* 2. THE MAIN PROJECTILE (The Astra Streak) */}
                      <m.div
                        initial={{ x: 0, opacity: 1, scaleX: 0.2 }}
                        // Stretches massively horizontally to simulate motion blur and speed
                        animate={{
                          x: 800,
                          opacity: [1, 1, 0],
                          scaleX: [1, 5, 8],
                        }}
                        transition={{ duration: 0.35, ease: "easeIn" }}
                        className="absolute top-0 left-0 flex items-center"
                        style={{ originX: 0 }} // Anchors the stretch to the back of the tail
                      >
                        {/* The burning atmospheric tail */}
                        <div className="w-64 h-1 bg-gradient-to-r from-transparent via-[#ea580c] to-[#fbbf24] blur-[1px]" />

                        {/* The superheated core streak */}
                        <div className="absolute right-0 w-32 h-2 bg-gradient-to-r from-transparent to-[#ffffff] blur-[2px] shadow-[0_0_20px_#fbbf24,0_0_40px_#ea580c]" />

                        {/* The piercing arrowhead (Blinding white) */}
                        <div className="absolute right-[-10px] w-6 h-6 bg-white rounded-full blur-[3px] shadow-[0_0_30px_5px_#ffffff,0_0_60px_10px_#fbbf24]" />
                        <div className="absolute right-[-4px] w-2 h-2 bg-white rounded-full" />

                        {/* 3. ATMOSPHERIC DISTORTION RINGS (Energy wrapping around the tip) */}
                        <m.div
                          initial={{ rotate: -45, scale: 0.2, opacity: 1 }}
                          animate={{ rotate: 45, scale: 2, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="absolute right-[-25px] top-1/2 -translate-y-1/2 w-16 h-16 border-t-[3px] border-r-[3px] border-white rounded-full blur-[1px] shadow-[0_0_15px_#fbbf24]"
                        />
                      </m.div>

                      {/* 4. THE IMPACT FLARE (Flashes right as the sidebar opens) */}
                      <m.div
                        initial={{ x: 750, y: "-50%", opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 4, 6] }}
                        transition={{
                          delay: 0.25,
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                        className="absolute top-0 right-[-800px] w-32 h-32 bg-amber-200 rounded-full blur-[40px] mix-blend-screen"
                      />
                    </div>
                  )}
                </AnimatePresence>

                {/* 2.3 THE METALLIC CLOSE BUTTON HUB (THE CHAMBER) */}
                <m.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.05 }} // Slight pop up on hover
                  whileTap={{ scale: 0.95 }} // Mechanical squeeze on click
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="absolute top-1/2 left-1/2 w-20 h-20 -ml-10 -mt-10 z-60 pointer-events-auto cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeArmory();
                  }}
                  title="Close Arsenal"
                >
                  {/* Subtle idle breathing aura to invite interaction */}
                  <div
                    className={`absolute inset-0 rounded-full bg-amber-700/20 blur-[12px] transition-opacity duration-500 animate-[pulse_3s_ease-in-out_infinite] ${castPhase >= 2 ? "opacity-0" : "opacity-60 group-hover:opacity-100 group-hover:bg-amber-500/40"}`}
                  />

                  {/* The Heavy Metallic Chamber */}
                  <div
                    className={`relative w-full h-full rounded-full bg-gradient-to-br from-[#4a351f] via-[#1a1108] to-[#0a0703] border-[2px] transition-colors duration-500 shadow-[0_10px_25px_rgba(0,0,0,0.9),_inset_0_2px_4px_rgba(255,255,255,0.15)] flex items-center justify-center ${castPhase >= 2 ? "border-[#fbbf24] shadow-[0_0_40px_rgba(251,191,36,0.6)]" : "border-[#8b5a2b] group-hover:border-[#b47a36]"}`}
                  >
                    {/* The Inner Socket & X (Lights up on hover) */}
                    <div
                      className={`w-8 h-8 rounded-full bg-black shadow-[inset_0_5px_15px_rgba(0,0,0,1)] border flex items-center justify-center transition-all duration-300 ${castPhase >= 3 ? "scale-50 opacity-0" : "border-[#3d2914] group-hover:border-[#8b5a2b] group-hover:shadow-[inset_0_2px_10px_rgba(245,158,11,0.25)]"}`}
                    >
                      <span className="text-xs text-[#a67c47] font-black drop-shadow-sm pb-[1px] transition-all duration-300 group-hover:text-amber-400 group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]">
                        ✕
                      </span>
                    </div>
                  </div>
                </m.button>

                {/* 2.4 SKIP ANIMATION TOGGLE (Auto-expands on load, then hoverable) */}
                <m.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    transition: { delay: 0, duration: 0.2 },
                  }} /* <--- ADDED FAST EXIT */
                  transition={{ delay: 0.8 }}
                  className="absolute top-1/2 left-1/2 -translate-x-[-47px] translate-y-[-12px] z-50 pointer-events-auto"
                >
                  <m.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSkipAnimation(!skipAnimation);
                    }}
                    // Dynamically forces w-[105px] when the timer is active, otherwise falls back to the w-8 hover trick
                    className={`group relative flex items-center h-8 bg-black/90 border border-[#8b5a2b]/50 shadow-[0_4px_10px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:border-[#fbbf24]/70 transition-all duration-500 ease-in-out rounded-full overflow-hidden cursor-pointer ${isToggleExpanded ? "w-[105px]" : "w-8 hover:w-[105px]"}`}
                  >
                    {/* The Bulb / Dot */}
                    <div className="absolute left-0 w-8 flex items-center justify-center flex-shrink-0">
                      {!skipAnimation && (
                        <div className="absolute w-2 h-2 rounded-full bg-amber-400/60 animate-ping" />
                      )}
                      <div
                        className={`relative z-10 w-2 h-2 rounded-full transition-colors duration-300 ${!skipAnimation ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" : "bg-slate-600"}`}
                      />
                    </div>

                    {/* The Text */}
                    <div
                      className={`flex pl-8 pr-3 whitespace-nowrap transition-opacity duration-300 ${isToggleExpanded ? "opacity-100 delay-0" : "opacity-0 group-hover:opacity-100 delay-100"}`}
                    >
                      <span
                        className={`text-[9px] font-sans font-bold tracking-widest uppercase transition-colors duration-300 ${!skipAnimation ? "text-amber-400" : "text-slate-500"}`}
                      >
                        {!skipAnimation ? "Cinematic" : "Instant"}
                      </span>
                    </div>
                  </m.button>
                </m.div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* 3. DEDICATED WEAPON DETAILS SLIDER (CINEMATIC UPGRADE) */}
        <AnimatePresence mode="wait">
          {selectedWeapon && isArmoryOpen && (
            <m.div
              key={selectedWeapon.id}
              className="fixed inset-0 z-[150] pointer-events-none flex justify-end"
            >
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedWeapon(null)}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto"
              />
              <m.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="relative w-full sm:w-[500px] h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0703] to-black border-l border-[#8b5a2b]/40 shadow-[-30px_0_80px_rgba(0,0,0,1)] pointer-events-auto overflow-y-auto"
              >
                <m.div
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
                    <m.div
                      variants={{
                        hidden: { y: -20, opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                      }}
                      className="w-full flex justify-center mb-8"
                    >
                      <div className="relative w-full aspect-square max-h-[340px] rounded-lg overflow-hidden border border-[#a67c47]/40 shadow-[0_15px_40px_rgba(0,0,0,0.8)] bg-black">
                        <img
                          src={selectedWeapon.image}
                          alt={selectedWeapon.name}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                        {/* Elegant dark fade at the bottom so it blends smoothly into the text */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0703] via-transparent to-transparent opacity-90" />
                      </div>
                    </m.div>
                    <m.h2
                      variants={{
                        hidden: { y: 20, opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                      }}
                      className="text-4xl sm:text-5xl font-serif font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-400 to-amber-700 text-center mb-4 drop-shadow-[0_5px_15px_rgba(0,0,0,1)]"
                    >
                      {selectedWeapon.name}
                    </m.h2>
                    <m.div
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
                    </m.div>
                  </div>
                  <m.div
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      visible: { y: 0, opacity: 1 },
                    }}
                    className="relative flex-grow bg-black/40 border border-[#8b5a2b]/20 rounded-xl p-8 text-slate-300 leading-relaxed shadow-[inset_0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-sm"
                  >
                    <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#a67c47]/40 rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#a67c47]/40 rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[#a67c47]/40 rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#a67c47]/40 rounded-br-xl" />
                    <p className="relative z-10 font-serif font-light text-justify tracking-wide text-sm leading-8 first-letter:text-5xl first-letter:font-black first-letter:text-amber-500 first-letter:float-left first-letter:mr-3 first-letter:mt-[-4px] drop-shadow-md">
                      {selectedWeapon.description}
                    </p>
                  </m.div>
                </m.div>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      </>
    </LazyMotion>
  );
}
