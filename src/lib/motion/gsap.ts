/**
 * GSAP set-up for the scroll story (spec §7). Import only from client components.
 * Plugins register once, in the browser.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

/** The three motion modes every scroll scene is written for (spec §7). */
export const MOTION_QUERIES = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  phone: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
