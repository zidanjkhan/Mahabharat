// src/components/RelationshipLines.js
"use client";

// Horizontal Line (Left to Right)
export function HLine({ x, y, width, dotted = false }) {
  return (
    <div
      // CHANGED: Removed -z-10, added z-0. Brightened the solid line to bg-slate-500.
      className={`absolute z-0 ${
        dotted
          ? "border-b-2 border-dotted border-emerald-500"
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
export function VLine({ x, y, height, dotted = false }) {
  return (
    <div
      // CHANGED: Removed -z-10, added z-0. Brightened the solid line to bg-slate-500.
      className={`absolute z-0 ${
        dotted
          ? "border-l-2 border-dotted border-emerald-500"
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
