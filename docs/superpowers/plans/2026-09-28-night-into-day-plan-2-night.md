# Night into day, plan 2 of 6: The Night Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the homepage's night: a refined particle-logo intro that streams into the hero orb, the new hero and night nav, and "01 The reality" with its word fill and reversible leak, all driven by a first story director.

**Architecture:**
- **One stage, two scenes.** `particle-stage.tsx` becomes a shell: renderer, camera, scroll, pointer, resize and tab visibility. It runs a *scene*: `stage-ambient.ts` (plan 1's port, every page but the homepage) or `stage-story.ts` (the homepage, loaded as its own chunk).
- **The director.** `story-director.ts` (pure, unit-tested) turns intro time, hero exit and reality progress into what the particles do. Positions are a function of progress, so every scene reverses exactly.
- **The intro gate.** A tiny inline script in `<head>` decides before first paint whether this visit gets the intro. It writes `<html data-intro>`. CSS shows the curtain from that attribute, the stage runs the intro from it, and React renders identical markup on server and client. That ends the hydration error today's `loading-screen.tsx` throws on every reload.
- **Chapter progress.** `story-progress.ts` is a plain object the homepage's scroll scenes write and the stage reads every frame, so scrolling never re-renders React.
- **The reality chapter** pins with CSS `position: sticky`. GSAP's ScrollTrigger only reads progress, and GSAP loads after first paint.

**Tech Stack:** Next.js 16.1.6 (App Router, Turbopack), React 19.2, TypeScript 5, Tailwind CSS v4, three 0.183, GSAP 3.15 (ScrollTrigger), Lenis 1.3, Node's built-in test runner, Python 3 with Pillow (dev-only generator), Lighthouse 12 via `npx`.

**Spec:** `docs/superpowers/specs/2026-09-27-night-into-day-homepage-design.md`. Read §4, §5 (Intro, Hero, 01 The reality), §7, §8, §11, §12 and §14 first. This plan is the spec's build phase 2. Plan 1 (`docs/superpowers/plans/2026-09-27-night-into-day-plan-1-foundation.md`) built the fonts, tokens, sky, GSAP engine and the ambient stage this plan extends. Design frames: the canvas at https://claude.ai/artifact/RkjEadVhEvTnBaqsVRSpzz ("Intro", "Hero · night", "01 The reality", and the phone frames).

## Global Constraints

**Git and rollout**
- Work only on branch `feat/night-into-day-2026-09`. Never commit to `main`. Never push: Waldo pushes, and merging to `main` deploys production.
- Commit messages have **no** `Co-Authored-By` lines (Waldo's standing preference).
- Stage paths explicitly (`git add <paths>`). Never `git add -A` or `git add .`, because the untracked `AGENTS.md` at the repo root isn't part of this work.
- Never delete a file. A replaced file moves with `git mv` to `archive/2026-09-night-into-day/<its original path>`, and each move is logged in `/Users/sheldonsteele/ZailaAIDesignsBusiness/HANDOFF.md` (Task 10).

**Secrets, servers and other sessions**
- Never read or modify `.env*`, `.env.sentry-build-plugin` or anything under `credentials/`.
- `npm run build` runs the project's Sentry plugin as usual and may upload source maps, as every Vercel build does. That's expected.
- Dev server: `npm run dev -- -p 3001`. Production server: `npm run build && npm run start -- -p 3100`. Port 3000 belongs to another app (pid 57320): never stop it. Stop only servers you started.
- The browser pane is hidden and renders no frames, so check pages with `scripts/cdp.mjs` and `scripts/shot.sh` (headless Chrome with real frames). They clean up their own Chrome. Never kill any other Chrome process.
- Another session owns branch `fix/metadata-sweep-2026-09` (worktree `.claude/worktrees/gracious-carson-4d41d9`). Never touch that worktree. In `src/app/layout.tsx`, leave the `metadata` object alone: that branch edits it.
- Edit CSS with the Edit tool, not shell appends. In plan 1, Turbopack's dev CSS cache missed a shell append.

**Stack**
- Styling stays Tailwind v4 plus `src/app/globals.css`. No new npm dependencies in this plan.
- GSAP is only ever loaded with `import("@/lib/motion/gsap")` inside an effect of a homepage client component, so it stays off the first-paint path (plan 1's speed lesson).
- framer-motion stays in the nav (spec §5) and out of the rewritten hero and reality sections (spec §11).

**Design rules**
- Brand tokens (spec §6) are Tailwind colours from plan 1:

  | Utility suffix | Value |
  |---|---|
  | `night`, `night-raise` | `#07060B`, `#0E0C15` |
  | `night-text`, `night-muted`, `night-dim` | `#F4F4F5`, `#A1A1AA`, `#8A8A93` |
  | `night-line` | `rgb(255 255 255 / 0.08)` |
  | `brand`, `brand-glow`, `brand-ink` | `#7C3AED`, `#A855F7`, `#6D28D9` |
  | `lavender`, `quiet` | `#EDE9FE`, `#7B8698` |

- Type utilities from plan 1: `text-hero` (42→84px), `text-statement` (30→50px), `text-label` (13px, 0.04em). `font-display` is Manrope, `font-sans` is Inter.
- Standing preferences: no page transitions (no sweeping overlays), and no text labels in the custom cursor.
- Pins are CSS `position: sticky`. ScrollTrigger reads progress and never pins or rewraps markup. With reduced motion, nothing pins or scrubs and every line shows in its final state.

**Copy**
- Approved copy, used verbatim:
  - Hero: "Premium websites for service businesses that want more leads." ("more leads." in `#A855F7`). The subhead "Zaila designs and builds fast, modern websites with optional booking, payments, and AI support — so your business looks credible and works harder online. Live in days, not months." "Start Your Project". "See pricing — builds from $800, care from $69/mo →" (phones: "See pricing — from $800 →"). "Available for new projects".
  - Reality: "Someone Googles you tonight, lands on a slow page with no way to book, and calls the next place on the list." "You never hear about it." "That's the leak we fix."
- Draft, for Waldo's approval before merge: the chapter label "01 / The reality".
- Dropped from the homepage when `story-section.tsx` is archived, pending Waldo's approval (spec §10): "Why we exist", "Most business websites quietly underperform. Here's why.", the fact chips, and "Every day without a great site costs you customers". The "problem" and "fix" beats' copy returns in plans 5 and 3 (read it from the archived file).
- House voice for anything new: sentence case, no exclamation marks, no emojis, never an invented metric, testimonial or client.

**Speed gate (Waldo, 2026-09-27)**
- Applied throttling, median of 3 runs, against the baseline (Performance 87, LCP 1.72 s): Performance ≥ 84, LCP ≤ 1.92 s, CLS ≤ 0.1.
- Simulated throttling (5 runs), recorded alongside: Accessibility 100, SEO 100, Best practices ≥ 96.
- Methods are in `docs/superpowers/plans/2026-09-27-night-into-day-log.md`. If the gate misses, stop and report the numbers instead of continuing.

**Code style**
- Match the codebase: 2-space indent, double quotes, semicolons, `"use client"` at the top of client components, `@/` imports in app code.
- Pure modules in `src/components/story/*.ts` import nothing from the app. Tests import them with a `.ts` extension. A pure module that imports a sibling pure module also uses the `.ts` extension, because Node's type stripping needs it (`tsconfig.json` allows it). Type-only imports use `import type`.
- The lint config includes React Compiler rules (`react-hooks/set-state-in-effect`, `purity`, `refs`, `globals`). Don't call `setState` synchronously in an effect body, and keep impure calls such as `new Date()` out of render (module-level functions are fine).
- Checks: `npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build`.

## Deliberate differences from the spec and the frames

Each is small, and each is here so a reviewer doesn't mistake it for a slip:

1. **The word fill uses server-rendered word spans, not SplitText.** SplitText's screen-reader handling puts `aria-label` on the `<p>`, which ARIA prohibits on paragraphs (Lighthouse flags it). It also rewrites a DOM that React owns. Plain spans read naturally, are in the server HTML, and need no re-split on resize. SplitText stays registered for the line reveals in later plans.
2. **Unfilled words are `#63636E`, not the frame's `#4B4B55`.** The frame's grey is 2.34:1 on night. Large type needs 3:1, and `#63636E` gives 3.40:1 (3.27:1 over the sky's centre glow), keeping Accessibility at 100.
3. **The intro plays once per session, when the session starts on the homepage.** The gate marks the session on its first page load, wherever that is. Today a visitor who lands on the blog and then clicks Home still sits through the intro, on a client-side navigation. A flash-free curtain can't do that: it would appear only after the new page had painted.
4. **The homepage skips the route fade.** The hero has its own entrance, and a fade from `opacity: 0` would hold back the headline that becomes the page's LCP once the nav's logo image is gone.
5. **On phones the headline fades up as one piece.** Per-line masks need forced line breaks, and those break badly at 42px.
6. **"Work" joins the nav in plan 4**, when `#work` exists.
7. **The availability dot keeps the frame's green (`#34D399`).** It's a status light, not an accent.
8. **Director v1 has no sky or nav-theme outputs yet.** Plan 2 is all night; plan 3 adds both with the sunrise.

---

## File structure

| Path | Status | Responsibility |
|---|---|---|
| `eslint.config.mjs` | modify | Ignore `.claude/**` (agent worktrees are not project source) |
| `scripts/sample-logo-points.py` | create | Regenerates the logo's points from `public/logo.png` (dev-only) |
| `src/components/story/logo-points.ts` | create (generated) | 3,000 logo points, base64 (~16 KB) |
| `src/components/story/particle-shapes.ts` (+ test) | modify | Scatter, logo and leak generators; logo point decoder |
| `src/components/story/story-director.ts` (+ test) | create | Progress → stage state; intro phase |
| `src/components/story/intro-gate.ts` (+ test) | create | Pre-paint script that decides the intro |
| `scripts/cdp.mjs` | modify | Prints console errors; `LOADS` and `REDUCED` options |
| `src/components/story/stage-scene.ts` | create | Types shared by the stage and its scenes |
| `src/components/story/stage-ambient.ts` | create | Ambient scene (plan 1's port, moved out of the component) |
| `src/components/story/particle-stage.tsx` | modify | Shell: renderer, camera, inputs; picks the scene |
| `src/components/story/story-progress.ts` | create | Chapter progress shared with the stage |
| `src/components/story/particle-shaders.ts` | modify | `STORY_VERTEX` |
| `src/components/story/stage-story.ts` | create | Story scene: intro, orb, leak |
| `src/components/story/intro-curtain.tsx` | create | The night curtain element |
| `src/app/layout.tsx` | modify | Gate script, curtain, Manrope preload |
| `src/app/globals.css` | modify | Stage class, curtain, hero entrance, homepage route-fade opt-out |
| `src/app/page.tsx` | modify | Chapter order |
| `src/components/ui/chip-mark.tsx` | create | The logo's chip, inline SVG |
| `src/components/navbar-new.tsx` | modify | Night theme |
| `src/components/ui/hamilton-time.tsx` | create | Live Hamilton time |
| `src/components/ui/scroll-link.tsx` | create | In-page link that glides with Lenis |
| `src/components/hero.tsx` | modify (rewrite) | The new hero (server component) |
| `src/components/reality-section.tsx` | create | 01 The reality |
| `src/components/loading-screen.tsx` | move to archive | Replaced by the curtain and the stage |
| `src/components/story-section.tsx` | move to archive | Replaced by the reality chapter |
| `docs/superpowers/plans/2026-09-27-night-into-day-log.md` | modify | Plan 2 measurements |

## What comes after this plan

| Plan | Scope |
|---|---|
| 3, Sunrise and the fix | Director gains sky stops and the nav theme; `storyProgress` gains the sunrise and the fix; horizon and landing (the landing rectangle is measured from the sample site's DOM box); `fix-section.tsx` with the four-step build and expanding rows (the fix beat's copy is in `archive/2026-09-night-into-day/src/components/story-section.tsx`); nav day theme on `data-nav-theme`; stage sleep once the landing completes; `services-section.tsx` archived |
| 4, Selected work | Captures, `src/lib/work.ts` with `enabled`/`linkEnabled`, frame opening, scroll-linked captures, "Work" in nav and footer |
| 5, The rest of the day | Process (opens with the archived "problem" beat), how we work, marquee, dusk contact with the logo bookend, footer; remaining old sections archived |
| 6, Finish | Phones (orb placement from the phone frames; the 406 px layout width found in plan 1), reduced motion on every page, speed pass (including inner pages' LCP now that the nav has no image), cross-browser checks, verification against G1–G9, hand-off for a Vercel preview |

---

### Task 1: Logo points and the intro's shapes

**Files:**
- Modify: `eslint.config.mjs` (ignore `.claude/**`)
- Create: `scripts/sample-logo-points.py`
- Create (generated): `src/components/story/logo-points.ts`
- Modify: `src/components/story/particle-shapes.ts` (append four functions)
- Test: `src/components/story/particle-shapes.test.ts` (extend the import, append five tests)

**Interfaces:**
- Consumes: `Rng`, `mulberry32` from `particle-shapes.ts` (plan 1).
- Produces:
  - `LOGO_POINTS: string` (`logo-points.ts`): 3,000 points, base64 of little-endian uint16 x,y pairs.
  - `decodeLogoPoints(base64: string): Float32Array`: x,y pairs in [-0.5, 0.5] on the logo's longer side, y up.
  - `generateLogo(count: number, points: Float32Array, size: number, rng: Rng): Float32Array`: `count * 3` floats; the logo centred on the origin, `size` world units on its longer side.
  - `generateScatter(count: number, inner: number, outer: number, rng: Rng): Float32Array`: `count * 3` floats on a ring between `inner` and `outer`, z in [-3, 1.5].
  - `generateLeak(count: number, fraction: number, rng: Rng): Float32Array`: `count * 4` floats per particle: [leaves at (0–0.75, or 2 = never), exit height (±1.6), exit depth (±1), extra distance past the edge (0–1.5)].

- [ ] **Step 1: Make lint ignore agent worktrees**

`npm run lint` currently reports about 13,700 problems, all inside `.claude/worktrees/gracious-carson-4d41d9` (another session's worktree, including its build output). `npx eslint src` is clean. In `eslint.config.mjs`, replace:

```js
    // Files moved aside by the night-into-day revamp (never compiled).
    "archive/**",
```

with:

```js
    // Files moved aside by the night-into-day revamp (never compiled).
    "archive/**",
    // Agent worktrees and settings (other branches, their own build output).
    ".claude/**",
```

Run: `npm run lint`
Expected: exits 0 with no problems listed.

- [ ] **Step 2: Write the failing tests**

In `src/components/story/particle-shapes.test.ts`, replace the import block:

```ts
import {
  generateCube,
  generateDust,
  generateHelix,
  generatePlane,
  generateRandoms,
  generateSphere,
  generateTorus,
  mulberry32,
} from "./particle-shapes.ts";
```

with:

```ts
import {
  decodeLogoPoints,
  generateCube,
  generateDust,
  generateHelix,
  generateLeak,
  generateLogo,
  generatePlane,
  generateRandoms,
  generateScatter,
  generateSphere,
  generateTorus,
  mulberry32,
} from "./particle-shapes.ts";
import { LOGO_POINTS } from "./logo-points.ts";
```

Then append to the end of the file:

```ts
test("decodeLogoPoints maps little-endian uint16 pairs onto -0.5 to 0.5", () => {
  const encoded = Buffer.from(new Uint16Array([0, 65535, 32768, 16384]).buffer).toString("base64");
  const points = decodeLogoPoints(encoded);
  assert.equal(points.length, 4);
  assert.ok(Math.abs(points[0] + 0.5) < 1e-6);
  assert.ok(Math.abs(points[1] - 0.5) < 1e-6);
  assert.ok(Math.abs(points[2]) < 1e-4);
  assert.ok(Math.abs(points[3] + 0.25) < 1e-4);
});

test("the logo's precomputed points fill the logo's box", () => {
  const points = decodeLogoPoints(LOGO_POINTS);
  assert.equal(points.length, 6000);
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < points.length; i += 2) {
    minX = Math.min(minX, points[i]);
    maxX = Math.max(maxX, points[i]);
    minY = Math.min(minY, points[i + 1]);
    maxY = Math.max(maxY, points[i + 1]);
  }
  // Normalised on the longer side (the width), so x spans almost -0.5 to 0.5
  assert.ok(minX < -0.48 && maxX > 0.48);
  // The logo is nearly square (632 × 601 px), so y spans a little less
  assert.ok(minY >= -0.5 && maxY <= 0.5 && maxY - minY > 0.9);
});

test("logo targets reuse the points at the given size, with a little depth", () => {
  const points = decodeLogoPoints(LOGO_POINTS);
  const size = 2;
  const logo = generateLogo(9000, points, size, mulberry32(3));
  assert.equal(logo.length, 9000 * 3);
  assert.deepEqual(logo, generateLogo(9000, points, size, mulberry32(3)));
  eachPoint(logo, (x, y, z) => {
    assert.ok(Math.abs(x) <= size * 0.51 && Math.abs(y) <= size * 0.51);
    assert.ok(Math.abs(z) <= size * 0.025 + 1e-6);
  });
});

test("the scatter is a ring just outside the view, in front of the camera", () => {
  const points = generateScatter(N, 4, 8, mulberry32(4));
  assert.equal(points.length, N * 3);
  eachPoint(points, (x, y, z) => {
    const r = Math.hypot(x, y);
    assert.ok(r >= 4 - 1e-5 && r <= 8 + 1e-5);
    assert.ok(z >= -3 && z <= 1.5);
  });
});

test("the leak sends about the given share of particles past the edge", () => {
  const count = 4000;
  const leak = generateLeak(count, 0.45, mulberry32(5));
  assert.equal(leak.length, count * 4);
  let leavers = 0;
  for (let i = 0; i < count; i++) {
    const at = leak[i * 4];
    if (at <= 1) {
      leavers++;
      assert.ok(at >= 0 && at <= 0.75);
    } else {
      assert.equal(at, 2);
    }
    assert.ok(Math.abs(leak[i * 4 + 1]) <= 1.6);
    assert.ok(Math.abs(leak[i * 4 + 2]) <= 1);
    assert.ok(leak[i * 4 + 3] >= 0 && leak[i * 4 + 3] <= 1.5);
  }
  assert.ok(Math.abs(leavers / count - 0.45) < 0.03);
});
```

- [ ] **Step 3: Run the tests to make sure they fail**

Run: `npm test`
Expected: FAIL. `particle-shapes.test.ts` can't load, with `Cannot find module` for `logo-points.ts` or `does not provide an export named 'decodeLogoPoints'`. The 9 sky tests still pass.

- [ ] **Step 4: Add the generators**

Append to `src/components/story/particle-shapes.ts`:

```ts
/**
 * Where the intro's particles start: a ring just outside the view, all in
 * front of the camera (z from -3 to 1.5), so none sweeps past the lens.
 */
export function generateScatter(count: number, inner: number, outer: number, rng: Rng): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = rng() * Math.PI * 2;
    const r = inner + rng() * (outer - inner);
    positions[i * 3] = r * Math.cos(angle);
    positions[i * 3 + 1] = r * Math.sin(angle);
    positions[i * 3 + 2] = rng() * 4.5 - 3;
  }
  return positions;
}

/**
 * Unpack the logo's precomputed points (scripts/sample-logo-points.py writes
 * them). Returns x,y pairs in -0.5 to 0.5, measured on the logo's longer
 * side, with y pointing up.
 */
export function decodeLogoPoints(base64: string): Float32Array {
  const bytes = atob(base64);
  const out = new Float32Array(bytes.length / 2);
  for (let i = 0; i < out.length; i++) {
    const value = bytes.charCodeAt(i * 2) | (bytes.charCodeAt(i * 2 + 1) << 8);
    out[i] = value / 65535 - 0.5;
  }
  return out;
}

/**
 * Targets that draw the logo, centred on the origin and facing the camera.
 * `points` comes from decodeLogoPoints; `size` is the logo's longer side in
 * world units. Extra particles reuse the points with a jitter of about half
 * the spacing between them, so the strokes fill in rather than doubling up.
 */
export function generateLogo(count: number, points: Float32Array, size: number, rng: Rng): Float32Array {
  const positions = new Float32Array(count * 3);
  const n = points.length / 2;
  const jitter = size * 0.008;
  for (let i = 0; i < count; i++) {
    const j = i % n;
    positions[i * 3] = points[j * 2] * size + (rng() - 0.5) * jitter;
    positions[i * 3 + 1] = points[j * 2 + 1] * size + (rng() - 0.5) * jitter;
    positions[i * 3 + 2] = (rng() - 0.5) * size * 0.05;
  }
  return positions;
}

/**
 * The leak (spec §5): four floats per particle. [0] is when it leaves, as a
 * share of the leak (0 to 0.75, or 2 for never); [1] and [2] are the height
 * and depth it exits at; [3] is how far past the right edge it drifts.
 */
export function generateLeak(count: number, fraction: number, rng: Rng): Float32Array {
  const values = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const leaves = rng() < fraction;
    values[i * 4] = leaves ? rng() * 0.75 : 2;
    values[i * 4 + 1] = (rng() - 0.5) * 3.2;
    values[i * 4 + 2] = (rng() - 0.5) * 2;
    values[i * 4 + 3] = rng() * 1.5;
  }
  return values;
}
```

- [ ] **Step 5: Write the logo point generator**

Create `scripts/sample-logo-points.py`:

```python
#!/usr/bin/env python3
"""Regenerate src/components/story/logo-points.ts from public/logo.png.

The intro's particles draw the logo from these points, so the page never
fetches or samples the PNG at load (spec §5 and §8). Dev-only: run it by hand
after the logo changes, then commit the output. Needs Pillow.

Usage: python3 scripts/sample-logo-points.py
"""

import base64
import random
import struct
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public" / "logo.png"
TARGET = ROOT / "src" / "components" / "story" / "logo-points.ts"

COUNT = 3000  # 12 KB of points; the stage reuses them for up to 9,000 particles
ALPHA_MIN = 128  # a pixel is part of the logo from half opacity up
SEED = 20260927  # the particle stage's seed


def main() -> None:
    image = Image.open(SOURCE).convert("RGBA")
    width, height = image.size
    alpha = image.getchannel("A").load()
    opaque = [(x, y) for y in range(height) for x in range(width) if alpha[x, y] >= ALPHA_MIN]

    left = min(x for x, _ in opaque)
    right = max(x for x, _ in opaque) + 1
    top = min(y for _, y in opaque)
    bottom = max(y for _, y in opaque) + 1
    side = max(right - left, bottom - top)
    cx, cy = (left + right) / 2, (top + bottom) / 2

    # Even coverage: split the logo into square cells, using the largest cell
    # size that still leaves COUNT occupied cells, and take one pixel from
    # each chosen cell. Thin wordmark strokes get points as well as the chip.
    def occupied(size: int) -> dict:
        cells: dict = {}
        for x, y in opaque:
            cells.setdefault(((x - left) // size, (y - top) // size), []).append((x, y))
        return cells

    size = int((len(opaque) / COUNT) ** 0.5) + 4
    cells = occupied(size)
    while len(cells) < COUNT and size > 1:
        size -= 1
        cells = occupied(size)

    rng = random.Random(SEED)
    keys = sorted(cells)
    rng.shuffle(keys)
    points = [rng.choice(cells[key]) for key in keys[:COUNT]]

    # x and y in -0.5..0.5 on the logo's longer side, y up, as little-endian uint16
    packed = bytearray()
    for x, y in points:
        for value in ((x + 0.5 - cx) / side, (cy - (y + 0.5)) / side):
            packed += struct.pack("<H", round((value + 0.5) * 65535))
    encoded = base64.b64encode(bytes(packed)).decode("ascii")

    TARGET.write_text(
        "// Generated by scripts/sample-logo-points.py from public/logo.png. Do not edit.\n"
        f"// {COUNT} points as little-endian uint16 x,y pairs, base64. Decode with decodeLogoPoints().\n"
        "\n"
        f'export const LOGO_POINTS =\n  "{encoded}";\n'
    )
    print(
        f"{TARGET.relative_to(ROOT)}: {COUNT} points from {len(opaque)} logo pixels, "
        f"cell {size}px, {len(encoded) / 1024:.1f} KB"
    )


if __name__ == "__main__":
    main()
```

- [ ] **Step 6: Generate the points**

Run: `python3 scripts/sample-logo-points.py`
Expected: `src/components/story/logo-points.ts: 3000 points from 69775 logo pixels, cell 5px, 15.6 KB`

- [ ] **Step 7: Run the tests to make sure they pass**

Run: `npm test`
Expected: `ℹ tests 23`, `ℹ pass 23`, `ℹ fail 0`.

- [ ] **Step 8: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: both exit 0.

- [ ] **Step 9: Commit**

```bash
git add eslint.config.mjs scripts/sample-logo-points.py src/components/story/logo-points.ts src/components/story/particle-shapes.ts src/components/story/particle-shapes.test.ts
git commit -m "feat(story): precomputed logo points and the intro's shapes"
```

---

### Task 2: The story director, version 1

**Files:**
- Create: `src/components/story/story-director.ts`
- Test: `src/components/story/story-director.test.ts`

**Interfaces:**
- Consumes: `clamp01(t: number): number` from `sky-stops.ts` (plan 1).
- Produces:
  - `INTRO: { fly: 1.2; hold: 1.85; end: 2.65 }` (seconds from the intro's first frame).
  - `type IntroPhase = "play" | "reveal" | "done"`.
  - `type StoryInput = { introSeconds: number | null; heroExit: number; reality: number }`.
  - `type StageState = { fly: number; stream: number; leak: number; spin: number }`.
  - `introPhase(seconds: number | null): IntroPhase`.
  - `directStage(input: StoryInput): StageState`.

- [ ] **Step 1: Write the failing tests**

Create `src/components/story/story-director.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { INTRO, directStage, introPhase } from "./story-director.ts";

const top = { heroExit: 0, reality: 0 };

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
  const leak = (reality: number) => directStage({ introSeconds: null, heroExit: 1, reality }).leak;
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
    directStage({ introSeconds: null, heroExit, reality }).spin;
  assert.equal(spin(0, 0), 0);
  assert.ok(spin(1, 0) > spin(0.5, 0));
  assert.ok(spin(1, 1) > spin(1, 0));
});

test("progress outside 0 to 1 is clamped", () => {
  assert.deepEqual(
    directStage({ introSeconds: null, heroExit: 3, reality: 2 }),
    directStage({ introSeconds: null, heroExit: 1, reality: 1 })
  );
  assert.deepEqual(
    directStage({ introSeconds: -1, heroExit: -1, reality: -1 }),
    directStage({ introSeconds: 0, heroExit: 0, reality: 0 })
  );
});
```

- [ ] **Step 2: Run the tests to make sure they fail**

Run: `npm test`
Expected: FAIL with `Cannot find module` for `story-director.ts`. The other 23 tests pass.

- [ ] **Step 3: Write the director**

Create `src/components/story/story-director.ts`:

```ts
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
```

- [ ] **Step 4: Run the tests to make sure they pass**

Run: `npm test`
Expected: `ℹ tests 29`, `ℹ pass 29`, `ℹ fail 0`.

- [ ] **Step 5: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/components/story/story-director.ts src/components/story/story-director.test.ts
git commit -m "feat(story): director v1 for the intro, hero and reality"
```

---

### Task 3: The intro gate

**Files:**
- Create: `src/components/story/intro-gate.ts`
- Test: `src/components/story/intro-gate.test.ts`

**Interfaces:**
- Produces:
  - `INTRO_SEEN_KEY = "zaila_site_visited"` (the sessionStorage key today's intro already uses).
  - `INTRO_START_TIMEOUT_MS = 5000`, `INTRO_MAX_MS = 10000`.
  - `INTRO_GATE_SCRIPT: string`: an inline script. It sets `document.documentElement.dataset.intro` to `"play"` or `"skip"` and arms the backstops. The stage sets `window.__zailaIntroStarted = true` when it starts the intro (Task 5).
- The attribute's life: `"play"` (curtain up) → `"reveal"` (curtain lifting; the stage writes it) → `"done"`. `"skip"`, or no attribute when scripts are off, means no intro.

- [ ] **Step 1: Write the failing tests**

Create `src/components/story/intro-gate.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  INTRO_GATE_SCRIPT,
  INTRO_MAX_MS,
  INTRO_SEEN_KEY,
  INTRO_START_TIMEOUT_MS,
} from "./intro-gate.ts";

type Visit = { path?: string; seen?: boolean; reducedMotion?: boolean; storageBlocked?: boolean };

/** Runs the gate against a stand-in page: the same string the layout inlines. */
function load({ path = "/", seen = false, reducedMotion = false, storageBlocked = false }: Visit = {}) {
  const stored = new Map<string, string>();
  if (seen) stored.set(INTRO_SEEN_KEY, "true");
  const timers: { run: () => void; ms: number }[] = [];
  const html = { dataset: {} as Record<string, string | undefined> };
  const guard = () => {
    if (storageBlocked) throw new Error("SecurityError");
  };
  const window = {
    __zailaIntroStarted: false,
    sessionStorage: {
      getItem: (key: string) => (guard(), stored.get(key) ?? null),
      setItem: (key: string, value: string) => (guard(), void stored.set(key, value)),
    },
    matchMedia: (query: string) => ({ matches: reducedMotion && query.includes("reduce") }),
  };
  const run = new Function("window", "document", "location", "setTimeout", INTRO_GATE_SCRIPT);
  run(window, { documentElement: html }, { pathname: path }, (fn: () => void, ms: number) => {
    timers.push({ run: fn, ms });
  });
  return {
    intro: () => html.dataset.intro,
    stored,
    window,
    after: (ms: number) => timers.filter((timer) => timer.ms === ms).forEach((timer) => timer.run()),
  };
}

test("a session that starts on the homepage plays the intro", () => {
  const page = load();
  assert.equal(page.intro(), "play");
  assert.equal(page.stored.get(INTRO_SEEN_KEY), "true");
});

test("a later load in the same session skips it", () => {
  assert.equal(load({ seen: true }).intro(), "skip");
});

test("a session that starts on another page never plays it", () => {
  const page = load({ path: "/pricing" });
  assert.equal(page.intro(), "skip");
  assert.equal(page.stored.get(INTRO_SEEN_KEY), "true");
});

test("reduced motion skips it", () => {
  assert.equal(load({ reducedMotion: true }).intro(), "skip");
});

test("blocked storage skips it", () => {
  assert.equal(load({ storageBlocked: true }).intro(), "skip");
});

test("the curtain lifts if the stage hasn't started by the timeout", () => {
  const page = load();
  page.after(INTRO_START_TIMEOUT_MS);
  assert.equal(page.intro(), "done");
});

test("a running intro isn't cut short, but never outlives the hard limit", () => {
  const page = load();
  page.window.__zailaIntroStarted = true;
  page.after(INTRO_START_TIMEOUT_MS);
  assert.equal(page.intro(), "play");
  page.after(INTRO_MAX_MS);
  assert.equal(page.intro(), "done");
});
```

- [ ] **Step 2: Run the tests to make sure they fail**

Run: `npm test`
Expected: FAIL with `Cannot find module` for `intro-gate.ts`. The other 29 tests pass.

- [ ] **Step 3: Write the gate**

Create `src/components/story/intro-gate.ts`:

```ts
/**
 * The intro gate (spec §5). A tiny script, inlined in <head>, that runs before
 * first paint and decides whether this visit gets the intro. It writes the
 * answer to <html data-intro>, which the CSS and the particle stage read, so
 * React renders the same markup on the server and the client. That is what
 * ends the hydration mismatch the old loading screen caused on every reload.
 *
 * data-intro: "play" (curtain up) → "reveal" (curtain lifting) → "done".
 * "skip", or no attribute when scripts are off, means no intro.
 *
 * The intro plays once per session, and only when the session starts on the
 * homepage. Blocked storage and reduced motion skip it.
 */

/** sessionStorage key; the old loading screen used the same one. */
export const INTRO_SEEN_KEY = "zaila_site_visited";

/** If the stage hasn't started the intro by then, the curtain lifts anyway. */
export const INTRO_START_TIMEOUT_MS = 5000;

/** Hard backstop: the curtain never outlives this. */
export const INTRO_MAX_MS = 10000;

export const INTRO_GATE_SCRIPT = `(function(){var d=document.documentElement;try{var s=window.sessionStorage;var play=location.pathname==="/"&&!s.getItem("${INTRO_SEEN_KEY}")&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches;s.setItem("${INTRO_SEEN_KEY}","true");d.dataset.intro=play?"play":"skip";if(!play)return;setTimeout(function(){if(d.dataset.intro==="play"&&!window.__zailaIntroStarted)d.dataset.intro="done"},${INTRO_START_TIMEOUT_MS});setTimeout(function(){if(d.dataset.intro!=="done")d.dataset.intro="done"},${INTRO_MAX_MS})}catch(e){d.dataset.intro="skip"}})();`;
```

- [ ] **Step 4: Run the tests to make sure they pass**

Run: `npm test`
Expected: `ℹ tests 36`, `ℹ pass 36`, `ℹ fail 0`.

- [ ] **Step 5: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/components/story/intro-gate.ts src/components/story/intro-gate.test.ts
git commit -m "feat(story): intro gate decides before first paint"
```

---

### Task 4: Stage shell with the ambient scene

A refactor with no visible change: the WebGL shell and the ambient particles separate, so the homepage can run a different scene in Task 5.

**Files:**
- Modify: `scripts/cdp.mjs` (console output, `LOADS`, `REDUCED`)
- Create: `src/components/story/stage-scene.ts`
- Create: `src/components/story/stage-ambient.ts`
- Modify: `src/components/story/particle-stage.tsx` (rewrite as the shell)
- Modify: `src/app/globals.css` (`.particle-stage` class)

**Interfaces:**
- Consumes: plan 1's generators and shaders (`particle-shapes.ts`, `particle-shaders.ts`).
- Produces:
  - `type StageSize = { width: number; height: number; pixelRatio: number }`.
  - `type StageSetup = { scene: THREE.Scene; camera: THREE.PerspectiveCamera; rng: Rng; size: StageSize }`.
  - `type StageFrame = { delta: number; elapsed: number; scrollY: number; mouse: { x: number; y: number }; mouseInfluence: number }`.
  - `type StageScene = { resize(size: StageSize): void; update(frame: StageFrame): void; dispose(): void }`.
  - `createAmbientScene(setup: StageSetup, counts: { particles: number; dust: number }): StageScene`.
  - CSS class `.particle-stage` on the stage's container (Task 6 keys the intro rules off it).

- [ ] **Step 1: Teach `cdp.mjs` to report console errors, reload and emulate reduced motion**

Replace `scripts/cdp.mjs` with:

```js
#!/usr/bin/env node
// Load a URL in headless Chrome over the DevTools protocol, wait, run a JS expression
// and optionally save a screenshot. Headless Chrome produces real animation frames,
// unlike a hidden browser pane, so scroll scenes and WebGL behave as they would live.
// Usage: node scripts/cdp.mjs <url> <waitMs> <expression> [screenshot.png] [width] [height]
// Env:
//   MOBILE=1   emulate a phone (touch, device pixel ratio 2) at the given width and height
//   REDUCED=1  emulate prefers-reduced-motion: reduce
//   LOADS=n    load the URL n times in the same tab, so sessionStorage carries over
// Console errors and warnings, and uncaught exceptions, print as they happen.
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, waitMs = "5000", expression = "document.title", shotPath, width = "1440", height = "900"] =
  process.argv.slice(2);
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333 + Math.floor(Math.random() * 500);
const profile = mkdtempSync(join(tmpdir(), "zaila-cdp-"));

const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  "--remote-allow-origins=*",
  "--no-first-run",
  "--no-default-browser-check",
  "--hide-scrollbars",
  `--user-data-dir=${profile}`,
  `--window-size=${width},${height}`,
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function targets() {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === "page");
      if (page) return page;
    } catch {}
    await sleep(200);
  }
  throw new Error("Chrome debugging endpoint never came up");
}

function finish(code) {
  try { chrome.kill("SIGKILL"); } catch {}
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
  process.exit(code);
}

try {
  const page = await targets();
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let nextId = 1;
  const pending = new Map();
  const listeners = [];
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    } else if (msg.method) {
      for (const l of listeners) l(msg);
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const id = nextId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });

  listeners.push((m) => {
    if (m.method === "Runtime.consoleAPICalled" && (m.params.type === "error" || m.params.type === "warning")) {
      const text = m.params.args.map((a) => a.value ?? a.description ?? "").join(" ");
      console.log(`console.${m.params.type}: ${text}`);
    } else if (m.method === "Runtime.exceptionThrown") {
      const details = m.params.exceptionDetails;
      console.log(`exception: ${details.exception?.description ?? details.text}`);
    }
  });

  await send("Page.enable");
  await send("Runtime.enable");
  if (process.env.MOBILE === "1") {
    // A real phone viewport (desktop Chrome windows can't go below ~500px wide).
    await send("Emulation.setDeviceMetricsOverride", {
      width: Number(width),
      height: Number(height),
      deviceScaleFactor: 2,
      mobile: true,
    });
    await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  }
  if (process.env.REDUCED === "1") {
    await send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    });
  }
  const loads = Math.max(1, Number(process.env.LOADS ?? 1));
  for (let i = 0; i < loads; i++) {
    const loaded = new Promise((resolve) =>
      listeners.push((m) => { if (m.method === "Page.loadEventFired") resolve(); })
    );
    await send("Page.navigate", { url });
    await Promise.race([loaded, sleep(20000)]);
    await sleep(Number(waitMs));
  }

  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.result?.exceptionDetails) {
    console.log("EXCEPTION:", JSON.stringify(result.result.exceptionDetails.exception?.description ?? result.result.exceptionDetails));
  } else {
    console.log(JSON.stringify(result.result?.result?.value, null, 2));
  }

  if (shotPath) {
    const shot = await send("Page.captureScreenshot", { format: "png" });
    writeFileSync(shotPath, Buffer.from(shot.result.data, "base64"));
    console.log("screenshot:", shotPath);
  }
  ws.close();
  finish(0);
} catch (error) {
  console.error(String(error));
  finish(1);
}
```

- [ ] **Step 2: Write the scene contract**

Create `src/components/story/stage-scene.ts`:

```ts
/**
 * The contract between the particle stage (particle-stage.tsx) and its scenes.
 * The stage owns the renderer, the camera and the inputs; a scene owns the
 * particles and decides what they do each frame.
 */
import type * as THREE from "three";
import type { Rng } from "./particle-shapes";

export type StageSize = { width: number; height: number; pixelRatio: number };

export type StageSetup = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  rng: Rng;
  size: StageSize;
};

/** One frame's inputs. Scroll and pointer arrive already eased by the stage. */
export type StageFrame = {
  /** Seconds since the last frame, capped at 0.033. */
  delta: number;
  /** Seconds since the stage started. */
  elapsed: number;
  /** window.scrollY, eased. */
  scrollY: number;
  /** Pointer position, eased: -1 to 1 on each axis, y up. */
  mouse: { x: number; y: number };
  /** 0 → 1 while the pointer moves, easing back to 0 when it rests. */
  mouseInfluence: number;
};

export type StageScene = {
  resize(size: StageSize): void;
  update(frame: StageFrame): void;
  dispose(): void;
};
```

- [ ] **Step 3: Move the ambient particles into their own scene**

Create `src/components/story/stage-ambient.ts`. This is plan 1's ambient code moved as is. The random-number calls stay in the same order, so the field looks identical.

```ts
import * as THREE from "three";
import {
  generateCube,
  generateDust,
  generateHelix,
  generatePlane,
  generateRandoms,
  generateSphere,
  generateTorus,
} from "./particle-shapes";
import { DUST_FRAGMENT, DUST_VERTEX, PARTICLE_FRAGMENT, PARTICLE_VERTEX } from "./particle-shaders";
import type { StageFrame, StageScene, StageSetup, StageSize } from "./stage-scene";

/**
 * Ambient mode: plan 1's like-for-like port of the old sphere background.
 * The sphere morphs through torus, helix, cube and terrain across the page's
 * scroll, turns slowly and moves away from the cursor.
 */
export function createAmbientScene(
  { scene, camera, rng, size }: StageSetup,
  counts: { particles: number; dust: number }
): StageScene {
  const shapes = [
    generateSphere(counts.particles, 2.5, rng),
    generateTorus(counts.particles, 1.8, 0.8, rng),
    generateHelix(counts.particles, 1.5, 4.5, 5, rng),
    generateCube(counts.particles, 3.5, rng),
    generatePlane(counts.particles, 3.0, rng),
  ];

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(shapes[0], 3));
  geometry.setAttribute("aTarget1", new THREE.BufferAttribute(shapes[1], 3));
  geometry.setAttribute("aTarget2", new THREE.BufferAttribute(shapes[2], 3));
  geometry.setAttribute("aTarget3", new THREE.BufferAttribute(shapes[3], 3));
  geometry.setAttribute("aTarget4", new THREE.BufferAttribute(shapes[4], 3));
  geometry.setAttribute(
    "aRandom",
    new THREE.BufferAttribute(generateRandoms(counts.particles, rng), 1)
  );

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uPixelRatio: { value: size.pixelRatio },
      uMouse: { value: new THREE.Vector3(0, 0, 0) },
      uMouseInfluence: { value: 0 },
      uColor1: { value: new THREE.Color("#c084fc") },
      uColor2: { value: new THREE.Color("#e879f9") },
      uColor3: { value: new THREE.Color("#6d28d9") },
    },
    vertexShader: PARTICLE_VERTEX,
    fragmentShader: PARTICLE_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geometry, material);
  // Sit right of centre so it balances the text on the left
  particles.position.set(1.5, 0, 0);
  scene.add(particles);

  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(generateDust(counts.dust, rng), 3)
  );

  const dustMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: material.uniforms.uTime,
      uPixelRatio: material.uniforms.uPixelRatio,
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

  let maxScroll = 1;
  let startX = 1.5;

  function resize(next: StageSize) {
    material.uniforms.uPixelRatio.value = next.pixelRatio;
    maxScroll = Math.max(document.documentElement.scrollHeight - next.height, 1);
    startX = next.width < 768 ? 0 : 1.5;
  }
  resize(size);

  let baseRotationY = 0;
  let baseTimeX = 0;
  let dustTimeY = 0;

  // Reused vectors for mouse unprojection
  const mouseWorldPos = new THREE.Vector3();
  const mouseLocalPos = new THREE.Vector3();
  const inverseMatrix = new THREE.Matrix4();

  function update({ delta, elapsed, scrollY, mouse, mouseInfluence }: StageFrame) {
    baseRotationY += delta * 0.05;
    baseTimeX += delta * 0.02;
    dustTimeY += delta * 0.02;

    if (mouseInfluence > 0.001) {
      // Mouse position in particle space, only while the effect is visible
      const fovRad = (camera.fov * Math.PI) / 180;
      const halfHeight = camera.position.z * Math.tan(fovRad / 2);
      const halfWidth = halfHeight * camera.aspect;
      mouseWorldPos.set(mouse.x * halfWidth, mouse.y * halfHeight, 0);
      particles.updateMatrixWorld();
      inverseMatrix.copy(particles.matrixWorld).invert();
      mouseLocalPos.copy(mouseWorldPos).applyMatrix4(inverseMatrix);
      material.uniforms.uMouse.value.copy(mouseLocalPos);
    }

    material.uniforms.uTime.value = elapsed;
    material.uniforms.uMouseInfluence.value = mouseInfluence;

    const scrollProgress = scrollY / maxScroll;

    // 5 shapes = 4 transitions; 4.5 lets delayed particles reach the last shape
    material.uniforms.uMorph.value = scrollProgress * 4.5;

    // Slide from right of centre to the middle as you scroll
    particles.position.x = startX - scrollProgress * startX;

    const mouseRotationX = mouse.y * 0.15 * mouseInfluence;
    const mouseRotationY = mouse.x * 0.2 * mouseInfluence;

    particles.rotation.y = baseRotationY + scrollProgress * Math.PI * 2.0 + mouseRotationY;
    particles.rotation.x = Math.sin(baseTimeX) * 0.1 + scrollProgress * 1.55 + mouseRotationX;
    particles.rotation.z = scrollProgress * 0.2;

    // Lift the terrain so it sits behind the footer
    particles.position.y = -(scrollProgress * 1.2);
    particles.position.z = -(scrollProgress * 3.5);

    dust.rotation.y = dustTimeY + scrollProgress * Math.PI;
    dust.position.y = -(scrollProgress * 2.0);
  }

  function dispose() {
    scene.remove(particles, dust);
    geometry.dispose();
    material.dispose();
    dustGeometry.dispose();
    dustMaterial.dispose();
  }

  return { resize, update, dispose };
}
```

- [ ] **Step 4: Turn the stage component into the shell**

Replace `src/components/story/particle-stage.tsx` with the following. Every page still runs the ambient scene with plan 1's counts, so nothing changes on screen yet.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import * as THREE from "three";
import { mulberry32 } from "./particle-shapes";
import { createAmbientScene } from "./stage-ambient";
import type { StageScene, StageSetup, StageSize } from "./stage-scene";

/** Fixed seed, so the particle field looks the same on every visit. */
const SEED = 20260927;

/**
 * The single WebGL layer behind the site (spec §8). This shell owns the
 * renderer, the camera and the inputs (scroll, pointer, resize, tab
 * visibility). A scene owns the particles: every page runs the ambient scene
 * for now, and the homepage gets its story scene next.
 */
export function ParticleStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  // Smaller particle budget on subpages for smooth performance
  const isHomepage = pathname === "/";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Track the inner cleanup so it runs even if the timer fires after unmount
    let innerCleanup: (() => void) | null = null;
    let destroyed = false;

    // Defer heavy WebGL set-up so the page can paint first
    const initTimer = setTimeout(() => {
      if (destroyed) return;

      const isMobileViewport = window.innerWidth < 768;
      const createScene = (setup: StageSetup) =>
        createAmbientScene(
          setup,
          isHomepage
            ? { particles: isMobileViewport ? 7000 : 9000, dust: isMobileViewport ? 400 : 650 }
            : { particles: isMobileViewport ? 3000 : 4500, dust: 300 }
        );

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        });
      } catch {
        // No WebGL (blocklisted GPU, some in-app browsers): the sky alone is fine.
        return;
      }

      const measure = (): StageSize => ({
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1 : 1.25),
      });
      const size = measure();

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 1000);
      camera.position.z = 4.5;

      Object.assign(renderer.domElement.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        display: "block",
      });
      renderer.setSize(size.width, size.height, false);
      renderer.setPixelRatio(size.pixelRatio);
      container.appendChild(renderer.domElement);

      const stageScene: StageScene = createScene({ scene, camera, rng: mulberry32(SEED), size });

      // Scroll tracking
      let scrollY = 0;
      let targetScroll = 0;
      function handleScroll() {
        targetScroll = window.scrollY;
      }
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();

      // Mouse tracking (window-level, so it never blocks other interactions)
      const mouse = { x: 0, y: 0 };
      const targetMouse = { x: 0, y: 0 };
      let mouseActive = false;
      let mouseInfluence = 0;
      let mouseTimeout: ReturnType<typeof setTimeout> | undefined;
      const supportsHover = window.matchMedia("(hover: hover)").matches;

      function handleMouseMove(event: MouseEvent) {
        targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        targetMouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
        mouseActive = true;
        if (mouseTimeout) clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
          mouseActive = false;
        }, 2000);
      }

      function handleMouseLeave() {
        mouseActive = false;
      }

      if (supportsHover) {
        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        document.addEventListener("mouseleave", handleMouseLeave);
      }

      function handleResize() {
        const next = measure();
        camera.aspect = next.width / next.height;
        camera.updateProjectionMatrix();
        renderer.setSize(next.width, next.height, false);
        stageScene.resize(next);
      }
      window.addEventListener("resize", handleResize);
      handleResize();

      const clock = new THREE.Clock();
      let animationId = 0;
      let isDocumentVisible = document.visibilityState === "visible";

      function handleVisibilityChange() {
        isDocumentVisible = document.visibilityState === "visible";
      }
      document.addEventListener("visibilitychange", handleVisibilityChange);

      function animate() {
        animationId = requestAnimationFrame(animate);
        if (!isDocumentVisible) return;

        const delta = Math.min(clock.getDelta(), 0.033);
        scrollY += (targetScroll - scrollY) * 0.08;
        mouse.x += (targetMouse.x - mouse.x) * 0.08;
        mouse.y += (targetMouse.y - mouse.y) * 0.08;
        mouseInfluence += ((mouseActive ? 1 : 0) - mouseInfluence) * 0.05;

        stageScene.update({ delta, elapsed: clock.elapsedTime, scrollY, mouse, mouseInfluence });
        renderer.render(scene, camera);
      }

      animate();

      // Fade the stage in once it's drawing
      setVisible(true);

      innerCleanup = () => {
        cancelAnimationFrame(animationId);
        if (mouseTimeout) clearTimeout(mouseTimeout);
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        if (supportsHover) {
          window.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseleave", handleMouseLeave);
        }
        stageScene.dispose();
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }, 100);

    return () => {
      destroyed = true;
      clearTimeout(initTimer);
      innerCleanup?.();
      setVisible(false);
    };
  }, [isHomepage]);

  return (
    <div
      ref={containerRef}
      className="particle-stage"
      aria-hidden="true"
      style={{ opacity: visible ? 1 : 0 }}
    />
  );
}
```

- [ ] **Step 5: Give the stage's container a class**

In `src/app/globals.css`, find the end of the sky block:

```css
.sky::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, #0f0b18 0%, rgb(15 11 24 / 0) 70%);
  opacity: var(--sky-glow);
}
```

and add after it (use the Edit tool):

```css

