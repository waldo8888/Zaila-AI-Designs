/**
 * The story director (spec §8): turns chapter progress into what the particle
 * stage shows. Pure, so every scene is a function of progress and scrolling
 * back reverses it exactly. Version 1 covers the night: the intro, the hero
 * and the reality. Plan 3 adds the sunrise, the sky and the nav theme.
 */
import { clamp01 } from "./sky-stops.ts";

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
};

export function introPhase(seconds: number | null): IntroPhase {
  if (seconds === null || seconds >= INTRO.end) return "done";
  return seconds < INTRO.hold ? "play" : "reveal";
}

const smooth = (t: number) => t * t * (3 - 2 * t);

export function directStage({ introSeconds, heroExit, reality }: StoryInput): StageState {
  const r = clamp01(reality);
  return {
    fly: introSeconds === null ? 1 : clamp01(introSeconds / INTRO.fly),
    stream:
      introSeconds === null
        ? 1
        : clamp01((introSeconds - INTRO.hold) / (INTRO.end - INTRO.hold)),
    leak: smooth(clamp01((r - 0.1) / 0.8)),
    spin: clamp01(heroExit) * 0.6 + r * 0.5,
  };
}
