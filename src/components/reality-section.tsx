"use client";

import { Fragment, useEffect, useRef } from "react";
import { storyProgress } from "@/components/story/story-progress";

const WORDS =
  "Someone Googles you tonight, lands on a slow page with no way to book, and calls the next place on the list.".split(
    " "
  );

/** A word not yet filled: dim, but still 3.4:1 on the night (large type needs 3:1). */
const UNFILLED = "#63636E";
const FILLED = "#F4F4F5";

/**
 * 01 The reality (spec §5). On desktop the chapter pins for 0.75 screen (CSS
 * sticky; ScrollTrigger only reads progress) while the sentence fills word by
 * word and the particle stage leaks about 45% of the orb off the right edge.
 * Phones fill it as it passes the middle of the screen, with no pin. With
 * reduced motion nothing moves and every line shows in full. The words are
 * plain spans in the server HTML, so screen readers read one sentence.
 */
export function RealitySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let cancelled = false;
    let revert: (() => void) | undefined;

    // GSAP loads after first paint, like the smooth scroll (spec §11)
    import("@/lib/motion/gsap").then(({ gsap, ScrollTrigger, MOTION_QUERIES }) => {
      if (cancelled) return;
      const mm = gsap.matchMedia();

      const scene = (start: string, end: string) => {
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: section, start, end, scrub: 0.6 },
          // The stage reads this every frame to drive the leak (story-director.ts)
          onUpdate: () => {
            storyProgress.reality = timeline.progress();
          },
        });
        timeline
          .fromTo(".reality-line-fill", { scaleY: 0 }, { scaleY: 1, ease: "none", duration: 1 }, 0)
          .fromTo(
            ".reality-word",
            { color: UNFILLED },
            { color: FILLED, ease: "none", duration: 0.06, stagger: 0.03 },
            0
          )
          .fromTo(".reality-punch", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.12 }, 0.7)
          .fromTo(".reality-coda", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.12 }, 0.84);
        return () => {
          storyProgress.reality = 0;
        };
      };

      // Desktop: from the sentence coming into view to the end of the pin
      mm.add(MOTION_QUERIES.desktop, () => scene("top 55%", "bottom bottom"), section);
      // Phones: while the chapter passes through the middle of the screen
      mm.add(MOTION_QUERIES.phone, () => scene("top 75%", "bottom 45%"), section);

      // Web fonts change the chapter's height on phones: measure again once they're in
      document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
      revert = () => mm.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
      storyProgress.reality = 0;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="story"
      aria-labelledby="reality-title"
      className="relative lg:motion-safe:h-[175vh]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-20 lg:px-20 lg:py-40 lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:flex lg:motion-safe:h-svh lg:motion-safe:flex-col lg:motion-safe:justify-center lg:motion-safe:py-0">
        <h2
          id="reality-title"
          className="text-xs text-night-dim lg:text-label lg:motion-safe:absolute lg:motion-safe:top-[72px]"
        >
          01 / The reality
        </h2>
        <div className="relative mt-8 max-w-[700px] lg:mt-12 lg:motion-safe:mt-0">
          <div
            aria-hidden="true"
            className="absolute -left-8 bottom-0 top-1.5 hidden w-0.5 bg-night-line lg:block"
          >
            <div className="reality-line-fill h-full origin-top bg-brand-glow" />
          </div>
          <p className="font-display text-statement font-bold text-night-text">
            {WORDS.map((word, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className="reality-word">{word}</span>
              </Fragment>
            ))}
          </p>
          <p className="reality-punch mt-6 font-display text-statement leading-[1.1] font-extrabold tracking-[-0.035em] text-brand-glow lg:mt-[52px]">
            You never hear about it.
          </p>
          <p className="reality-coda mt-3.5 text-[15px] leading-[1.6] text-night-muted lg:text-lg">
            That&apos;s the leak we fix.
          </p>
        </div>
      </div>
    </section>
  );
}