/* The particle stage's layer (particle-stage.tsx). */
.particle-stage {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  contain: layout paint size;
  /* Soften particles so foreground text stays easy to read */
  filter: blur(1px) brightness(0.92);
  transition: opacity 0.8s ease-out;
}
```

- [ ] **Step 6: Run the checks**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: `ℹ pass 36`, and everything else exits 0.

- [ ] **Step 7: Check nothing changed on screen**

Start `npm run start -- -p 3100` in the background, then run:

```bash
bash scripts/shot.sh "http://localhost:3100/" .lighthouse/shots/plan2-t4-home-1440.png 1440 900
bash scripts/shot.sh "http://localhost:3100/pricing" .lighthouse/shots/plan2-t4-pricing-1440.png 1440 900
node scripts/cdp.mjs "http://localhost:3100/pricing" 4000 "document.querySelectorAll('.particle-stage canvas').length"
```

Expected:
- The last command prints `1`, with no `console.error` or `exception` lines.
- Open each shot next to `plan1-home-1440.png` and `plan1-pricing-1440.png` in `.lighthouse/shots/` with the Read tool. Same particle field and placement. The sphere turns and floats, so single particles move between frames.

Stop the server.

- [ ] **Step 8: Commit**

```bash
git add scripts/cdp.mjs src/components/story/stage-scene.ts src/components/story/stage-ambient.ts src/components/story/particle-stage.tsx src/app/globals.css
git commit -m "refactor(story): stage shell with the ambient particles as a scene"
```

---

### Task 5: The story scene (orb, leak and intro)

The homepage switches from the ambient field to the story: an orb that holds its place, turns with the scroll and leaks when the reality chapter says so, plus the intro whenever `<html data-intro="play">`. The gate isn't wired until Task 6, so after this task the homepage shows the orb with no intro of its own. The old loading screen still plays over it.

**Files:**
- Create: `src/components/story/story-progress.ts`
- Modify: `src/components/story/particle-shaders.ts` (header comment; append `STORY_VERTEX`)
- Create: `src/components/story/stage-story.ts`
- Modify: `src/components/story/particle-stage.tsx` (the homepage loads the story scene)

**Interfaces:**
- Consumes:
  - `INTRO`, `introPhase`, `directStage` and `IntroPhase` from `story-director.ts` (Task 2).
  - `LOGO_POINTS` and the Task 1 generators.
  - The Task 4 types and shell.
- Produces:
  - `storyProgress: { reality: number }`. Written by `reality-section.tsx` (Task 9), read by the stage every frame.
  - `createStoryScene(setup: StageSetup): StageScene`.
  - Writes `html.dataset.intro` through `"play" → "reveal" → "done"` and sets `window.__zailaIntroStarted = true` when it starts the intro.

- [ ] **Step 1: Shared chapter progress**

Create `src/components/story/story-progress.ts`:

```ts
/**
 * Chapter progress that the homepage's scroll scenes publish for the particle
 * stage (spec §9, data flow). A plain object the stage reads every frame, so
 * scrolling never re-renders React. Each chapter writes its own 0 → 1 value.
 */
