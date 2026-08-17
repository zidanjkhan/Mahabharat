// src/components/GlobalSearchModal.js
"use client";

import { useState, useMemo } from "react";
import { getSearchableItems } from "../data/searchIndex";

export default function GlobalSearchModal({ isOpen, onClose, onSelectResult }) {
  const [query, setQuery] = useState("");
  const allItems = useMemo(() => getSearchableItems(), []);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    
    return allItems.filter(item => {
      const title = item.title ? String(item.title).toLowerCase() : "";
      const subtitle = item.subtitle ? String(item.subtitle).toLowerCase() : "";
      return title.includes(lowerQuery) || subtitle.includes(lowerQuery);
    }).slice(0, 8); // Limit to top 8 results
  }, [query, allItems]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 px-4">
      <div className="w-full max-w-2xl bg-[#070b14] border border-amber-500/40 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input Header */}
        <div className="flex items-center px-6 py-4 border-b border-amber-500/20">
          <svg className="w-5 h-5 text-amber-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search chapters, map locations, characters..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none font-serif tracking-wide"
          />
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-amber-400 text-xs font-mono uppercase px-2 py-1 border border-slate-700 rounded ml-2"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          {query.trim() && filteredItems.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs font-serif tracking-wider uppercase">
              No sacred texts or territories found matching &ldquo;{query}&rdquo;
            </div>
          )}

          {!query.trim() && (
            <div className="text-center py-8 text-slate-600 text-xs font-serif tracking-wider uppercase">
              Type to search across the Mahabharata matrix...
            </div>
          )}

          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectResult(item);
                onClose();
              }}
              className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-amber-500/10 border border-transparent hover:border-amber-500/30 cursor-pointer transition-all duration-150 group"
            >
              <div>
                <h4 className="text-amber-300 font-serif text-sm font-bold group-hover:text-amber-200 transition-colors">
                  {item.title}
                </h4>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                  {item.subtitle}
                </span>
              </div>
              <span className="text-amber-500/60 group-hover:translate-x-1 transition-transform text-xs">
                →
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}