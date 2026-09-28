"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type Lenis from "lenis";

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

    let cancelled = false;
    let teardown: (() => void) | null = null;

    // Lenis and GSAP load after first paint, so they stay off the critical
    // rendering path (spec §11). Native scrolling works until they arrive.
    Promise.all([import("lenis"), import("@/lib/motion/gsap")]).then(
      ([{ default: LenisClass }, { gsap, ScrollTrigger }]) => {
        if (cancelled) return;

        const lenisInstance = new LenisClass({
          duration: 0.9,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          touchMultiplier: 1.4,
          infinite: false,
          autoRaf: false,
        });

        (window as LenisWindow).__lenis = lenisInstance;
        setLenis(lenisInstance);

        // Lenis runs on GSAP's clock and feeds ScrollTrigger, so smooth scrolling
        // and the scroll scenes never disagree (spec §7).
        lenisInstance.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenisInstance.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        teardown = () => {
          gsap.ticker.remove(tick);
          if ((window as LenisWindow).__lenis === lenisInstance) {
            delete (window as LenisWindow).__lenis;
          }
          lenisInstance.destroy();
        };
      }
    );

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={lenis}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
