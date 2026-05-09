"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";

const SmoothScrollContext = createContext<Lenis | null>(null);
type LenisWindow = Window & typeof globalThis & { __lenis?: Lenis };

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;

    if (prefersReducedMotion || coarsePointer) {
      return;
    }

    const lenisInstance = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.4,
      infinite: false,
    });

    (window as LenisWindow).__lenis = lenisInstance;
    const publishLenisId = window.setTimeout(() => setLenis(lenisInstance), 0);

    let rafId = 0;
    function raf(time: number) {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      window.clearTimeout(publishLenisId);
      cancelAnimationFrame(rafId);
      if ((window as LenisWindow).__lenis === lenisInstance) {
        delete (window as LenisWindow).__lenis;
      }
      lenisInstance.destroy();
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={lenis}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
