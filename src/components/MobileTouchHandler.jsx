// src/components/MobileTouchHandler.jsx
"use client";
import { useEffect, useState, createContext, useContext } from "react";

const MobileContext = createContext({ isMobile: false });

export function useMobile() {
  return useContext(MobileContext);
}

export default function MobileTouchHandler({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      const isSmall = window.innerWidth < 1024;
      setIsMobile(hasTouch || isSmall);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <MobileContext.Provider value={{ isMobile }}>
      <div className="w-full h-full relative" style={{ touchAction: 'auto' }}>
        {children}
      </div>
    </MobileContext.Provider>
  );
}