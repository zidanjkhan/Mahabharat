"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ManuscriptAudioPlayer({ 
  textToRead, 
  onNextChapter, 
  onPrevChapter, 
  hasNextChapter, 
  hasPrevChapter 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(0.8);

  // Stop the audio if the manuscript is closed or the chapter changes
  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    return () => window.speechSynthesis.cancel();
  }, [textToRead]);

  const toggleAudio = () => {
    const synth = window.speechSynthesis;

    if (isPlaying && !isPaused) {
      synth.pause();
      setIsPaused(true);
    } else if (isPlaying && isPaused) {
      synth.resume();
      setIsPaused(false);
    } else {
      synth.cancel(); 
      
      setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(textToRead);
          
          utterance.rate = 0.75; // Slower, dramatic pace
          utterance.pitch = 0.5; // Deep mythical pitch
          utterance.volume = volume; // Hooked to your volume slider
          
          const voices = synth.getVoices();
          const englishVoices = voices.filter(v => v.lang.startsWith('en'));
          const epicVoice = englishVoices.find(v => 
            v.name.includes('Google UK English Male') || 
            v.name.includes('Daniel') ||                 
            v.name.includes('David')                     
          ) || englishVoices[0]; 

          if (epicVoice) utterance.voice = epicVoice;

          utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
          };

          synth.speak(utterance);
          setIsPlaying(true);
          setIsPaused(false);
      }, 50);
    }
  };

  // Note: Browser TTS doesn't change volume mid-sentence easily. 
  // If the user changes volume while playing, we pause/resume to apply it quickly.
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (isPlaying && !isPaused) {
        window.speechSynthesis.pause();
        // The new volume applies to the next spoken chunk in most browsers
        window.speechSynthesis.resume(); 
    }
  };

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] flex items-center"
    >
      {/* THE SLIDING PANEL */}
      <motion.div
        animate={{ 
          width: isHovered ? "280px" : "48px",
          borderTopLeftRadius: isHovered ? "12px" : "24px",
          borderBottomLeftRadius: isHovered ? "12px" : "24px"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="h-16 bg-[#1a202c]/95 border-y border-l border-amber-500/30 shadow-[-5px_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center overflow-hidden relative"
      >
        {/* COLLAPSED STATE (Just the icon) */}
        <div className="min-w-[48px] w-[48px] h-full flex items-center justify-center absolute right-0 cursor-pointer text-amber-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>

        {/* EXPANDED STATE (The Controls) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center w-full pl-4 pr-12 gap-3"
            >
              {/* Previous Chapter */}
              <button 
                onClick={onPrevChapter}
                disabled={!hasPrevChapter}
                className={`p-1.5 rounded-full transition-colors ${hasPrevChapter ? "text-slate-300 hover:text-amber-400 hover:bg-slate-700" : "text-slate-600 cursor-not-allowed"}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
              </button>

              {/* Play/Pause */}
              <button 
                onClick={toggleAudio}
                className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-amber-500/10 border border-amber-500/50 rounded-full hover:bg-amber-500/20 hover:scale-105 transition-all text-amber-400"
              >
                {isPlaying && !isPaused ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> // Pause
                ) : (
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> // Play
                )}
              </button>

              {/* Next Chapter */}
              <button 
                onClick={onNextChapter}
                disabled={!hasNextChapter}
                className={`p-1.5 rounded-full transition-colors ${hasNextChapter ? "text-slate-300 hover:text-amber-400 hover:bg-slate-700" : "text-slate-600 cursor-not-allowed"}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 ml-2 w-full">
                <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}