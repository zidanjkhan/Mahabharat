// src/components/AudioLorePlayer.js
"use client";

import { useState, useEffect, useRef } from "react";

export default function AudioLorePlayer({ 
  textToRead, 
  currentTitle, 
  onNextChapter, 
  onPrevChapter, 
  hasNextChapter, 
  hasPrevChapter,
  isPopupOpen 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  
  const isHoveringRef = useRef(false);
  const hoverTimeoutRef = useRef(null);
  const isPlayingRef = useRef(false);

  isPlayingRef.current = isPlaying;

  // Chapter Change & Continuity
  useEffect(() => {
    window.speechSynthesis.cancel();
    
    if (isPlayingRef.current && textToRead) {
      playText();
    } else {
      setIsPlaying(false);
      setIsPaused(false);
      setAudioProgress(0);
      setIsExpanded(false);
    }
    
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, [textToRead]);

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    // Reduced delay to 1 second (1000ms) for a quicker retraction
    hoverTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 1000);
  };

  const handleCenterClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!isExpanded) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      setIsExpanded(true);
    } else {
      toggleAudio();
    }
  };

  const playText = () => {
    if (!textToRead) return;

    const synth = window.speechSynthesis;
    synth.cancel(); 
    
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.82; 
        utterance.pitch = 0.25; 
        
        const voices = synth.getVoices();
        if (voices.length > 0) {
          const englishVoices = voices.filter(v => v.lang.startsWith('en'));
          const epicVoice = englishVoices.find(v => 
            v.name.includes('George') || 
            v.name.includes('Alex') || 
            v.name.includes('Google UK English Male') || 
            v.name.includes('Daniel')
          ) || englishVoices[0]; 

          if (epicVoice) utterance.voice = epicVoice;
        }

        utterance.onboundary = (event) => {
          if (event.name === 'word') {
            const progressPercentage = (event.charIndex / textToRead.length) * 100;
            setAudioProgress(progressPercentage);
          }
        };

        utterance.onend = () => {
          setAudioProgress(100);
          setTimeout(() => {
            setIsPlaying(false);
            setIsPaused(false);
            setAudioProgress(0);
            setIsExpanded(false); 
          }, 1000);
        };

        synth.speak(utterance);
        setIsPlaying(true);
        setIsPaused(false);
        setIsExpanded(true); 
        
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => {
          if (!isHoveringRef.current) setIsExpanded(false);
        }, 1000);
        
    }, 50);
  };

  const toggleAudio = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    const synth = window.speechSynthesis;

    if (isPlaying && !isPaused) {
      synth.pause();
      setIsPaused(true);
    } else if (isPlaying && isPaused) {
      synth.resume();
      setIsPaused(false);
    } else {
      playText();
    }
  };

  const isVisible = isPopupOpen || isPlaying || audioProgress > 0;
  if (!isVisible) return null;

  return (
    <>
      {/* ===========================================================================
        MODE 1: THE WAX SEAL (Inside Deep Lore Manuscript)
        =========================================================================== */}
      {isPopupOpen && (
        <div 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="fixed left-1/2 -translate-x-1/2 bottom-[11vh] sm:bottom-[14vh] z-[100] flex items-center justify-center pointer-events-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in duration-500 cursor-pointer"
        >
          <div className={`relative flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isExpanded ? "w-[200px] sm:w-[220px]" : "w-[72px]"}`}>
            
            {/* FLOATING BUTTONS TRAY */}
            <div className={`absolute inset-0 flex items-center justify-between transition-all duration-500 ${isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <button onClick={(e) => { e.stopPropagation(); onPrevChapter(); }} disabled={!hasPrevChapter} className={`group/btn p-2.5 rounded-full transition-all duration-300 ${hasPrevChapter ? "hover:bg-[#1a0601] hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] cursor-pointer" : "opacity-40"}`}>
                  <svg className={`w-7 h-7 sm:w-8 sm:h-8 transition-all duration-300 drop-shadow-[0_3px_4px_rgba(0,0,0,0.6)] ${hasPrevChapter ? "fill-[#0a0502] stroke-[#fbbf24] stroke-[1.5px] group-hover/btn:fill-[#fbbf24] group-hover/btn:stroke-amber-200" : "fill-[#3a0505] stroke-[#8b5a2b] stroke-[1px]"}`} viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                </button>
                <div className="w-[72px] shrink-0" />
                <button onClick={(e) => { e.stopPropagation(); onNextChapter(); }} disabled={!hasNextChapter} className={`group/btn p-2.5 rounded-full transition-all duration-300 ${hasNextChapter ? "hover:bg-[#1a0601] hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] cursor-pointer" : "opacity-40"}`}>
                  <svg className={`w-7 h-7 sm:w-8 sm:h-8 transition-all duration-300 drop-shadow-[0_3px_4px_rgba(0,0,0,0.6)] ${hasNextChapter ? "fill-[#0a0502] stroke-[#fbbf24] stroke-[1.5px] group-hover/btn:fill-[#fbbf24] group-hover/btn:stroke-amber-200" : "fill-[#3a0505] stroke-[#8b5a2b] stroke-[1px]"}`} viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                </button>
            </div>

            {/* THE CENTER WAX SEAL */}
            <div onClick={handleCenterClick} className="relative z-10 w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#680b0b] via-[#4a0606] to-[#260101] border-[1.5px] border-[#fbbf24]/80 shadow-[0_5px_15px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center cursor-pointer group">
              {!isPlaying ? (
                <div className="absolute inset-0 rounded-full pointer-events-none z-0" style={{ padding: "2px", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }}>
                  <div className="absolute top-1/2 left-1/2 w-[300%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_120deg,transparent_75%,#fbbf24_100%)]" />
                </div>
              ) : (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 transform -rotate-90" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="34" fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray="213.6" strokeDashoffset={213.6 - (audioProgress / 100 * 213.6)} className="transition-all duration-300 ease-linear shadow-[0_0_10px_#fcd34d]" strokeLinecap="round" />
                </svg>
              )}

              <div className="relative z-10 flex items-center justify-center">
                {!isExpanded ? (
                  <svg className="w-[38px] h-[38px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:brightness-125 group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] pointer-events-none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="ivory-shell" x1="10%" y1="0%" x2="90%" y2="100%"><stop offset="0%" stopColor="#ffffff" /><stop offset="25%" stopColor="#fef3c7" /><stop offset="70%" stopColor="#d4d4d8" /><stop offset="100%" stopColor="#78716c" /></linearGradient>
                      <linearGradient id="shell-inner" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#451a03" /><stop offset="100%" stopColor="#000000" /></linearGradient>
                      <linearGradient id="gold-trim" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fde68a" /><stop offset="50%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#78350f" /></linearGradient>
                    </defs>
                    <path d="M 50 5 C 75 10, 90 35, 75 65 C 65 85, 55 95, 50 95 C 45 95, 35 85, 25 65 C 10 35, 25 10, 50 5 Z" fill="url(#ivory-shell)" />
                    <path d="M 50 20 C 65 25, 75 45, 65 65 C 60 75, 53 85, 50 87 C 47 85, 40 75, 35 65 C 25 45, 35 25, 50 20 Z" fill="url(#shell-inner)" />
                    <path d="M 50 5 C 75 10, 90 35, 75 65 C 65 85, 55 95, 50 95 C 55 85, 65 65, 70 45 C 75 25, 65 15, 50 5 Z" fill="url(#ivory-shell)" filter="drop-shadow(-2px 2px 3px rgba(0,0,0,0.5))" />
                    <path d="M 50 5 C 65 15, 75 25, 70 45 C 65 65, 55 85, 50 95" stroke="url(#gold-trim)" strokeWidth="2.5" fill="none" />
                    <path d="M 28 30 Q 40 45 62 30" stroke="url(#gold-trim)" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M 22 45 Q 40 60 67 45" stroke="url(#gold-trim)" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M 27 60 Q 40 70 60 60" stroke="url(#gold-trim)" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M 33 75 Q 45 80 55 75" stroke="url(#gold-trim)" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M 43 85 Q 50 100 57 85 Z" fill="url(#gold-trim)" />
                  </svg>
                ) : (
                  <div className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] transition-colors duration-300 group-hover:brightness-125 cursor-pointer" onClick={toggleAudio}>
                    {isPlaying && !isPaused ? (
                      <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                      <svg className="w-9 h-9 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===========================================================================
        MODE 2: THE EDGE PILL (Background Player)
        =========================================================================== */}
      {!isPopupOpen && (
        <div 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleCenterClick}
          className="fixed right-0 top-[70%] sm:top-[75%] -translate-y-1/2 z-[100] flex items-center animate-in slide-in-from-right duration-500 cursor-pointer pointer-events-auto"
        >
          <div className={`relative group bg-gradient-to-l from-[#120a05]/95 via-[#0a0502]/95 to-[#050301]/95 shadow-[inset_0_2px_10px_rgba(255,255,255,0.05),_0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden backdrop-blur-md
          ${isExpanded ? "w-[340px] h-20 rounded-l-2xl shadow-[0_0_30px_rgba(245,158,11,0.2)]" : "w-14 h-28 rounded-l-2xl hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]"}`}
          >
            {!isPlaying ? (
              <div className="absolute inset-0 rounded-l-2xl pointer-events-none z-0" style={{ padding: "1px 0px 1px 1px", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }}>
                <div className="absolute top-1/2 right-1/2 w-[300%] aspect-square translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_120deg,transparent_75%,#8b5a2b_100%)]" />
              </div>
            ) : (
              isExpanded ? (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" width="340" height="80" viewBox="0 0 340 80">
                  <path d="M 340 1 L 24 1 A 23 23 0 0 0 24 79 L 340 79" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="660" strokeDashoffset={660 - (audioProgress / 100 * 660)} className="transition-all duration-300 ease-linear shadow-[0_0_8px_#fcd34d]" strokeLinecap="round" />
                </svg>
              ) : (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" width="56" height="112" viewBox="0 0 56 112">
                  <path d="M 56 1 L 24 1 A 23 23 0 0 0 24 111 L 56 111" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="145" strokeDashoffset={145 - (audioProgress / 100 * 145)} className="transition-all duration-300 ease-linear shadow-[0_0_8px_#fcd34d]" strokeLinecap="round" />
                </svg>
              )
            )}

            <div className={`absolute inset-0 rounded-l-2xl pointer-events-none border-y border-l border-r-0 transition-colors duration-500 ${isPlaying ? "border-amber-700/20" : isExpanded ? "border-[#8b5a2b]/60" : "border-[#8b5a2b]/30 group-hover:border-[#8b5a2b]/80"}`} />

            {/* COLLAPSED PILL VIEW */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ease-out pr-1 ${isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
              <svg className="w-5 h-5 text-amber-500/80 group-hover:text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
              <span className="text-[9px] font-serif font-black text-amber-500/80 group-hover:text-amber-400 tracking-widest uppercase mt-2 transition-colors">
                {isPlaying || audioProgress > 0 ? `${Math.round(audioProgress)}%` : "LORE"}
              </span>
            </div>

            {/* EXPANDED MUSIC PLAYER VIEW */}
            <div className={`absolute top-0 right-0 w-[340px] h-20 flex items-center transition-opacity duration-400 delay-100 ease-in ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
               <div className="w-20 h-full flex flex-col items-center justify-center flex-shrink-0 relative z-10 border-r border-[#8b5a2b]/20 bg-black/40">
                  <svg className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                  <span className="text-[10px] font-serif font-black text-amber-400 tracking-widest uppercase mt-1">
                    {Math.round(audioProgress)}%
                  </span>
               </div>

               <div className="flex-1 flex flex-col justify-center px-4 z-10 overflow-hidden">
                  <div className="text-left mb-1 pr-2">
                    <span className="text-[9px] uppercase tracking-wider text-[#a67c47] font-bold block truncate">Now Playing</span>
                    <span className="text-xs font-serif font-bold text-[#ffedb3] block truncate">{currentTitle || "Ancient Lore"}</span>
                  </div>

                  <div className="flex items-center justify-between px-1">
                     <button onClick={(e) => { e.stopPropagation(); onPrevChapter(); }} disabled={!hasPrevChapter} className={`p-1.5 rounded-full transition-all cursor-pointer ${hasPrevChapter ? "text-amber-500/70 hover:text-amber-300 hover:bg-slate-800/50" : "text-slate-600 opacity-30"}`}>
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                     </button>
                     <button onClick={toggleAudio} className="w-8 h-8 flex items-center justify-center rounded-full border border-amber-500/40 bg-gradient-to-br from-[#2a1708] to-black text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:scale-105 transition-all cursor-pointer">
                        {isPlaying && !isPaused ? (
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        )}
                     </button>
                     <button onClick={(e) => { e.stopPropagation(); onNextChapter(); }} disabled={!hasNextChapter} className={`p-1.5 rounded-full transition-all cursor-pointer ${hasNextChapter ? "text-amber-500/70 hover:text-amber-300 hover:bg-slate-800/50" : "text-slate-600 opacity-30"}`}>
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}