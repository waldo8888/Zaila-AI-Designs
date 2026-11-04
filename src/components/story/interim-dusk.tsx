"use client";

import { useEffect, useRef } from "react";
import { storyProgress } from "@/components/story/story-progress";

/**
 * Until plan 5 rebuilds the sections below the fix in daylight, they're still
 * the dark originals, so the sky turns back to night as they arrive. This
 * marker sits at the top of the first of them and publishes that dusk for
 * the stage. Plan 5 moves the dusk to the marquee and archives this file.
 */
export function InterimDusk() {
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    let cancelled = false;
    let revert: (() => void) | undefined;

    import("@/lib/motion/gsap").then(({ gsap }) => {
      if (cancelled) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const dusk = gsap.timeline({
          scrollTrigger: { trigger: marker, start: "top bottom", end: "top 35%", scrub: 0.6 },
          onUpdate: () => {
            storyProgress.dusk = dusk.progress();
          },
        });
        dusk.to({}, { duration: 1 });
        return () => {
          storyProgress.dusk = 0;
        };
      });
      revert = () => mm.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
      storyProgress.dusk = 0;
    };
  }, []);

  return <div ref={markerRef} aria-hidden="true" />;
}
