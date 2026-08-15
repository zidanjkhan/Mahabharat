// src/components/Place.js

"use client";



export default function Place({

  name,

  top,

  left,

  size = "md",

  color = "amber",

  onClick,

}) {

  // 1. TACTICAL SIZES

  const sizeClasses = {

    sm: "w-16 h-16",

    md: "w-24 h-24",

    lg: "w-32 h-32",

    xl: "w-48 h-48",

  };



  // 2. GLOW COLORS

  const colorStyles = {

    amber: {

      ping: "bg-amber-500/40",

      base: "bg-amber-500/10 group-hover:bg-amber-500/40 group-hover:scale-110",

      text: "text-amber-500 border-amber-600/40",

    },

    red: {

      ping: "bg-red-500/40",

      base: "bg-red-500/10 group-hover:bg-red-500/40 group-hover:scale-110",

      text: "text-red-500 border-red-600/40",

    },

    blue: {

      ping: "bg-blue-500/40",

      base: "bg-blue-500/10 group-hover:bg-blue-500/40 group-hover:scale-110",

      text: "text-blue-500 border-blue-600/40",

    },

    emerald: {

      ping: "bg-emerald-500/40",

      base: "bg-emerald-500/10 group-hover:bg-emerald-500/40 group-hover:scale-110",

      text: "text-emerald-500 border-emerald-600/40",

    },

  };



  const selectedSize = sizeClasses[size] || sizeClasses.md;

  const selectedColor = colorStyles[color] || colorStyles.amber;



  return (

    <div

      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 flex flex-col items-center justify-center ${selectedSize}`}

      style={{ top: `${top}%`, left: `${left}%` }}

      onClick={onClick}

    >

      {/*

        THE SLOW EXPANDING GLOW

        Added [animation-duration:3s] to slow the pulse down significantly.

      */}

      <div

        className={`absolute inset-0 rounded-full animate-ping [animation-duration:2s] blur-sm opacity-100 ${selectedColor.ping}`}

      ></div>



      {/* THE STATIC AURA */}

      <div

        className={`absolute inset-2 rounded-full blur-sm transition-all duration-300 ${selectedColor.base}`}

      ></div>



      {/* THE FLOATING LABEL */}

      <div className="absolute top-[110%] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30">

        <span

          className={`bg-[#0b1120]/95 font-serif tracking-widest px-4 py-1.5 rounded border text-xl sm:text-5xl whitespace-nowrap shadow-[0_4px_15px_rgba(0,0,0,0.8)] backdrop-blur-md uppercase ${selectedColor.text}`}

        >

          {name}

        </span>

      </div>

    </div>

  );

}