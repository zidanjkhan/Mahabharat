// src/app/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

import Place from "../components/Place";
import MapHoverPin from "../components/MapHoverPin";
import Navbar from "../components/Navbar";
import FloatingMenu from "../components/FloatingMenu";
import CinematicCardDeck from "../components/CinematicCardDeck";
import IntroAnimation from "../components/IntroAnimation";
import WarAtmosphereOverlay from "../components/WarAtmosphereOverlay";
import MapAnimationOverlay from "@/components/MapAnimationOverlay";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { timelineData } from "../data/scriptures";
import { mapLocations } from "../data/mapLocations";
import { kurukshetraWarData } from "../data/kurukshetraData";
import { weaponsData } from "@/data/weaponsData";

// --- TRUE DYNAMIC IMPORTS (Code Split: These won't load until needed!) ---
const Sidebar = dynamic(() => import("../components/Sidebar"), { ssr: false });
const ChapterDrawer = dynamic(() => import("../components/ChapterDrawer"), { ssr: false });
const FamilyTreeModal = dynamic(() => import("../components/FamilyTreeModal"), { ssr: false });
const GlobalSearchModal = dynamic(() => import("../components/GlobalSearchModal"), { ssr: false });
const RegionLorePanel = dynamic(() => import("../components/RegionLorePanel"), { ssr: false });

