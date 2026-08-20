// src/app/page.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Place from "../components/Place";
import MapHoverPin from "../components/MapHoverPin";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import FloatingMenu from "../components/FloatingMenu";
import FamilyTreeModal from "../components/FamilyTreeModal";
import RegionLorePanel from "../components/RegionLorePanel";
import GlobalSearchModal from "../components/GlobalSearchModal"; 
import CinematicCardDeck from "../components/CinematicCardDeck";
import ChapterDrawer from "../components/ChapterDrawer"; 
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { timelineData } from "../data/scriptures";
import { mapLocations } from "../data/mapLocations";
import { kurukshetraWarData } from "../data/kurukshetraData";

// Dedicated map content component (Strictly PC/Desktop mode)
function MapContent({
  setShowSidebar,
  setHoveredRegion,
  currentData,
}) {
  return (
    <div className="relative w-[3840px] h-[2160px]">
      <Image
        src="/MapMain.png"
        alt="Map of Aryavarta"
        fill
        className="object-cover opacity-80 contrast-125 saturate-50"
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
            onMouseEnter={() => setHoveredRegion(pin)}
            onMouseLeave={() => setHoveredRegion(null)}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [activeEra, setActiveEra] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [isMapHovered, setIsMapHovered] = useState(false);
  const [showFamilyTree, setShowFamilyTree] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); 

  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [initialScale, setInitialScale] = useState(0.5);

  // Dynamically calculate scale so the massive map fits mobile screens perfectly on load
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setInitialScale(0.22); // Perfect fit for small phones
      } else if (width < 1024) {
        setInitialScale(0.35); // Tablets
      } else {
        setInitialScale(0.5);  // Desktop
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // KURUKSHETRA WAR MODE STATE
  const [isWarMode, setIsWarMode] = useState(false);
  const [warDayIndex, setWarDayIndex] = useState(0);

  // Choose data source based on whether war mode is active
  const currentData = isWarMode 
    ? { ...kurukshetraWarData[warDayIndex], pins: [] } 
    : timelineData[activeEra];

  const handleSearchResultSelect = (item) => {
    if (item.type === "chapter") {
      setActiveEra(item.index);
      setIsWarMode(false);
      setShowSidebar(true);
      setShowPopup(false);
    } else if (item.type === "location") {
      setHoveredRegion(item.data);
    } else if (item.type === "character") {
      setSelectedCharacter(item.data);
      setShowFamilyTree(true);
    }
  };

  const handleSelectChapter = (index) => {
    if (isWarMode) {
      setWarDayIndex(index);
    } else {
      setActiveEra(index);
    }
  };

  const handleDrawerSelectChapter = (index) => {
    handleSelectChapter(index);
    setShowSidebar(true);
  };

  return (
    <main className="w-full h-[100dvh] bg-slate-950 overflow-hidden flex items-center justify-center touch-none relative text-slate-200">
      
      {/* MAP STAYS UNTOUCHED IN THE BACKGROUND */}
      <div
        className="absolute inset-0 z-0 w-full h-full"
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
          <TransformComponent wrapperStyle={{ width: "100vw", height: "100vh" }}>
            <MapContent
              setShowSidebar={setShowSidebar}
              setHoveredRegion={setHoveredRegion}
              currentData={currentData}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>

      {/* BACKGROUND CLICK DETECTOR TO CLOSE DRAWER WHEN CLICKING OUTSIDE */}
      {isDrawerOpen && (
        <div 
          className="absolute inset-0 z-35 bg-transparent pointer-events-auto"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      <RegionLorePanel
        selectedRegion={hoveredRegion}
        setHoveredRegion={setHoveredRegion}
      />

      <Navbar
        isMapHovered={isMapHovered}
        showSidebar={showSidebar}
        showPopup={showPopup}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* FLOATING MENU */}
      <FloatingMenu 
        setShowFamilyTree={setShowFamilyTree} 
        setShowDrawer={setIsDrawerOpen} 
      />

      {/* SIDEBAR */}
      <Sidebar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        currentData={currentData}
        isWarMode={isWarMode}
        hasPrevChapter={activeEra > 0}
        hasNextChapter={activeEra < timelineData.length - 1}
        onPrevChapter={() => {
          if (activeEra > 0) {
            setActiveEra(activeEra - 1);
            setShowPopup(false);
          }
        }}
        onNextChapter={() => {
          if (activeEra < timelineData.length - 1) {
            setActiveEra(activeEra + 1);
            setShowPopup(false);
          }
        }}
        onOpenKurukshetra={(dayIdx = 0) => {
          setIsWarMode(true);
          setWarDayIndex(dayIdx);
          setShowSidebar(true);
        }}
        onSwitchBackToChapters={() => {
          setIsWarMode(false);
          setActiveEra(0);
        }}
      />

      {/* CINEMATIC CARD DECK AT THE BOTTOM */}
      <CinematicCardDeck
        chapters={isWarMode ? kurukshetraWarData : timelineData}
        currentChapterIndex={isWarMode ? warDayIndex : activeEra}
        onSelectChapter={handleSelectChapter}
        isWarMode={isWarMode}
        onEnterWar={() => {
          setIsWarMode(true);
          setWarDayIndex(0);
        }}
        onSwitchBackToChapters={() => setIsWarMode(false)}
        onOpenSidebar={() => setShowSidebar(true)}
      />

      {/* STANDALONE CHAPTER DRAWER MODAL */}
      <ChapterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        chapters={isWarMode ? kurukshetraWarData : timelineData}
        currentChapterIndex={isWarMode ? warDayIndex : activeEra}
        onSelectChapter={(index) => {
          handleDrawerSelectChapter(index);
        }}
        onEnterWar={() => {
          setIsWarMode(true);
          setWarDayIndex(0);
          setShowSidebar(true);
        }}
      />

      <FamilyTreeModal
        showFamilyTree={showFamilyTree}
        setShowFamilyTree={setShowFamilyTree}
        selectedCharacter={selectedCharacter}
        setSelectedCharacter={setSelectedCharacter}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSearchResultSelect}
      />
    </main>
  );
}
