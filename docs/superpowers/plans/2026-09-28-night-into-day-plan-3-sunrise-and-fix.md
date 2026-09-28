# Night into day, plan 3 of 6: Sunrise and the Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn night into day as the fix arrives. The sky scrubs from night to mist, the orb's remaining particles fall into a horizon and land on a sample site, and "02 The fix" pins while that site builds itself one service at a time. The nav turns to its day theme, and the particle stage sleeps once it has landed.

**Architecture:**
- **The director grows a sky.** `directSky` turns sunrise and dusk progress into three sky colours (top, middle, bottom), the night glow and the nav theme. `directStage` adds the horizon, the landing and a `running` flag. Both stay pure and unit-tested.
- **The fix is server HTML in its finished state:** every service open, the sample site fully built. A client island, `fix-scenes.tsx`, loads GSAP after first paint. It pins the chapter with CSS sticky and steps the build through `data-state` and `data-build` attributes, which CSS styles and transitions. It also publishes the sunrise progress and the sample site's element for the stage.
- **The stage** reads that progress each frame. It writes the sky variables and `<html data-nav-theme>`, draws the horizon and the landing, and stops drawing once the landing completes.
- **An interim dusk.** Until plan 5 rebuilds the sections below the fix in daylight, a small marker turns the sky back to night as the old, dark sections arrive.

**Tech Stack:** Next.js 16.1.6 (App Router, Turbopack), React 19.2, TypeScript 5, Tailwind CSS 4.2 (container units, CSS variables), three 0.183, GSAP 3.15 (ScrollTrigger), `next/font/google` (adds Fraunces for the sample site), Node's built-in test runner, Lighthouse 12 via `npx`.

**Spec:** `docs/superpowers/specs/2026-09-27-night-into-day-homepage-design.md`. Read §4, §5 ("Sunrise handoff", "02 The fix"), §6, §7, §8, §10 and §12 first. This plan is the spec's build phase 3. Plan 2 (`docs/superpowers/plans/2026-09-28-night-into-day-plan-2-night.md`) built the stage shell, the story scene, the director v1, the intro gate, the nav and the reality chapter this plan extends. Design frames: https://claude.ai/artifact/RkjEadVhEvTnBaqsVRSpzz, files `project/Sunrise.dc.html`, `project/Fix.dc.html`, `project/FixStoryboard.dc.html`, `project/MobileFix.dc.html` (read with the Artifact tool's `read` action).

## Global Constraints

