// src/components/WaveTimelineSlider.js
"use client";

import { useState, useRef, useEffect } from "react";

export default function WaveTimelineSlider({ chapters, currentChapterIndex, onSelectChapter }) {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [mouseX, setMouseX] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Measure container width cleanly on mount and resize
  useEffect(() => {
    if (!containerRef.current) return;
    setContainerWidth(containerRef.current.offsetWidth);

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current || containerWidth === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setMouseX(x);

    const step = containerWidth / (chapters.length + 1);
    let closestIndex = null;
    let minDistance = Infinity;

    chapters.forEach((_, index) => {
      const dotX = step * (index + 1);
      const distance = Math.abs(x - dotX);
      if (distance < minDistance && distance < 60) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setHoveredIndex(closestIndex);
  };

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-full h-16 z-40 flex items-center px-6 pointer-events-auto">
      
      {/* Track Container spanning full width with background removed */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setMouseX(null);
          setHoveredIndex(null);
        }}
        className="relative w-full h-full flex items-center justify-between cursor-pointer"
      >
        {/* Base Connecting Line */}
        <div className="absolute inset-x-2 h-[2px] bg-amber-500/30 z-0 shadow-[0_0_10px_rgba(245,158,11,0.2)]" />

        {chapters.map((chapter, index) => {
          let scale = 1;
          let translateY = 0;

          if (mouseX !== null && containerWidth > 0) {
            const dotX = (containerWidth / (chapters.length + 1)) * (index + 1);
            const distance = Math.abs(mouseX - dotX);
            const maxDist = 90; // Wave ripple influence radius

            if (distance < maxDist) {
              const factor = Math.cos((distance / maxDist) * (Math.PI / 2));
              scale = 1 + factor * 1.2; 
              translateY = -factor * 10; 
            }
          }

          const isSelected = currentChapterIndex === index;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={index}
              onClick={() => onSelectChapter(index)}
              className="relative z-10 flex flex-col items-center group"
              style={{
                transform: `translateY(${translateY}px) scale(${scale})`,
                transition: mouseX === null ? "all 0.3s ease-out" : "none",
              }}
            >
              {/* Floating Transparent Tooltip on Hover/Selection */}
              {(isSelected) && (
                <div className="absolute -top-10 px-3 py-1 bg-[#070b14]/70 border border-amber-500/30 z-20 backdrop-blur-md rounded text-amber-400 text-[10px] uppercase tracking-widest whitespace-nowrap shadow-xl pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                  {chapter.title || `Chapter ${index + 1}`}
                </div>
              )}
              {(isHovered) && (
                <div className="absolute -top-10 px-3 py-1 bg-[#070b14]/30 border border-amber-500/30 backdrop-blur-md rounded text-white text-[10px] uppercase tracking-widest whitespace-nowrap shadow-xl pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                  {chapter.title || `Chapter ${index + 1}`}
                </div>
              )}

              {/* Smaller resting chapter dot */}
              <div
                className={`rounded-full border transition-colors duration-200 ${
                  isSelected
                    ? "w-3.5 h-3.5 bg-amber-400 border-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.9)]"
                    : isHovered
                    ? "w-3.5 h-3.5 bg-amber-300 border-amber-100 shadow-[0_0_10px_rgba(251,191,36,0.7)]"
                    : "w-2.5 h-2.5 bg-slate-950 border-amber-500/50"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}