// src/app/page.js
"use client";

import { useState, useEffect, useRef } from "react";
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
import MapAnimationOverlay from "@/components/MapAnimationOverlay";

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
  activeEra,
  warDayIndex,
}) {
  // Updated: Allow previous pin tracking during war mode using kurukshetraWarData as well
  const previousPin = isWarMode
    ? (warDayIndex > 0 ? kurukshetraWarData[warDayIndex - 1]?.pins?.[0] : null)
    : (!isWarMode && activeEra > 0 ? timelineData[activeEra - 1]?.pins?.[0] : null);

  return (
    <div className="relative w-[3840px] h-[2160px]">
      <img
        src="/MainMap1.png"
        alt="Map of Aryavarta"
        className="absolute inset-0 w-full h-full object-cover opacity-80 contrast-125 saturate-50"
        style={{ imageRendering: "-webkit-optimize-contrast" }}
      />
      <WarAtmosphereOverlay isWarMode={isWarMode} />

      {/* Map Animation Overlay now lives inside the canvas container to track map scaling and panning */}
      <MapAnimationOverlay
        currentData={currentData}
        previousPin={previousPin}
        isWarMode={isWarMode}
        warDayIndex={warDayIndex}
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
            onMouseEnter={() => setHoveredRegion(pin)}
            onMouseLeave={() => setHoveredRegion(null)}
          />
        ))}

        {/* 2. SLIDER-DRIVEN PINS */}
        {currentData?.pins && currentData.pins.map((pin, index) => (
          <Place
            key={`slider-pin-${index}`}
            name={pin.name}
            top={pin.top}
            left={pin.left}
            size={pin.size}
            color={pin.color}
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

  const transformComponentRef = useRef(null);
  const [isCardExpanded, setIsCardExpanded] = useState(false);

  // Dynamically calculate scale so the massive map fits mobile screens perfectly on load
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setInitialScale(0.22);
      } else if (width < 1024) {
        setInitialScale(0.35);
      } else {
        setInitialScale(0.5);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // KURUKSHETRA WAR MODE STATE
  const [isWarMode, setIsWarMode] = useState(false);
  const [warDayIndex, setWarDayIndex] = useState(0);

  // Choose data source based on whether war mode is active (Preserve pins if they exist in kurukshetraWarData)
  const currentData = isWarMode
    ? kurukshetraWarData[warDayIndex]
    : timelineData[activeEra];

  // Dynamic Map Pan & Focus Effect (Separate mobile layout adjustment for top-offset & broader zoom-out)
  useEffect(() => {
    const activePin =
      currentData?.pins && currentData.pins.length > 0
        ? currentData.pins[0]
        : null;

    if (transformComponentRef.current && activePin) {
      const { setTransform } = transformComponentRef.current;

      const mapWidth = 3840;
      const mapHeight = 2160;

      const pinPixelX = (activePin.left / 100) * mapWidth;
      const pinPixelY = (activePin.top / 100) * mapHeight;

      const isPhone = window.innerWidth < 1024;

      // Make targetScale wider/more zoomed-out on mobile so animations have breathing room
      const targetScale = 0.75;

      const windowX = window.innerWidth / 2;
      // If it's a phone, shift windowY higher up (e.g., 28% from top instead of 50% center) so the pin rests higher
      const windowY = isCardExpanded ? window.innerHeight * 0.27 : window.innerHeight / 2;

      const targetX = windowX - pinPixelX * targetScale;
      const targetY = windowY - pinPixelY * targetScale;

      setTransform(targetX, targetY, targetScale, 5000, "easeOut");
    }
  }, [activeEra, warDayIndex, isWarMode, isCardExpanded]);

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
    <main className="w-full h-[100dvh] bg- overflow-hidden flex items-center justify-center touch-none relative text-slate-200">
      {/* MAP CONTAINER */}

      <div
        className="absolute inset-0 z-0 w-full h-full bg-slate-950 overflow-hidden"
        onMouseEnter={() => setIsMapHovered(true)}
        onMouseLeave={() => setIsMapHovered(false)}
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/map-background.png" 
            alt="Ancient Leather Backdrop"
            fill
            priority
            className="object-cover opacity-90"
          />
        </div>
        <TransformWrapper
          ref={transformComponentRef}
          initialScale={initialScale}
          minScale={0.45}
          maxScale={4}
          centerOnInit={true}
          limitToBounds={true}
          alignmentAnimation={{ disabled: false }}
        >
          <TransformComponent
            wrapperStyle={{
              width: "100vw",
              height: "100vh",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            contentStyle={{ width: "3840px", height: "2160px" }}
          >
            <MapContent
              setShowSidebar={setShowSidebar}
              setHoveredRegion={setHoveredRegion}
              currentData={currentData}
              isWarMode={isWarMode}
              activeEra={activeEra}
              warDayIndex={warDayIndex}
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
        onExpandChange={setIsCardExpanded}
      />

      <ChapterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        isWarMode={isWarMode}
        chapters={isWarMode ? kurukshetraWarData : timelineData}
        currentChapterIndex={isWarMode ? warDayIndex : activeEra}
        onSelectChapter={(index) => {
          handleDrawerSelectChapter(index);
        }}
        onEnterWar={() => {
          setIsWarMode(true);
          setWarDayIndex(0);
          setIsDrawerOpen(false);
          setShowSidebar(false);
        }}
        onExitWar={() => {
          setIsWarMode(false);
          setIsDrawerOpen(false);
          setShowSidebar(false);
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