**Git and rollout**
- Work only on branch `feat/night-into-day-2026-09`. It has a draft PR, https://github.com/waldo8888/Zaila-AI-Designs/pull/4. Never commit to `main`. Don't push without Waldo's word for this plan: merging `main` deploys production.
- Commit messages have **no** `Co-Authored-By` lines (Waldo's standing preference).
- Stage paths explicitly (`git add <paths>`). Never `git add -A` or `git add .`, because the untracked `AGENTS.md` at the repo root isn't part of this work. After a `git mv`, add only the new path, since the old one no longer exists.
- Never delete a file. A replaced file moves with `git mv` to `archive/2026-09-night-into-day/<its original path>`, and the move is logged in `/Users/sheldonsteele/ZailaAIDesignsBusiness/HANDOFF.md` (Task 7).

**Secrets, servers and other sessions**
- Never read or modify `.env*`, `.env.sentry-build-plugin` or anything under `credentials/`.
- `npm run build` runs the Sentry plugin and may upload source maps. That's expected.
- Production server: `npm run build && npm run start -- -p 3100`. Port 3000 belongs to another app (pid 57320): never stop it. Stop only servers you started (`lsof -ti tcp:3100 | xargs kill`).
- Check pages with `scripts/cdp.mjs` and `scripts/shot.sh` (headless Chrome with real frames; `MOBILE=1`, `REDUCED=1` and `LOADS=n` options). The browser pane is hidden and renders no frames. Never kill any other Chrome process.
- Don't touch `.claude/worktrees/`, and in `src/app/layout.tsx` leave the `metadata` object alone. Both belong to the metadata-sweep branch.
- Edit CSS with the Edit tool, not shell appends.

**Stack**
- Styling stays Tailwind v4 plus `src/app/globals.css`. No new npm dependencies. The one new font, Fraunces, comes through the existing `next/font/google`, and only the sample site uses it (not preloaded).
- GSAP is only ever loaded with `import("@/lib/motion/gsap")` inside an effect of a homepage client component.
- Pins are CSS `position: sticky`; ScrollTrigger reads progress and never pins. Reduced motion: no pins or scrubs, every line in its final state.

**Design rules**
- Tokens (spec §6), all available as Tailwind colours and as CSS variables (`var(--color-…)`; Tailwind 4.2 emits them all):

  | Name | Value |
  |---|---|
  | `night`, `night-text`, `night-muted` | `#07060B`, `#F4F4F5`, `#A1A1AA` |
  | `day`, `day-raise`, `day-text`, `day-muted`, `day-dim`, `day-line` | `#F1F3F7`, `#FFFFFF`, `#0F172A`, `#475569`, `#56637A`, `#E2E8F0` |
  | `brand`, `brand-glow`, `brand-ink`, `lavender` | `#7C3AED`, `#A855F7`, `#6D28D9`, `#EDE9FE` |

- Sky stops: sunrise `#07060B #140C26 #2F2158 #6B59A8 #B8AADD #E6E0F4 #F1F3F7`; dusk the reverse journey (`sky-stops.ts`, plan 1).
- Standing preferences: no page transitions, no text labels in the custom cursor.
- Budgets (spec §8): 9,000 particles on desktop, 5,000 on phones (< 1024 px); the stage does no drawing during the day chapters.

**Copy**
- Approved, verbatim:
  - Heading "A premium site, live in days."
  - The fix description: "We figure out what's actually losing you leads, then design and build for that. Booking, payments, and AI support come in when they earn their spot — not because our name has AI in it. (Long story.)"
  - The four service names, feature lines and full descriptions (moved from `services-section.tsx`).
  - "See pricing — builds from $800 →"
  - "Not sure which tier? Book the discovery call. We'll tell you if you're overbuying."
- Approved by Waldo's delegation on 2026-09-28 (spec §10):
  - The label "02 / The fix".
  - The sample site: "Your Salon", "Services", "Prices", "Visit", "Book now", "Your best hair day starts here.", "Cuts, colour and blowouts. Book online anytime.", "Book an appointment", "Next openings", "Sat 10:30", "Sat 1:15", "Sun 11:00", "Hi, any openings Saturday?", "Yes, 10:30 or 1:15. Want me to book one?", "[Salon photo]", "yourbusiness.ca".
  - The care card: "Care plan", "This month's check-in", "Hosting", "Updates", "Performance check".
- Dropped, also approved: the old services header "What we build", "Websites, lead flow, and the stuff that keeps them working" and its one-journey sub.

**Speed gate** (unchanged from plan 2)
- Applied throttling, median of 3, against the baseline (Performance 87, LCP 1.72 s): Performance ≥ 84, LCP ≤ 1.92 s, CLS ≤ 0.1.
- Simulated (5 runs): Accessibility 100, SEO 100, Best practices ≥ 96.
- Methods are in `docs/superpowers/plans/2026-09-27-night-into-day-log.md`. If the gate misses, stop and report.

**Code style**
- Match the codebase: 2-space indent, double quotes, semicolons, `"use client"` only where needed, `@/` imports in app code.
- Pure modules in `src/components/story/*.ts` import nothing from the app. Tests import them with `.ts`, and so do pure modules importing each other. Type-only imports use `import type`.
- React Compiler lint rules apply: no synchronous `setState` in an effect body, and no impure calls during render.
- Checks: `npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build`.

## Deliberate differences from the spec and the frames

1. **The sky gets a middle colour** (`--sky-mid`). The Sunrise frame passes through violet on its way from night to mist, and a two-colour gradient would go grey instead.
2. **In both transitions the bottom of the sky leads**, because the next chapter's content arrives from below. Mid-sunrise the top is still night (the reality text leaving) and the bottom is already mist (the fix arriving), exactly as the Sunrise frame shows.
3. **An interim dusk right after the fix, until plan 5.** The process, testimonials, proof and contact sections are still the dark originals, so the sky must be night behind them. Plan 5 moves the dusk to the marquee and archives `interim-dusk.tsx`.
4. **Fraunces for the sample salon**, as in the frames. It's the made-up client's own typeface, loaded through `next/font` without preloading.
5. **Phones hide the fix description and the discovery-call line visually**, as in the phone frame, but keep both in the page for screen readers and search.
6. **The nav marks whichever homepage section is under the middle of the screen** (Services, and also Process), not only Services.
7. **Asleep, the stage still runs its small per-frame update** (the director and the sky), but it draws nothing.

---

## File structure

| Path | Status | Responsibility |
|---|---|---|
| `src/components/story/particle-shapes.ts` (+ test) | modify | Horizon and landing targets |
| `src/components/story/sky-stops.ts` (+ test) | modify | `luminance()` |
| `src/components/story/story-director.ts` (+ test) | modify | Director v2: `directSky`; horizon, landing, running |
| `src/components/fix-section.tsx` | create | 02 The fix: copy, the four services, the pin |
| `src/components/sample-site.tsx` | create | The made-up salon site and care card (Fraunces) |
| `src/app/globals.css` | modify | Fix rows, sample site, nav themes, sky middle colour |
| `src/app/page.tsx` | modify | Chapter order |
| `src/components/services-section.tsx` | move to archive | Replaced by the fix |
| `src/components/navbar-new.tsx` | modify | `--nav-*` variables, the current section |
| `src/components/story/story-progress.ts` | modify | `sunrise`, `dusk`, `landingTarget` |
| `src/components/fix-scenes.tsx` | create | The fix's scroll scenes (sunrise progress, the build) |
| `src/components/story/particle-shaders.ts` | modify | Horizon and landing in `STORY_VERTEX`; dust opacity |
| `src/components/story/stage-scene.ts` | modify | `update()` can ask not to draw |
| `src/components/story/stage-ambient.ts` | modify | Dust opacity uniform |
| `src/components/story/stage-story.ts` | modify | Sky, nav theme, horizon, landing, sleep |
| `src/components/story/particle-stage.tsx` | modify | Skips drawing while the scene sleeps; `data-drawing` |
| `src/components/story/interim-dusk.tsx` | create | Night again below the fix, until plan 5 |
| `docs/superpowers/plans/2026-09-27-night-into-day-log.md` | modify | Plan 3 measurements |

## What comes after this plan

| Plan | Scope |
|---|---|
| 4, Selected work | Captures, `src/lib/work.ts` with `enabled`/`linkEnabled` (each project's meta and points from its client profile), frame opening, scroll-linked captures, "Work" in nav and footer (the nav's current-section marking picks up `#work` automatically) |
| 5, The rest of the day | Process (opens with the archived "problem" beat), how we work, marquee, dusk contact with the logo bookend (the stage wakes for it), footer; the dusk moves to the marquee and `interim-dusk.tsx` is archived with the remaining old sections |
| 6, Finish | Phones (orb placement), reduced motion on every page (sky per section without blending), speed pass (inner pages' LCP; `THREE.Clock` → `THREE.Timer`), cross-browser checks, verification against G1–G9, hand-off for a Vercel preview |

---

### Task 1: Horizon and landing targets

**Files:**
- Modify: `src/components/story/particle-shapes.ts` (append two functions)
- Test: `src/components/story/particle-shapes.test.ts` (extend the import, append two tests)

**Interfaces:**
- Consumes: `Rng` (plan 1).
- Produces:
  - `generateHorizon(count: number, rng: Rng): Float32Array`: `count * 3` floats, `[x, y, z]` with x in -1 to 1 (half-widths), y in -0.08 to 0.08 (half-heights), z in -1.2 to 0.6.
  - `generateLanding(count: number, rng: Rng): Float32Array`: `count * 2` floats in 0 to 1, `[u, v]` across the sample site's box.

- [ ] **Step 1: Write the failing tests**

In `src/components/story/particle-shapes.test.ts`, add `generateHorizon,` after `generateHelix,` and `generateLanding,` after `generateLeak,` in the import list. Then append:

```ts
test("the horizon spans the width in a thin band", () => {
  const horizon = generateHorizon(N, mulberry32(6));
  assert.equal(horizon.length, N * 3);
  assert.deepEqual(horizon, generateHorizon(N, mulberry32(6)));
  eachPoint(horizon, (x, y, z) => {
    assert.ok(x >= -1 && x <= 1);
    assert.ok(Math.abs(y) <= 0.08 + 1e-6);
    assert.ok(z >= -1.2 && z <= 0.6);
  });
});

test("landing spots fall inside the sample site's box", () => {
  const spots = generateLanding(N, mulberry32(7));
  assert.equal(spots.length, N * 2);
  for (const value of spots) assert.ok(value >= 0 && value < 1);
});
```

- [ ] **Step 2: Run the tests to make sure they fail**

Run: `npm test`
Expected: FAIL. `particle-shapes.test.ts` can't load (`does not provide an export named 'generateHorizon'`); the other test files pass.

- [ ] **Step 3: Add the generators**

Append to `src/components/story/particle-shapes.ts`:

```ts
/**
 * The horizon the orb's particles settle into at sunrise (spec §5): x across
 * the width in half-widths (-1 to 1), a thin band in y in half-heights, and a
 * little depth. The stage scales it to the screen.
 */
export function generateHorizon(count: number, rng: Rng): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = rng() * 2 - 1;
    positions[i * 3 + 1] = (rng() + rng() - 1) * 0.08;
    positions[i * 3 + 2] = rng() * 1.8 - 1.2;
  }
  return positions;
}

/** Where each particle lands on the sample site: u,v from 0 to 1 across its box. */
export function generateLanding(count: number, rng: Rng): Float32Array {
  const values = new Float32Array(count * 2);
  for (let i = 0; i < values.length; i++) values[i] = rng();
  return values;
}
```

- [ ] **Step 4: Run the tests to make sure they pass**

Run: `npm test`
Expected: `ℹ tests 38`, `ℹ pass 38`, `ℹ fail 0`.

- [ ] **Step 5: Type-check, lint and commit**

```bash
npx tsc --noEmit && npm run lint
git add src/components/story/particle-shapes.ts src/components/story/particle-shapes.test.ts
git commit -m "feat(story): horizon and landing targets"
```

---

### Task 2: The story director, version 2

**Files:**
- Modify: `src/components/story/sky-stops.ts` (append `luminance`)
- Test: `src/components/story/sky-stops.test.ts` (append one test)
- Modify: `src/components/story/story-director.ts` (rewrite)
- Test: `src/components/story/story-director.test.ts` (rewrite)

**Interfaces:**
- Consumes: `SUNRISE`, `DUSK`, `NIGHT`, `DAY`, `clamp01`, `hexToRgb`, `sampleStops` (plan 1).
- Produces:
  - `luminance(hex: string): number` (WCAG relative luminance, 0 to 1).
  - `StoryInput` gains `sunrise: number`.
  - `StageState` gains `horizon: number`, `landing: number`, `running: boolean`.
  - `type SkyInput = { sunrise: number; dusk: number }`.
  - `type SkyState = { top: string; mid: string; bottom: string; glow: number; nav: "night" | "day" }`.
  - `directSky(input: SkyInput): SkyState`.
  - `INTRO`, `IntroPhase`, `introPhase` and `directStage` keep their names.

- [ ] **Step 1: Write the failing tests**

In `src/components/story/sky-stops.test.ts`, add `luminance,` to the import list from `./sky-stops.ts`, then append:

```ts
test("luminance runs from 0 for black to 1 for white", () => {
  assert.equal(luminance("#000000"), 0);
  assert.ok(Math.abs(luminance("#FFFFFF") - 1) < 1e-9);
  assert.ok(luminance(NIGHT) < 0.01);
  assert.ok(luminance(DAY) > 0.85);
});
```

(`NIGHT` and `DAY` are already imported there; add them to the import if they aren't.)

Replace `src/components/story/story-director.test.ts` with:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { DAY, NIGHT, luminance } from "./sky-stops.ts";
import { INTRO, directSky, directStage, introPhase } from "./story-director.ts";

const top = { heroExit: 0, reality: 0, sunrise: 0 };

test("with no intro the orb is already formed", () => {
  const state = directStage({ introSeconds: null, ...top });
  assert.equal(state.fly, 1);
  assert.equal(state.stream, 1);
  assert.equal(introPhase(null), "done");
});

test("the intro flies in, holds on the logo, then streams into the orb", () => {
  const at = (introSeconds: number) => {
    const { fly, stream } = directStage({ introSeconds, ...top });
    return { fly, stream };
  };
  assert.deepEqual(at(0), { fly: 0, stream: 0 });
  assert.deepEqual(at(INTRO.fly), { fly: 1, stream: 0 });
  assert.deepEqual(at(INTRO.hold), { fly: 1, stream: 0 });
  assert.ok(Math.abs(at((INTRO.hold + INTRO.end) / 2).stream - 0.5) < 1e-9);
  assert.deepEqual(at(INTRO.end), { fly: 1, stream: 1 });
});

test("the curtain is up until the hold ends, lifts during the stream, then goes", () => {
  assert.equal(introPhase(0), "play");
  assert.equal(introPhase(INTRO.hold - 0.01), "play");
  assert.equal(introPhase(INTRO.hold), "reveal");
  assert.equal(introPhase(INTRO.end - 0.01), "reveal");
  assert.equal(introPhase(INTRO.end), "done");
});

test("the leak waits for a tenth of the chapter, then grows steadily until nine tenths", () => {
  const leak = (reality: number) =>
    directStage({ introSeconds: null, heroExit: 1, reality, sunrise: 0 }).leak;
  assert.equal(leak(0), 0);
  assert.equal(leak(0.1), 0);
  assert.equal(leak(0.9), 1);
  assert.equal(leak(1), 1);
  let previous = 0;
  for (let step = 0; step <= 100; step++) {
    const value = leak(step / 100);
    assert.ok(value >= previous, `the leak shrank at ${step}%`);
    previous = value;
  }
});

test("the orb turns a little further as the hero and the reality scroll by", () => {
  const spin = (heroExit: number, reality: number) =>
    directStage({ introSeconds: null, heroExit, reality, sunrise: 0 }).spin;
  assert.equal(spin(0, 0), 0);
  assert.ok(spin(1, 0) > spin(0.5, 0));
  assert.ok(spin(1, 1) > spin(1, 0));
});

test("progress outside 0 to 1 is clamped", () => {
  assert.deepEqual(
    directStage({ introSeconds: null, heroExit: 3, reality: 2, sunrise: 5 }),
    directStage({ introSeconds: null, heroExit: 1, reality: 1, sunrise: 1 })
  );
  assert.deepEqual(
    directStage({ introSeconds: -1, heroExit: -1, reality: -1, sunrise: -1 }),
    directStage({ introSeconds: 0, heroExit: 0, reality: 0, sunrise: 0 })
  );
});

test("the sunrise settles the orb into a horizon, then lands it on the sample site", () => {
  const at = (sunrise: number) =>
    directStage({ introSeconds: null, heroExit: 1, reality: 1, sunrise });
  assert.equal(at(0).horizon, 0);
  assert.equal(at(0.55).horizon, 1);
  assert.equal(at(0.55).landing, 0);
  assert.ok(at(0.8).landing > 0 && at(0.8).landing < 1);
  assert.equal(at(1).landing, 1);
});

test("the stage sleeps once the particles have landed, and wakes on the way back", () => {
  const running = (sunrise: number) =>
    directStage({ introSeconds: null, heroExit: 1, reality: 1, sunrise }).running;
  assert.equal(running(0), true);
  assert.equal(running(0.99), true);
  assert.equal(running(1), false);
});

test("the sky is night, then day after the sunrise, then night again after dusk", () => {
  const night = directSky({ sunrise: 0, dusk: 0 });
  const day = directSky({ sunrise: 1, dusk: 0 });
  const dusk = directSky({ sunrise: 1, dusk: 1 });
  assert.deepEqual([night.top, night.mid, night.bottom], [NIGHT, NIGHT, NIGHT]);
  assert.deepEqual([day.top, day.mid, day.bottom], [DAY, DAY, DAY]);
  assert.deepEqual([dusk.top, dusk.mid, dusk.bottom], [NIGHT, NIGHT, NIGHT]);
  assert.deepEqual([night.glow, day.glow, dusk.glow], [1, 0, 1]);
});

test("in both transitions the bottom of the sky leads", () => {
  const rising = directSky({ sunrise: 0.5, dusk: 0 });
  assert.equal(rising.top, NIGHT);
  assert.equal(rising.bottom, DAY);
  assert.ok(luminance(rising.mid) > luminance(rising.top));
  assert.ok(luminance(rising.mid) < luminance(rising.bottom));
  const falling = directSky({ sunrise: 1, dusk: 0.5 });
  assert.equal(falling.top, DAY);
  assert.equal(falling.bottom, NIGHT);
});

test("the nav turns to its day theme once, late in the sunrise, and back at dusk", () => {
  const nav = (sunrise: number, dusk: number) => directSky({ sunrise, dusk }).nav;
  assert.equal(nav(0, 0), "night");
  assert.equal(nav(0.6, 0), "night");
  assert.equal(nav(1, 0), "day");
  assert.equal(nav(1, 1), "night");
  let flips = 0;
  let previous = nav(0, 0);
  for (let step = 1; step <= 100; step++) {
    const current = nav(step / 100, 0);
    if (current !== previous) flips++;
    previous = current;
  }
  assert.equal(flips, 1);
});
```

- [ ] **Step 2: Run the tests to make sure they fail**

Run: `npm test`
Expected: FAIL: `luminance` and `directSky` aren't exported yet (the two files can't load). The other test files pass.

- [ ] **Step 3: Add `luminance`**

Append to `src/components/story/sky-stops.ts`:

```ts
/** WCAG relative luminance of a #RRGGBB colour: 0 for black to 1 for white. */
export function luminance(hex: string): number {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}
```

- [ ] **Step 4: Write director v2**

Replace `src/components/story/story-director.ts` with:

```ts
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
  return {
    top,
    mid: sampleStops(stops, t * 2 - 0.5),
    bottom: sampleStops(stops, t * 2),
    glow: d > 0 ? d : 1 - s,
    nav: luminance(top) > 0.3 ? "day" : "night",
  };
}
```

- [ ] **Step 5: Run the tests to make sure they pass**

Run: `npm test`
Expected: `ℹ tests 44`, `ℹ pass 44`, `ℹ fail 0`.

- [ ] **Step 6: Type-check, lint and commit**

`stage-story.ts` still calls `directStage` without `sunrise`, so `tsc` fails until Task 6 unless you pass it now. In `src/components/story/stage-story.ts`, replace:

```ts
      reality: storyProgress.reality,
    });
```

with:

```ts
      reality: storyProgress.reality,
      sunrise: 0,
    });
```

Then:

```bash
npx tsc --noEmit && npm run lint
git add src/components/story/sky-stops.ts src/components/story/sky-stops.test.ts src/components/story/story-director.ts src/components/story/story-director.test.ts src/components/story/stage-story.ts
git commit -m "feat(story): director v2 with the sky, the horizon and the landing"
```

---

### Task 3: The fix, in its finished state

The chapter as server HTML: every service open and the sample site fully built, on an opaque day panel for now. Task 5 adds the pin and the build; Task 6 lets the sky show through.

**Files:**
- Create: `src/components/sample-site.tsx`
- Create: `src/components/fix-section.tsx`
- Modify: `src/app/globals.css` (fix rows and sample site styles)
- Modify: `src/app/page.tsx`
- Move: `src/components/services-section.tsx` → `archive/2026-09-night-into-day/src/components/services-section.tsx`

**Interfaces:**
- Produces:
  - `FixSection()` at `#services` (the anchor the nav, footer and JSON-LD already use), with `.fix-stage` (the inner container Task 5 pins), `.fix-step` rows (`data-state`: `open` | `upcoming` | `active` | `done`) and the `SampleSite`.
  - `SampleSite()`: `figure.fix-frame-wrap` (`data-build`: `all` | `1` | `2` | `3` | `4`), containing `.fix-frame` (the browser frame the particles land on) and `.ss-care` (the care card). Pieces arrive by step: `.ss-2` (booking), `.ss-3` (chat), `.ss-4` (care card).

- [ ] **Step 1: The sample site**

Create `src/components/sample-site.tsx`:

