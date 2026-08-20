// src/components/FamilyTreeModal.js
"use client";

import { useState, useEffect } from "react";
import CharacterBox from "./CharacterBox";
import { HLine, VLine } from "./RelationshipLines";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { characterData } from "@/data/characterData";

// Helper component: Supports Desktop Hover & Mobile Tap-to-Toggle for Divine Boxes
function DivineBox({ x, y, name, title, description, imageUrl, onSelect, activeMobileCharacter, setActiveMobileCharacter }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isMobileActive = activeMobileCharacter === name;

  const handleInteraction = (e) => {
    e.stopPropagation();
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) {
      if (!isMobileActive) {
        setActiveMobileCharacter(name);
      } else {
        if (onSelect) onSelect();
        setActiveMobileCharacter(null);
      }
    } else {
      if (onSelect) onSelect();
    }
  };

  const isVisible = showTooltip || isMobileActive;

  return (
    <div 
      className={`absolute z-35 flex flex-col items-center pointer-events-auto cursor-pointer group transition-all duration-300 ${
        isVisible ? "scale-190 z-50" : "scale-100"
      }`}
      style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={handleInteraction}
    >
      <div className={`w-14 h-14 ${isVisible ? 'w-24 h-24' : ''} group-hover:w-24 group-hover:h-24 rounded-full bg-[#070b14] border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] overflow-hidden relative transition-all duration-300 ease-in-out flex items-center justify-center`}>
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-amber-950/40 flex items-center justify-center text-amber-300 font-serif font-bold text-xs">
            {name}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent opacity-60"></div>
        
        <div className={`absolute inset-0 flex items-center justify-center text-center p-1 ${isVisible ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity duration-300 bg-black/40`}>
          <span className="text-[10px] font-bold font-serif text-amber-200 uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            {name}
          </span>
        </div>

        <span className={`absolute text-[9px] font-bold font-serif text-amber-200 uppercase tracking-tighter ${isVisible ? 'opacity-0' : 'opacity-100'} group-hover:opacity-0 transition-opacity duration-200 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]`}>
          {name.slice(0, 3)}
        </span>
      </div>

      {isVisible && (
        <div className="absolute bottom-full mb-3 w-48 p-3 bg-[#070b14]/95 border border-amber-500/50 rounded-lg shadow-2xl backdrop-blur-md z-50 text-center animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
          <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest block mb-0.5">
            {title}
          </span>
          <p className="text-xs text-slate-200 font-serif leading-tight">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FamilyTreeModal({ 
  showFamilyTree, 
  setShowFamilyTree, 
  selectedCharacter: searchSelectedCharacter, 
  setSelectedCharacter: setSearchSelectedCharacter 
}) {
  const [showHeader, setShowHeader] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showMobileHint, setShowMobileHint] = useState(false);
  const [activeMobileCharacter, setActiveMobileCharacter] = useState(null);

  // Handle header fade-out timer on modal open and check if mobile
  useEffect(() => {
    if (showFamilyTree) {
      setShowHeader(true);
      const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
      if (isTouchDevice) {
        setShowMobileHint(true);
        // Hide hint after 5 seconds
        const hintTimer = setTimeout(() => {
          setShowMobileHint(false);
        }, 5000);
        return () => clearTimeout(hintTimer);
      }

      const timer = setTimeout(() => {
        setShowHeader(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showFamilyTree]);

  // Handle incoming character selection from Global Search
  useEffect(() => {
    if (searchSelectedCharacter && showFamilyTree) {
      const charName = typeof searchSelectedCharacter === 'string' 
        ? searchSelectedCharacter 
        : searchSelectedCharacter.name;
        
      if (charName && characterData[charName]) {
        setSelectedCharacter(characterData[charName]);
      }
      
      if (setSearchSelectedCharacter) {
        setSearchSelectedCharacter(null);
      }
    }
  }, [searchSelectedCharacter, showFamilyTree, setSearchSelectedCharacter]);

  if (!showFamilyTree) return null;

  const handleCharacterClick = (characterInfo) => {
    if (characterInfo) {
      const name = typeof characterInfo === 'string' ? characterInfo : characterInfo.name;
      const data = characterData[name];
      if (data) {
        setSelectedCharacter(data);
      }
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md pointer-events-auto overflow-hidden flex items-center justify-center">
      {/* FLOATING HEADER */}
      <div className="absolute top-0 left-0 w-full flex flex-col justify-center items-center px-6 sm:px-12 py-6 z-[60] pointer-events-none">
        <h4
          className={`text-amber-500 font-bold font-serif text-lg sm:text-2xl uppercase tracking-[0.3em] drop-shadow-[0_4px_20px_rgba(0,0,0,1)] transition-opacity duration-500 ${
            showHeader ? "opacity-100" : "opacity-0"
          }`}
        >
          Dynasty Lineage
        </h4>

        {/* Blinking Mobile Hint Banner */}
        {showMobileHint && (
          <div className="mt-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/60 backdrop-blur-md text-amber-300 text-[11px] font-sans font-semibold tracking-wider animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.4)] pointer-events-auto text-center">
            💡 Tap once for details • Tap twice for full profile
          </div>
        )}

        <button
          onClick={() => setShowFamilyTree(false)}
          className="absolute right-6 sm:right-12 text-slate-300 hover:text-amber-400 text-2xl font-bold transition-all hover:scale-110 pointer-events-auto drop-shadow-[0_4px_10px_rgba(0,0,0,1)]"
        >
          ✕
        </button>
      </div>

      {/* FULL-SCREEN CANVAS */}
      <div className="w-full h-full cursor-grab active:cursor-grabbing" onClick={() => setActiveMobileCharacter(null)}>
        <TransformWrapper
          initialScale={0.50}
          minScale={0.2}
          maxScale={2.5}
          centerOnInit={true}
          limitToBounds={false}
        >
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
            <div className="relative w-[1900px] h-[2100px]">
              <div className="absolute top-50 left-0 w-full h-full">
                
                {/* RELATIONSHIP LINES */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <HLine x={150} y={150} width={250} />
                  <VLine x={275} y={150} height={310} />
                  <HLine x={400} y={150} width={450} />
                  <VLine x={625} y={150} height={130} />
                  <HLine x={520} y={280} width={210} />
                  <VLine x={520} y={280} height={180} />
                  <VLine x={730} y={280} height={180} />
                  <VLine x={850} y={150} height={80} />
                  <HLine x={850} y={230} width={450} />
                  <VLine x={1300} y={230} height={230} />

                  <VLine x={1300} y={460} height={140} dotted={true} />
                  <HLine x={520} y={600} width={1080} dotted={true} />
                  <VLine x={520} y={599} height={50} dotted={true} />
                  <VLine x={950} y={599} height={50} dotted={true} />
                  <VLine x={1600} y={599} height={50} dotted={true} />

                  <VLine x={520} y={760} height={280} />
                  <VLine x={950} y={760} height={280} />
                  <VLine x={1600} y={760} height={280} />

                  <HLine x={300} y={1040} width={220} />
                  <HLine x={720} y={1040} width={230} />
                  <HLine x={950} y={1040} width={370} />

                  <VLine x={410} y={1040} height={280} />
                  <HLine x={300} y={1320} width={220} />
                  <VLine x={300} y={1320} height={160} />
                  <VLine x={520} y={1320} height={160} />
                  
                  <VLine x={-50} y={1140} height={300} />

                  <VLine x={720} y={1140} height={50} dotted={true} divine={true} />
                  <VLine x={770} y={1190} height={130} dotted={true} divine={true} />
                  <HLine x={120} y={1190} width={650} dotted={true} divine={true} />
                  <VLine x={120} y={1190} height={290} dotted={true} divine={true} />
                  <HLine x={770} y={1320} width={390} dotted={true} divine={true} />
                  <VLine x={820} y={1320} height={160} dotted={true} divine={true} />
                  <VLine x={990} y={1320} height={160} dotted={true} divine={true} />
                  <VLine x={1160} y={1320} height={160} dotted={true} divine={true} />

                  <VLine x={1245} y={1040} height={280} dotted={true} divine={true} />
                  <HLine x={1245} y={1320} width={295} dotted={true} divine={true} />
                  <VLine x={1340} y={1320} height={160} dotted={true} divine={true} />
                  <VLine x={1540} y={1320} height={160} dotted={true} divine={true} />

                  <VLine x={820} y={1590} height={50} />
                  <VLine x={990} y={1590} height={160} />
                  <VLine x={1160} y={1590} height={160} />
                  <VLine x={1340} y={1590} height={50} />
                  <VLine x={1510} y={1590} height={50} />
                  <VLine x={1740} y={1590} height={50} />
                  <HLine x={820} y={1640} width={920} />

                  <VLine x={990} y={1640} height={170} />
                  <VLine x={1160} y={1640} height={170} />
                </div>

                {/* CHARACTER BOXES */}
                <CharacterBox name="Ganga" title="River Goddess" gender="female" x={150} y={150} description="Shantanu's first wife and mother to Bhishma." imageUrl="/depiction/Ganga.png" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Shantanu" title="King of Hastinapur" gender="male" x={400} y={150} description="The grand patriarch of the Kuru dynasty." imageUrl="/depiction/Shantanu.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Satyavati" title="The Fisher Queen" gender="female" x={850} y={150} description="Shantanu's second wife." imageUrl="/depiction/Satyavati.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />

                <CharacterBox name="Bhishma" title="Supreme Commander (Pitamaha)" gender="male" x={275} y={460} variant="commander" description="Took a terrible vow of celibacy and led the Kaurava army for the first 10 days." imageUrl="/depiction/Bhishma.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Chitrangada" title="The Eldest Son" gender="male" x={520} y={460} description="Died young in battle without heirs." imageUrl="/depiction/Chitrangada.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Vichitravirya" title="The Fragile King" gender="male" x={730} y={460} description="Died childless, requiring the Niyoga intervention." imageUrl="/depiction/Vichitravirya.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Vyasa" title="The Great Sage" gender="male" x={1300} y={460} description="Satyavati's firstborn. Surrogate father via Niyoga." imageUrl="/depiction/Vyasa.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />

                <CharacterBox name="Ambika" title="First Widow" gender="female" x={520} y={760} description="Mother of Dhritarashtra." imageUrl="/depiction/Ambika.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Ambalika" title="Second Widow" gender="female" x={950} y={760} description="Mother of Pandu." imageUrl="/depiction/Amba.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Handmaiden" title="The Maid" gender="female" x={1600} y={760} description="Sent in place of the terrified queens. Mother of Vidura." imageUrl="/depiction/Handmaiden.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />

                <CharacterBox name="Shakuni" title="The Deceiver" gender="male" x={120} y={1040} description="Gandhari's brother and the main antagonist of the Mahabharata." imageUrl="/depiction/Shakuni.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Gandhari" title="Blindfolded Queen" gender="female" x={300} y={1040} description="Wife of Dhritarashtra." imageUrl="/depiction/Gandhari.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Dhritarashtra" title="The Blind King" gender="male" x={520} y={1040} description="Father of the Kauravas." imageUrl="/depiction/Dhritarashtra.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Kunti" title="First Queen" gender="female" x={720} y={1040} description="Mother of Karna and the eldest Pandavas." imageUrl="/depiction/Kunti.png" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Pandu" title="The Pale King" gender="male" x={950} y={1040} description="Ruled Hastinapur but died due to a curse." imageUrl="/depiction/Pandu.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Madri" title="Second Queen" gender="female" x={1250} y={1040} description="Pandu's second wife. Mother to the twins." imageUrl="/depiction/Madri.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Vidura" title="Prime Minister" gender="male" x={1600} y={1040} description="The wisest man in Hastinapur." imageUrl="/depiction/Vidhura.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Dronacharya" title="Master of Arms" gender="male" x={-50} y={1040} description="Royal preceptor of both the Kauravas and Pandavas." imageUrl="/depiction/Dronacharya.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />

                <CharacterBox name="Lord Krishna" title="The Supreme Guide & Strategist" gender="male" x={650} y={1330} width="168px" height="236px" variant="divine" description="The supreme avatar of Vishnu who served as Arjuna's charioteer." imageUrl="/depiction/Krishna.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />

                <CharacterBox name="Ashwathama" title="The Immortal Warrior" gender="male" x={-50} y={1480} description="Son of Dronacharya. Cursed with immortality and eternal wandering." imageUrl="/depiction/Ashwathama.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Karna" title="The Tragic Hero" gender="male" x={120} y={1480} description="Secretly Kunti's firstborn, raised by a charioteer family. Loyal friend of Duryodhana." imageUrl="/depiction/Karna.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Duryodhana" title="Kaurava Prince" gender="male" x={480} y={1480} description="Eldest of the 100 Kauravas." imageUrl="/depiction/Duryodhana.png" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="99 Brothers" title="The Kauravas" gender="male" x={300} y={1480} description="The remaining 99 sons of Dhritarashtra." imageUrl="/depiction/Kauravas.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />

                <CharacterBox name="Yudhisthira" title="The Just King" gender="male" x={820} y={1480} description="Eldest Pandava." imageUrl="/depiction/Yudhishthira.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Bhima" title="The Mighty" gender="male" x={990} y={1480} description="Second Pandava." imageUrl="/depiction/Bhima.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Arjuna" title="The Archer" gender="male" x={1160} y={1480} description="Third Pandava." imageUrl="/depiction/Arjuna.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />

                <CharacterBox name="Nakula" title="The Handsome" gender="male" x={1340} y={1480} description="Fourth Pandava, master swordsman." imageUrl="/depiction/Nakula.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Sahadeva" title="The Wise" gender="male" x={1510} y={1480} description="Youngest Pandava, master of astrology." imageUrl="/depiction/Sahadeva.png" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Draupadi" title="The Queen of Pandavas" gender="female" x={1740} y={1480} description="Wife of the Pandavas, known for her intelligence and strength." imageUrl="/depiction/Draupadi.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />

                <CharacterBox name="Abhimanyu" title="The Young Warrior" gender="male" x={1160} y={1810} description="Son of Arjuna and Subhadra, known for his bravery and skill." imageUrl="/depiction/Abhimanyu.jfif" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                <CharacterBox name="Ghatotkacha" title="The Mighty Warrior" gender="male" x={990} y={1810} description="Son of Bhima and Hidimba, known for his incredible strength." imageUrl="/depiction/Ghatotkacha.png" onSelect={handleCharacterClick} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />

                {/* DIVINE PARENT BOXES */}
                <div className="absolute inset-0 z-30 pointer-events-none">
                  <DivineBox x={120} y={1270} name="Surya" title="The Sun God" description="Celestial solar deity who bestowed Karna upon Kunti." imageUrl="/depiction/Surya.jfif" onSelect={() => handleCharacterClick("Surya")} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                  <DivineBox x={820} y={1335} name="Dharma" title="Lord of Justice" description="God of righteousness and moral law, father of Yudhisthira." imageUrl="/depiction/Dharma.png" onSelect={() => handleCharacterClick("Dharma")} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                  <DivineBox x={990} y={1335} name="Vayu" title="Lord of Wind" description="Celestial deity of breath, wind, and immense strength, father of Bhima." imageUrl="/depiction/Vayu.jfif" onSelect={() => handleCharacterClick("Vayu")} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                  <DivineBox x={1160} y={1335} name="Indra" title="King of Heavens" description="Lord of thunder, lightning, and rain, celestial father of Arjuna." imageUrl="/depiction/Indra.jfif" onSelect={() => handleCharacterClick("Indra")} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                  <DivineBox x={1425} y={1335} name="Ashwins" title="Twin Divine Physicians" description="Celestial horsemen and gods of medicine, fathers of Nakula and Sahadeva." imageUrl="/depiction/Ashwins.png" onSelect={() => handleCharacterClick("Ashwins")} activeMobileCharacter={activeMobileCharacter} setActiveMobileCharacter={setActiveMobileCharacter} />
                </div>

              </div>
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>

      {/* BOTTOM NAVIGATION GUIDANCE BADGE */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[60] pointer-events-none px-4 py-2 rounded-xl bg-slate-950/20 border border-amber-500/30 backdrop-blur-sm shadow-2xl text-center">
        <p className="text-[11px] font-serif text-amber-300/90 tracking-wider uppercase">
          🧭 Drag to pan • Pinch or scroll to zoom
        </p>
      </div>

      {/* 1-PAGE CHARACTER PROFILE SIDEBAR */}
      {selectedCharacter && (
        <div className="absolute top-0 right-0 w-full sm:w-[500px] h-full bg-[#070b14]/98 border-l border-amber-500/40 backdrop-blur-2xl z-[70] p-8 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          <div>
            <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
              <div>
                <span className="text-amber-400 text-xs font-extrabold uppercase tracking-widest block mb-1">
                  {selectedCharacter.title}
                </span>
                <h2 className="text-slate-100 font-serif text-3xl font-bold tracking-wide">
                  {selectedCharacter.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCharacter(null)}
                className="text-slate-400 hover:text-amber-400 text-2xl font-bold transition-transform hover:scale-110"
              >
                ✕
              </button>
            </div>

            {selectedCharacter.imageUrl && (
              <div className="w-full max-w-[280px] mx-auto aspect-[16/22.5] rounded-lg overflow-hidden border-2 border-amber-500/40 mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative">
                <img
                  src={selectedCharacter.imageUrl}
                  alt={selectedCharacter.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent opacity-80"></div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] text-amber-500 font-bold">
                Complete Chronicle & Legacy
              </h3>
              <p className="text-slate-300 text-base leading-relaxed font-serif whitespace-pre-line">
                {selectedCharacter.fullDescription}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 text-center text-xs text-slate-500 uppercase tracking-widest">
            Mahabharata Dynasty Archives
          </div>
        </div>
      )}
    </div>
  );
}