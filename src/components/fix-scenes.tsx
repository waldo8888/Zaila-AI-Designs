"use client";

import { useEffect } from "react";
import { storyProgress } from "@/components/story/story-progress";

/**
 * The fix's scroll scenes (spec §5). The section is pinned by CSS; this only
 * reads progress. The arrival publishes the sunrise for the stage and fades
 * the sample site in as the particles land on it. The pin builds the site
 * one service at a time, at 25, 50 and 75%, and each row follows along.
 * Renders nothing; with reduced motion the section stays in its finished state.
 */
export function FixScenes() {
  useEffect(() => {
    const section = document.getElementById("services");
    if (!section) return;
    storyProgress.landingTarget = section.querySelector<HTMLElement>(".fix-frame");
    let cancelled = false;
    let revert: (() => void) | undefined;

    // GSAP loads after first paint (spec §11)
    import("@/lib/motion/gsap").then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const rows = gsap.utils.toArray<HTMLElement>(".fix-step", section);
          const site = section.querySelector(".fix-frame-wrap");

          // The arrival: the stage's sunrise, and the site fading in as the particles land
          const arrival = gsap.timeline({
            scrollTrigger: { trigger: section, start: "top bottom", end: "top top", scrub: 0.6 },
            onUpdate: () => {
              storyProgress.sunrise = arrival.progress();
            },
          });
          arrival
            .to({}, { duration: 1 }, 0)
            .fromTo(".fix-frame-wrap", { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.45 }, 0.55);

          // The build across the pin
          gsap.set(rows, { attr: { "data-state": "upcoming" } });
          gsap.set(rows[0], { attr: { "data-state": "active" } });
          gsap.set(site, { attr: { "data-build": "1" } });
          const build = gsap.timeline({
            scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.4 },
          });
          build.to({}, { duration: 1 }, 0);
          for (let step = 1; step < rows.length; step++) {
            build
              .set(rows[step - 1], { attr: { "data-state": "done" } }, step * 0.25)
              .set(rows[step], { attr: { "data-state": "active" } }, step * 0.25)
              .set(site, { attr: { "data-build": String(step + 1) } }, step * 0.25);
          }

          return () => {
            storyProgress.sunrise = 0;
          };
        },
        section
      );

      // Web fonts change heights: measure again once they're in
      document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
      revert = () => mm.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
      storyProgress.sunrise = 0;
      storyProgress.landingTarget = null;
    };
  }, []);

  return null;
}
