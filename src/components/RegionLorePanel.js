// src/components/RegionLorePanel.jsx
"use client";

export default function RegionLorePanel({ selectedRegion, setHoveredRegion }) {
  if (!selectedRegion) return null;

  return (
    <div 
      className="absolute top-6 left-6 z-40 w-80 sm:w-[420px] max-w-[90vw] pointer-events-auto animate-in fade-in slide-in-from-top-6 duration-300"
      onMouseEnter={() => {
        if (setHoveredRegion) setHoveredRegion(selectedRegion);
      }}
      onMouseLeave={() => {
        if (setHoveredRegion) setHoveredRegion(null);
      }}
    >
      {/* Main Container Wrapper with rich drop shadow and pure organic shape outline */}
      <div className="relative w-full p-8 sm:p-10 flex flex-col justify-between min-h-[260px] filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.95)]">
        
        {/* Custom Parchment Image Asset (Transparent edges intact with no blocky background) */}
        <img
          src="/paper.png"
          alt="Ancient Region Parchment"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10"
        />

        {/* Content Layer */}
        <div className="relative z-20 flex flex-col h-full">
          
          {/* Header Section with Tag */}
          <div className="flex justify-between items-center border-b border-[#5c351b]/40 pb-2 mb-3">
            <h3 className="text-[#3b1505] font-serif font-black text-xl sm:text-2xl uppercase tracking-wider">
              {selectedRegion.name}
            </h3>
            <span className="text-[10px] font-bold font-serif uppercase tracking-[0.2em] px-2 py-1 bg-[#5c351b]/15 border border-[#5c351b]/30 text-[#5c351b] rounded">
              Kingdom
            </span>
          </div>

          {/* Description Body */}
          <div className="font-serif text-xs sm:text-sm leading-relaxed text-[#261005] font-medium text-justify overflow-y-auto max-h-[180px] pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#5c3a21]/40 [&::-webkit-scrollbar-thumb]:rounded-full">
            {selectedRegion.description || "A peaceful, agrarian, and well-governed region steeped in epic lore and historic encounters of the great era."}
          </div>

        </div>
      </div>
    </div>
  );
}