export const storyProgress = {
  /** The reality chapter's fill (reality-section.tsx). */
  reality: 0,
};
```

- [ ] **Step 2: The story's vertex shader**

In `src/components/story/particle-shaders.ts`, replace the first line:

```ts
/** GLSL for the particle stage, moved verbatim from the old sphere-background.tsx. */
```

with:

```ts
/**
 * GLSL for the particle stage. The ambient shaders moved verbatim from the old
 * sphere-background.tsx; STORY_VERTEX drives the homepage and shares
 * PARTICLE_FRAGMENT with them.
 */
```

Then append to the end of the file:

```ts
/**
 * The homepage story (stage-story.ts). Positions are worked out in world space
 * so the logo faces the camera and the leak heads for the screen's right edge
 * while the orb itself turns. Every term is a function of the uniforms, so
 * scrolling back reverses each scene exactly.
 */
export const STORY_VERTEX = /* glsl */ `
  attribute vec3 aStart;
  attribute vec3 aLogo;
  attribute vec4 aLeak;
  attribute float aRandom;

  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uFly;
  uniform float uStream;
  uniform float uLeak;
  uniform float uExitX;
  uniform float uLogoScale;
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
    world = mix(world, vec3(uExitX + aLeak.w, aLeak.y, aLeak.z), leak);
    world.y += sin(leak * 3.14159) * 0.3 * sign(aLeak.y);

    // Particles near the cursor push away (the orb's, not the logo's)
    vec3 toMouse = world - uMouse;
    float repulsion = smoothstep(1.5, 0.0, length(toMouse.xy)) * uMouseInfluence * stream;
    world += normalize(toMouse + vec3(0.001)) * repulsion * 0.8;
    world.z += repulsion * 0.5;
    vMouseProximity = repulsion;

    vec4 mvPosition = viewMatrix * vec4(world, 1.0);

    // Finer points while they draw the logo, the orb's soft glow once they arrive
    float size = mix(14.0 + aRandom * 14.0, 20.0 + aRandom * 25.0, stream);
    size *= uPixelRatio * (1.0 + vMouseProximity * 0.5);
    gl_PointSize = size * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    float orbAlpha = (0.35 + 0.35 * (1.0 - smoothstep(0.0, 8.0, length(orbLocal)))) * (0.4 + aRandom * 0.3);
    float logoAlpha = 0.75 + aRandom * 0.25;
    vAlpha = mix(logoAlpha, orbAlpha, stream) + vMouseProximity * 0.2;

    // The orb's depth tint; the logo keeps its light lilac and pink
    vPos = mix(vec3(0.0, 0.0, -2.0), orbLocal, stream);
    vColorMix = fract(aRandom + sin(orbLocal.y * 2.0 + uTime) * 0.1);
  }
`;
```

- [ ] **Step 3: The story scene**

Create `src/components/story/stage-story.ts`:

```ts
import * as THREE from "three";
import { LOGO_POINTS } from "./logo-points";
import {
  decodeLogoPoints,
  generateDust,
  generateLeak,
  generateLogo,
  generateRandoms,
  generateScatter,
  generateSphere,
} from "./particle-shapes";
import { DUST_FRAGMENT, DUST_VERTEX, PARTICLE_FRAGMENT, STORY_VERTEX } from "./particle-shaders";
import type { StageFrame, StageScene, StageSetup, StageSize } from "./stage-scene";
import { directStage, introPhase, type IntroPhase } from "./story-director";
import { storyProgress } from "./story-progress";

