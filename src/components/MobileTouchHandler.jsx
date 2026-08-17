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
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <MobileContext.Provider value={{ isMobile }}>
      <div className={`w-full h-full relative ${isMobile ? 'mobile-touch-active' : ''}`}>
        {children}
      </div>
    </MobileContext.Provider>
  );
}