```tsx
import { Fraunces } from "next/font/google";

// The made-up client's own typeface. Not preloaded: the site sits below the fold.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
  preload: false,
});

const check = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 12.5l5 5L20 7" />
  </svg>
);

/**
 * The made-up salon site that builds itself in 02 The fix (spec §5). It's
 * plainly a sample: a placeholder domain and a labelled photo placeholder.
 * data-build says how far the build has got: "all" in the server HTML, then
 * 1 to 4 while the chapter plays (fix-scenes.tsx). Styles: globals.css,
 * "The sample salon site".
 */
export function SampleSite() {
  return (
    <figure
      className={`fix-frame-wrap ${fraunces.variable}`}
      data-build="all"
      role="img"
      aria-label="A sample site for a made-up salon, built one service at a time: the page, then a booking button and next openings, then a chat reply offering a time, then a monthly care plan check-in."
    >
      <div className="fix-frame">
        <div className="ss-chrome">
          <span className="ss-dot" />
          <span className="ss-dot" />
          <span className="ss-dot" />
          <span className="ss-url">yourbusiness.ca</span>
        </div>
        <div className="ss-page">
          <div className="ss-nav">
            <span className="ss-brand">Your Salon</span>
            <span className="ss-link">Services</span>
            <span className="ss-link">Prices</span>
            <span className="ss-link">Visit</span>
            <span className="ss-book ss-2">
              <span>Book now</span>
            </span>
          </div>
          <div className="ss-hero">
            <div>
              <p className="ss-headline">Your best hair day starts here.</p>
              <p className="ss-sub">Cuts, colour and blowouts. Book online anytime.</p>
              <span className="ss-cta ss-2">
                <span>Book an appointment</span>
              </span>
            </div>
            <div className="ss-photo">
              <span className="ss-photo-label">[Salon photo]</span>
              <div className="ss-chat ss-3">
                <span className="ss-bubble">Hi, any openings Saturday?</span>
                <span className="ss-bubble ss-reply">Yes, 10:30 or 1:15. Want me to book one?</span>
              </div>
            </div>
          </div>
          <div className="ss-openings ss-2">
            <span className="ss-openings-label">Next openings</span>
            <span className="ss-slot">Sat 10:30</span>
            <span className="ss-slot">Sat 1:15</span>
            <span className="ss-slot ss-slot-picked">Sun 11:00</span>
          </div>
        </div>
      </div>
      <div className="ss-care ss-4">
        <p className="ss-care-kicker">
          <span className="ss-care-dot" />
          Care plan
        </p>
        <p className="ss-care-title">This month&apos;s check-in</p>
        <ul className="ss-care-list">
          <li>{check}Hosting</li>
          <li>{check}Updates</li>
          <li>{check}Performance check</li>
        </ul>
      </div>
    </figure>
  );
}
```

- [ ] **Step 2: The section**

Create `src/components/fix-section.tsx`:

```tsx
import Link from "next/link";
import { SampleSite } from "@/components/sample-site";

/** The four services, in build order. Approved copy, moved from the old services section. */
const SERVICES = [
  {
    name: "Websites",
    features: ["Custom design", "Mobile-first", "Fast loads", "SEO basics done"],
    description:
      "Premium, mobile-first sites that load fast and make you look like the obvious choice. Built on Next.js, hosted on the edge, designed to get a visitor to actually do something.",
  },
  {
    name: "Lead systems",
    features: ["Online booking", "Quote & contact forms", "Payments & deposits", "Calendar sync"],
    description:
      "Booking, quote forms, deposits, and checkout — so a visitor can book a table, request a quote, or pay without emailing you first and waiting.",
  },
  {
    name: "AI & automation",
    features: ["Lead capture", "FAQ handling", "Booking handoff", "Trained on your business"],
    description:
      "An assistant that answers the questions you're tired of answering, captures the lead, and books the call. We add it when it actually helps — not as decoration.",
  },
  {
    name: "Care plans",
    features: ["Managed hosting", "Monthly change time", "Performance checks", "SEO monitoring"],
    description:
      "Hosting, updates, and a human who checks on your site every month. A website is like a houseplant — fine in week one, quietly dying by month nine unless someone's watering it.",
  },
];

/**
 * 02 The fix (spec §5): what we build. The server HTML is the finished state,
 * every service open and the sample site fully built, so it reads in full
 * without JavaScript or with reduced motion. Styles: globals.css, "02 The fix".
 */
export function FixSection() {
  return (
    <section id="services" aria-labelledby="fix-title" className="relative bg-day text-day-text">
      <div className="fix-stage mx-auto flex w-full max-w-[1440px] flex-col px-5 py-20 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:content-center lg:items-center lg:gap-[60px] lg:px-20 lg:py-32">
        {/* On phones this column dissolves so the pricing link can follow the site, as in the phone frame */}
        <div className="max-lg:contents">
          <p className="text-xs text-day-muted lg:text-label">02 / The fix</p>
          <h2
            id="fix-title"
            className="mt-2.5 font-display text-[38px] leading-[0.98] font-extrabold tracking-[-0.045em] lg:mt-4 lg:text-[length:clamp(2.5rem,min(4.45vw,7.2vh),4rem)] lg:leading-[0.96]"
          >
            A premium site,{" "}
            <br className="max-lg:hidden" />
            live in days.
          </h2>
          <p className="max-lg:sr-only lg:mt-5 lg:text-base lg:leading-[1.65] lg:text-day-muted">
            We figure out what&apos;s actually losing you leads, then design and build for that.
            Booking, payments, and AI support come in when they earn their spot — not because our
            name has AI in it. (Long story.)
          </p>
          <ol className="mt-4 flex flex-wrap gap-2 lg:mt-6 lg:flex-col lg:flex-nowrap lg:gap-1">
            {SERVICES.map((service, i) => (
              <li key={service.name} className="fix-step" data-state="open">
                <span className="fix-step-badge" aria-hidden="true">
                  <svg
                    className="fix-step-check"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12.5l5 5L20 7" />
                  </svg>
                  <span className="fix-step-num">{`0${i + 1}`}</span>
                </span>
                <div className="fix-step-body">
                  <h3 className="fix-step-name">{service.name}</h3>
                  <p className="fix-step-features">{service.features.join(" · ")}</p>
                  <div className="fix-step-more">
                    <div>
                      <p>{service.description}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <Link
            href="/pricing"
            className="mt-6 inline-block self-start text-sm font-semibold text-brand-ink transition-colors hover:text-brand max-lg:order-2 lg:mt-6 lg:text-[15px]"
          >
            See pricing — builds from $800 →
          </Link>
          <p className="max-lg:sr-only lg:mt-2 lg:text-sm lg:text-day-dim">
            Not sure which tier? Book the discovery call. We&apos;ll tell you if you&apos;re
            overbuying.
          </p>
        </div>
        <div className="mt-8 max-lg:order-1 lg:mt-0">
          <SampleSite />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Styles for the rows and the sample site**

In `src/app/globals.css`, append after the last rule of the hero entrance block, the one that ends:

```css
  html:not([data-intro="play"]) .hero-fade-late {
    animation-delay: 0.45s;
  }
}
```

add (Edit tool):

```css

/* 02 The fix (fix-section.tsx): the four services. The server HTML has every
   row "open". With motion, fix-scenes.tsx moves them through "upcoming",
   "active" and "done" as the sample site builds. Phones show them as chips. */
.fix-step {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 11px;
  border: 1px solid var(--color-day-line);
  border-radius: 999px;
  font-size: 12px;
  color: var(--color-day-dim);
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
}

.fix-step[data-state="open"],
.fix-step[data-state="done"] {
  border-color: transparent;
  background: var(--color-lavender);
  color: #5b21b6;
}

.fix-step[data-state="active"] {
  border-color: transparent;
  background: var(--color-brand);
  color: #ffffff;
  font-weight: 600;
}

.fix-step-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.fix-step-check {
  display: none;
  width: 12px;
  height: 12px;
}

.fix-step[data-state="open"] .fix-step-check,
.fix-step[data-state="done"] .fix-step-check {
  display: block;
}

.fix-step[data-state="open"] .fix-step-num,
.fix-step[data-state="done"] .fix-step-num {
  display: none;
}

.fix-step-name {
  margin: 0;
  font: inherit;
}

/* Phones: the feature line and the description stay in the page for screen readers */
.fix-step-features,
.fix-step-more {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (min-width: 1024px) {
  .fix-step {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: clamp(6px, 1.2vh, 11px) 16px;
    border-color: transparent;
    border-radius: 16px;
    font-size: inherit;
    color: inherit;
  }

  .fix-step[data-state="open"],
  .fix-step[data-state="done"],
  .fix-step[data-state="active"] {
    background: transparent;
    color: inherit;
    font-weight: inherit;
  }

  .fix-step[data-state="active"] {
    border-color: rgb(15 23 42 / 0.06);
    background: #ffffff;
    box-shadow: 0 14px 34px -20px rgb(15 23 42 / 0.4);
  }

  .fix-step-badge {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border: 1px solid var(--color-day-line);
    border-radius: 50%;
    font-family: var(--font-manrope), sans-serif;
    font-size: 13px;
    font-weight: 800;
    color: var(--color-day-dim);
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  }

  .fix-step[data-state="open"] .fix-step-badge,
  .fix-step[data-state="done"] .fix-step-badge {
    border-color: transparent;
    background: var(--color-lavender);
    color: var(--color-brand-ink);
  }

  .fix-step[data-state="active"] .fix-step-badge {
    border-color: transparent;
    background: var(--color-brand);
    color: #ffffff;
  }

  .fix-step-check {
    width: 16px;
    height: 16px;
  }

  .fix-step-body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: 2px;
  }

  .fix-step-name {
    font-family: var(--font-manrope), sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--color-day-text);
  }

  .fix-step-features,
  .fix-step-more {
    position: static;
    width: auto;
    height: auto;
    overflow: visible;
    clip-path: none;
    white-space: normal;
  }

  .fix-step-features {
    margin: 0;
    font-size: 13px;
    color: var(--color-day-dim);
  }

  .fix-step[data-state="active"] .fix-step-features {
    color: var(--color-day-muted);
  }

  /* An open or active row shows its full description */
  .fix-step-more {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .fix-step-more > div {
    overflow: hidden;
  }

  .fix-step-more p {
    margin: 0;
    padding-top: 8px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--color-day-muted);
  }

  .fix-step[data-state="open"] .fix-step-more,
  .fix-step[data-state="active"] .fix-step-more {
    grid-template-rows: 1fr;
  }
}

/* The sample salon site (sample-site.tsx). Sized in container units off the
   figure's width (the design is 710 px wide), so it scales as one picture.
   It's the made-up client's own brand: cream, forest green and terracotta. */
.fix-frame-wrap {
  position: relative;
  margin: 0;
  container-type: inline-size;
}

.fix-frame {
  overflow: hidden;
  border: 1px solid rgb(15 23 42 / 0.08);
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 44px 90px -44px rgb(15 23 42 / 0.5);
}

.ss-chrome {
  display: flex;
  align-items: center;
  gap: 0.99cqw;
  height: 5.35cqw;
  padding: 0 1.97cqw;
  border-bottom: 1px solid rgb(15 23 42 / 0.06);
  background: #f4f4f5;
}

.ss-dot {
  width: 1.41cqw;
  height: 1.41cqw;
  border-radius: 50%;
  background: #d4d4d8;
}

.ss-url {
  margin: 0 auto;
  padding: 0.56cqw 2.25cqw;
  border-radius: 0.85cqw;
  background: #ffffff;
  font-size: 1.69cqw;
  color: #71717a;
}

.ss-page {
  position: relative;
  padding: 3.66cqw 4.51cqw 4.23cqw;
  background: #f7f2ea;
  color: #1e3b2f;
}

.ss-nav {
  display: flex;
  align-items: center;
  gap: 3.1cqw;
  font-size: 1.69cqw;
  color: #4b5e55;
}

.ss-brand,
.ss-headline {
  font-family: var(--font-fraunces), Georgia, serif;
}

.ss-brand {
  margin-right: auto;
  font-size: 2.82cqw;
  font-weight: 600;
  color: #1e3b2f;
}

.ss-book,
.ss-cta,
.ss-openings {
  border: 1.5px solid transparent;
}

.ss-book {
  padding: 1.13cqw 2.11cqw;
  border-radius: 999px;
  background: #1e3b2f;
  color: #f7f2ea;
  font-weight: 600;
}

.ss-hero {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4.23cqw;
  align-items: end;
  margin-top: 4.23cqw;
}

.ss-headline {
  margin: 0;
  font-size: 5.92cqw;
  font-weight: 500;
  line-height: 1.02;
  letter-spacing: -0.02em;
}

.ss-sub {
  margin: 1.97cqw 0 0;
  font-size: 1.83cqw;
  line-height: 1.5;
  color: #4b5e55;
}

.ss-cta {
  display: inline-block;
  margin-top: 2.54cqw;
  padding: 1.69cqw 3.1cqw;
  border-radius: 999px;
  background: #c8643b;
  color: #ffffff;
  font-size: 1.83cqw;
  font-weight: 600;
  box-shadow: 0 0 0 0.85cqw rgb(200 100 59 / 0.18);
}