type IntroWindow = Window & typeof globalThis & { __zailaIntroStarted?: boolean };

/** Share of the orb's particles that leak away in the reality chapter (spec §5). */
const LEAK_FRACTION = 0.45;

/**
 * Story mode, the homepage (spec §8). The intro draws the logo above the
 * curtain and streams it into the orb; the reality chapter then leaks about
 * 45% of the orb off the right edge. The story director turns progress into
 * positions, so scrolling back reverses every scene exactly.
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
  // leak), so the sphere's bounds can't be used to cull them.
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

  // World units covered by the pointer's -1 to 1 at z = 0, and the viewport height
  const reach = { x: 1, y: 1 };
  let viewportHeight = size.height;

  function resize(next: StageSize) {
    const tanHalf = Math.tan((camera.fov * Math.PI) / 360);
    const aspect = next.width / next.height;
    reach.y = camera.position.z * tanHalf;
    reach.x = reach.y * aspect;
    viewportHeight = next.height;
    material.uniforms.uPixelRatio.value = next.pixelRatio;
    // Just past the right edge, even for the deepest exit point (z = -1)
    material.uniforms.uExitX.value = (camera.position.z + 1) * tanHalf * aspect + 0.3;
    // The logo takes 58% of the height, or 72% of the width on narrow screens
    material.uniforms.uLogoScale.value = Math.min(reach.y * 2 * 0.58, reach.x * 2 * 0.72);
    // Right of centre, behind the end of the headline; centred on phones
    particles.position.x = next.width < 1024 ? 0 : 1.5;
  }
  resize(size);

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
    });

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
    uniforms.uMouseInfluence.value = influence;
    if (influence > 0.001) uniforms.uMouse.value.set(mouse.x * reach.x, mouse.y * reach.y, 0);

    particles.rotation.y = baseRotationY + state.spin + mouse.x * 0.2 * influence;
    particles.rotation.x = Math.sin(baseTimeX) * 0.1 + mouse.y * 0.15 * influence;
    dust.rotation.y = dustTimeY;
  }

  function dispose() {
    // Leaving mid-intro (a route change) must never leave the curtain up
    if (introPending || introStart !== null) html.dataset.intro = "done";
    scene.remove(particles, dust);
    geometry.dispose();
    material.dispose();
    dustGeometry.dispose();
    dustMaterial.dispose();
  }

  return { resize, update, dispose };
}
```

- [ ] **Step 4: The homepage loads the story scene**

Replace `src/components/story/particle-stage.tsx` with:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import * as THREE from "three";
import { mulberry32 } from "./particle-shapes";
import { createAmbientScene } from "./stage-ambient";
import type { StageScene, StageSetup, StageSize } from "./stage-scene";

/** Fixed seed, so the particle field looks the same on every visit. */
const SEED = 20260927;

