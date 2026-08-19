import React, { useState } from "react";
import { kurukshetraWarData } from "@/data/kurukshetraData";

export default function KurukshetraSlider({ initialDayIndex = 0, onBackToSidebar }) {
  const [currentIndex, setCurrentIndex] = useState(initialDayIndex);
  const [showDeepLore, setShowDeepLore] = useState(false);

  const currentDay = kurukshetraWarData[currentIndex];

  const handleNext = () => {
    if (currentIndex < kurukshetraWarData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowDeepLore(false); // Reset to summary when switching days
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowDeepLore(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-3xl mx-auto">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-4">
        <button
          onClick={onBackToSidebar}
          className="text-sm font-medium text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
        >
          &larr; Back to Sidebar Menu
        </button>
        <span className="text-xs uppercase tracking-widest px-3 py-1 bg-red-900 text-white rounded-full font-semibold">
          Kurukshetra War Chronicles
        </span>
      </div>

      {/* Main Card Container */}
      <div className="w-full bg-[#f4ebd0] border-2 border-[#d4b996] p-8 rounded-lg shadow-md flex flex-col justify-between min-h-[350px]">
        <div>
          <div className="flex justify-between items-center border-b border-[#d4b996] pb-3 mb-4">
            <span className="text-sm font-bold uppercase tracking-widest text-red-800">
              {currentDay.era}
            </span>
            <span className="text-xs text-gray-600">
              Day {currentIndex + 1} of {kurukshetraWarData.length}
            </span>
          </div>

          <h2 className="text-2xl font-serif text-gray-900 mb-4">
            {currentDay.title}
          </h2>

          {/* Toggle between Summary and Deep Lore */}
          {!showDeepLore ? (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                Summary
              </h3>
              <p className="text-gray-800 font-serif leading-relaxed text-base">
                {currentDay.summary}
              </p>
              <button
                onClick={() => setShowDeepLore(true)}
                className="mt-4 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-sm font-medium rounded transition cursor-pointer"
              >
                Read Deep Lore &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                Deep Lore
              </h3>
              <p className="text-gray-900 font-serif leading-relaxed text-base whitespace-pre-line">
                {currentDay.deepLore}
              </p>
              <button
                onClick={() => setShowDeepLore(false)}
                className="mt-4 px-4 py-2 bg-[#d4b996] hover:bg-[#c2a47e] text-gray-900 text-sm font-medium rounded transition cursor-pointer"
              >
                &larr; Back to Summary
              </button>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-[#d4b996]">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded font-medium transition cursor-pointer ${
              currentIndex === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#d4b996] hover:bg-[#c2a47e] text-gray-900"
            }`}
          >
            Previous Day
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === kurukshetraWarData.length - 1}
            className={`px-4 py-2 rounded font-medium transition cursor-pointer ${
              currentIndex === kurukshetraWarData.length - 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-900 hover:bg-red-950 text-white"
            }`}
          >
            Next Day
          </button>
        </div>
      </div>

      {/* Slider Indicator Dots */}
      <div className="flex items-center gap-2 mt-6 overflow-x-auto max-w-xl py-2">
        {kurukshetraWarData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setShowDeepLore(false);
            }}
            className={`w-3 h-3 rounded-full transition cursor-pointer ${
              currentIndex === idx ? "bg-red-900 scale-125" : "bg-gray-300"
            }`}
            title={`Day ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}