// src/app/page.js
"use client";

import { useState } from "react";
import Image from "next/image";
import WaveTimelineSlider from "../components/WaveTimelineSlider"; // NEW WAVY SLIDER
import Place from "../components/Place";
import MapHoverPin from "../components/MapHoverPin";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import FloatingMenu from "../components/FloatingMenu";
import FamilyTreeModal from "../components/FamilyTreeModal";
import RegionLorePanel from "../components/RegionLorePanel";
import {
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";

import { timelineData } from "../data/scriptures";
import { mapLocations } from "../data/mapLocations";

export default function Home() {
  const [activeEra, setActiveEra] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [isMapHovered, setIsMapHovered] = useState(false);
  const [showFamilyTree, setShowFamilyTree] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const currentData = timelineData[activeEra];

  // Handler for your new Wavy Timeline Slider (triggers chapter selection & sidebar)
  const handleSelectChapter = (index) => {
    setActiveEra(index);
    setShowSidebar(true);
    setShowPopup(false);
  };

  return (
    <main className="w-screen h-screen bg-slate-950 overflow-hidden flex items-center justify-center touch-none relative text-slate-200">
      
      <div
        className="absolute inset-0 z-0"
        onMouseEnter={() => setIsMapHovered(true)}
        onMouseLeave={() => setIsMapHovered(false)}
      >
        <TransformWrapper
          initialScale={0.5}
          minScale={0.5}
          maxScale={4}
          centerOnInit={true}
          limitToBounds={true}
        >
          <TransformComponent
            wrapperStyle={{ width: "100vw", height: "100vh" }}
          >
            <div className="relative w-[3840px] h-[2160px]">
              <Image
                src="/MapMain.png"
                alt="Map of Aryavarta"
                fill
                className="object-cover opacity-40 contrast-125 saturate-50"
                priority
              />
              <div className="absolute inset-0 z-10">
                
                {/* 1. INDEPENDENT MAP HOVER LOCATIONS */}
                {mapLocations.map((pin) => (
                  <MapHoverPin
                    key={pin.id}
                    name={pin.name}
                    top={pin.top}
                    left={pin.left}
                    size={pin.size}
                    color={pin.color}
                    onClick={() => setShowSidebar(true)}
                    onMouseEnter={() => setHoveredRegion(pin)}
                    onMouseLeave={() => setHoveredRegion(null)}
                  />
                ))}

                {/* 2. SLIDER-DRIVEN PINS */}
                {currentData.pins.map((pin, index) => (
                  <Place
                    key={`slider-pin-${index}`}
                    name={pin.name}
                    top={pin.top}
                    left={pin.left}
                    size={pin.size}
                    color={pin.color}
                    onClick={() => setShowSidebar(true)}
                  />
                ))}

              </div>
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>

      <RegionLorePanel selectedRegion={hoveredRegion} />

      <Navbar
        isMapHovered={isMapHovered}
        showSidebar={showSidebar}
        showPopup={showPopup}
      />

      <FloatingMenu setShowFamilyTree={setShowFamilyTree} />

      <Sidebar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        currentData={currentData}
      />

      {/* NEW INTERACTIVE WAVY TIMELINE SLIDER */}
      <WaveTimelineSlider
        chapters={timelineData}
        currentChapterIndex={activeEra}
        onSelectChapter={handleSelectChapter}
      />

      <FamilyTreeModal
        showFamilyTree={showFamilyTree}
        setShowFamilyTree={setShowFamilyTree}
      />

    </main>
  );
}