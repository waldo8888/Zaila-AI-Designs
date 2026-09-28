/**
 * The story director (spec §8): turns chapter progress into what the particle
 * stage shows and how the sky looks. Pure, so every scene is a function of
 * progress and scrolling back reverses it exactly. Version 2 covers the night
 * (the intro, the hero, the reality) and the sunrise into the fix. Plan 5
 * adds the dusk and the logo bookend.
 */
import { DUSK, SUNRISE, clamp01, luminance, sampleStops } from "./sky-stops.ts";

/** Intro timings, in seconds from its first frame: fly in, hold, stream into the orb. */
export const INTRO = { fly: 1.2, hold: 1.85, end: 2.65 } as const;

/** Where the intro is: the curtain is up, lifting, or gone. */
export type IntroPhase = "play" | "reveal" | "done";

export type StoryInput = {
  /** Seconds since the intro's first frame, or null when this visit has no intro. */
  introSeconds: number | null;
  /** 0 → 1 as the hero scrolls out of view. */
  heroExit: number;
  /** 0 → 1 through the reality chapter's fill. */
  reality: number;
  /** 0 → 1 from the reality's release to the fix's pin. */
  sunrise: number;
};

export type StageState = {
  /** 0 → 1: scattered particles fly into the logo. */
  fly: number;
  /** 0 → 1: the logo streams into the orb. */
  stream: number;
  /** 0 → 1: the leak. Each particle's own threshold decides when it goes. */
  leak: number;
  /** Extra turn of the orb, in radians, that follows the scroll. */
  spin: number;
  /** 0 → 1: the particles still in the orb fall into a horizon. */
  horizon: number;
  /** 0 → 1: they land on the sample site and fade as it appears. */
  landing: number;
  /** False once they've landed: the day chapters need no particles (spec §8). */
  running: boolean;
};

export type SkyInput = {
  /** 0 → 1 across the sunrise. */
  sunrise: number;
  /** 0 → 1 as the sky turns back to night. */
  dusk: number;
};

export type SkyState = {
  top: string;
  mid: string;
  bottom: string;
  /** Opacity of the night glow behind the stage. */
  glow: number;
  /** The nav's theme: day once the top of the sky is light. */
  nav: "night" | "day";
};

export function introPhase(seconds: number | null): IntroPhase {
  if (seconds === null || seconds >= INTRO.end) return "done";
  return seconds < INTRO.hold ? "play" : "reveal";
}

const smooth = (t: number) => t * t * (3 - 2 * t);

export function directStage({ introSeconds, heroExit, reality, sunrise }: StoryInput): StageState {
  const r = clamp01(reality);
  const s = clamp01(sunrise);
  const landing = smooth(clamp01((s - 0.55) / 0.45));
  return {
    fly: introSeconds === null ? 1 : clamp01(introSeconds / INTRO.fly),
    stream:
      introSeconds === null
        ? 1
        : clamp01((introSeconds - INTRO.hold) / (INTRO.end - INTRO.hold)),
    leak: smooth(clamp01((r - 0.1) / 0.8)),
    spin: clamp01(heroExit) * 0.6 + r * 0.5,
    horizon: smooth(clamp01(s / 0.55)),
    landing,
    running: landing < 1,
  };
}

/**
 * The sky (spec §6). In both transitions the bottom of the screen leads,
 * because the next chapter's content arrives from below: mid-sunrise the top
 * is still night and the bottom is already mist, as the Sunrise frame shows.
 */
export function directSky({ sunrise, dusk }: SkyInput): SkyState {
  const s = clamp01(sunrise);
  const d = clamp01(dusk);
  const stops = d > 0 ? DUSK : SUNRISE;
  const t = d > 0 ? d : s;
  const top = sampleStops(stops, t * 2 - 1);
  const midAt = t * 2 - 0.5;
  return {
    top,
    mid: sampleStops(stops, midAt),
    bottom: sampleStops(stops, t * 2),
    // The glow sits in the middle of the screen and is only lighter than night,
    // so it shows while the middle is still night-dark and is gone as it lightens
    glow: d > 0 ? clamp01((midAt - 0.85) / 0.15) : 1 - clamp01(midAt / 0.15),
    nav: luminance(top) > 0.3 ? "day" : "night",
  };
}