.ss-photo {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 42.25cqw;
  padding-bottom: 1.97cqw;
  border-radius: 999px 999px 2.54cqw 2.54cqw;
  background: linear-gradient(170deg, #e6bd98 0%, #c98d63 55%, #9a5b38 100%);
}

.ss-photo-label {
  font-size: 1.55cqw;
  letter-spacing: 0.04em;
  color: rgb(255 255 255 / 0.85);
}

.ss-chat {
  position: absolute;
  left: -13.8cqw;
  bottom: 7.3cqw;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.13cqw;
  padding: 0.85cqw;
  border-radius: 2.25cqw;
}

.ss-bubble {
  padding: 1.41cqw 1.97cqw;
  border-radius: 1.97cqw 1.97cqw 1.97cqw 0.56cqw;
  background: #ffffff;
  color: #1e3b2f;
  font-size: 1.69cqw;
  white-space: nowrap;
  box-shadow: 0 1.69cqw 3.94cqw -1.97cqw rgb(0 0 0 / 0.4);
}

.ss-reply {
  margin-left: 3.66cqw;
  border-radius: 1.97cqw 1.97cqw 0.56cqw 1.97cqw;
  background: #1e3b2f;
  color: #f7f2ea;
}

.ss-openings {
  display: flex;
  align-items: center;
  gap: 1.41cqw;
  width: fit-content;
  margin-top: 3.1cqw;
  padding: 0.56cqw;
  border-radius: 999px;
  font-size: 1.69cqw;
}

.ss-openings-label {
  margin: 0 0.56cqw;
  color: #4b5e55;
}

.ss-slot {
  padding: 0.99cqw 1.83cqw;
  border: 1px solid rgb(30 59 47 / 0.25);
  border-radius: 999px;
}

.ss-slot-picked {
  border-color: #1e3b2f;
  background: #1e3b2f;
  color: #f7f2ea;
}

.ss-care {
  position: absolute;
  top: -6.48cqw;
  right: -2.54cqw;
  width: 32.1cqw;
  padding: 2.54cqw 2.82cqw;
  border: 1px solid rgb(15 23 42 / 0.06);
  border-radius: 2.82cqw;
  background: #ffffff;
  box-shadow: 0 3.66cqw 8.45cqw -3.66cqw rgb(15 23 42 / 0.45);
}

.ss-care-kicker {
  display: flex;
  align-items: center;
  gap: 1.13cqw;
  margin: 0;
  font-size: 1.69cqw;
  font-weight: 600;
  color: #6d28d9;
}

.ss-care-dot {
  width: 1.13cqw;
  height: 1.13cqw;
  border-radius: 50%;
  background: #7c3aed;
}

.ss-care-title {
  margin: 1.13cqw 0 0;
  font-family: var(--font-manrope), sans-serif;
  font-size: 2.25cqw;
  font-weight: 700;
  color: #0f172a;
}

.ss-care-list {
  display: flex;
  flex-direction: column;
  gap: 1.13cqw;
  margin: 1.69cqw 0 0;
  padding: 0;
  list-style: none;
  font-size: 1.83cqw;
  color: #334155;
}

.ss-care-list li {
  display: flex;
  align-items: center;
  gap: 1.13cqw;
}

.ss-care-list svg {
  width: 2.25cqw;
  height: 2.25cqw;
  color: #047857;
}

/* The build (fix-scenes.tsx sets data-build to 1–4). In step 1 the booking
   pieces are dashed outlines of what's coming; each later step fades its
   pieces in, and the newest gets a violet ring. */
.ss-2,
.ss-3,
.ss-4 {
  transition: opacity 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease, background-color 0.35s ease, border-color 0.35s ease;
}

.fix-frame-wrap[data-build="1"] .ss-2 {
  border-style: dashed;
  border-color: rgb(30 59 47 / 0.3);
  background: transparent;
  box-shadow: none;
}

.fix-frame-wrap[data-build="1"] .ss-2 > * {
  visibility: hidden;
}

.fix-frame-wrap[data-build="1"] .ss-3,
.fix-frame-wrap[data-build="2"] .ss-3,
.fix-frame-wrap[data-build="1"] .ss-4,
.fix-frame-wrap[data-build="2"] .ss-4,
.fix-frame-wrap[data-build="3"] .ss-4 {
  opacity: 0;
  transform: translateY(1.41cqw);
}

.fix-frame-wrap[data-build="2"] .ss-2,
.fix-frame-wrap[data-build="3"] .ss-3,
.fix-frame-wrap[data-build="4"] .ss-4 {
  box-shadow: 0 0 0 0.42cqw #f7f2ea, 0 0 0 0.7cqw rgb(124 58 237 / 0.55);
}

/* Phones: one column, photo first, bigger small print (the phone frame is 350 px) */
@container (max-width: 520px) {
  .ss-chrome {
    gap: 1.43cqw;
    height: 8cqw;
    padding: 0 2.86cqw;
  }

  .ss-dot {
    width: 2cqw;
    height: 2cqw;
  }

  .ss-url {
    padding: 0.86cqw 2.86cqw;
    font-size: 2.86cqw;
  }

  .ss-page {
    padding: 4.57cqw 5.14cqw 5.14cqw;
  }

  .ss-nav {
    font-size: 2.86cqw;
  }

  .ss-link,
  .ss-sub,
  .ss-openings-label {
    display: none;
  }

  .ss-brand {
    font-size: 4cqw;
  }

  .ss-book {
    padding: 1.43cqw 2.86cqw;
  }

  .ss-hero {
    grid-template-columns: minmax(0, 1fr);
    gap: 4cqw;
    margin-top: 4cqw;
  }

  .ss-photo {
    order: -1;
    height: 37.14cqw;
  }

  .ss-headline {
    font-size: 7.43cqw;
  }

  .ss-cta {
    margin-top: 3.43cqw;
    padding: 2.57cqw 4.57cqw;
    font-size: 3.14cqw;
  }

  .ss-chat {
    left: auto;
    right: 2.29cqw;
    bottom: 7cqw;
    align-items: flex-end;
    gap: 1.43cqw;
    padding: 1.14cqw;
  }

  .ss-bubble {
    padding: 2cqw 2.86cqw;
    font-size: 2.86cqw;
  }

  .ss-reply {
    margin-left: 0;
  }

  .ss-openings {
    flex-wrap: wrap;
    gap: 1.71cqw;
    margin-top: 4cqw;
    padding: 0.86cqw;
    font-size: 2.86cqw;
  }

  .ss-slot {
    padding: 1.14cqw 2.57cqw;
  }

  /* The phone frame has no care card: step 4 shows on the "Care plans" chip */
  .ss-care {
    display: none;
  }
}
```

- [ ] **Step 4: Put it after the reality and archive the old services section**

In `src/app/page.tsx`, replace `import { ServicesSection } from "@/components/services-section";` with `import { FixSection } from "@/components/fix-section";`, and `      <ServicesSection />` with `      <FixSection />`. Then:

```bash
git mv src/components/services-section.tsx archive/2026-09-night-into-day/src/components/services-section.tsx
```

- [ ] **Step 5: Run the checks**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: `ℹ pass 44`, and everything else exits 0.

- [ ] **Step 6: Look at it**

Start `npm run start -- -p 3100` in the background, then:

```bash
node scripts/cdp.mjs "http://localhost:3100/" 6000 "(async () => { const s = document.getElementById('services'); window.__lenis ? window.__lenis.scrollTo(s, { immediate: true }) : s.scrollIntoView(); await new Promise((r) => setTimeout(r, 1500)); return { rows: [...document.querySelectorAll('.fix-step')].map((r) => r.dataset.state), build: document.querySelector('.fix-frame-wrap').dataset.build, h2: document.getElementById('fix-title').textContent, descriptions: [...document.querySelectorAll('.fix-step-more p')].length, font: getComputedStyle(document.querySelector('.ss-headline')).fontFamily }; })()" .lighthouse/shots/plan3-fix-static-1440.png 1440 900
MOBILE=1 node scripts/cdp.mjs "http://localhost:3100/" 6000 "(async () => { document.getElementById('services').scrollIntoView(); await new Promise((r) => setTimeout(r, 1500)); return document.documentElement.scrollWidth - innerWidth; })()" .lighthouse/shots/plan3-fix-static-390.png 390 844
```

Expected:
- The first command prints: rows `["open","open","open","open"]`, build `"all"`, h2 `"A premium site, live in days."`, descriptions `4`, and a font containing `Fraunces`.
- The second prints `0` (no sideways overflow).
- `plan3-fix-static-1440.png` against the canvas frame "02 The fix · last step":
  - The label, the two-line heading and the description on the left.
  - Four service rows, each with a lavender check and its description open.
  - The pricing link and the discovery-call line.
  - On the right, the browser frame with "Your Salon" fully built: the Book now pill, the headline, "Book an appointment", the arch photo labelled "[Salon photo]", the two chat bubbles and the next-openings row.
  - The care card overlapping the frame's top-right corner.
  - All on the mist day panel.
- `plan3-fix-static-390.png`: the label and heading, four lavender chips, the frame in one column (photo first, both chat bubbles over the photo), then the pricing link. No care card on phones.

Stop the server.

> **Tuned while executing (2026-09-28):** checked against the rendered canvas frames. The desktop heading breaks after "site," as the frame does (the `<br>` is desktop-only). On phones the left column dissolves (`max-lg:contents`), so the pricing link can follow the frame as it does in the phone frame. The phone frame has no care card, so phones hide it (step 4 still shows on the "Care plans" chip), and the chat bubbles sit higher on the photo (`bottom: 7cqw`), clear of the "[Salon photo]" label. The code above includes all of this.

- [ ] **Step 7: Commit**

```bash
git add src/components/sample-site.tsx src/components/fix-section.tsx src/app/globals.css src/app/page.tsx archive/2026-09-night-into-day/src/components/services-section.tsx docs/superpowers/plans/2026-09-28-night-into-day-plan-3-sunrise-and-fix.md
git commit -m "feat(fix): 02 The fix with the sample salon site, in its finished state"
```

---

### Task 4: The nav in two themes

**Files:**
- Modify: `src/app/globals.css` (nav theme variables)
- Modify: `src/components/navbar-new.tsx` (rewrite)

**Interfaces:**
- Consumes: `ChipMark` (plan 2).
- Produces: `header.site-nav`, which reads `--nav-*` variables. `<html data-nav-theme="day">` (written by the stage in Task 6) switches them. `data-menu-open` on the header keeps the night colours over the dark menu overlay. On the homepage, the nav item for the section under the middle of the screen gets `aria-current="true"`.

- [ ] **Step 1: Theme variables**

In `src/app/globals.css`, after the `.particle-stage` block (the one ending `transition: opacity 0.8s ease-out, filter 0.6s ease-out;` and `}`), add (Edit tool):

```css

/* Nav themes (spec §5). Night by default; the story director sets
   <html data-nav-theme="day"> over the day chapters. The open phone menu is
   dark, so the header keeps its night colours while it's open. */
.site-nav {
  --nav-text: var(--color-night-text);
  --nav-muted: var(--color-night-muted);
  --nav-mark: var(--color-brand-glow);
  --nav-cta-bg: var(--color-night-text);
  --nav-cta-text: var(--color-night);
  --nav-cta-hover: #ffffff;
  --nav-scrolled: rgb(7 6 11 / 0.8);
  --nav-toggle-border: rgb(255 255 255 / 0.14);
  --nav-toggle-bg: rgb(255 255 255 / 0.04);
  --nav-toggle-bar: #ffffff;
}

html[data-nav-theme="day"] .site-nav:not([data-menu-open]) {
  --nav-text: var(--color-day-text);
  --nav-muted: var(--color-day-muted);
  --nav-mark: var(--color-brand);
  --nav-cta-bg: var(--color-brand);
  --nav-cta-text: #ffffff;
  --nav-cta-hover: var(--color-brand-ink);
  --nav-scrolled: rgb(241 243 247 / 0.85);
  --nav-toggle-border: rgb(15 23 42 / 0.14);
  --nav-toggle-bg: #ffffff;
  --nav-toggle-bar: var(--color-day-text);
}
```

- [ ] **Step 2: The nav reads the variables and marks the current section**

Replace `src/components/navbar-new.tsx` with:

```tsx
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useSmoothScroll } from "@/components/smooth-scroll";
import { ChipMark } from "@/components/ui/chip-mark";

type NavItem =
  | { type: "section"; label: string; id: string }
  | { type: "link"; label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { type: "section", label: "Services", id: "services" },
  { type: "section", label: "Process", id: "process" },
  { type: "link", label: "How we work", href: "/growth-stories" },
  { type: "link", label: "Blog", href: "/blog" },
  { type: "link", label: "Pricing", href: "/pricing" },
];