/**
 * The single WebGL layer behind the site (spec §8). This shell owns the
 * renderer, the camera and the inputs (scroll, pointer, resize, tab
 * visibility). A scene owns the particles: the homepage runs the story
 * (stage-story.ts), every other page the ambient field (stage-ambient.ts).
 */
export function ParticleStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const isHomepage = pathname === "/";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const html = document.documentElement;

    // Never leave the intro's curtain up when there's nothing to draw (intro-gate.ts)
    const liftCurtain = () => {
      if (html.dataset.intro === "play" || html.dataset.intro === "reveal") {
        html.dataset.intro = "done";
      }
    };

    // The homepage's story is its own chunk, so other pages never download it
    const story = isHomepage ? import("./stage-story") : null;
    story?.catch(() => undefined);

    // Track the inner cleanup so it runs even if the timer fires after unmount
    let innerCleanup: (() => void) | null = null;
    let destroyed = false;

    // Defer heavy WebGL set-up so the page can paint first
    const initTimer = setTimeout(async () => {
      let createScene: (setup: StageSetup) => StageScene;
      if (story) {
        try {
          createScene = (await story).createStoryScene;
        } catch {
          // The story didn't load: the sky alone is fine
          liftCurtain();
          return;
        }
      } else {
        // Only the homepage has an intro
        liftCurtain();
        const isMobileViewport = window.innerWidth < 768;
        createScene = (setup) =>
          createAmbientScene(setup, { particles: isMobileViewport ? 3000 : 4500, dust: 300 });
      }
      if (destroyed) return;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        });
      } catch {
        // No WebGL (blocklisted GPU, some in-app browsers): the sky alone is fine.
        liftCurtain();
        return;
      }

      const measure = (): StageSize => ({
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1 : 1.25),
      });
      const size = measure();

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 1000);
      camera.position.z = 4.5;

      Object.assign(renderer.domElement.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        display: "block",
      });
      renderer.setSize(size.width, size.height, false);
      renderer.setPixelRatio(size.pixelRatio);
      container.appendChild(renderer.domElement);

      const stageScene: StageScene = createScene({ scene, camera, rng: mulberry32(SEED), size });

      // Scroll tracking
      let scrollY = 0;
      let targetScroll = 0;
      function handleScroll() {
        targetScroll = window.scrollY;
      }
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();

      // Mouse tracking (window-level, so it never blocks other interactions)
      const mouse = { x: 0, y: 0 };
      const targetMouse = { x: 0, y: 0 };
      let mouseActive = false;
      let mouseInfluence = 0;
      let mouseTimeout: ReturnType<typeof setTimeout> | undefined;
      const supportsHover = window.matchMedia("(hover: hover)").matches;

      function handleMouseMove(event: MouseEvent) {
        targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        targetMouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
        mouseActive = true;
        if (mouseTimeout) clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
          mouseActive = false;
        }, 2000);
      }

      function handleMouseLeave() {
        mouseActive = false;
      }

      if (supportsHover) {
        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        document.addEventListener("mouseleave", handleMouseLeave);
      }

      function handleResize() {
        const next = measure();
        camera.aspect = next.width / next.height;
        camera.updateProjectionMatrix();
        renderer.setSize(next.width, next.height, false);
        stageScene.resize(next);
      }
      window.addEventListener("resize", handleResize);
      handleResize();

      const clock = new THREE.Clock();
      let animationId = 0;
      let isDocumentVisible = document.visibilityState === "visible";

      function handleVisibilityChange() {
        isDocumentVisible = document.visibilityState === "visible";
      }
      document.addEventListener("visibilitychange", handleVisibilityChange);

      function animate() {
        animationId = requestAnimationFrame(animate);
        if (!isDocumentVisible) return;

        const delta = Math.min(clock.getDelta(), 0.033);
        scrollY += (targetScroll - scrollY) * 0.08;
        mouse.x += (targetMouse.x - mouse.x) * 0.08;
        mouse.y += (targetMouse.y - mouse.y) * 0.08;
        mouseInfluence += ((mouseActive ? 1 : 0) - mouseInfluence) * 0.05;

        stageScene.update({ delta, elapsed: clock.elapsedTime, scrollY, mouse, mouseInfluence });
        renderer.render(scene, camera);
      }

      animate();

      // Fade the stage in once it's drawing
      setVisible(true);

      innerCleanup = () => {
        cancelAnimationFrame(animationId);
        if (mouseTimeout) clearTimeout(mouseTimeout);
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        if (supportsHover) {
          window.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseleave", handleMouseLeave);
        }
        stageScene.dispose();
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }, 100);

    return () => {
      destroyed = true;
      clearTimeout(initTimer);
      innerCleanup?.();
      setVisible(false);
    };
  }, [isHomepage]);

  return (
    <div
      ref={containerRef}
      className="particle-stage"
      aria-hidden="true"
      style={{ opacity: visible ? 1 : 0 }}
    />
  );
}
```

- [ ] **Step 5: Run the checks**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: `ℹ pass 36`, and everything else exits 0.

- [ ] **Step 6: Check the orb, and that only the homepage downloads the story**

Start `npm run start -- -p 3100` in the background, then run:

```bash
bash scripts/shot.sh "http://localhost:3100/" .lighthouse/shots/plan2-t5-home-1440.png 1440 900
bash scripts/shot.sh "http://localhost:3100/" .lighthouse/shots/plan2-t5-home-390.png 390 844
node scripts/cdp.mjs "http://localhost:3100/" 6000 "document.querySelectorAll('.particle-stage canvas').length"
PREFIX=$(node -e 'const s=require("fs").readFileSync("src/components/story/logo-points.ts","utf8");console.log(s.match(/"([A-Za-z0-9+\/]{24})/)[1])')
for page in "" pricing; do
  node scripts/cdp.mjs "http://localhost:3100/$page" 4000 "(async () => { for (const e of performance.getEntriesByType('resource')) { if (!e.name.endsWith('.js')) continue; if ((await (await fetch(e.name)).text()).includes('$PREFIX')) return 'story chunk loaded'; } return 'no story chunk'; })()"
