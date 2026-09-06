"use client";

import { useState, useEffect, useRef } from "react";

export default function AudioLorePlayer({ 
  textToRead, 
  onNextChapter, 
  onPrevChapter, 
  hasNextChapter, 
  hasPrevChapter 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [audioProgress, setAudioProgress] = useState(0);
  
  const isHoveringRef = useRef(false);

  // Reset audio & UI state if the chapter changes or manuscript is closed
  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setAudioProgress(0);
    if (!isHoveringRef.current) {
      setIsExpanded(false);
    }
    return () => window.speechSynthesis.cancel();
  }, [textToRead]);

  // SMART HOVER & TAP LOGIC
  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    // Auto-expand on hover ONLY if it's not playing.
    if (!isPlaying) setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    // Auto-collapse on leave ONLY if it's not playing.
    if (!isPlaying) setIsExpanded(false);
  };

  const handleTabClick = () => {
    // Allows toggling the player open/closed at any time by clicking it
    setIsExpanded(!isExpanded);
  };

  const playText = (volLevel = volume) => {
    const synth = window.speechSynthesis;
    synth.cancel(); 
    
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(textToRead);
        
        utterance.rate = 0.75; 
        utterance.pitch = 0.5; 
        utterance.volume = volLevel; 
        
        const voices = synth.getVoices();
        const englishVoices = voices.filter(v => v.lang.startsWith('en'));
        const epicVoice = englishVoices.find(v => 
          v.name.includes('Google UK English Male') || 
          v.name.includes('Daniel') ||                 
          v.name.includes('David')                     
        ) || englishVoices[0]; 

        if (epicVoice) utterance.voice = epicVoice;

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
            if (!isHoveringRef.current) setIsExpanded(false); 
          }, 1000);
        };

        synth.speak(utterance);
        setIsPlaying(true);
        setIsPaused(false);
        setIsExpanded(true); // Auto-expand when playback initially starts
    }, 50);
  };

  const toggleAudio = () => {
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

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    // Removed the playText(newVolume) call here so it stops restarting the audio mid-sentence!
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTabClick}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] flex items-center"
    >
      <div 
        className={`relative group bg-gradient-to-l from-[#1c110685] via-slate-800/70 to-slate-900 shadow-[inset_0_2px_5px_rgba(255,255,255,0.2),_0_0_15px_rgba(245,158,11,0.2)] transition-all duration-700 ease-in-out overflow-hidden pointer-events-auto
        ${isExpanded ? "w-[360px] h-28 rounded-l-full shadow-[0_0_40px_rgba(245,158,11,0.7)] cursor-pointer" : "w-20 h-32 rounded-l-full hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] cursor-pointer"}`}
      >
        
        {/* --- DYNAMIC BORDER & PROGRESS BAR --- */}
        {!isPlaying ? (
          // IDLE STATE: Spinning gold border
          <div className="absolute inset-0 rounded-l-full pointer-events-none z-0" style={{ padding: "2px 0px 2px 2px", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }}>
            <div className="absolute top-1/2 right-1/2 w-[300%] aspect-square translate-x-1/2 -translate-y-1/2 animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_120deg,transparent_75%,#fcd34d_100%)]" />
          </div>
        ) : (
          // PLAYING STATE: Audio tracker
          isExpanded ? (
            // Expanded Progress Bar
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" width="360" height="112" viewBox="0 0 360 112">
              <path d="M 360 1.5 L 56 1.5 A 54.5 54.5 0 0 0 56 110.5 L 360 110.5" fill="none" stroke="#fcd34d" strokeWidth="3" strokeDasharray="781" strokeDashoffset={781 - (audioProgress / 100 * 781)} className="transition-all duration-300 ease-linear shadow-[0_0_10px_#fcd34d]" strokeLinecap="round" />
            </svg>
          ) : (
            // Hidden/Collapsed Progress Bar
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" width="80" height="128" viewBox="0 0 80 128">
              <path d="M 80 1.5 L 64 1.5 A 62.5 62.5 0 0 0 64 126.5 L 80 126.5" fill="none" stroke="#fcd34d" strokeWidth="3" strokeDasharray="230" strokeDashoffset={230 - (audioProgress / 100 * 230)} className="transition-all duration-300 ease-linear shadow-[0_0_10px_#fcd34d]" strokeLinecap="round" />
            </svg>
          )
        )}

        <div className={`absolute inset-0 rounded-l-full pointer-events-none border-y border-l border-r-0 transition-colors duration-700 ${isPlaying ? "border-amber-700/20" : isExpanded ? "border-amber-300" : "border-amber-700/30 group-hover:border-amber-400"}`} />

        {/* COLLAPSED STATE: Visible when hidden */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ease-out pr-2 ${isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          {/* New Audiobook Icon */}
          <svg className="w-8 h-8 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,1)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 010-5H20" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 10l5-3v6l-5-3z" fill="currentColor" stroke="none" />
          </svg>
          {/* Persistent Percentage */}
          <span className="text-[10px] font-serif font-bold text-amber-300 tracking-widest uppercase drop-shadow-sm mt-2">
            {isPlaying || audioProgress > 0 ? `${Math.round(audioProgress)}%` : "LORE"}
          </span>
        </div>

        {/* EXPANDED STATE: The Controls */}
        <div className={`absolute top-0 right-0 w-[360px] h-28 flex items-center transition-opacity duration-500 delay-100 ease-in ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
           
           <div className="w-24 h-full flex flex-col items-center justify-center flex-shrink-0 relative z-10 border-r border-amber-500/20 bg-black/20">
              <svg className="w-8 h-8 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,1)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 010-5H20" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 10l5-3v6l-5-3z" fill="currentColor" stroke="none" />
              </svg>
              <span className="text-[10px] font-serif font-bold text-amber-300 tracking-widest uppercase drop-shadow-sm mt-2">
                {Math.round(audioProgress)}%
              </span>
           </div>

           <div className="flex-1 flex flex-col justify-center px-6 z-10 gap-3">
              <div className="flex items-center justify-between px-2">
                 <button onClick={(e) => { e.stopPropagation(); onPrevChapter(); }} disabled={!hasPrevChapter} className={`p-2 rounded-full transition-all ${hasPrevChapter ? "text-amber-500/70 hover:text-amber-300 hover:shadow-[0_0_10px_rgba(251,191,36,0.5)] hover:bg-slate-700/50" : "text-slate-600 opacity-50"}`}>
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                 </button>

                 <button onClick={(e) => { e.stopPropagation(); toggleAudio(); }} className="w-12 h-12 flex items-center justify-center rounded-full border border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:scale-110 hover:bg-amber-500/40 transition-all">
                    {isPlaying && !isPaused ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                      <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                 </button>

                 <button onClick={(e) => { e.stopPropagation(); onNextChapter(); }} disabled={!hasNextChapter} className={`p-2 rounded-full transition-all ${hasNextChapter ? "text-amber-500/70 hover:text-amber-300 hover:shadow-[0_0_10px_rgba(251,191,36,0.5)] hover:bg-slate-700/50" : "text-slate-600 opacity-50"}`}>
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                 </button>
              </div>

              <div className="flex items-center gap-3">
                 <svg className="w-4 h-4 text-amber-500/70" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                 <input 
                   type="range" 
                   min="0" 
                   max="1" 
                   step="0.1" 
                   value={volume} 
                   onChange={handleVolumeChange}
                   onClick={(e) => e.stopPropagation()} 
                   className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400" 
                 />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}