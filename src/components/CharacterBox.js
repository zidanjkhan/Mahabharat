// src/components/CharacterBox.js
"use client";

import { useState } from "react";

export default function CharacterBox({ 
  name, 
  title, 
  description, 
  gender = "male", 
  x, 
  y, 
  imageUrl,
  variant = "default",
  width,
  height,
  onSelect,
  activeMobileCharacter,
  setActiveMobileCharacter
}) {
  const [hovered, setHovered] = useState(false);
  const isMobileActive = activeMobileCharacter === name;

  const genderColors = {
    male: "border-blue-600/50 text-blue-400 group-hover:border-blue-400",
    female: "border-pink-600/50 text-pink-400 group-hover:border-pink-400",
  };

  const variantStyles = {
    divine: "border-cyan-400/80 text-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.4)] animate-pulse [animation-duration:3s]",
    commander: "border-amber-500/80 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)]",
    default: genderColors[gender] || genderColors.male,
  };

  const handleClick = (e) => {
    e.stopPropagation();
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    if (isTouchDevice) {
      if (!isMobileActive) {
        // First tap on mobile: Open this character, automatically close others
        if (setActiveMobileCharacter) setActiveMobileCharacter(name);
      } else {
        // Second tap on mobile: Open sidebar profile
        if (onSelect) onSelect({ name, title, description, imageUrl, gender });
        if (setActiveMobileCharacter) setActiveMobileCharacter(null);
      }
    } else {
      // PC Click: Open sidebar profile immediately
      if (onSelect) onSelect({ name, title, description, imageUrl, gender });
    }
  };

  const isVisible = hovered || isMobileActive;

  return (
    <div 
      className={`absolute group cursor-pointer flex items-center justify-center transition-all duration-300 ${
        isVisible ? "z-50 scale-180" : "z-20 scale-100"
      }`}
      style={{ 
        left: `${x}px`, 
        top: `${y}px`, 
        transform: 'translate(-50%, -50%)', 
        width: width || '160px', 
        height: height || '225px' 
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      
      {/* THE CHARACTER NODE */}
      <div className={`w-full h-full bg-[#0f172a]/95 backdrop-blur-md border-2 rounded-lg shadow-2xl flex flex-col justify-end p-3 ${variantStyles[variant]} transition-all duration-300 ease-in-out ${
        isVisible ? "bg-[#1e293b]" : "group-hover:bg-[#1e293b]"
      } overflow-hidden relative`}>
        
        {variant === "divine" && (
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/80 via-transparent to-cyan-500/20 pointer-events-none animate-pulse"></div>
        )}

        {variant === "commander" && (
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950/80 via-transparent to-amber-500/20 pointer-events-none"></div>
        )}

        {imageUrl && (
          <div className="absolute inset-0 opacity-60 transition-all">
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#070b14] via-[#070b14]/80 to-transparent pointer-events-none"></div>

        <span className="font-bold text-center text-xs tracking-widest uppercase z-10 drop-shadow-[0_2px_6px_rgba(0,0,0,1)] text-slate-100 pb-1">
          {name}
        </span>
      </div>

      {/* TOOLTIP: Appears on PC hover or Mobile first tap */}
      <div className={`absolute left-[110%] top-1/2 -translate-y-1/2 w-80 bg-[#070b14]/95 border border-amber-500/60 backdrop-blur-md rounded-lg p-5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] transition-all duration-300 pointer-events-none z-50 ${
        isVisible ? "opacity-100 visible" : "opacity-0 invisible"
      }`}>
        <div className="text-amber-400 text-xs font-extrabold uppercase tracking-widest mb-2 border-b border-slate-800 pb-2">
          {title}
        </div>
        <div className="text-slate-200 text-sm leading-relaxed font-serif line-clamp-3">
          {description}
        </div>
        
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-[8px] border-transparent border-r-[#070b14]"></div>
      </div>
    </div>
  );
}