/**
 * The nav (spec §5). Night theme by default; over the day chapters the story
 * director sets <html data-nav-theme="day"> and the colours follow the --nav-*
 * variables in globals.css. On the homepage it marks the section under the
 * middle of the screen as current.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const lenis = useSmoothScroll();
  const currentId = isHome ? current : null;

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      // Pause Lenis while menu is open
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, lenis]);

  // Which homepage section crosses the middle of the screen
  useEffect(() => {
    if (!isHome) return;
    const sections = NAV_ITEMS.flatMap((item) =>
      item.type === "section" ? [document.getElementById(item.id)] : []
    ).filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) setCurrent(id);
          else setCurrent((value) => (value === id ? null : value));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    lastScrollY.current = latest;

    // Show/hide based on scroll direction
    if (latest > 100) {
      setScrolled(true);
      if (latest > previous && latest > 300) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    } else {
      setScrolled(false);
      setHidden(false);
    }
  });

  function handleNav(id: string) {
    setMobileOpen(false);
    if (isHome) {
      const el = document.getElementById(id);
      if (!el) return;
      if (lenis) {
        lenis.scrollTo(el, { offset: 0 });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/#${id}`);
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0, 1] }}
        data-menu-open={mobileOpen ? "" : undefined}
        className={`site-nav fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "py-3 bg-(--nav-scrolled) backdrop-blur-xl"
          : "py-5"
          }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 lg:px-20">
          {/* Logo */}
          <Link href="/" className="group relative z-10">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 font-display text-[15px] font-extrabold tracking-[-0.02em] text-(--nav-text) transition-colors lg:gap-2.5 lg:text-[17px]"
            >
              <ChipMark className="size-6 text-(--nav-mark) transition-colors lg:size-7" />
              <span>Zaila AI Designs</span>
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <motion.nav
            aria-label="Main"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden items-center gap-8 lg:flex"
          >
            {NAV_ITEMS.map((item, i) => (
              <DesktopNavItem
                key={item.label}
                item={item}
                i={i}
                current={item.type === "section" && item.id === currentId}
                handleNav={handleNav}
              />
            ))}
          </motion.nav>

          {/* CTA Button */}
          <motion.button
            onClick={() => handleNav("contact")}
            className="hidden h-11 items-center rounded-full bg-(--nav-cta-bg) px-[22px] text-sm font-semibold text-(--nav-cta-text) transition-colors hover:bg-(--nav-cta-hover) lg:inline-flex"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Start Your Project
          </motion.button>

          {/* Mobile toggle */}
          <motion.button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-(--nav-toggle-border) bg-(--nav-toggle-bg) transition-colors lg:hidden"
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-5 h-5">
              <motion.span
                className="absolute left-0 w-5 h-0.5 bg-(--nav-toggle-bar) rounded-full"
                animate={{
                  top: mobileOpen ? "50%" : "30%",
                  rotate: mobileOpen ? 45 : 0,
                  y: mobileOpen ? "-50%" : 0,
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 top-1/2 w-5 h-0.5 bg-(--nav-toggle-bar) rounded-full -translate-y-1/2"
                animate={{ opacity: mobileOpen ? 0 : 1, x: mobileOpen ? -10 : 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 w-5 h-0.5 bg-(--nav-toggle-bar) rounded-full"
                animate={{
                  top: mobileOpen ? "50%" : "70%",
                  rotate: mobileOpen ? -45 : 0,
                  y: mobileOpen ? "-50%" : 0,
                }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile menu - full screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-night/95 backdrop-blur-2xl lg:hidden"
          >
            <nav aria-label="Main" className="flex flex-col items-center justify-center h-full gap-8 px-6">
              <div className="mb-4 flex items-center gap-3 font-display text-2xl font-extrabold tracking-[-0.02em] text-night-text">
                <ChipMark className="size-10 text-brand-glow" />
                <span>Zaila AI Designs</span>
              </div>
              {NAV_ITEMS.map((item, i) => (
                <MobileNavItem key={item.label} item={item} i={i} handleNav={handleNav} setMobileOpen={setMobileOpen} />
              ))}
              <motion.button
                onClick={() => handleNav("contact")}
                className="mt-8 rounded-full bg-night-text px-10 py-4 text-[16px] font-semibold text-night"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
              >
                Start Your Project
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const desktopLinkClass =
  "text-sm text-(--nav-muted) transition-colors hover:text-(--nav-text) aria-[current=true]:font-semibold aria-[current=true]:text-(--nav-text)";

function DesktopNavItem({
  item,
  i,
  current,
  handleNav,
}: {
  item: NavItem;
  i: number;
  current: boolean;
  handleNav: (id: string) => void;
}) {
  const entrance = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.3 + i * 0.05 },
  };
  if (item.type === "link") {
    return (
      <motion.div {...entrance}>
        <Link href={item.href} className={desktopLinkClass}>
          {item.label}
        </Link>
      </motion.div>
    );
  }
  return (
    <motion.button
      {...entrance}
      onClick={() => handleNav(item.id)}
      aria-current={current ? "true" : undefined}
      className={desktopLinkClass}
    >
      {item.label}
    </motion.button>
  );
}

function MobileNavItem({
  item,
  i,
  handleNav,
  setMobileOpen,
}: {
  item: NavItem;
  i: number;
  handleNav: (id: string) => void;
  setMobileOpen: (v: boolean) => void;
}) {
  if (item.type === "link") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.1 + i * 0.05 }}
      >
        <Link
          href={item.href}
          onClick={() => setMobileOpen(false)}
          className="text-[32px] font-semibold text-white tracking-tight"
        >
          {item.label}
        </Link>
      </motion.div>
    );
  }
  return (
    <motion.button
      onClick={() => handleNav(item.id)}
      className="text-[32px] font-semibold text-white tracking-tight"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: 0.1 + i * 0.05 }}
    >
      {item.label}
    </motion.button>
  );
}
```

- [ ] **Step 3: Run the checks**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: `ℹ pass 44`, and everything else exits 0.

- [ ] **Step 4: Look at both themes**

Start `npm run start -- -p 3100` in the background. The stage doesn't set the theme until Task 6, so set it by hand:

```bash
node scripts/cdp.mjs "http://localhost:3100/" 6000 "(async () => { const s = document.getElementById('services'); const go = (y) => window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y); go(s.offsetTop + 260); await new Promise((r) => setTimeout(r, 900)); go(s.offsetTop + 200); await new Promise((r) => setTimeout(r, 900)); document.documentElement.dataset.navTheme = 'day'; await new Promise((r) => setTimeout(r, 800)); return { current: document.querySelector('.site-nav [aria-current=\"true\"]')?.textContent ?? null }; })()" .lighthouse/shots/plan3-nav-day-1440.png 1440 900
bash scripts/shot.sh "http://localhost:3100/" .lighthouse/shots/plan3-nav-night-1440.png 1440 900
```

Expected:
- The first command prints `current` `"Services"`.
- `plan3-nav-day-1440.png` matches the canvas frame's day nav:
  - violet chip and dark wordmark;
  - slate links with "Services" darker and bold;
  - a violet "Start Your Project" pill;
  - a pale header background if scrolled.
- `plan3-nav-night-1440.png` is the night nav, unchanged from plan 2.

Stop the server.

> **Found while executing (2026-09-28):** the first version of this command jumped straight down to the fix, and the nav hides on a downward scroll, so the shot had no nav in it. The command above now lands a little lower and scrolls back up 60 px, which shows the nav. A phone check also confirmed the open menu keeps the night colours in the day theme (toggle bars `rgb(15, 23, 42)` closed, white open).

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/components/navbar-new.tsx
git commit -m "feat(nav): day theme through CSS variables, and the current section"
```

---

### Task 5: The fix in motion

**Files:**
- Modify: `src/components/story/story-progress.ts`
- Create: `src/components/fix-scenes.tsx`
- Modify: `src/components/fix-section.tsx` (the pin; mount `FixScenes`)

