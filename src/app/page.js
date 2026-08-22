// src/app/page.js
"use client";

import { useState, useEffect, useRef } from "react"; // <-- ADDED: useRef imported for map focusing
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
import WarAtmosphereOverlay from "../components/WarAtmosphereOverlay";

// Dedicated map content component (Strictly PC/Desktop mode)
function MapContent({
  setShowSidebar,
  setHoveredRegion,
  currentData,
  isWarMode,
}) {
  return (
    <div className="relative w-[3840px] h-[2160px]">
      <img
        src="/MainMap1.png"
        alt="Map of Aryavarta"
        // REMOVED `fill` from here
        className="absolute inset-0 w-full h-full object-cover opacity-80 contrast-125 saturate-50"
        style={{ imageRendering: "-webkit-optimize-contrast" }}
      />
      <WarAtmosphereOverlay isWarMode={isWarMode} />
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

  // --- ADDED: Reference to control zoom & pan programmatically ---
  const transformComponentRef = useRef(null);

  // Dynamically calculate scale so the massive map fits mobile screens perfectly on load
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setInitialScale(0.22); // Perfect fit for small phones
      } else if (width < 1024) {
        setInitialScale(0.35); // Tablets
      } else {
        setInitialScale(0.5); // Desktop
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

  // --- ADDED: Dynamic Map Subtle Pan & Center Focus Effect ---
  useEffect(() => {
    // Check if the current chapter/day has a designated active pin coordinate
    const activePin =
      currentData.pins && currentData.pins.length > 0
        ? currentData.pins[0]
        : null;

    if (transformComponentRef.current && activePin) {
      const { setTransform } = transformComponentRef.current;

      // Map canvas total dimensions are 3840px by 2160px
      const mapWidth = 3840;
      const mapHeight = 2160;

      // Calculate pixel coordinates from percentage pins
      const pinPixelX = (activePin.left / 100) * mapWidth;
      const pinPixelY = (activePin.top / 100) * mapHeight;

      // Balanced zoom scale (0.85 gives a clean overview while perfectly centering the pin)
      const targetScale = 0.85;

      // Compute window center offset to center the pin on screen seamlessly
      const windowX = window.innerWidth / 2;
      const windowY = window.innerHeight / 2;

      const targetX = windowX - pinPixelX * targetScale;
      const targetY = windowY - pinPixelY * targetScale;

      // Smoothly animate the map camera to the target position and scale
      setTransform(targetX, targetY, targetScale, 600, "easeOut");
    }
  }, [activeEra, warDayIndex, isWarMode]);

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
        {/* --- ADDED: ref attached to TransformWrapper for dynamic zooming & panning --- */}
        <TransformWrapper
          ref={transformComponentRef}
          initialScale={0.5}
          minScale={0.5}
          maxScale={4}
          centerOnInit={true}
          limitToBounds={true}
        >
          <TransformComponent
            wrapperStyle={{ width: "100vw", height: "100vh" }}
          >
            <MapContent
              setShowSidebar={setShowSidebar}
              setHoveredRegion={setHoveredRegion}
              currentData={currentData}
              isWarMode={isWarMode}
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
