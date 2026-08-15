// src/components/FamilyTreeModal.js
"use client";

import { useState, useEffect } from "react";
import CharacterBox from "./CharacterBox";
import { HLine, VLine } from "./RelationshipLines";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { characterData } from "@/data/characterData";

export default function FamilyTreeModal({ showFamilyTree, setShowFamilyTree }) {
  const [showHeader, setShowHeader] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    if (showFamilyTree) {
      setShowHeader(true);
      const timer = setTimeout(() => {
        setShowHeader(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showFamilyTree]);

  if (!showFamilyTree) return null;

  const handleCharacterClick = (name) => {
    const data = characterData[name];
    if (data) {
      setSelectedCharacter(data);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md pointer-events-auto overflow-hidden flex items-center justify-center">
      {/* FLOATING HEADER */}
      <div className="absolute top-0 left-0 w-full flex justify-center items-center px-6 sm:px-12 py-6 z-[60] pointer-events-none">
        <h4
          className={`text-amber-500 font-bold font-serif text-lg sm:text-2xl uppercase tracking-[0.3em] drop-shadow-[0_4px_20px_rgba(0,0,0,1)] transition-opacity duration-1000 ${
            showHeader ? "opacity-100" : "opacity-0"
          }`}
        >
          Dynasty Lineage
        </h4>
        <button
          onClick={() => setShowFamilyTree(false)}
          className="absolute right-6 sm:right-12 text-slate-300 hover:text-amber-400 text-2xl font-bold transition-all hover:scale-110 pointer-events-auto drop-shadow-[0_4px_10px_rgba(0,0,0,1)]"
        >
          ✕
        </button>
      </div>

      {/* FULL-SCREEN CANVAS */}
      <div className="w-full h-full cursor-grab active:cursor-grabbing">
        <TransformWrapper
          initialScale={0.75}
          minScale={0.2}
          maxScale={2.5}
          centerOnInit={true}
          limitToBounds={false}
        >
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
            <div className="relative w-[1900px] h-[2100px]">
              <div className="absolute top-100 left-0 w-full h-full">
                {/* =========================================
                    LAYER 1: RELATIONSHIP LINES (z-0)
                    ========================================= */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  {/* --- GENERATION 1 TO 2 --- */}
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

                  {/* --- GENERATION 2 TO 3 (Niyoga) --- */}
                  <VLine x={1300} y={460} height={140} dotted={true} />
                  <HLine x={520} y={600} width={1080} dotted={true} />
                  <VLine x={520} y={599} height={50} dotted={true} />
                  <VLine x={950} y={599} height={50} dotted={true} />
                  <VLine x={1600} y={599} height={50} dotted={true} />

                  {/* --- GENERATION 3 TO 4 --- */}
                  <VLine x={520} y={760} height={280} />
                  <VLine x={950} y={760} height={280} />
                  <VLine x={1600} y={760} height={280} />

                  {/* --- GENERATION 4 MARRIAGES --- */}
                  <HLine x={300} y={1040} width={220} />
                  <HLine x={720} y={1040} width={230} />
                  <HLine x={950} y={1040} width={390} />

                  {/* --- GENERATION 4 TO 5 DESCENT --- */}
                  <VLine x={410} y={1040} height={280} />
                  <HLine x={300} y={1320} width={220} />
                  <VLine x={300} y={1320} height={160} />
                  <VLine x={520} y={1320} height={160} />

                  <VLine x={935} y={1040} height={280} />
                  <HLine x={820} y={1320} width={340} />
                  <VLine x={820} y={1320} height={160} />
                  <VLine x={990} y={1320} height={160} />
                  <VLine x={1160} y={1320} height={160} />

                  <VLine x={1245} y={1040} height={280} />
                  <HLine x={1245} y={1320} width={295} />
                  <VLine x={1340} y={1320} height={160} />
                  <VLine x={1540} y={1320} height={160} />
                </div>

                {/* =========================================
                    LAYER 2: CHARACTER BOXES (z-20)
                    ========================================= */}

                {/* GENERATION 1 (Y = 150) */}
                <CharacterBox
                  name="Ganga"
                  title="River Goddess"
                  gender="female"
                  x={150}
                  y={150}
                  description="Shantanu's first wife and mother to Bhishma."
                  imageUrl="/depiction/Ganga.png"
                  onSelect={() => handleCharacterClick("Ganga")}
                />
                <CharacterBox
                  name="Shantanu"
                  title="King of Hastinapur"
                  gender="male"
                  x={400}
                  y={150}
                  description="The grand patriarch of the Kuru dynasty."
                  imageUrl="/depiction/Shantanu.jfif"
                  onSelect={() => handleCharacterClick("Shantanu")}
                />
                <CharacterBox
                  name="Satyavati"
                  title="The Fisher Queen"
                  gender="female"
                  x={850}
                  y={150}
                  description="Shantanu's second wife."
                  imageUrl="/depiction/Satyavati.jfif"
                  onSelect={() => handleCharacterClick("Satyavati")}
                />

                {/* GENERATION 2 (Y = 460) */}
                <CharacterBox
                  name="Bhishma"
                  title="Supreme Commander (Pitamaha)"
                  gender="male"
                  x={275}
                  y={460}
                  variant="commander"
                  description="Took a terrible vow of celibacy and led the Kaurava army for the first 10 days."
                  imageUrl="/depiction/Bhishma.jfif"
                  onSelect={() => handleCharacterClick("Bhishma")}
                />
                <CharacterBox
                  name="Chitrangada"
                  title="The Eldest Son"
                  gender="male"
                  x={520}
                  y={460}
                  description="Died young in battle without heirs."
                  imageUrl="/depiction/Chitrangada.jfif"
                  onSelect={() => handleCharacterClick("Chitrangada")}
                />
                <CharacterBox
                  name="Vichitravirya"
                  title="The Fragile King"
                  gender="male"
                  x={730}
                  y={460}
                  description="Died childless, requiring the Niyoga intervention."
                  imageUrl="/depiction/Vichitravirya.jfif"
                  onSelect={() => handleCharacterClick("Vichitravirya")}
                />
                <CharacterBox
                  name="Vyasa"
                  title="The Great Sage"
                  gender="male"
                  x={1300}
                  y={460}
                  description="Satyavati's firstborn. Surrogate father via Niyoga."
                  imageUrl="/depiction/Vyasa.jfif"
                  onSelect={() => handleCharacterClick("Vyasa")}
                />

                {/* GENERATION 3 (Y = 760) */}
                <CharacterBox
                  name="Ambika"
                  title="First Widow"
                  gender="female"
                  x={520}
                  y={760}
                  description="Mother of Dhritarashtra."
                  imageUrl="/depiction/Ambika.jfif"
                  onSelect={() => handleCharacterClick("Ambika")}
                />
                <CharacterBox
                  name="Ambalika"
                  title="Second Widow"
                  gender="female"
                  x={950}
                  y={760}
                  description="Mother of Pandu."
                  imageUrl="/depiction/Amba.jfif"
                  onSelect={() => handleCharacterClick("Ambalika")}
                />
                <CharacterBox
                  name="Handmaiden"
                  title="The Maid"
                  gender="female"
                  x={1600}
                  y={760}
                  description="Sent in place of the terrified queens. Mother of Vidura."
                  imageUrl="/depiction/Handmaiden.jfif"
                  onSelect={() => handleCharacterClick("Handmaiden")}
                />

                {/* GENERATION 4 (Y = 1040) */}
                <CharacterBox
                  name="Gandhari"
                  title="Blindfolded Queen"
                  gender="female"
                  x={300}
                  y={1040}
                  description="Wife of Dhritarashtra."
                  imageUrl="/depiction/Gandhari.jfif"
                  onSelect={() => handleCharacterClick("Gandhari")}
                />
                <CharacterBox
                  name="Dhritarashtra"
                  title="The Blind King"
                  gender="male"
                  x={520}
                  y={1040}
                  description="Father of the Kauravas."
                  imageUrl="/depiction/Dhritarashtra.jfif"
                  onSelect={() => handleCharacterClick("Dhritarashtra")}
                />
                <CharacterBox
                  name="Kunti"
                  title="First Queen"
                  gender="female"
                  x={720}
                  y={1040}
                  description="Mother of Karna and the eldest Pandavas."
                  imageUrl="/depiction/Kunti.png"
                  onSelect={() => handleCharacterClick("Kunti")}
                />
                <CharacterBox
                  name="Pandu"
                  title="The Pale King"
                  gender="male"
                  x={950}
                  y={1040}
                  description="Ruled Hastinapur but died due to a curse."
                  imageUrl="/depiction/Pandu.jfif"
                  onSelect={() => handleCharacterClick("Pandu")}
                />
                <CharacterBox
                  name="Madri"
                  title="Second Queen"
                  gender="female"
                  x={1340}
                  y={1040}
                  description="Pandu's second wife. Mother to the twins."
                  imageUrl="/depiction/Madri.jfif"
                  onSelect={() => handleCharacterClick("Madri")}
                />
                <CharacterBox
                  name="Vidura"
                  title="Prime Minister"
                  gender="male"
                  x={1600}
                  y={1040}
                  description="The wisest man in Hastinapur."
                  imageUrl="/depiction/Vidhura.jfif"
                  onSelect={() => handleCharacterClick("Vidura")}
                />

                {/* LORD KRISHNA */}
                <CharacterBox
                  name="Lord Krishna"
                  title="The Supreme Guide & Strategist"
                  gender="male"
                  x={650}
                  y={1290}
                  width="168px"
                  height="236px"
                  variant="divine"
                  description="The supreme avatar of Vishnu who served as Arjuna's charioteer."
                  imageUrl="/depiction/Krishna.jfif"
                  onSelect={() => handleCharacterClick("Lord Krishna")}
                />

                {/* GENERATION 5 (Y = 1480) */}
                <CharacterBox
                  name="Duryodhana"
                  title="Kaurava Prince"
                  gender="male"
                  x={480}
                  y={1480}
                  description="Eldest of the 100 Kauravas."
                  imageUrl="/depiction/Duryodhana.png"
                  onSelect={() => handleCharacterClick("Duryodhana")}
                />
                <CharacterBox
                  name="99 Brothers"
                  title="The Kauravas"
                  gender="male"
                  x={300}
                  y={1480}
                  description="The remaining 99 sons of Dhritarashtra."
                  imageUrl="/depiction/Kauravas.jfif"
                  onSelect={() => handleCharacterClick("99 Brothers")}
                />

                <CharacterBox
                  name="Yudhisthira"
                  title="The Just King"
                  gender="male"
                  x={820}
                  y={1480}
                  description="Eldest Pandava."
                  imageUrl="/depiction/Yudhishthira.jfif"
                  onSelect={() => handleCharacterClick("Yudhisthira")}
                />
                <CharacterBox
                  name="Bhima"
                  title="The Mighty"
                  gender="male"
                  x={990}
                  y={1480}
                  description="Second Pandava."
                  imageUrl="/depiction/Bhima.jfif"
                  onSelect={() => handleCharacterClick("Bhima")}
                />
                <CharacterBox
                  name="Arjuna"
                  title="The Archer"
                  gender="male"
                  x={1160}
                  y={1480}
                  description="Third Pandava."
                  imageUrl="/depiction/Arjuna.jfif"
                  onSelect={() => handleCharacterClick("Arjuna")}
                />

                <CharacterBox
                  name="Nakula"
                  title="The Handsome"
                  gender="male"
                  x={1340}
                  y={1480}
                  description="Fourth Pandava, master swordsman."
                  imageUrl="/depiction/Nakula.jfif"
                  onSelect={() => handleCharacterClick("Nakula")}
                />
                <CharacterBox
                  name="Sahadeva"
                  title="The Wise"
                  gender="male"
                  x={1540}
                  y={1480}
                  description="Youngest Pandava, master of astrology."
                  imageUrl="/depiction/Sahadeva.png"
                  onSelect={() => handleCharacterClick("Sahadeva")}
                />
              </div>
            </div>
          </TransformComponent>
        </TransformWrapper>
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