**Interfaces:**
- Consumes: `gsap`, `ScrollTrigger` (plan 1, dynamic import); the Task 3 markup (`.fix-stage`, `.fix-step`, `.fix-frame-wrap`, `.fix-frame`).
- Produces:
  - `storyProgress` gains `sunrise: number` (0 → 1 from this section's top reaching the bottom of the screen to its pin), `dusk: number` (written by `interim-dusk.tsx` in Task 6), and `landingTarget: HTMLElement | null` (the `.fix-frame`).
  - The build: rows `data-state` and `data-build` step at 25, 50 and 75% of the pin.

- [ ] **Step 1: More shared progress**

Replace `src/components/story/story-progress.ts` with:

```ts
/**
 * Chapter progress that the homepage's scroll scenes publish for the particle
 * stage (spec §9, data flow). A plain object the stage reads every frame, so
 * scrolling never re-renders React.
 */
export const storyProgress: {
  /** The reality chapter's fill (reality-section.tsx). */
  reality: number;
  /** 0 → 1 as the fix arrives, from its top at the bottom of the screen to its pin (fix-scenes.tsx). */
  sunrise: number;
  /** 0 → 1 as the sky turns back to night (interim-dusk.tsx until plan 5). */
  dusk: number;
  /** The sample site's browser frame, where the particles land (fix-scenes.tsx). */
  landingTarget: HTMLElement | null;
} = { reality: 0, sunrise: 0, dusk: 0, landingTarget: null };
```

- [ ] **Step 2: The scenes**

Create `src/components/fix-scenes.tsx`:

```tsx
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
```

- [ ] **Step 3: Pin the section and mount the scenes**

In `src/components/fix-section.tsx`:

1. Add the import after `import { SampleSite } from "@/components/sample-site";`:

```tsx
import { FixScenes } from "@/components/fix-scenes";
```

2. Replace the `<section …>` opening tag:

```tsx
    <section id="services" aria-labelledby="fix-title" className="relative bg-day text-day-text">
```

with:

```tsx
    <section
      id="services"
      aria-labelledby="fix-title"
      className="relative bg-day text-day-text motion-safe:h-[200vh] lg:motion-safe:h-[250vh]"
    >
```

3. In the `fix-stage` div's class list, replace `py-20` with `py-20 motion-safe:sticky motion-safe:top-0 motion-safe:min-h-svh motion-safe:justify-center motion-safe:pb-4 motion-safe:pt-20`, and `lg:py-32` with `lg:py-32 lg:motion-safe:pb-6 lg:motion-safe:pt-24`.

   On shorter desktop screens the description and the discovery line give way while pinned, as they do on phones. Put this comment above the description `<p>`:

```tsx
          {/* This and the discovery line give way while pinned on shorter desktop screens, as on phones */}
```

   Then add `lg:motion-safe:[@media(max-height:900px)]:sr-only` to the end of the description's class list, and add `lg:ml-16 ` before `lg:text-sm` in the discovery line's class list and the same variant to its end. On the pricing link, add `lg:ml-16 ` before `lg:text-[15px]`, and put this comment above the `<Link`:

```tsx
          {/* On desktop these line up with the service names, clear of the fixed chat launcher */}
```

4. Before `    </section>`, add `      <FixScenes />`.

5. Update the doc comment's last sentence to: `With motion, the chapter pins (1.5 screens on desktop, 1 on phones) and fix-scenes.tsx builds the site one service at a time. Styles: globals.css, "02 The fix".`

- [ ] **Step 4: Run the checks**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: `ℹ pass 44`, and everything else exits 0.

- [ ] **Step 5: Scroll through the build**

Start `npm run start -- -p 3100` in the background. On desktop the fix pins from scrollY = its top (2.75 screens) for 1.5 screens:

```bash
for p in 0.1 0.35 0.6 0.9; do
  node scripts/cdp.mjs "http://localhost:3100/" 6000 "(async () => { const top = document.getElementById('services').offsetTop; const go = (y) => window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y); go(top + innerHeight * 1.5 * $p); await new Promise((r) => setTimeout(r, 1800)); return { p: $p, top: Math.round(document.querySelector('.fix-stage').getBoundingClientRect().top), rows: [...document.querySelectorAll('.fix-step')].map((r) => r.dataset.state).join(' '), build: document.querySelector('.fix-frame-wrap').dataset.build, frame: getComputedStyle(document.querySelector('.fix-frame-wrap')).opacity }; })()" ".lighthouse/shots/plan3-fix-$p-1440.png" 1440 900 | grep -v "THREE.Clock\|screenshot:" | tr -d '\n '; echo
done
MOBILE=1 node scripts/cdp.mjs "http://localhost:3100/" 6000 "(async () => { const top = document.getElementById('services').offsetTop; scrollTo(0, top + innerHeight * 0.6); await new Promise((r) => setTimeout(r, 1800)); return { top: Math.round(document.querySelector('.fix-stage').getBoundingClientRect().top), rows: [...document.querySelectorAll('.fix-step')].map((r) => r.dataset.state).join(' '), build: document.querySelector('.fix-frame-wrap').dataset.build }; })()" .lighthouse/shots/plan3-fix-390.png 390 844
REDUCED=1 node scripts/cdp.mjs "http://localhost:3100/" 3000 "(() => { const s = document.getElementById('services'); return { height: Math.round(s.getBoundingClientRect().height), vh: innerHeight, rows: [...document.querySelectorAll('.fix-step')].map((r) => r.dataset.state).join(' '), build: document.querySelector('.fix-frame-wrap').dataset.build, sticky: getComputedStyle(document.querySelector('.fix-stage')).position }; })()"
```

Expected:
- `0.1`: `top` 0 (pinned), rows `active upcoming upcoming upcoming`, build `"1"`, frame `"1"`. The frame shows the page with dashed outlines where the booking pieces will go.
- `0.35`: rows `done active upcoming upcoming`, build `"2"`. Book now, Book an appointment and the openings row are in, ringed in violet, and the Lead systems row is expanded.
- `0.6`: build `"3"`, with the chat bubbles in.
- `0.9`: build `"4"`, with the care card in and Care plans active. This matches the "02 The fix · last step" frame.
- Phone: `top` 0 (pinned), build `"3"` (60% of its one-screen pin), with violet and lavender chips above the frame.
- Reduced motion: `height` about one screen or a little more (no pin), rows `open open open open`, build `"all"`, sticky `"static"`.

Stop the server.

> **Found while executing (2026-09-28):** first, the stage was exactly one screen tall (`h-svh`) with its content centred, so on shorter screens the content spilled off both edges. With the tallest step active:
> - 1440×900 cut the discovery line.
> - 1536×864 also cut the pricing link.
> - 1366×768 and 1280×720 lost the label off the top too.
>
> Three changes fix it:
> - The stage is now at least one screen tall (`min-h-svh`), so the top is never cut. On very short screens the bottom waits below the fold during the pin and scrolls in after.
> - Below 900 px of height, the description and the discovery line give way while pinned. They stay available to screen readers, as on phones.
> - The fixed chat launcher (x 24–104, bottom 104 px) then covered the pricing link's first letter for the whole pin. The link and the discovery line now line up with the service names (`lg:ml-16`, x 144).
>
> Measured after the fix, with the tallest step active:
> - 1920×1080 and 1440×1000 show everything.
> - 1440×900 and 1536×864 fit with the link in view.
> - 1366×768 and 1280×720 keep the label at 96 px and the whole sample site in view.
> - On a short phone (390×664) the label stays at 80 px.

- [ ] **Step 6: Commit**

```bash
git add src/components/story/story-progress.ts src/components/fix-scenes.tsx src/components/fix-section.tsx docs/superpowers/plans/2026-09-28-night-into-day-plan-3-sunrise-and-fix.md
git commit -m "feat(fix): pin the chapter and build the sample site one service at a time"
```

---

### Task 6: Sunrise on the stage

**Files:**
- Modify: `src/components/story/particle-shaders.ts` (`STORY_VERTEX`; the dust's `uOpacity`)
- Modify: `src/components/story/stage-ambient.ts` (dust `uOpacity: 1`)
- Modify: `src/components/story/stage-scene.ts` (`update` may return `false`)
- Modify: `src/components/story/stage-story.ts` (rewrite)
- Modify: `src/components/story/particle-stage.tsx` (skip drawing; `data-drawing`)
- Modify: `src/app/globals.css` (`--sky-mid`)
- Create: `src/components/story/interim-dusk.tsx`
- Modify: `src/app/page.tsx` (mount `InterimDusk`)
- Modify: `src/components/fix-section.tsx` (the day panel only for reduced motion)

**Interfaces:**
- Consumes: `directStage`, `directSky`, `SkyState` (Task 2); `generateHorizon`, `generateLanding` (Task 1); `storyProgress.sunrise`, `dusk`, `landingTarget` (Task 5).
- Produces:
  - `StageScene.update(frame): boolean | void`. Return `false` to skip drawing that frame.
  - `.particle-stage[data-drawing="true" | "false"]`.
  - `<html style="--sky-top | --sky-mid | --sky-bottom | --sky-glow">` and `<html data-nav-theme>` while the story runs; removed when it's disposed.

- [ ] **Step 1: Shaders**

In `src/components/story/particle-shaders.ts`:

1. In `DUST_VERTEX`, replace:

```glsl
  uniform float uTime;
  uniform float uPixelRatio;

  varying float vAlpha;

  void main() {
    vec3 pos = position;
```

with:

```glsl
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uOpacity;

  varying float vAlpha;

  void main() {
    vec3 pos = position;
```

and replace `    vAlpha = 0.08 + 0.06 * sin(uTime + position.x * 5.0);` with `    vAlpha = (0.08 + 0.06 * sin(uTime + position.x * 5.0)) * uOpacity;`.

2. Replace the whole `STORY_VERTEX` export (from `export const STORY_VERTEX = /* glsl */ \`` to its closing `` `; ``) with:

```ts
export const STORY_VERTEX = /* glsl */ `
  attribute vec3 aStart;
  attribute vec3 aLogo;
  attribute vec4 aLeak;
  attribute vec3 aHorizon;
  attribute vec2 aLand;
  attribute float aRandom;

  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uFly;
  uniform float uStream;
  uniform float uLeak;
  uniform float uExitX;
  uniform float uLogoScale;
  uniform float uHorizon;
  uniform float uLanding;
  uniform vec3 uHorizonFrame; // half width, horizon height, half height (world units)
  uniform vec4 uLandRect;     // left, top, right, bottom of the sample site (world units, z = 0)
  uniform vec3 uMouse;
  uniform float uMouseInfluence;

  varying float vAlpha;
  varying float vColorMix;
  varying vec3 vPos;
  varying float vMouseProximity;

  void main() {
    // The orb: the sphere in position, turned and placed by the model matrix
    vec3 orbLocal = position;
    float floatSpeed = 0.5 + aRandom * 0.5;
    orbLocal.x += sin(uTime * floatSpeed + aRandom * 6.28) * 0.05;
    orbLocal.y += cos(uTime * floatSpeed * 0.7 + aRandom * 6.28) * 0.05;
    orbLocal.z += sin(uTime * floatSpeed * 0.5 + aRandom * 3.14) * 0.05;
    vec3 orb = (modelMatrix * vec4(orbLocal, 1.0)).xyz;

    // Intro: fly from the scatter into the logo, which shimmers while it holds...
    float delay = aRandom * 0.35;
    float fly = clamp((uFly - delay) / (1.0 - delay), 0.0, 1.0);
    fly = 1.0 - pow(1.0 - fly, 3.0);
    vec3 logo = aLogo * uLogoScale;
    logo.x += sin(uTime * 3.0 + aRandom * 6.28) * 0.006;
    logo.y += cos(uTime * 2.5 + aRandom * 3.14) * 0.006;
    vec3 intro = mix(aStart, logo, fly);
    float spiral = (1.0 - fly) * 6.28318 * aRandom;
    intro.xy += vec2(cos(spiral), sin(spiral)) * (1.0 - fly) * 0.3;

    // ...then stream into the orb
    float stream = clamp((uStream - delay) / (1.0 - delay), 0.0, 1.0);
    stream = stream * stream * (3.0 - 2.0 * stream);
    vec3 world = mix(intro, orb, stream);

    // The leak: once in the orb, some particles peel away past the right edge
    float leak = smoothstep(aLeak.x, aLeak.x + 0.25, uLeak) * stream;
    // Brightest and biggest mid-flight, so the peel reads as a stream
    float flight = sin(leak * 3.14159);
    world = mix(world, vec3(uExitX + aLeak.w, aLeak.y, aLeak.z), leak);
    world.y += flight * 0.3 * sign(aLeak.y);

    // Sunrise: the particles still in the orb fall into a horizon...
    float stay = 1.0 - leak;
    float fall = clamp((uHorizon - aRandom * 0.3) / 0.7, 0.0, 1.0);
    fall = fall * fall * (3.0 - 2.0 * fall);
    vec3 horizon = vec3(
      aHorizon.x * uHorizonFrame.x,
      uHorizonFrame.y + aHorizon.y * uHorizonFrame.z + sin(aHorizon.x * 3.0 + uTime * 0.6) * 0.06,
      aHorizon.z
    );
    world = mix(world, horizon, fall * stay);

    // ...then land on the sample site, fading as it appears
    float land = clamp((uLanding - aRandom * 0.3) / 0.7, 0.0, 1.0);
    land = land * land * (3.0 - 2.0 * land);
    vec3 site = vec3(mix(uLandRect.x, uLandRect.z, aLand.x), mix(uLandRect.y, uLandRect.w, aLand.y), 0.0);
    world = mix(world, site, land * stay);

    // Particles near the cursor push away (the orb's, not the logo's)
    vec3 toMouse = world - uMouse;
    float repulsion = smoothstep(1.5, 0.0, length(toMouse.xy)) * uMouseInfluence * stream;
    world += normalize(toMouse + vec3(0.001)) * repulsion * 0.8;
    world.z += repulsion * 0.5;
    vMouseProximity = repulsion;

    vec4 mvPosition = viewMatrix * vec4(world, 1.0);

    // Finer points while they draw the logo, the orb's soft glow once they arrive
    float size = mix(14.0 + aRandom * 14.0, 20.0 + aRandom * 25.0, stream);
    size *= uPixelRatio * (1.0 + vMouseProximity * 0.5) * (1.0 + flight * 0.5);
    gl_PointSize = size * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    float orbAlpha = (0.35 + 0.35 * (1.0 - smoothstep(0.0, 8.0, length(orbLocal)))) * (0.4 + aRandom * 0.3);
    float logoAlpha = 0.75 + aRandom * 0.25;
    vAlpha = (mix(logoAlpha, orbAlpha, stream) + vMouseProximity * 0.2 + flight * 0.35) * (1.0 - land);

    // The orb's depth tint; the logo keeps its light lilac and pink
    vPos = mix(vec3(0.0, 0.0, -2.0), orbLocal, stream);
    vColorMix = fract(aRandom + sin(orbLocal.y * 2.0 + uTime) * 0.1);
  }
`;
```

- [ ] **Step 2: The ambient dust keeps full opacity**

In `src/components/story/stage-ambient.ts`, in the `dustMaterial` uniforms, replace:

```ts
      uPixelRatio: material.uniforms.uPixelRatio,
      uColor: { value: new THREE.Color("#d946ef") },
```

with:

```ts
      uPixelRatio: material.uniforms.uPixelRatio,
      uOpacity: { value: 1 },
      uColor: { value: new THREE.Color("#d946ef") },
```

- [ ] **Step 3: Scenes can ask not to draw**

In `src/components/story/stage-scene.ts`, replace:

```ts
export type StageScene = {
  resize(size: StageSize): void;
  update(frame: StageFrame): void;
  dispose(): void;
};
```

with:

```ts
export type StageScene = {
  resize(size: StageSize): void;
  /** Return false to skip drawing this frame (the story sleeps through the day). */
  update(frame: StageFrame): boolean | void;
  dispose(): void;
};
```

- [ ] **Step 4: The story scene: sky, nav theme, horizon, landing and sleep**

Replace `src/components/story/stage-story.ts` with:

```ts
import * as THREE from "three";
import { LOGO_POINTS } from "./logo-points";
import {
  decodeLogoPoints,
  generateDust,
  generateHorizon,
  generateLanding,
  generateLeak,
  generateLogo,
  generateRandoms,
  generateScatter,
  generateSphere,
} from "./particle-shapes";
import { DUST_FRAGMENT, DUST_VERTEX, PARTICLE_FRAGMENT, STORY_VERTEX } from "./particle-shaders";
import type { StageFrame, StageScene, StageSetup, StageSize } from "./stage-scene";
import {
  directSky,
  directStage,
  introPhase,
  type IntroPhase,
  type SkyState,
} from "./story-director";
import { storyProgress } from "./story-progress";

type IntroWindow = Window & typeof globalThis & { __zailaIntroStarted?: boolean };

/** Share of the orb's particles that leak away in the reality chapter (spec §5). */
const LEAK_FRACTION = 0.45;

/**
 * Story mode, the homepage (spec §8). The intro draws the logo above the
 * curtain and streams it into the orb; the reality leaks about 45% of the orb
 * off the right edge; at sunrise the rest fall into a horizon and land on the
 * fix's sample site, and then the stage sleeps. The director turns progress
 * into positions and the sky, so scrolling back reverses every scene exactly.
 */
export function createStoryScene({ scene, camera, rng, size }: StageSetup): StageScene {
  const html = document.documentElement;
  const isPhone = size.width < 1024;
  const count = isPhone ? 5000 : 9000;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(generateSphere(count, 2.5, rng), 3));
  geometry.setAttribute("aStart", new THREE.BufferAttribute(generateScatter(count, 4, 8, rng), 3));
  geometry.setAttribute(
    "aLogo",
    new THREE.BufferAttribute(generateLogo(count, decodeLogoPoints(LOGO_POINTS), 1, rng), 3)
  );
  geometry.setAttribute(
    "aLeak",
    new THREE.BufferAttribute(generateLeak(count, LEAK_FRACTION, rng), 4)
  );
  geometry.setAttribute("aRandom", new THREE.BufferAttribute(generateRandoms(count, rng), 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: size.pixelRatio },
      uFly: { value: 1 },
      uStream: { value: 1 },
      uLeak: { value: 0 },
      uExitX: { value: 4 },
      uLogoScale: { value: 2 },
      uHorizon: { value: 0 },
      uLanding: { value: 0 },
      uHorizonFrame: { value: new THREE.Vector3(3, -0.2, 1.9) },
      uLandRect: { value: new THREE.Vector4(0, 0, 0, 0) },
      uMouse: { value: new THREE.Vector3() },
      uMouseInfluence: { value: 0 },
      uColor1: { value: new THREE.Color("#c084fc") },
      uColor2: { value: new THREE.Color("#e879f9") },
      uColor3: { value: new THREE.Color("#6d28d9") },
    },
    vertexShader: STORY_VERTEX,
    fragmentShader: PARTICLE_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geometry, material);
  // The shader moves particles far from their sphere positions (the logo, the
  // leak, the horizon, the landing), so the sphere's bounds can't cull them.
  particles.frustumCulled = false;
  scene.add(particles);

  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(generateDust(isPhone ? 400 : 650, rng), 3)
  );
  const dustMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: material.uniforms.uTime,
      uPixelRatio: material.uniforms.uPixelRatio,
      uOpacity: { value: 1 },
      uColor: { value: new THREE.Color("#d946ef") },
    },
    vertexShader: DUST_VERTEX,
    fragmentShader: DUST_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const dust = new THREE.Points(dustGeometry, dustMaterial);
  scene.add(dust);

  // Generated last, so the intro, the orb, the leak and the dust keep their seeded look
  geometry.setAttribute("aHorizon", new THREE.BufferAttribute(generateHorizon(count, rng), 3));
  geometry.setAttribute("aLand", new THREE.BufferAttribute(generateLanding(count, rng), 2));

  // World units covered by the pointer's -1 to 1 at z = 0, and the viewport
  const reach = { x: 1, y: 1 };
  let viewportWidth = size.width;
  let viewportHeight = size.height;

  function resize(next: StageSize) {
    const tanHalf = Math.tan((camera.fov * Math.PI) / 360);
    const aspect = next.width / next.height;
    reach.y = camera.position.z * tanHalf;
    reach.x = reach.y * aspect;
    viewportWidth = next.width;
    viewportHeight = next.height;
    material.uniforms.uPixelRatio.value = next.pixelRatio;
    // Just past the right edge, even for the deepest exit point (z = -1)
    material.uniforms.uExitX.value = (camera.position.z + 1) * tanHalf * aspect + 0.3;
    // The logo takes 58% of the height, or 72% of the width on narrow screens
    material.uniforms.uLogoScale.value = Math.min(reach.y * 2 * 0.58, reach.x * 2 * 0.72);
    // The horizon runs a little past both edges, just below the middle
    material.uniforms.uHorizonFrame.value.set(reach.x * 1.15, -0.1 * reach.y, reach.y);
    // Right of centre, behind the end of the headline; centred on phones
    particles.position.x = next.width < 1024 ? 0 : 1.5;
  }
  resize(size);

  // The sample site's box on screen, in world units at z = 0
  function aimLanding() {
    const target = storyProgress.landingTarget;
    if (!target) return;
    const box = target.getBoundingClientRect();
    const x = (px: number) => ((px / viewportWidth) * 2 - 1) * reach.x;
    const y = (px: number) => (1 - (px / viewportHeight) * 2) * reach.y;
    material.uniforms.uLandRect.value.set(x(box.left), y(box.top), x(box.right), y(box.bottom));
  }

  // The sky and the nav theme, written to <html> only when they change
  let painted = "";
  function paintSky(sky: SkyState) {
    const key = `${sky.top}${sky.mid}${sky.bottom}${sky.glow.toFixed(3)}${sky.nav}`;
    if (key === painted) return;
    painted = key;
    html.style.setProperty("--sky-top", sky.top);
    html.style.setProperty("--sky-mid", sky.mid);
    html.style.setProperty("--sky-bottom", sky.bottom);
    html.style.setProperty("--sky-glow", sky.glow.toFixed(3));
    html.dataset.navTheme = sky.nav;
  }

  // The intro gate (intro-gate.ts) decided before first paint whether this visit gets the intro
  let introPending = html.dataset.intro === "play";
  let introStart: number | null = null;
  let phase: IntroPhase | null = null;

  let baseRotationY = 0;
  let baseTimeX = 0;
  let dustTimeY = 0;

  function update({ delta, elapsed, scrollY, mouse, mouseInfluence }: StageFrame) {
    const now = performance.now();
    if (introPending) {
      // The intro starts on the stage's first frame, so the fly-in is seen from its start
      introPending = false;
      introStart = now;
      (window as IntroWindow).__zailaIntroStarted = true;
    }
    // The gate's backstop may have lifted the curtain already: finish at once
    if (introStart !== null && html.dataset.intro === "done") introStart = null;

    const introSeconds = introStart === null ? null : (now - introStart) / 1000;
    if (introSeconds !== null) {
      const next = introPhase(introSeconds);
      if (next !== phase) {
        phase = next;
        html.dataset.intro = next;
      }
      if (next === "done") introStart = null;
    }

    const state = directStage({
      introSeconds,
      heroExit: scrollY / viewportHeight,
      reality: storyProgress.reality,
      sunrise: storyProgress.sunrise,
    });
    const sky = directSky({ sunrise: storyProgress.sunrise, dusk: storyProgress.dusk });
    paintSky(sky);

    if (!still) {
      baseRotationY += delta * 0.05;
      baseTimeX += delta * 0.02;
      dustTimeY += delta * 0.02;
    }
    const influence = still ? 0 : mouseInfluence;

    const uniforms = material.uniforms;
    uniforms.uTime.value = still ? 0 : elapsed;
    uniforms.uFly.value = state.fly;
    uniforms.uStream.value = state.stream;
    uniforms.uLeak.value = state.leak;
    uniforms.uHorizon.value = state.horizon;
    uniforms.uLanding.value = state.landing;
    uniforms.uMouseInfluence.value = influence;
    if (influence > 0.001) uniforms.uMouse.value.set(mouse.x * reach.x, mouse.y * reach.y, 0);
    if (state.landing > 0 && state.landing < 1) aimLanding();
    dustMaterial.uniforms.uOpacity.value = sky.glow;

    particles.rotation.y = baseRotationY + state.spin + mouse.x * 0.2 * influence;
    particles.rotation.x = Math.sin(baseTimeX) * 0.1 + mouse.y * 0.15 * influence;
    dust.rotation.y = dustTimeY;

    return state.running;
  }

  function dispose() {
    // Leaving mid-intro (a route change) must never leave the curtain up
    if (introPending || introStart !== null) html.dataset.intro = "done";
    // Other pages keep the night sky and the night nav
    for (const name of ["--sky-top", "--sky-mid", "--sky-bottom", "--sky-glow"]) {
      html.style.removeProperty(name);
    }
    delete html.dataset.navTheme;
    scene.remove(particles, dust);
    geometry.dispose();
    material.dispose();
    dustGeometry.dispose();
    dustMaterial.dispose();
  }

  return { resize, update, dispose };
}
```

- [ ] **Step 5: The shell skips drawing while the scene sleeps**

In `src/components/story/particle-stage.tsx`:

1. Replace:

```tsx
      const clock = new THREE.Clock();
      let animationId = 0;