done
```

Expected:
- The canvas count prints `1`, with no `console.error` or `exception` lines. A shader compile error would print a `THREE.WebGLProgram` error here.
- The last loop prints `"story chunk loaded"` for `/` and `"no story chunk"` for `/pricing`.
- `plan2-t5-home-1440.png`: after the old loading screen, the orb sits right of centre as in `plan1-home-1440.png`.
- `plan2-t5-home-390.png`: the orb centred and visibly lighter than `plan1-home-390.png` (5,000 particles instead of 7,000).

Stop the server.

> **Found while executing (2026-09-28):** under touch emulation the stage never showed, on `/` or `/pricing`, and plan 1's phone frames had the same problem. `custom-cursor.tsx` decided "touch" in a `useState` initializer and returned `null` on the client, while the server rendered its two divs. React then attached the next elements (the sky and the particle stage) to those two divs, so the canvas went into the hidden 6 px cursor dot. The fix moves the touch check into the cursor's effect, so both sides render the same markup. It's committed on its own, before this task: `fix(cursor): same markup on server and client, so phones get the particles`.

- [ ] **Step 7: Commit**

```bash
git add src/components/story/story-progress.ts src/components/story/particle-shaders.ts src/components/story/stage-story.ts src/components/story/particle-stage.tsx
git commit -m "feat(story): homepage story scene with the orb, the leak and the intro"
```

---

### Task 6: The intro, wired up

**Files:**
- Create: `src/components/story/intro-curtain.tsx`
- Modify: `src/app/globals.css` (curtain; the stage above it during the intro)
- Modify: `src/app/layout.tsx` (the gate in `<head>`, `suppressHydrationWarning`, the curtain)
- Modify: `src/app/page.tsx` (drop `LoadingScreen`)
- Move: `src/components/loading-screen.tsx` → `archive/2026-09-night-into-day/src/components/loading-screen.tsx`

**Interfaces:**
- Consumes: `INTRO_GATE_SCRIPT` (Task 3); the story scene's intro phases (Task 5); `.particle-stage` (Task 4).
- Produces: `IntroCurtain` (server component, `<div class="intro-curtain">`). The hero entrance in Task 8 keys off `html[data-intro]` too.

- [ ] **Step 1: Reproduce the hydration error first**

If nothing answers on port 3001 (`curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/` prints `000`), start `npm run dev -- -p 3001` in the background and wait for it to answer. Then run:

```bash
LOADS=2 node scripts/cdp.mjs "http://localhost:3001/" 5000 "document.documentElement.dataset.intro ?? 'none'"
```

Expected: at least one `console.error` or `exception` line about hydration (for example "Hydration failed because the server rendered HTML didn't match the client"), then `"none"`. This is the bug: the second load in a session renders the loading screen on the server but not on the client.

- [ ] **Step 2: The curtain**

Create `src/components/story/intro-curtain.tsx`:

```tsx
/**
 * The intro's night curtain (spec §5). It covers the page while the particle
 * stage draws the logo above it. <html data-intro> shows, lifts and removes it
 * (see intro-gate.ts and globals.css), so it needs no JavaScript of its own.
 */
export function IntroCurtain() {
  return <div aria-hidden="true" className="intro-curtain" />;
}
```

- [ ] **Step 3: Curtain styles, and the stage above it during the intro**

In `src/app/globals.css`, replace:

```css
.sky::after {
  content: "";
```

with:

```css
.sky::after,
.intro-curtain::after {
  content: "";
```

Then, in the `.particle-stage` block from Task 4, replace:

```css
  transition: opacity 0.8s ease-out;
}
```

with:

```css
  transition: opacity 0.8s ease-out, filter 0.6s ease-out;
}

/* Intro curtain (spec §5). The intro gate (intro-gate.ts) sets <html data-intro>
   before first paint: "play" shows the curtain, "reveal" fades it out while the
   hero's entrance plays, "done" and "skip" remove it. It paints exactly like the
   sky, so lifting it reveals only the page. */
.intro-curtain {
  display: none;
}

html[data-intro="play"] .intro-curtain,
html[data-intro="reveal"] .intro-curtain {
  display: block;
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: linear-gradient(180deg, var(--sky-top), var(--sky-bottom));
  transition: opacity 0.6s ease-out;
}

html[data-intro="reveal"] .intro-curtain {
  opacity: 0;
  pointer-events: none;
}

/* During the intro the stage draws above the curtain, sharp, then drops back. */
html[data-intro="play"] .particle-stage,
html[data-intro="reveal"] .particle-stage {
  z-index: 9001;
}

html[data-intro="play"] .particle-stage {
  filter: none;
}
```

- [ ] **Step 4: Wire the gate and the curtain into the layout**

In `src/app/layout.tsx`:

1. After `import { Sky } from "@/components/story/sky";`, add:

```tsx
import { IntroCurtain } from "@/components/story/intro-curtain";
import { INTRO_GATE_SCRIPT } from "@/components/story/intro-gate";
```

2. Replace:

```tsx
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <script
```

with:

```tsx
  // The intro gate sets data-intro on <html> before React hydrates, hence
  // suppressHydrationWarning (it only covers <html>'s own attributes).
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        {/* Decides before first paint whether this visit gets the intro (intro-gate.ts) */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_GATE_SCRIPT }} />
        <script
```

3. Replace:

```tsx
          <FooterNew />
        </SmoothScroll>
```

with:

```tsx
          <FooterNew />
          <IntroCurtain />
        </SmoothScroll>
```

Leave the `metadata` object untouched.

- [ ] **Step 5: Retire the old loading screen**

In `src/app/page.tsx`, delete the line `import { LoadingScreen } from "@/components/loading-screen";` and the line `      <LoadingScreen />`. Then run:

```bash
mkdir -p archive/2026-09-night-into-day/src/components
git mv src/components/loading-screen.tsx archive/2026-09-night-into-day/src/components/loading-screen.tsx
```

- [ ] **Step 6: Confirm the hydration error is gone**

The dev server reloads on its own. Run:

```bash
LOADS=2 node scripts/cdp.mjs "http://localhost:3001/" 5000 "document.documentElement.dataset.intro"
```

Expected: `"skip"`, and no hydration `console.error` or `exception` lines. Stop the dev server if you started it.

- [ ] **Step 7: Run the checks**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: `ℹ pass 36`, and everything else exits 0.

- [ ] **Step 8: Watch the intro**

Start `npm run start -- -p 3100` in the background, then run:

```bash
node scripts/cdp.mjs "http://localhost:3100/" 0 "new Promise((resolve) => { const seen = []; const tick = () => { const v = document.documentElement.dataset.intro; if (!seen.length || seen[seen.length - 1][0] !== v) seen.push([v, Math.round(performance.now())]); if (v === 'done' || performance.now() > 12000) resolve(seen); else requestAnimationFrame(tick); }; tick(); })"
LOADS=2 node scripts/cdp.mjs "http://localhost:3100/" 3000 "document.documentElement.dataset.intro"
node scripts/cdp.mjs "http://localhost:3100/pricing" 3000 "[document.documentElement.dataset.intro, sessionStorage.getItem('zaila_site_visited')]"
REDUCED=1 node scripts/cdp.mjs "http://localhost:3100/" 3000 "document.documentElement.dataset.intro"
for wait in 700 1600 2400 6000; do
  SHOT_WAIT_MS=$wait bash scripts/shot.sh "http://localhost:3100/" ".lighthouse/shots/plan2-intro-$wait.png" 1440 900
done
SHOT_WAIT_MS=1600 bash scripts/shot.sh "http://localhost:3100/" .lighthouse/shots/plan2-intro-1600-390.png 390 844
```

Expected:
- The first command prints `play`, `reveal`, `done` with timestamps. `reveal` comes about 1.85 s after the stage's first frame, `done` about 0.8 s after that, and nothing is left after 12 s.
- The second prints `"skip"` with no error lines, the third `["skip", "true"]`, and the fourth `"skip"`.
- The frames (Read tool):
  - `700`: particles flying in on the night curtain; no page content visible.
  - `1600`: the logo (chip mark and both wordmark lines) drawn in particles at the centre, sharp.
  - `2400`: the curtain lifting, the page showing through, particles streaming to the right.
  - `6000`: the page with the orb right of centre, the curtain gone.
  - `1600-390`: the whole logo fits the phone's width.
- The stage starts after hydration, so if a frame misses its moment, adjust its wait by ±300 ms and retake it.

> **Tuned while executing (2026-09-28):** the first logo frames read dim. The logo points were finer than the old intro's, and they picked up the orb's dark-violet depth tint. `STORY_VERTEX` above now draws the logo with slightly larger points (14 + 14r), alpha 0.75–1.0 and no depth tint.

Stop the server.

- [ ] **Step 9: Commit**

```bash
git add src/components/story/intro-curtain.tsx src/app/globals.css src/app/layout.tsx src/app/page.tsx archive/2026-09-night-into-day/src/components/loading-screen.tsx
git commit -m "feat(story): the intro runs in the one stage; no more hydration error"
```

---

### Task 7: The night nav

**Files:**
- Create: `src/components/ui/chip-mark.tsx`
- Modify: `src/components/navbar-new.tsx` (rewrite)

**Interfaces:**
- Produces: `ChipMark({ className?: string })`, an inline SVG that draws in `currentColor` (the footer reuses it in plan 5).
- The nav's links, anchors, hide-on-scroll and mobile menu behave as today. `/logo.png` is no longer requested on load.

- [ ] **Step 1: The chip mark**

Create `src/components/ui/chip-mark.tsx`:

```tsx
/** The chip from the Zaila logo, drawn inline so the nav needs no image request. */
export function ChipMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="5.5" y="5.5" width="13" height="13" rx="2.6" />
      <path d="M9 2.5v3M12 2.5v3M15 2.5v3M9 18.5v3M12 18.5v3M15 18.5v3M2.5 9h3M2.5 12h3M2.5 15h3M18.5 9h3M18.5 12h3M18.5 15h3" />
      <rect x="9.3" y="9.2" width="2" height="4.4" rx="1" fill="currentColor" stroke="none" />
      <rect x="12.7" y="9.2" width="2" height="4.4" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
```

- [ ] **Step 2: The nav in its night theme**

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

/** The nav in its night theme (spec §5): chip mark and wordmark, quiet links, a light pill. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const lenis = useSmoothScroll();

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

  const navItems: NavItem[] = [
    { type: "section", label: "Services", id: "services" },
    { type: "section", label: "Process", id: "process" },
    { type: "link", label: "How we work", href: "/growth-stories" },
    { type: "link", label: "Blog", href: "/blog" },
    { type: "link", label: "Pricing", href: "/pricing" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "py-3 bg-night/80 backdrop-blur-xl"
          : "py-5"
          }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 lg:px-20">
          {/* Logo */}
          <Link href="/" className="group relative z-10">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 font-display text-[15px] font-extrabold tracking-[-0.02em] text-night-text lg:gap-2.5 lg:text-[17px]"
            >
              <ChipMark className="size-6 text-brand-glow lg:size-7" />
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
            {navItems.map((item, i) => (
              <DesktopNavItem key={item.label} item={item} i={i} handleNav={handleNav} />
            ))}
          </motion.nav>

          {/* CTA Button */}
          <motion.button
            onClick={() => handleNav("contact")}
            className="hidden h-11 items-center rounded-full bg-night-text px-[22px] text-sm font-semibold text-night transition-colors hover:bg-white lg:inline-flex"
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
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.04] lg:hidden"
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-5 h-5">
              <motion.span
                className="absolute left-0 w-5 h-0.5 bg-white rounded-full"
                animate={{
                  top: mobileOpen ? "50%" : "30%",
                  rotate: mobileOpen ? 45 : 0,
                  y: mobileOpen ? "-50%" : 0,
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 top-1/2 w-5 h-0.5 bg-white rounded-full -translate-y-1/2"
                animate={{ opacity: mobileOpen ? 0 : 1, x: mobileOpen ? -10 : 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 w-5 h-0.5 bg-white rounded-full"
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
              {navItems.map((item, i) => (
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

const desktopLinkClass = "text-sm text-night-muted transition-colors hover:text-night-text";

function DesktopNavItem({ item, i, handleNav }: { item: NavItem; i: number; handleNav: (id: string) => void }) {
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
    <motion.button {...entrance} onClick={() => handleNav(item.id)} className={desktopLinkClass}>
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
Expected: `ℹ pass 36`, and everything else exits 0.

- [ ] **Step 4: Look at it**

Start `npm run start -- -p 3100` in the background, then run:

```bash
bash scripts/shot.sh "http://localhost:3100/" .lighthouse/shots/plan2-nav-1440.png 1440 900
bash scripts/shot.sh "http://localhost:3100/pricing" .lighthouse/shots/plan2-nav-pricing-1440.png 1440 900
MOBILE=1 node scripts/cdp.mjs "http://localhost:3100/" 6000 "(async () => { document.querySelector('[aria-label=\"Toggle menu\"]').click(); await new Promise((r) => setTimeout(r, 700)); return true; })()" .lighthouse/shots/plan2-nav-menu-390.png 390 844
node scripts/cdp.mjs "http://localhost:3100/" 6000 "performance.getEntriesByType('resource').some((e) => e.name.includes('logo.png'))"
```

Expected (Read tool for the frames):
- `plan2-nav-1440.png` and `plan2-nav-pricing-1440.png` match the canvas's hero nav: violet chip and "Zaila AI Designs" on the left; Services, Process, How we work, Blog and Pricing in grey; a light "Start Your Project" pill; 80 px side margins at 1440.
- `plan2-nav-menu-390.png`: the menu open, with the chip and wordmark above the links and a light "Start Your Project" pill.
- The last command prints `false` (the logo image isn't loaded any more).

Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/chip-mark.tsx src/components/navbar-new.tsx
git commit -m "feat(nav): night theme with an inline chip mark"
```

