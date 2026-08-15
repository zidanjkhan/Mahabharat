// src/components/RegionLorePanel.js
"use client";

export default function RegionLorePanel({ selectedRegion }) {
  // If no region is hovered, we can either hide it or show a default "Explore Aryavarta" prompt
  if (!selectedRegion) {
    return (
      <div className="absolute top-24 left-6 z-40 w-96 p-6 bg-[#070b14]/80 backdrop-blur-md border border-amber-600/20 rounded-lg shadow-2xl pointer-events-none transition-all duration-500 opacity-60">
        <h3 className="text-amber-500 font-serif text-lg tracking-widest uppercase mb-2">
          Aryavarta Realm
        </h3>
        <p className="text-slate-400 text-sm font-serif leading-relaxed">
          Hover over any illuminated kingdom on the map to reveal its ancient
          history, lore, and strategic significance.
        </p>
      </div>
    );
  }

  return (
    <div className="absolute top-24 left-6 z-40 w-96 p-6 bg-[#070b14]/90 backdrop-blur-md border border-amber-500/40 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] pointer-events-none transition-all duration-300 animate-fadeIn">
      {/* Region Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <h3 className="text-amber-400 font-serif font-bold text-xl tracking-widest uppercase">
          {selectedRegion.name}
        </h3>
        <span className="text-xs font-mono text-amber-600 uppercase tracking-wider px-2 py-0.5 border border-amber-600/30 rounded">
          Kingdom
        </span>
      </div>

      {/* History / Fun Facts description */}
      <p className="text-slate-300 text-sm font-serif leading-relaxed">
        {selectedRegion.description ||
          "A cornerstone kingdom of the Mahabharat epic, witnessing critical councils, royal coronations, and pivotal shifts in dharma."}
      </p>
    </div>
  );
}