```

with:

```tsx
      const clock = new THREE.Clock();
      let animationId = 0;
      // The scene can ask not to draw: the story sleeps through the day (spec §8)
      let drawing = true;
      const setDrawing = (value: boolean) => {
        drawing = value;
        container.dataset.drawing = String(value);
      };
      setDrawing(true);
```

The helper is an arrow function because TypeScript can't narrow `container` inside the hoisted `function animate()`.

2. Replace:

```tsx
        stageScene.update({ delta, elapsed: clock.elapsedTime, scrollY, mouse, mouseInfluence });
        renderer.render(scene, camera);
```

with:

```tsx
        const draw =
          stageScene.update({ delta, elapsed: clock.elapsedTime, scrollY, mouse, mouseInfluence }) !==
          false;
        if (draw) {
          renderer.render(scene, camera);
        } else if (drawing) {
          // Falling asleep: clear what's left once, then draw nothing
          renderer.clear();
        }
        if (draw !== drawing) setDrawing(draw);
```

3. In `innerCleanup`, after `stageScene.dispose();`, add `delete container.dataset.drawing;`.

- [ ] **Step 6: The sky's middle colour**

In `src/app/globals.css`, replace:

```css
:root {
  --sky-top: #07060b;
  --sky-bottom: #07060b;
  --sky-glow: 1;
}
```

with:

```css
:root {
  --sky-top: #07060b;
  --sky-mid: #07060b;
  --sky-bottom: #07060b;
  --sky-glow: 1;
}
```

and replace the `.sky` rule (the curtain has an identical gradient line, so match the whole rule):

```css
.sky {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(180deg, var(--sky-top), var(--sky-bottom));
}
```

with:

```css
.sky {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(180deg, var(--sky-top), var(--sky-mid), var(--sky-bottom));
}
```

The intro curtain's own gradient stays as it is (it only shows at night).

- [ ] **Step 7: The interim dusk**

Create `src/components/story/interim-dusk.tsx`:

```tsx
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
```

In `src/app/page.tsx`, add `import { InterimDusk } from "@/components/story/interim-dusk";` after the `FixSection` import, and `      <InterimDusk />` on the line after `      <FixSection />`.

- [ ] **Step 8: The sky shows through the fix (the day panel stays only for reduced motion)**

In `src/components/fix-section.tsx`, in the `<section>`'s class list, replace `relative bg-day text-day-text` with `relative text-day-text motion-reduce:bg-day`. With motion, the sky is day behind the fix. With reduced motion there's no sunrise, so the section keeps its own day panel.

- [ ] **Step 9: Run the checks**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: `ℹ pass 44` (45 with the glow test in the note under Step 11), and everything else exits 0.

- [ ] **Step 10: Watch the sunrise**

Start `npm run start -- -p 3100` in the background. On desktop the sunrise runs from scrollY = 1.75 to 2.75 screens, the fix pins until 4.25, and the interim dusk runs from 4.25 to 4.9:

```bash
for f in 2.0 2.25 2.6 3.0 4.6 5.3; do
  node scripts/cdp.mjs "http://localhost:3100/" 6000 "(async () => { const go = (y) => window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y); go(innerHeight * $f); await new Promise((r) => setTimeout(r, 2500)); const h = document.documentElement; return { at: $f, top: h.style.getPropertyValue('--sky-top'), mid: h.style.getPropertyValue('--sky-mid'), bottom: h.style.getPropertyValue('--sky-bottom'), nav: h.dataset.navTheme, drawing: document.querySelector('.particle-stage').dataset.drawing, current: document.querySelector('.site-nav [aria-current=\"true\"]')?.textContent ?? null }; })()" ".lighthouse/shots/plan3-sky-$f-1440.png" 1440 900 | grep -v "THREE.Clock\|screenshot:" | tr -d '\n '; echo
done
node scripts/cdp.mjs "http://localhost:3100/" 6000 "(async () => { const go = (y) => window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y); go(innerHeight * 3.2); await new Promise((r) => setTimeout(r, 2500)); go(innerHeight * 2.25); await new Promise((r) => setTimeout(r, 2500)); return document.querySelector('.particle-stage').dataset.drawing; })()" .lighthouse/shots/plan3-sky-back-1440.png 1440 900
node scripts/cdp.mjs "http://localhost:3100/pricing" 4000 "[document.documentElement.style.getPropertyValue('--sky-top'), document.documentElement.dataset.navTheme ?? 'none']"
```

Expected:
- `2.0` (sunrise ≈ 0.25):
  - `top` `#07060B`, `bottom` violet, nav `night`, drawing `true`.
  - The frame: the reality text leaving at the top, and the orb's remaining particles falling toward a horizon.