---

### Task 8: The hero

**Files:**
- Create: `src/components/ui/hamilton-time.tsx`
- Create: `src/components/ui/scroll-link.tsx`
- Modify: `src/components/hero.tsx` (rewrite as a server component)
- Modify: `src/app/globals.css` (hero entrance; the homepage skips the route fade)
- Modify: `src/app/layout.tsx` (preload Manrope again)

**Interfaces:**
- Consumes: `useSmoothScrollTo()` from `@/hooks/use-scroll-animation` (existing); `html[data-intro]` (Task 6).
- Produces:
  - `ScrollLink({ to: string; className?: string; children: React.ReactNode })`: an anchor to `#to` that glides with Lenis when it runs.
  - `HamiltonTime()`: renders " · 9:47 PM" style text once running, nothing on the server.
  - The hero section carries `class="hero"`; the CSS hooks are `.hero-line`, `.hero-fade` and `.hero-fade-late`.

- [ ] **Step 1: The in-page link**

Create `src/components/ui/scroll-link.tsx`:

```tsx
"use client";

import { useSmoothScrollTo } from "@/hooks/use-scroll-animation";

/**
 * An in-page link that glides with Lenis when it's running. Without
 * JavaScript it's a plain anchor, so it still works.
 */
export function ScrollLink({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: React.ReactNode;
}) {
  const scrollTo = useSmoothScrollTo();
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        scrollTo(to);
      }}
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 2: The live Hamilton time**

Create `src/components/ui/hamilton-time.tsx`:

```tsx
"use client";

import { useSyncExternalStore } from "react";

const clock = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Toronto",
  hour: "numeric",
  minute: "2-digit",
});

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
}

function now() {
  return clock.format(new Date());
}

function onServer() {
  return null;
}

/**
 * Hamilton's local time for the hero's meta row, as " · 9:47 PM". The page
 * is static, so the server renders nothing here and the time appears once
 * the page is running.
 */
export function HamiltonTime() {
  const time = useSyncExternalStore(subscribe, now, onServer);
  return time ? <span className="tabular-nums"> · {time}</span> : null;
}
```

- [ ] **Step 3: The hero**

Replace `src/components/hero.tsx` with:

```tsx
import Link from "next/link";
import { HamiltonTime } from "@/components/ui/hamilton-time";
import { ScrollLink } from "@/components/ui/scroll-link";

/**
 * Screen 1, at night (spec §5). The orb behind the end of the headline is the
 * particle stage. The entrance is CSS only (globals.css, "Hero entrance"): it
 * plays at first paint, or as the intro's curtain lifts.
 */
