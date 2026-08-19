// src/app/page.js
"use client";

import { useState } from "react";
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
import MobileTouchHandler, {
  useMobile,
} from "../components/MobileTouchHandler"; 
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { timelineData } from "../data/scriptures";
import { mapLocations } from "../data/mapLocations";
import { kurukshetraWarData } from "../data/kurukshetraData";

// Dedicated map content component to safely use the mobile hook
function MapContent({
  showSidebar,
  setShowSidebar,
  hoveredRegion,
  setHoveredRegion,
  currentData,
}) {
  const { isMobile } = useMobile();

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
            onClick={() => {
              if (isMobile) {
                setHoveredRegion(hoveredRegion?.id === pin.id ? null : pin);
              } else {
                setShowSidebar(true);
              }
            }}
            onMouseEnter={() => {
              setHoveredRegion(pin);
            }}
            onMouseLeave={() => {
              setHoveredRegion(null);
            }}
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
            onClick={() => {
              if (isMobile) {
                setHoveredRegion(hoveredRegion?.name === pin.name ? null : pin);
              } else {
                setShowSidebar(true);
              }
            }}
            onMouseEnter={() => {
              if (!isMobile) setHoveredRegion(pin);
            }}
            onMouseLeave={() => {
              if (!isMobile) setHoveredRegion(null);
            }}
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
      setShowPopup(false);
    }
  };

  return (
    <main className="w-screen h-screen bg-slate-950 overflow-hidden flex items-center justify-center touch-none relative text-slate-200">
      
      {/* MAP STAYS UNTOUCHED IN THE BACKGROUND */}
      <MobileTouchHandler>
        <div
          className="absolute inset-0 z-0 w-full h-full"
          onMouseEnter={() => setIsMapHovered(true)}
          onMouseLeave={() => setIsMapHovered(false)}
          onClick={() => {
            // 👈 Clicking anywhere on the map background will collapse the left chapter drawer
            if (isDrawerOpen) setIsDrawerOpen(false);
          }}
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
              <MapContent
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
                hoveredRegion={hoveredRegion}
                setHoveredRegion={setHoveredRegion}
                currentData={currentData}
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
      </MobileTouchHandler>

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

      {/* FLOATING MENU (Houses both Family Tree and Chapters Drawer buttons) */}
      <FloatingMenu 
        setShowFamilyTree={setShowFamilyTree} 
        setShowDrawer={setIsDrawerOpen} 
      />

      {/* SIDEBAR */}
      <div className="relative h-full z-50">
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
          handleSelectChapter(index);
          setShowSidebar(true); // 👈 Directly opens sidebar on right without closing the drawer
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