// Dedicated map content component (Strictly PC/Desktop mode)
function MapContent({
  setShowSidebar,
  setHoveredRegion,
  currentData,
  isWarMode,
  activeEra,
  warDayIndex,
  isIntroPlaying
}) {
  const previousPin = isWarMode
    ? (warDayIndex > 0 ? kurukshetraWarData[warDayIndex - 1]?.pins?.[0] : null)
    : (!isWarMode && activeEra > 0 ? timelineData[activeEra - 1]?.pins?.[0] : null);

  return (
    <div className="relative w-[3840px] h-[2160px]">
      {/* THE MAP IMAGE */}
      <img
        src="/MainMap1.png"
        alt="Map of Mahabharata"
        fetchPriority="high"
        decoding="sync"
        className="absolute inset-0 w-full h-full object-cover opacity-80 contrast-125 saturate-50"
        style={{ imageRendering: "-webkit-optimize-contrast" }}
      />
      
      <WarAtmosphereOverlay isWarMode={isWarMode} />

      {/* Pins and Overlays */}
      <div className={`absolute inset-0 z-10 transition-opacity duration-[2000ms] ease-in ${isIntroPlaying ? "opacity-0" : "opacity-100"}`}>
        <MapAnimationOverlay
          currentData={currentData}
          previousPin={previousPin}
          isWarMode={isWarMode}
          warDayIndex={warDayIndex}
        />

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
  const [introState, setIntroState] = useState("waiting");

  const [activeEra, setActiveEra] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [isMapHovered, setIsMapHovered] = useState(false);
  const [showFamilyTree, setShowFamilyTree] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [selectedWeapon, setSelectedWeapon] = useState(null); 
  const [isArmoryOpen, setIsArmoryOpen] = useState(false);

  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [initialScale, setInitialScale] = useState(0.5);

  const transformComponentRef = useRef(null);
  const [isCardExpanded, setIsCardExpanded] = useState(false);

  const [isWarMode, setIsWarMode] = useState(false);
  const [warDayIndex, setWarDayIndex] = useState(0);

  const currentData = isWarMode
    ? kurukshetraWarData[warDayIndex]
    : timelineData[activeEra];

  // UI STATE TRACKER: Used to pause background downloads
  const isUIActive = showSidebar || showPopup || isArmoryOpen || showFamilyTree || isSearchOpen || isDrawerOpen;
  
  const imageQueue = useRef([]);
  const isQueueInitialized = useRef(false);

  // --- SMART BACKGROUND PRELOADER ---
  useEffect(() => {
    // 1. Initialize the queue only once after the intro finishes
    if (introState === "finished" && !isQueueInitialized.current) {
      const allImages = [
        ...timelineData.map((d) => d.cardImg),
        ...timelineData.map((d) => d.sidebarImage),
        ...kurukshetraWarData.map((d) => d.cardImg),
        ...kurukshetraWarData.map((d) => d.sidebarImage),
      ].filter(Boolean);
      
      // Remove duplicates
      imageQueue.current = [...new Set(allImages)];
      isQueueInitialized.current = true;
    }

    // 2. Pause downloading if any menu is open or intro isn't done
    if (introState !== "finished" || isUIActive) return;

    let isCancelled = false;

    // 3. Load images sequentially (one-by-one) so we don't choke the network
    const loadNextImage = () => {
      if (isCancelled || imageQueue.current.length === 0) return;
      
      const url = imageQueue.current.shift(); // Take next image from queue
      const img = new window.Image();
      
      img.onload = loadNextImage;  // If success, load the next one
      img.onerror = loadNextImage; // If fail, skip and load the next one
      img.src = url; 
    };

    // Give the browser 1.5 seconds to breathe before starting background downloads
    const idleTimer = setTimeout(() => {
      loadNextImage();
      loadNextImage(); // Load 2 images simultaneously max
    }, 1500);

    return () => {
      isCancelled = true; // Clean up and pause the queue when UI opens
      clearTimeout(idleTimer);
    };
  }, [introState, isUIActive]); 

  // Map Scaling Logic
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      if (width < 640) setInitialScale(0.22);
      else if (width < 1024) setInitialScale(0.35);
      else setInitialScale(0.5);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Map Panning Logic
  useEffect(() => {
    if (introState === "waiting") return;
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

      const targetScale = 0.75;
      const windowX = window.innerWidth / 2;
      const windowY = isCardExpanded ? window.innerHeight * 0.27 : window.innerHeight / 2;

      const targetX = windowX - pinPixelX * targetScale;
      const targetY = windowY - pinPixelY * targetScale;

      // STAGGERED ANIMATION FIX: 
      // We wait 400ms to let the Card UI smoothly finish its expansion 
      // and let the image load before we force the GPU to pan the massive 4K map.
      const panTimer = setTimeout(() => {
        setTransform(targetX, targetY, targetScale, 4000, "easeOut");
      }, 200);

      // Cleanup the timer if the user rapidly scrubs through chapters
      return () => clearTimeout(panTimer);
    }
  }, [activeEra, warDayIndex, isWarMode, isCardExpanded, introState, currentData]);

  const handleSearchResultSelect = (item) => {
    if (item.type === "chapter") {
      setActiveEra(item.index);
      setIsWarMode(false);
      setShowSidebar(true);
      setShowPopup(false);
      setIsSearchOpen(false);
    } 
    else if (item.type === "war-day") {
      setIsWarMode(true);
      setWarDayIndex(item.index);
      setShowSidebar(true);
      setShowPopup(false);
      setIsSearchOpen(false);
    } 
    else if (item.type === "location") {
      setHoveredRegion(item.data);
      setIsSearchOpen(false);
    } 
    else if (item.type === "character") {
      setSelectedCharacter(item.data);
      setShowFamilyTree(true);
      setIsSearchOpen(false);
    } 
    else if (item.type === "weapon") {
      setSelectedWeapon(item.data);
      setIsArmoryOpen(true);
      setIsSearchOpen(false);
    }
  };

  const handleSelectChapter = (index) => {
    if (isWarMode) setWarDayIndex(index);
    else setActiveEra(index);
  };

  const handleDrawerSelectChapter = (index) => {
    handleSelectChapter(index);
    setShowSidebar(true);
  };

  return (
    <main className="w-full h-[100dvh] bg- overflow-hidden flex items-center justify-center touch-none relative text-slate-200">
      
      {/* CINEMATIC INTRO OVERLAY */}
      {introState !== "finished" && (
        <IntroAnimation 
          onStart={() => setIntroState("playing")} 
          onComplete={() => setIntroState("finished")} 
        />
      )}

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
              willChange: "transform",
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
              isIntroPlaying={introState !== "finished"} 
            />
          </TransformComponent>
        </TransformWrapper>
      </div>

      {isDrawerOpen && (
        <div
          className="absolute inset-0 z-35 bg-transparent pointer-events-auto"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* THE UI LAYER */}
      <div className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-[2000ms] ease-in-out ${introState !== "finished" ? "opacity-0" : "opacity-100"}`}>
        
        {/* We wrap each UI component to force them to be clickable again */}
        {hoveredRegion && (
          <div className="pointer-events-auto">
            <RegionLorePanel
              selectedRegion={hoveredRegion}
              setHoveredRegion={setHoveredRegion}
            />
          </div>
        )}

        <div className="pointer-events-auto">
          <Navbar
            isMapHovered={isMapHovered}
            showSidebar={showSidebar}
            showPopup={showPopup}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        </div>

        <div className="pointer-events-auto">
          <FloatingMenu
            setShowFamilyTree={setShowFamilyTree}
            setShowDrawer={setIsDrawerOpen}
            isArmoryOpen={isArmoryOpen}
            setIsArmoryOpen={setIsArmoryOpen}
            selectedWeapon={selectedWeapon}
            setSelectedWeapon={setSelectedWeapon}
          />
        </div>

        {showSidebar && (
          <div className="pointer-events-auto">
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
          </div>
        )}

        <div className="pointer-events-auto">
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
        </div>

        {isDrawerOpen && (
          <div className="pointer-events-auto">
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
          </div>
        )}

        {showFamilyTree && (
          <div className="pointer-events-auto">
            <FamilyTreeModal
              showFamilyTree={showFamilyTree}
              setShowFamilyTree={setShowFamilyTree}
              selectedCharacter={selectedCharacter}
              setSelectedCharacter={setSelectedCharacter}
            />
          </div>
        )}

        {isSearchOpen && (
          <div className="pointer-events-auto">
            <GlobalSearchModal
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              onSelectResult={handleSearchResultSelect}
            />
          </div>
        )}
      </div>
    </main>
  );
}