// src/components/RelationshipLines.js
"use client";

// Horizontal Line (Left to Right)
export function HLine({ x, y, width, dotted = false, divine = false }) {
  return (
    <div
      className={`absolute z-0 ${
        dotted
          ? divine
            ? "border-b-2 border-dotted border-amber-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
            : "border-b-2 border-dotted border-emerald-500"
          : "h-[2px] bg-slate-500"
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        transform: "translateY(-50%)",
      }}
    />
  );
}

// Vertical Line (Top to Bottom)
export function VLine({ x, y, height, dotted = false, divine = false }) {
  return (
    <div
      className={`absolute z-0 ${
        dotted
          ? divine
            ? "border-l-2 border-dotted border-amber-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
            : "border-l-2 border-dotted border-emerald-500"
          : "w-[2px] bg-slate-500"
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        height: `${height}px`,
        transform: "translateX(-50%)",
      }}
    />
  );
}