- `2.25` (≈ 0.5):
  - `top` `#07060B`, `mid` `#6B59A8`, `bottom` `#F1F3F7`: the Sunrise frame's full gradient.
  - A particle horizon across the screen, and "02 / The fix" arriving at the bottom.
- `2.6` (≈ 0.85):
  - nav `day`.
  - Particles converging on the sample site as it fades in.
- `3.0` (pinned):
  - top, mid and bottom all `#F1F3F7`, nav `day`, drawing `false`, current `"Services"`.
  - The frame shows the fix building on the mist sky, with no particles.
- `4.6` (interim dusk ≈ 0.54):
  - `top` light, `bottom` `#07060B`.
  - The old process section's dark content rising into the night at the bottom.
- `5.3`:
  - All three `#07060B`, nav `night`, drawing `false`.
  - The old sections as before, on the night sky.
- The way back prints `"true"`: the stage wakes. `plan3-sky-back-1440.png` shows the horizon again, matching the `2.25` frame.
- `/pricing` prints `["", "none"]`: other pages keep the night defaults.

Compare `plan3-sky-2.25-1440.png` with the canvas "Sunrise" frame, and `plan3-sky-3.0-1440.png` with "02 The fix · last step".

- [ ] **Step 11: Phones and reduced motion**

```bash
MOBILE=1 node scripts/cdp.mjs "http://localhost:3100/" 6000 "(async () => { const s = document.getElementById('services'); scrollTo(0, s.offsetTop - innerHeight * 0.5); await new Promise((r) => setTimeout(r, 2500)); const h = document.documentElement; return { mid: h.style.getPropertyValue('--sky-mid'), drawing: document.querySelector('.particle-stage').dataset.drawing }; })()" .lighthouse/shots/plan3-sky-390.png 390 844
REDUCED=1 node scripts/cdp.mjs "http://localhost:3100/" 3000 "(async () => { document.getElementById('services').scrollIntoView(); await new Promise((r) => setTimeout(r, 800)); return { bg: getComputedStyle(document.getElementById('services')).backgroundColor, sky: document.documentElement.style.getPropertyValue('--sky-top') || 'default' }; })()" .lighthouse/shots/plan3-fix-reduced-1440.png 1440 900
```

Expected:
- Phone: `mid` violet (mid-sunrise) and drawing `true`. The frame shows the horizon across the phone and the fix arriving.
- Reduced motion: `bg` `rgb(241, 243, 247)` and the sky night (`#07060B`: the stage still paints it, with no sunrise). The frame shows the finished fix on its own day panel: all four rows open, the full site.

Stop the server.

> **Found while executing (2026-09-28):** at `2.25` the first frames had a dark smudge in the middle of the sunrise, and the canvas Sunrise frame has none. The cause was the night glow (`.sky::after`, a radial `#0f0b18`). That colour is only lighter than night, so over violet and mist it reads as a dark blotch. Task 2's `glow: d > 0 ? d : 1 - s` still had it at 50% mid-sunrise. The glow now belongs to the night-dark middle of the sky: full until the middle starts to lighten, gone by 15% of the way along its stops, and back in the dusk only over the last 15%. This also takes it off the middle of the dusk. In `story-director.ts`, `directSky`:
>
> ```ts
>   const top = sampleStops(stops, t * 2 - 1);
>   const midAt = t * 2 - 0.5;
>   return {
>     top,
>     mid: sampleStops(stops, midAt),
>     bottom: sampleStops(stops, t * 2),
>     // The glow sits in the middle of the screen and is only lighter than night,
>     // so it shows while the middle is still night-dark and is gone as it lightens
>     glow: d > 0 ? clamp01((midAt - 0.85) / 0.15) : 1 - clamp01(midAt / 0.15),
> ```
>
> with a new test before "in both transitions the bottom of the sky leads" (`ℹ pass 44` before it, 45 with it):
>
> ```ts
> test("the night glow only shows while the middle of the sky is still night", () => {
>   const glow = (sunrise: number, dusk: number) => directSky({ sunrise, dusk }).glow;
>   assert.equal(glow(0.25, 0), 1);
>   // Mid-sunrise and mid-dusk the middle is violet, where the glow reads as a smudge
>   assert.equal(glow(0.5, 0), 0);
>   assert.equal(glow(1, 0.5), 0);
>   assert.equal(glow(1, 0.75), 1);
> });
> ```
>
> Known interim limitation: mid-dusk (`4.6`), the dark front passes the fix's pricing link as the chapter leaves, so for a moment it's violet on dark violet. Plan 5 replaces this stopgap dusk with the marquee's, which it can tie to the section boundary.

- [ ] **Step 12: Commit**

```bash
git add src/components/story/particle-shaders.ts src/components/story/stage-ambient.ts src/components/story/stage-scene.ts src/components/story/stage-story.ts src/components/story/particle-stage.tsx src/app/globals.css src/components/story/interim-dusk.tsx src/app/page.tsx src/components/fix-section.tsx src/components/story/story-director.ts src/components/story/story-director.test.ts docs/superpowers/plans/2026-09-28-night-into-day-plan-3-sunrise-and-fix.md
git commit -m "feat(story): sunrise into the fix; the stage lands the particles and sleeps"
```

---

### Task 7: Verify, measure and hand off

**Files:**
- Modify: `docs/superpowers/plans/2026-09-27-night-into-day-log.md`
- Modify: `/Users/sheldonsteele/ZailaAIDesignsBusiness/HANDOFF.md` (the IN FLIGHT line, plus a LOG entry)

- [ ] **Step 1: Run the full check suite**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: `ℹ pass 44`, and everything else exits 0.

- [ ] **Step 2: The speed gate (applied throttling)**

Start `npm run start -- -p 3100` in the background, then:

```bash
for i in 1 2 3; do
  npx --yes lighthouse@12 http://localhost:3100/ --quiet \
    --chrome-flags="--headless=new" \
    --throttling-method=devtools --only-categories=performance \
    --output=json --output-path=".lighthouse/applied-plan3-$i.json"
done
node scripts/lh-summary.mjs .lighthouse/applied-plan3-1.json .lighthouse/applied-plan3-2.json .lighthouse/applied-plan3-3.json
node -e 'for (const i of [1, 2, 3]) { const r = require(`./.lighthouse/applied-plan3-${i}.json`); const item = r.audits["largest-contentful-paint-element"].details.items[0].items[0]; console.log(i, "perf", Math.round(r.categories.performance.score * 100), "LCP", (r.audits["largest-contentful-paint"].numericValue / 1000).toFixed(2), "TBT", Math.round(r.audits["total-blocking-time"].numericValue), item.node.snippet); }'
```

Required: Performance ≥ 84, LCP ≤ 1.92 s, CLS ≤ 0.1. If one misses, stop and report the numbers.

- [ ] **Step 3: Simulated runs, recorded alongside**

```bash
for i in 1 2 3 4 5; do
  npx --yes lighthouse@12 http://localhost:3100/ --quiet \
    --chrome-flags="--headless=new" \
    --only-categories=performance,accessibility,best-practices,seo \
    --output=json --output-path=".lighthouse/sim-plan3-$i.json"
done
node scripts/lh-summary.mjs .lighthouse/sim-plan3-1.json .lighthouse/sim-plan3-2.json .lighthouse/sim-plan3-3.json .lighthouse/sim-plan3-4.json .lighthouse/sim-plan3-5.json
node -e 'const r = require("./.lighthouse/sim-plan3-1.json"); for (const cat of ["accessibility", "best-practices", "seo"]) for (const ref of r.categories[cat].auditRefs) { const a = r.audits[ref.id]; if (a.score !== null && a.score < 1 && ref.weight > 0) console.log(cat, ref.id, a.score, a.title); }'
```

Expected: Accessibility 100, SEO 100, Best practices ≥ 96. The only failing audit expected is `errors-in-console`, from the Vercel scripts returning 404 on localhost, as in the baseline. Fix anything else and re-run.

- [ ] **Step 4: G2 and G3**

```bash
node scripts/cdp.mjs "http://localhost:3100/" 6000 "(() => { const s = document.getElementById('services'); const vh = innerHeight; const services = document.getElementById('services'); return { fixTopScreens: +(s.offsetTop / vh).toFixed(2), stickyBeforeServices: [...document.querySelectorAll('main *')].filter((el) => getComputedStyle(el).position === 'sticky' && (el.compareDocumentPosition(services) & Node.DOCUMENT_POSITION_FOLLOWING)).length }; })()"
```

Expected: `fixTopScreens` about 2.75. So services start arriving at scrollY ≈ 1.75 screens and are fully in view at ≈ 2.75 (G2). `stickyBeforeServices` is `1`, the reality pin (G3). Stop the server.

- [ ] **Step 5: Record the results in the log**

Append to `docs/superpowers/plans/2026-09-27-night-into-day-log.md`. Replace the capitalised markers with the commit (`git rev-parse --short HEAD`), the printed rows, run 1's LCP element and "passes" or "misses":

```markdown

## After plan 3 (sunrise and the fix)

Commit SHORT_SHA. Same methods as above.

**Applied throttling (3 runs), the gate:**

| Metric | Value |
|---|---|
| ROWS FROM STEP 2 | |

**Simulated (5 runs), recorded alongside:**

| Metric | Value |
|---|---|
| ROWS FROM STEP 3 | |

- **Verdict:** VERDICT the gate (Performance ≥ 84, LCP ≤ 1.92 s, CLS ≤ 0.1).
- **LCP element:** `SNIPPET` (applied run 1).
- **What changed:**
  - The fix replaces the old services grid: the sample salon site builds itself across a 1.5-screen pin.
  - The sky scrubs from night to mist with a middle colour.
  - The stage lands the particles on the sample site, then stops drawing (`data-drawing="false"`) through the day.
  - The sample site's Fraunces font loads lazily, below the fold.
- **G2:** the fix's top sits at about 2.75 screens, so services arrive from about screen 1.75. **G3:** one pin before services (the reality).
- **Interim:** the sky turns back to night after the fix until plan 5, because the sections below are still the dark originals.
```

Commit it:

```bash
git add docs/superpowers/plans/2026-09-27-night-into-day-log.md
git commit -m "docs: plan 3 measurements"
```

- [ ] **Step 6: Update the handoff file and snapshot it**

In `/Users/sheldonsteele/ZailaAIDesignsBusiness/HANDOFF.md`, in the IN FLIGHT line for `zaila-ai-designs`, replace:

```
plans 1 and 2 done (head `35dcd3f`), plan 3 (sunrise and the fix) next
```

with this, where SHORT_SHA is the output of `git rev-parse --short HEAD`:

```
plans 1–3 done (head `SHORT_SHA`, not yet pushed to the draft PR), plan 4 (selected work) next
```

Then append at the end of the LOG, filling in the timestamp (`date "+%Y-%m-%d %H:%M"`) and the numbers:

```markdown

## [TIMESTAMP] Claude | zailaai.com night-into-day: plan 3 (sunrise and the fix) done

- Branch `feat/night-into-day-2026-09`, head `SHORT_SHA`, committed locally; draft PR #4 doesn't have it yet (pushing needs Waldo's word).
- **Plan 3 of 6** (plan `docs/superpowers/plans/2026-09-28-night-into-day-plan-3-sunrise-and-fix.md`):
  - **The sunrise:** as the fix arrives, the sky scrubs from night through violet to mist, and the orb's remaining particles fall into a horizon, then land on the sample site.
  - **02 The fix:** a made-up salon site, "Your Salon", builds itself across a 1.5-screen pin (1 screen on phones): the page, then the booking, the chat and the care check-in. The four services follow along on the left, each opening its full description.
  - **Nav:** it turns to its day theme and marks Services.
  - **Stage:** it stops drawing through the day.
- **Interim, until plan 5:** the sky turns back to night after the fix, because the sections below are still the dark originals.
- **Moved aside, not deleted:** `src/components/services-section.tsx` → `archive/2026-09-night-into-day/src/components/`.
- **Lighthouse mobile, applied throttling (median of 3, localhost):** Performance NEW_PERF, LCP NEW_LCP s (baseline 87, 1.72 s). Full table in `docs/superpowers/plans/2026-09-27-night-into-day-log.md`.
- **→ Waldo:** nothing blocking. Say the word to push plan 3's commits to the draft PR for a Vercel preview.
- → ChatGPT: nothing needed.
```

Then run:

```bash
bash /Users/sheldonsteele/ZailaAIDesignsBusiness/_AI/snapshot.sh "zailaai.com night-into-day plan 3 done" "Claude" HANDOFF.md
```

Expected: `about to commit: HANDOFF.md` and a commit line.