export function Hero() {
  return (
    <section className="hero relative flex min-h-svh flex-col">
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 items-end px-5 pb-28 pt-24 lg:items-center lg:px-20 lg:pb-24">
        <div className="max-w-[1060px]">
          <h1 className="font-display text-hero font-extrabold text-night-text">
            <span className="hero-line">
              <span>Premium websites for</span>
            </span>{" "}
            <span className="hero-line">
              <span>service businesses that</span>
            </span>{" "}
            <span className="hero-line">
              <span>
                want <span className="text-brand-glow">more leads.</span>
              </span>
            </span>
          </h1>
          <p className="hero-fade mt-5 max-w-[520px] text-[15px] leading-[1.6] text-night-muted lg:mt-9 lg:text-lg">
            Zaila designs and builds fast, modern websites with optional booking, payments, and
            AI support — so your business looks credible and works harder online. Live in days,
            not months.
          </p>
          <div className="hero-fade hero-fade-late mt-[26px] flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7 lg:mt-11">
            <ScrollLink
              to="contact"
              className="inline-flex h-[52px] items-center justify-center rounded-full bg-night-text px-8 text-base font-semibold text-night transition-colors hover:bg-white lg:h-14"
            >
              Start Your Project
            </ScrollLink>
            <Link
              href="/pricing"
              className="text-center text-sm text-night-muted transition-colors hover:text-night-text lg:text-[15px]"
            >
              <span className="sm:hidden">See pricing — from $800 →</span>
              <span className="hidden sm:inline">
                See pricing — builds from $800, care from $69/mo →
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-fade hero-fade-late absolute inset-x-0 bottom-5 lg:bottom-[30px]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] items-center px-5 text-xs text-night-dim lg:grid-cols-[1fr_auto_1fr] lg:px-20 lg:text-[13px] lg:tracking-[0.02em]">
          <span>
            Hamilton, ON
            <HamiltonTime />
          </span>
          <ScrollLink to="story" className="hidden transition-colors hover:text-night-text lg:block">
            (Scroll)
          </ScrollLink>
          <span className="inline-flex items-center gap-2 justify-self-end">
            <span aria-hidden="true" className="size-[7px] rounded-full bg-[#34D399]" />
            <span className="lg:hidden">Available</span>
            <span className="hidden lg:inline">Available for new projects</span>
          </span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: The hero's entrance, and the homepage without the route fade**

In `src/app/globals.css`, replace:

```css
@media (prefers-reduced-motion: reduce) {
  .page-in {
    animation: none;
  }
}
```

with:

```css
@media (prefers-reduced-motion: reduce) {
  .page-in {
    animation: none;
  }
}

/* The homepage skips the route fade: its hero has its own entrance, and the
   fade would hold back the headline that counts as the page's LCP. */
.page-in:has(> .hero) {
  animation: none;
}

/* Hero entrance (spec §7). CSS only, so it starts at first paint. While the
   intro's curtain is up (data-intro="play") the hero waits, fully drawn, so it
   still counts for LCP; the entrance then plays as the curtain lifts. */
@keyframes hero-rise {
  from {
    transform: translateY(125%);
  }
  to {
    transform: none;
  }
}

@keyframes hero-fade-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* Desktop: each headline line rises out of its own mask. The mask reaches a
   little past the tight line box, so ascenders and descenders aren't cut. */
@media (min-width: 1024px) {
  .hero-line {
    display: block;
    clip-path: inset(-0.15em -0.5em -0.2em -0.5em);
  }

  .hero-line > span {
    display: block;
  }
}

@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
  html:not([data-intro="play"]) .hero-line > span {
    animation: hero-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  html:not([data-intro="play"]) .hero-line:nth-child(2) > span {
    animation-delay: 0.08s;
  }

  html:not([data-intro="play"]) .hero-line:nth-child(3) > span {
    animation-delay: 0.16s;
  }
}

/* Phones: the headline wraps freely, so it fades up as one piece. */
@media (max-width: 1023.98px) and (prefers-reduced-motion: no-preference) {
  html:not([data-intro="play"]) .hero h1 {
    animation: hero-fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
}

@media (prefers-reduced-motion: no-preference) {
  html:not([data-intro="play"]) .hero-fade {
    animation: hero-fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
  }

  html:not([data-intro="play"]) .hero-fade-late {
    animation-delay: 0.45s;
  }
}
```

- [ ] **Step 5: Preload Manrope again**

The headline is Manrope now. In `src/app/layout.tsx`, replace:

```tsx
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  // Nothing above the fold uses Manrope yet, so don't spend early bandwidth on it.
  // Plan 2 turns preloading back on when the hero headline switches to Manrope.
  preload: false,
});
```

with:

```tsx
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});
```

- [ ] **Step 6: Run the checks**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: `ℹ pass 36`, and everything else exits 0.

- [ ] **Step 7: Check the hero**

Start `npm run start -- -p 3100` in the background, then run:

```bash
node scripts/cdp.mjs "http://localhost:3100/" 6000 "(() => { const h1 = document.querySelector('h1'); const a = document.querySelector('.hero a[href=\"/pricing\"]').getBoundingClientRect(); return { h1: h1.textContent, font: getComputedStyle(h1).fontFamily, size: getComputedStyle(h1).fontSize, time: document.querySelector('.hero .tabular-nums')?.textContent, pricingBottom: Math.round(a.bottom), viewport: innerHeight }; })()"
MOBILE=1 node scripts/cdp.mjs "http://localhost:3100/" 6000 "(() => { const a = document.querySelector('.hero a[href=\"/pricing\"]'); const r = a.getBoundingClientRect(); return { text: a.innerText, bottom: Math.round(r.bottom), viewport: innerHeight, overflow: document.documentElement.scrollWidth - innerWidth }; })()" "" 390 844
bash scripts/shot.sh "http://localhost:3100/" .lighthouse/shots/plan2-hero-1440.png 1440 900
bash scripts/shot.sh "http://localhost:3100/" .lighthouse/shots/plan2-hero-390.png 390 844
LOADS=2 SHOT_WAIT_MS=150 bash scripts/shot.sh "http://localhost:3100/" .lighthouse/shots/plan2-hero-entrance-1440.png 1440 900
```

Expected:
- The first command prints:
  - `h1`: `"Premium websites for service businesses that want more leads."`
  - `font`: contains `Manrope`, and `size` is `"84px"`
  - `time`: matches ` · 9:47 PM` in shape (a narrow no-break space before "PM" is fine)
  - `pricingBottom` below `viewport`: the pricing link is on screen 1 (G1)
- The second prints `text` `"See pricing — from $800 →"` with `bottom` below `viewport` (G1 on a phone). The `overflow` value is the 16 px found in plan 1, which plan 6 fixes. Only a larger number is new, so report it if you see one.
- `plan2-hero-1440.png` against the canvas frame "Hero · night":
  - three headline lines at the left, "more leads." in violet;
  - the subhead, the white pill and the pricing link;
  - the meta row along the bottom: Hamilton time, (Scroll), and the green-dot availability;
  - the orb behind the end of the headline.
- `plan2-hero-390.png`: the headline, subhead, full-width pill and "See pricing — from $800 →" in the lower part of the screen; "Hamilton, ON · …" and "Available" along the bottom.
- `plan2-hero-entrance-1440.png`: taken just after a repeat load (no intro). The headline lines are part-way through rising, or finished, and never clipped once at rest.

Stop the server.

- [ ] **Step 8: Commit**

```bash
git add src/components/ui/scroll-link.tsx src/components/ui/hamilton-time.tsx src/components/hero.tsx src/app/globals.css src/app/layout.tsx
git commit -m "feat(hero): night hero with a CSS entrance and live Hamilton time"
```

---

### Task 9: 01 The reality

**Files:**
- Create: `src/components/reality-section.tsx`
- Modify: `src/app/page.tsx`
- Move: `src/components/story-section.tsx` → `archive/2026-09-night-into-day/src/components/story-section.tsx`

**Interfaces:**
- Consumes: `storyProgress` (Task 5); `gsap`, `ScrollTrigger` and `MOTION_QUERIES` from `@/lib/motion/gsap` (plan 1), loaded with a dynamic import.
- Produces: `RealitySection()` at `#story` (the anchor the hero's "(Scroll)" link uses). It writes `storyProgress.reality` from 0 to 1 and resets it to 0 on unmount.

- [ ] **Step 1: The chapter**

Create `src/components/reality-section.tsx`:

```tsx
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
```

- [ ] **Step 2: Put it after the hero and archive the old story section**

In `src/app/page.tsx`, replace:

```tsx
import { StorySection } from "@/components/story-section";
```

with:

```tsx
import { RealitySection } from "@/components/reality-section";
```

and replace `      <StorySection />` with `      <RealitySection />`. Then run:

```bash
git mv src/components/story-section.tsx archive/2026-09-night-into-day/src/components/story-section.tsx
```

- [ ] **Step 3: Run the checks**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: `ℹ pass 36`, and everything else exits 0.

- [ ] **Step 4: Scroll through it on desktop**

Start `npm run start -- -p 3100` in the background. The chapter starts one screen down. The fill runs from scrollY ≈ 0.45 × innerHeight to the end of the pin at 1.75 × innerHeight. Capture four points on the way down, then the first point again after coming back up:

```bash
for f in 0.9 1.2 1.5 1.75; do
  node scripts/cdp.mjs "http://localhost:3100/" 6000 "(async () => { const go = (y) => window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y); go(innerHeight * $f); await new Promise((r) => setTimeout(r, 2500)); const words = [...document.querySelectorAll('.reality-word')]; return { at: $f, sectionTop: Math.round(document.getElementById('story').getBoundingClientRect().top), filled: words.filter((w) => getComputedStyle(w).color === 'rgb(244, 244, 245)').length, of: words.length, punch: getComputedStyle(document.querySelector('.reality-punch')).opacity }; })()" ".lighthouse/shots/plan2-reality-$f-1440.png" 1440 900
done
node scripts/cdp.mjs "http://localhost:3100/" 6000 "(async () => { const go = (y) => window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y); go(innerHeight * 1.75); await new Promise((r) => setTimeout(r, 2500)); go(innerHeight * 0.9); await new Promise((r) => setTimeout(r, 2500)); const words = [...document.querySelectorAll('.reality-word')]; return { filled: words.filter((w) => getComputedStyle(w).color === 'rgb(244, 244, 245)').length }; })()" .lighthouse/shots/plan2-reality-back-1440.png 1440 900
node scripts/cdp.mjs "http://localhost:3100/" 6000 "(() => { const services = document.getElementById('services'); return [...document.querySelectorAll('main *')].filter((el) => getComputedStyle(el).position === 'sticky' && (el.compareDocumentPosition(services) & Node.DOCUMENT_POSITION_FOLLOWING)).length; })()"
```

Expected:
The timeline's progress is (scrollY − 0.45 × innerHeight) / (1.3 × innerHeight). Words fill from 0 to 0.66, "You never hear about it." rises from 0.70 to 0.82, "That's the leak we fix." from 0.84 to 0.96, and the leak runs from 0.10 to 0.90.

- `0.9` (progress ≈ 0.35): `sectionTop` ≈ 90 (not pinned yet), `filled` between 6 and 13 of 21, `punch` `"0"`. The frame shows the label, the sentence part-filled, and the progress line about a third drawn.
- `1.2` (≈ 0.58): `sectionTop` below 0 (pinned), `filled` between 15 and 20, `punch` `"0"`. Particles are peeling off the orb toward the right edge.
- `1.5` (≈ 0.81): pinned, `filled` 21, `punch` above `0.8` ("You never hear about it." in violet).
- `1.75` (1.0): the end of the pin, with "That's the leak we fix." visible. About 45% of the orb has streamed off the right edge.
- The back run prints the same `filled` count as `0.9` (±2). `plan2-reality-back-1440.png` matches `plan2-reality-0.9-1440.png`: the particles are back in the orb.
- The last command prints `1`: the reality's pin is the only sticky element before services (G3).
- Compare `plan2-reality-1.2-1440.png` with the canvas frame "01 The reality".

- [ ] **Step 5: Phones and reduced motion**

```bash
MOBILE=1 node scripts/cdp.mjs "http://localhost:3100/" 6000 "(async () => { const story = document.getElementById('story'); scrollTo(0, story.offsetTop - innerHeight * 0.1); await new Promise((r) => setTimeout(r, 2500)); const words = [...document.querySelectorAll('.reality-word')]; return { height: Math.round(story.getBoundingClientRect().height), viewport: innerHeight, filled: words.filter((w) => getComputedStyle(w).color === 'rgb(244, 244, 245)').length }; })()" .lighthouse/shots/plan2-reality-390.png 390 844
REDUCED=1 node scripts/cdp.mjs "http://localhost:3100/" 3000 "(() => { const story = document.getElementById('story'); const words = [...document.querySelectorAll('.reality-word')]; return { intro: document.documentElement.dataset.intro, height: Math.round(story.getBoundingClientRect().height), viewport: innerHeight, filled: words.filter((w) => getComputedStyle(w).color === 'rgb(244, 244, 245)').length, punch: getComputedStyle(document.querySelector('.reality-punch')).opacity, coda: getComputedStyle(document.querySelector('.reality-coda')).opacity, sticky: getComputedStyle(story.firstElementChild).position }; })()"
```

Expected:
- Phone: `height` well under 1.75 × `viewport` (no pin), with some words filled. The frame shows the label, the sentence at 30 px and "You never hear about it." below it.
- Reduced motion: `intro` `"skip"`, `height` under 1.75 × `viewport`, `filled` 21, `punch` and `coda` `"1"`, `sticky` `"static"`.

Stop the server.

- [ ] **Step 6: Commit**

```bash
git add src/components/reality-section.tsx src/app/page.tsx archive/2026-09-night-into-day/src/components/story-section.tsx
git commit -m "feat(story): 01 The reality, a pinned word fill with a reversible leak"
```

---

### Task 10: Verify, measure and hand off

**Files:**
- Modify: `docs/superpowers/plans/2026-09-27-night-into-day-log.md`
- Modify: `/Users/sheldonsteele/ZailaAIDesignsBusiness/HANDOFF.md` (the IN FLIGHT line, plus a LOG entry)

**Interfaces:**
- Consumes: everything above; `scripts/lh-summary.mjs` and `scripts/shot.sh` (plan 1).

- [ ] **Step 1: Run the full check suite**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: `ℹ pass 36`, and everything else exits 0.

- [ ] **Step 2: The speed gate (applied throttling)**

Start `npm run start -- -p 3100` in the background, then run:

```bash
for i in 1 2 3; do
  npx --yes lighthouse@12 http://localhost:3100/ --quiet \
    --chrome-flags="--headless=new" \
    --throttling-method=devtools --only-categories=performance \
    --output=json --output-path=".lighthouse/applied-plan2-$i.json"
done
node scripts/lh-summary.mjs .lighthouse/applied-plan2-1.json .lighthouse/applied-plan2-2.json .lighthouse/applied-plan2-3.json
node -e 'for (const i of [1, 2, 3]) { const r = require(`./.lighthouse/applied-plan2-${i}.json`); const item = r.audits["largest-contentful-paint-element"].details.items[0].items[0]; console.log(i, (r.audits["largest-contentful-paint"].numericValue / 1000).toFixed(2), item.node.snippet); }'
```

Expected: 11 rows, then one line per run with its LCP and the LCP element. Required:

| Metric | Required |
|---|---|
| Performance | ≥ 84 |
| LCP | ≤ 1.92 s |
| CLS | ≤ 0.1 |

The LCP element should be hero text (a headline line or the subhead). If a required metric misses, stop and report the numbers and the LCP elements instead of continuing.

- [ ] **Step 3: Simulated runs, recorded alongside**

```bash
for i in 1 2 3 4 5; do
  npx --yes lighthouse@12 http://localhost:3100/ --quiet \
    --chrome-flags="--headless=new" \
    --only-categories=performance,accessibility,best-practices,seo \
    --output=json --output-path=".lighthouse/sim-plan2-$i.json"
done
node scripts/lh-summary.mjs .lighthouse/sim-plan2-1.json .lighthouse/sim-plan2-2.json .lighthouse/sim-plan2-3.json .lighthouse/sim-plan2-4.json .lighthouse/sim-plan2-5.json
```

Expected: Accessibility 100, SEO 100, Best practices ≥ 96. The simulated Performance and LCP are recorded, not gated. If Accessibility is below 100, find the failing audit with `node -e 'const r = require("./.lighthouse/sim-plan2-1.json"); for (const [id, a] of Object.entries(r.audits)) if (a.score === 0 && r.categories.accessibility.auditRefs.some((x) => x.id === id)) console.log(id, a.title)'`, fix it, and re-run this step.

- [ ] **Step 4: Final frames**

```bash
bash scripts/shot.sh "http://localhost:3100/" .lighthouse/shots/plan2-home-1440.png 1440 900
bash scripts/shot.sh "http://localhost:3100/" .lighthouse/shots/plan2-home-390.png 390 844
bash scripts/shot.sh "http://localhost:3100/pricing" .lighthouse/shots/plan2-pricing-1440.png 1440 900
node scripts/cdp.mjs "http://localhost:3100/" 8000 "document.documentElement.dataset.intro"
```

Expected:
- The last command prints `"done"` with no error lines.
- Open the three frames (Read tool):
  - `plan2-home-1440.png` and `plan2-home-390.png`: the hero as in Task 8.
  - `plan2-pricing-1440.png`: the pricing page as in `plan1-pricing-1440.png`, apart from the new nav.

Stop the server.

- [ ] **Step 5: Record the results in the log**

Append to `docs/superpowers/plans/2026-09-27-night-into-day-log.md`. Replace the capitalised markers with:
- `SHORT_SHA`: the output of `git rev-parse --short HEAD`;
- the rows from Steps 2 and 3;
- `SNIPPET`: run 1's LCP element from Step 2;
- `VERDICT`: "passes" or "misses".

```markdown

## After plan 2 (night)

Commit SHORT_SHA. Same methods as above.

**Applied throttling (3 runs), the gate:**

| Metric | Value |
|---|---|
| ROWS FROM STEP 2 | |

**Simulated (5 runs), recorded alongside:**

| Metric | Value |
|---|---|
| ROWS FROM STEP 3 | |

- **LCP element:** `SNIPPET` (applied run 1). Plan 1's was the navbar logo image. The night nav draws the chip inline instead, so the hero text is now the largest element.
- **What changed:**
  - The intro runs in the one particle stage: one WebGL context, and no `logo.png` fetch or canvas sampling.
  - The hero's entrance is CSS, and the homepage skips the route fade.
  - Manrope is preloaded again.
  - The reality chapter's GSAP loads after first paint.
  - Phones draw 5,000 particles.
- **Verdict:** VERDICT the gate (Performance ≥ 84, LCP ≤ 1.92 s, CLS ≤ 0.1).
- **Hydration:** a second load in the same session no longer throws a React hydration error (`LOADS=2` check in Task 6).
```

- [ ] **Step 6: Commit the log**

```bash
git add docs/superpowers/plans/2026-09-27-night-into-day-log.md
git commit -m "docs: plan 2 measurements"
```

- [ ] **Step 7: Update the handoff file and snapshot it**

In `/Users/sheldonsteele/ZailaAIDesignsBusiness/HANDOFF.md`, in the IN FLIGHT line for `zaila-ai-designs`, replace:

```
plan 1 (foundation) done at `6e346fb`, plan 2 (night: intro, hero, the reality) next
```

with this, where SHORT_SHA is the output of `git rev-parse --short HEAD`:

```
plans 1 and 2 done (plan 2, the night, at `SHORT_SHA`), plan 3 (sunrise and the fix) next
```

Then append this entry at the end of the LOG. Fill in the timestamp from `date "+%Y-%m-%d %H:%M"` and the numbers from the log file.

```markdown

## [TIMESTAMP] Claude | zailaai.com night-into-day: plan 2 (the night) done

- Branch `feat/night-into-day-2026-09` in `Zaila AI Designs/zaila-ai-designs`, not pushed.
- **Plan 2 of 6, the night:**
  - **The intro:** the particle stage draws the real logo (3,000 precomputed points, chip and wordmark) above a night curtain, then streams it into the hero orb. It decides before first paint, so reloads no longer throw a React hydration error. It plays once per session, when the session starts on the homepage.
  - **The hero and nav:** a Manrope headline with a CSS entrance and live Hamilton time. The night nav shows the chip mark with "Zaila AI Designs", and its CTA now reads "Start Your Project", like the rest of the site.
  - **01 The reality:** pinned for 0.75 screen on desktop. The sentence fills word by word while about 45% of the orb leaks off the right edge, and all of it reverses on the way back up.
  - **Phones:** 5,000 particles instead of 7,000.
- **Moved aside, not deleted:** `src/components/loading-screen.tsx` and `src/components/story-section.tsx`, to `archive/2026-09-night-into-day/src/components/`.
- **Lighthouse mobile, applied throttling (median of 3, localhost):** baseline Performance 87, LCP 1.72 s → plan 2 Performance NEW_PERF, LCP NEW_LCP s. Full table in `docs/superpowers/plans/2026-09-27-night-into-day-log.md`.
- **→ Waldo:** nothing to do yet.
  - **New draft copy:** the chapter label "01 / The reality".
  - **Dropped from the homepage, pending your OK:** "Why we exist", "Most business websites quietly underperform. Here's why.", the fact chips, and "Every day without a great site costs you customers".
  - **Still open:** the On The Snap wording, the 20- vs 30-minute call, and the copy approvals. They block the merge, not the next plan.
```

Then run:

```bash
bash /Users/sheldonsteele/ZailaAIDesignsBusiness/_AI/snapshot.sh "zailaai.com night-into-day plan 2 done" "Claude" HANDOFF.md
```

Expected: the script prints `about to commit: HANDOFF.md` and a commit line.
