"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";

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
      autoRaf: false,
    });

    (window as LenisWindow).__lenis = lenisInstance;
    const publishLenisId = window.setTimeout(() => setLenis(lenisInstance), 0);

    // Lenis runs on GSAP's clock and feeds ScrollTrigger, so smooth scrolling
    // and the scroll scenes never disagree (spec §7).
    lenisInstance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenisInstance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.clearTimeout(publishLenisId);
      gsap.ticker.remove(tick);
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
