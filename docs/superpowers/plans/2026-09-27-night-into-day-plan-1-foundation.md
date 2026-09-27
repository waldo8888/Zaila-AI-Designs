# Night into day, plan 1 of 6: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lay the foundation for the night-into-day homepage while the site keeps looking and behaving like today: brand fonts and tokens, the GSAP + Lenis engine, a CSS sky backdrop, and one seeded particle stage.

**Architecture:**
- **Pure, seeded modules** (particle shapes, sky colours) are unit-tested with Node's built-in test runner.
- **One `ParticleStage` component** replaces `sphere-background.tsx` like-for-like, in "ambient" mode. It draws over a CSS `Sky` backdrop that later plans scrub with CSS variables.
- **Lenis moves onto GSAP's ticker** and feeds ScrollTrigger, ready for the scroll scenes in plans 2–6.
- **The route fade in `template.tsx` becomes CSS-only**, so content no longer waits for JavaScript.

**Tech Stack:**
- Next.js 16.1.6 (App Router), React 19.2, TypeScript 5
- Tailwind CSS v4, three 0.183, Lenis 1.3.17
- GSAP 3.15 with `@gsap/react` 2.1
- Node's built-in test runner (`node --test` with type stripping)
- Lighthouse 12 via `npx`, not added to the project

**Spec:** `docs/superpowers/specs/2026-09-27-night-into-day-homepage-design.md`. Read §6–§9, §11, §13 and §14 before starting. This plan is the spec's build phase 1.

## Global Constraints

**Git and rollout**
- Work only on branch `feat/night-into-day-2026-09`. Never commit to `main`. Never push: Waldo pushes, and merging to `main` deploys production.
- Commit messages have **no** `Co-Authored-By` lines (Waldo's standing preference).
- Stage paths explicitly (`git add <paths>`). Never `git add -A` or `git add .`, because the untracked `AGENTS.md` at the repo root isn't part of this work.
- Never delete a file. A replaced file moves with `git mv` to `archive/2026-09-night-into-day/<its original path>`, and each move is logged in `/Users/sheldonsteele/ZailaAIDesignsBusiness/HANDOFF.md`.

**Secrets and tooling**
- Never read or modify `.env*`, `.env.sentry-build-plugin` or anything under `credentials/`.
- `npm run build` runs the project's Sentry plugin as usual and may upload source maps, as every Vercel build does. That's expected.
- Styling stays Tailwind v4 plus `src/app/globals.css`. The only new dependencies are `gsap@^3.15.0` and `@gsap/react@^2.1.2`.

**Design rules**
- Brand tokens (spec §6):

  | Role | Values |
  |---|---|
  | Night | `#07060B`, raise `#0E0C15` |
  | Night text | `#F4F4F5`, `#A1A1AA`, `#8A8A93` |
  | Day | `#F1F3F7`, `#FFFFFF` |
  | Day text | `#0F172A`, `#475569`, `#56637A` |
  | Day line | `#E2E8F0` |
  | Violet / glow / ink | `#7C3AED` / `#A855F7` / `#6D28D9` |
  | Lavender / quiet | `#EDE9FE` / `#7B8698` |

- Fonts: Manrope (display) and Inter (body). Card radius: 20px.
- Standing preferences: no page transitions (no sweeping overlays), and no text labels in the custom cursor.
- This plan changes no user-facing copy.

**Code style**
- Match the codebase: 2-space indent, double quotes, semicolons, `"use client"` at the top of client components, and `@/` imports in app code.
- Pure modules in `src/components/story/*.ts` import nothing from the app. Their tests import them with a `.ts` extension, and any type-only import in a tested module must use `import type`, because Node's type stripping needs it.
- Checks: `npm run lint`, `npx tsc --noEmit`, `npm test` (added in Task 2) and `npm run build`.

---

## File structure

| Path | Status | Responsibility |
|---|---|---|
| `scripts/lh-summary.mjs` | create | Median Lighthouse metrics across runs, printed as markdown rows |
| `scripts/shot.sh` | create | One headless-Chrome screenshot of a URL at a given size |
| `docs/superpowers/plans/2026-09-27-night-into-day-log.md` | create | Measurement log shared by all six plans |
| `.gitignore` | modify | Ignore `/.lighthouse/` (reports and reference frames) |
| `package.json`, `package-lock.json` | modify | `test` script; `gsap` and `@gsap/react` |
| `tsconfig.json` | modify | `allowImportingTsExtensions`; exclude `archive` |
| `eslint.config.mjs` | modify | Ignore `archive/**` |
| `src/components/story/particle-shapes.ts` (+ `.test.ts`) | create | Seeded PRNG and particle target generators |
| `src/components/story/sky-stops.ts` (+ `.test.ts`) | create | Sky colours: sunrise and dusk stops, hex mixing |
| `src/app/globals.css` | modify | Fonts, brand tokens, sky backdrop, CSS route fade |
| `src/app/layout.tsx` | modify | Manrope and Inter; mount `Sky` and `ParticleStage` |
| `src/lib/motion/gsap.ts` | create | GSAP plugin registration and shared motion queries |
| `src/components/smooth-scroll.tsx` | modify | Lenis on GSAP's ticker, feeding ScrollTrigger |
| `src/components/story/particle-shaders.ts` | create | GLSL strings (moved verbatim from `sphere-background.tsx`) |
| `src/components/story/particle-stage.tsx` | create | The one WebGL layer (ambient mode, like-for-like) |
| `src/components/story/sky.tsx` | create | Fixed backdrop painted from `--sky-*` variables |
| `archive/2026-09-night-into-day/README.md` | create | What the archive folder is |
| `src/components/sphere-background.tsx` | move to archive | Replaced by `ParticleStage` |
| `src/app/template.tsx` | modify | CSS-only route fade with no delay |

## What comes after this plan

Each later plan gets written once the previous one lands:

| Plan | Scope |
|---|---|
| 2, Night | Refined intro (precomputed logo points, `intro-curtain.tsx`, logo → orb handoff, `loading-screen.tsx` archived); new hero with a CSS entrance, night nav theme and live Hamilton time; 01 The reality (sticky pin, SplitText word fill, reversible leak); story director v1 and its tests; phone particle budget down to about 5,000 (plan 1 keeps today's 7,000 for parity) |
| 3, Sunrise and the fix | Sky scrub; horizon and landing; `fix-section.tsx` with the four-step site build and expanding rows; day nav theme; stage sleep |
| 4, Selected work | Captures, `src/lib/work.ts` with `enabled`/`linkEnabled`, frame opening, scroll-linked captures, "Work" in nav and footer |
| 5, The rest of the day | Process, how we work, marquee, dusk contact with the logo bookend, footer; remaining old sections archived |
| 6, Finish | Phones, reduced motion, speed pass, cross-browser checks, verification against G1–G9, hand-off for a Vercel preview |

---

### Task 1: Measure today's site (the baseline)

**Files:**
- Create: `scripts/lh-summary.mjs`
- Create: `scripts/shot.sh`
- Create: `docs/superpowers/plans/2026-09-27-night-into-day-log.md`
- Modify: `.gitignore`

**Interfaces:**
- Produces:
  - `node scripts/lh-summary.mjs <report.json>...` prints markdown table rows (`| Metric | value |`), each the median across the given Lighthouse JSON reports.
  - `bash scripts/shot.sh <url> <out.png> [width=1440] [height=900]` writes a PNG and prints its path, or exits 1.
  - Every later plan uses both, the same way.

- [ ] **Step 1: Ignore Lighthouse output**

Append to `.gitignore`:

```gitignore

# lighthouse reports and reference frames (night-into-day plans)
/.lighthouse/
```

- [ ] **Step 2: Create `scripts/lh-summary.mjs`**

```js
#!/usr/bin/env node
// Median Lighthouse metrics across runs, printed as markdown table rows.
// Usage: node scripts/lh-summary.mjs report-1.json report-2.json ...
import { readFileSync } from "node:fs";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("usage: node scripts/lh-summary.mjs <report.json>...");
  process.exit(2);
}

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const runs = files.map((file) => JSON.parse(readFileSync(file, "utf8")));
const pick = (fn) => median(runs.map(fn));
const metric = (run, id) => run.audits[id]?.numericValue ?? Number.NaN;
const score = (run, id) => Math.round((run.categories[id]?.score ?? Number.NaN) * 100);
const scriptKB = (run) => {
  const items = run.audits["resource-summary"]?.details?.items ?? [];
  const scripts = items.find((item) => item.resourceType === "script");
  return scripts ? scripts.transferSize / 1024 : Number.NaN;
};

const rows = [
  ["Lighthouse version", runs[0].lighthouseVersion],
  ["Runs", String(runs.length)],
  ["Performance", String(pick((r) => score(r, "performance")))],
  ["LCP (s)", (pick((r) => metric(r, "largest-contentful-paint")) / 1000).toFixed(2)],
  ["FCP (s)", (pick((r) => metric(r, "first-contentful-paint")) / 1000).toFixed(2)],
  ["TBT (ms)", pick((r) => metric(r, "total-blocking-time")).toFixed(0)],
  ["CLS", pick((r) => metric(r, "cumulative-layout-shift")).toFixed(3)],
  ["Accessibility", String(pick((r) => score(r, "accessibility")))],
  ["Best practices", String(pick((r) => score(r, "best-practices")))],
  ["SEO", String(pick((r) => score(r, "seo")))],
  ["Script transfer (KB)", pick(scriptKB).toFixed(0)],
];

for (const [name, value] of rows) console.log(`| ${name} | ${value} |`);
```

- [ ] **Step 3: Create `scripts/shot.sh` and make it executable**

```bash
#!/usr/bin/env bash
# One headless-Chrome screenshot of a URL.
# Usage: bash scripts/shot.sh <url> <out.png> [width] [height]
#
# Chrome captures after SHOT_WAIT_MS of real time (default 8000), long enough
# for the first-visit intro to finish. (--virtual-time-budget never completes
# on this site: a request that stays open stalls the virtual clock.)
# On macOS, headless Chrome writes the screenshot but doesn't always exit,
# so this waits for the file, then stops only the Chrome it started
# (it uses a throwaway profile, never your own).
set -euo pipefail

URL="$1"
OUT="$2"
W="${3:-1440}"
H="${4:-900}"
WAIT_MS="${SHOT_WAIT_MS:-8000}"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PROFILE="$(mktemp -d -t zaila-shot)"

mkdir -p "$(dirname "$OUT")"
rm -f "$OUT"

"$CHROME" --headless=new --hide-scrollbars --no-first-run --no-default-browser-check \
  --user-data-dir="$PROFILE" --window-size="$W,$H" --timeout="$WAIT_MS" \
  --screenshot="$OUT" "$URL" >/dev/null 2>&1 &
PID=$!

for _ in $(seq 1 60); do
  sleep 0.5
  [ -s "$OUT" ] && break
done
sleep 0.5

kill "$PID" 2>/dev/null || true
pkill -f "$PROFILE" 2>/dev/null || true
rm -rf "$PROFILE"

if [ -s "$OUT" ]; then
  echo "$OUT"
else
  echo "capture failed: $URL" >&2
  exit 1
fi
```

Run: `chmod +x scripts/shot.sh`

- [ ] **Step 4: Build today's site and start it on port 3100**

Run: `npm run build`
Expected: the build completes with `✓ Compiled successfully` and a route list that includes `/`.

Then start the production server in the background, and keep it running through Step 7:

Run (background): `npm run start -- -p 3100`
Expected: the log shows `Ready` and `http://localhost:3100`.

- [ ] **Step 5: Run Lighthouse three times on the homepage**

```bash
mkdir -p .lighthouse
for i in 1 2 3; do
  npx --yes lighthouse@12 http://localhost:3100/ --quiet \
    --chrome-flags="--headless=new" \
    --only-categories=performance,accessibility,best-practices,seo \
    --output=json --output-path=".lighthouse/baseline-$i.json"
done
```

Expected: `.lighthouse/baseline-1.json`, `-2.json` and `-3.json` all exist. Lighthouse's default is mobile emulation with simulated throttling, and each run uses a fresh browser profile, so the first-visit intro plays every time. That matches a real first visit.

- [ ] **Step 6: Summarise the baseline**

Run: `node scripts/lh-summary.mjs .lighthouse/baseline-*.json`
Expected: 11 lines, each shaped like `| Performance | 71 |`. Keep this output for Step 8.

- [ ] **Step 7: Capture reference frames**

```bash
bash scripts/shot.sh "http://localhost:3100/" .lighthouse/shots/baseline-home-1440.png 1440 900
bash scripts/shot.sh "http://localhost:3100/" .lighthouse/shots/baseline-home-390.png 390 844
bash scripts/shot.sh "http://localhost:3100/#process" .lighthouse/shots/baseline-process-1440.png 1440 900
bash scripts/shot.sh "http://localhost:3100/pricing" .lighthouse/shots/baseline-pricing-1440.png 1440 900
```

Expected: four paths are printed. Open each PNG with the Read tool and confirm it shows the page, not a blank frame or the intro's particle logo. If a frame shows the intro, rerun that line; the virtual time budget normally lets it finish. Particles may not render in headless Chrome, which is fine: these frames are for layout and type, and the particle check uses the browser pane in Task 6.

Then stop the background server.

- [ ] **Step 8: Start the measurement log**

Create `docs/superpowers/plans/2026-09-27-night-into-day-log.md`. Replace the placeholder table row with the rows printed in Step 6, and use the output of `date "+%Y-%m-%d %H:%M"` for the timestamp.

```markdown
# Night into day: measurement log

Every number here comes from the same method, so before/after comparisons are fair.

**Method:**
1. `npm run build`, then `npm run start -- -p 3100`.
2. `npx --yes lighthouse@12 http://localhost:3100/` three times (default mobile emulation, simulated throttling, fresh profile per run, so the first-visit intro plays).
3. Medians from `node scripts/lh-summary.mjs`.

Reference frames live in `.lighthouse/shots/` (not committed).

## Baseline: today's site

Branch `feat/night-into-day-2026-09` at `5248542`. The code is identical to `main` at `fd390eb`; the only extra is the spec.
Measured: TIMESTAMP on Waldo's Mac.

| Metric | Value |
|---|---|
| ROWS FROM STEP 6 | |
```

The two capitalised markers are the only things to replace. After that, the file contains measured values only.

- [ ] **Step 9: Commit**

```bash
git add .gitignore scripts/lh-summary.mjs scripts/shot.sh docs/superpowers/plans/2026-09-27-night-into-day-log.md
git commit -m "chore(measure): baseline tooling and today's Lighthouse numbers"
```

---

### Task 2: Test runner and seeded particle shapes

**Files:**
- Modify: `package.json` (the `scripts` block)
- Modify: `tsconfig.json`
- Create: `src/components/story/particle-shapes.ts`
- Test: `src/components/story/particle-shapes.test.ts`

**Interfaces:**
- Produces (used by Task 6 and plans 2–3):
  - `type Rng = () => number`
  - `mulberry32(seed: number): Rng`
  - `generateSphere(count: number, radius: number, rng: Rng): Float32Array`
  - `generateTorus(count: number, R: number, r: number, rng: Rng): Float32Array`
  - `generateHelix(count: number, radius: number, height: number, turns: number, rng: Rng): Float32Array`
  - `generateCube(count: number, size: number, rng: Rng): Float32Array`
  - `generatePlane(count: number, size: number, rng: Rng): Float32Array`
  - `generateDust(count: number, rng: Rng): Float32Array`
  - `generateRandoms(count: number, rng: Rng): Float32Array`
  - Position arrays are `count * 3` floats (xyz triples); `generateRandoms` returns `count` values in `[0, 1)`.
  - `npm test` runs every `src/**/*.test.ts`.

- [ ] **Step 1: Add the `test` script**

In `package.json`, change the `scripts` block to:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "node --experimental-strip-types --disable-warning=ExperimentalWarning --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test \"src/**/*.test.ts\""
  },
```

- [ ] **Step 2: Let TypeScript accept `.ts` extensions in test imports**

In `tsconfig.json`, add this line inside `compilerOptions`, directly after `"noEmit": true,`:

```json
    "allowImportingTsExtensions": true,
```

- [ ] **Step 3: Write the failing test**

Create `src/components/story/particle-shapes.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
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

const N = 400;

function eachPoint(points: Float32Array, check: (x: number, y: number, z: number) => void) {
  for (let i = 0; i < points.length; i += 3) check(points[i], points[i + 1], points[i + 2]);
}

test("mulberry32 repeats for the same seed and stays in [0, 1)", () => {
  const a = mulberry32(42);
  const b = mulberry32(42);
  for (let i = 0; i < 1000; i++) {
    const x = a();
    assert.equal(x, b());
    assert.ok(x >= 0 && x < 1);
  }
});

test("mulberry32 differs across seeds", () => {
  assert.notEqual(mulberry32(1)(), mulberry32(2)());
});

test("generators are deterministic for a given seed", () => {
  assert.deepEqual(generateSphere(N, 2.5, mulberry32(7)), generateSphere(N, 2.5, mulberry32(7)));
  assert.deepEqual(generatePlane(N, 3, mulberry32(7)), generatePlane(N, 3, mulberry32(7)));
});

test("sphere points sit on the radius", () => {
  const points = generateSphere(N, 2.5, mulberry32(1));
  assert.equal(points.length, N * 3);
  eachPoint(points, (x, y, z) => assert.ok(Math.abs(Math.hypot(x, y, z) - 2.5) < 1e-4));
});

test("torus points sit on the tube", () => {
  const points = generateTorus(N, 1.8, 0.8, mulberry32(2));
  assert.equal(points.length, N * 3);
  eachPoint(points, (x, y, z) => {
    const fromRing = Math.hypot(x, y) - 1.8;
    assert.ok(Math.abs(Math.hypot(fromRing, z) - 0.8) < 1e-4);
  });
});

test("helix points stay within its height and radius jitter", () => {
  const points = generateHelix(N, 1.5, 4.5, 5, mulberry32(3));
  assert.equal(points.length, N * 3);
  eachPoint(points, (x, y, z) => {
    assert.ok(Math.abs(y) <= 2.25 + 1e-6);
    assert.ok(Math.abs(Math.hypot(x, z) - 1.5) <= 0.075 + 1e-4);
  });
});

test("cube points sit on a face", () => {
  const points = generateCube(N, 3.5, mulberry32(4));
  assert.equal(points.length, N * 3);
  eachPoint(points, (x, y, z) => {
    const furthest = Math.max(Math.abs(x), Math.abs(y), Math.abs(z));
    assert.ok(Math.abs(furthest - 1.75) < 1e-5);
  });
});

test("plane points stay inside the terrain bounds", () => {
  const points = generatePlane(N, 3, mulberry32(5));
  assert.equal(points.length, N * 3);
  eachPoint(points, (x, y, z) => {
    assert.ok(Math.abs(x) <= 18 && Math.abs(y) <= 18);
    assert.ok(Math.abs(z) <= 0.95 + 1e-6);
  });
});

test("dust and randoms have the right size and range", () => {
  const dust = generateDust(N, mulberry32(6));
  assert.equal(dust.length, N * 3);
  eachPoint(dust, (x, y, z) => assert.ok(Math.abs(x) <= 7.5 && Math.abs(y) <= 7.5 && Math.abs(z) <= 5));
  const randoms = generateRandoms(N, mulberry32(6));
  assert.equal(randoms.length, N);
  for (const value of randoms) assert.ok(value >= 0 && value < 1);
});
```

- [ ] **Step 4: Run it and confirm it fails**

Run: `npm test`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` (Cannot find module `.../particle-shapes.ts`).

- [ ] **Step 5: Write the module**

Create `src/components/story/particle-shapes.ts`:

```ts
/**
 * Seeded particle target generators for the particle stage (spec §8).
 * Pure functions: no DOM and no three.js, so they run under Node's test runner.
 * Position arrays hold xyz triples, `count * 3` floats long.
 */

export type Rng = () => number;

/** mulberry32: a tiny deterministic PRNG. Same seed, same sequence, values in [0, 1). */
export function mulberry32(seed: number): Rng {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateSphere(count: number, radius: number, rng: Rng): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(2 * rng() - 1);
    const theta = rng() * Math.PI * 2;
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  return positions;
}

export function generateTorus(count: number, R: number, r: number, rng: Rng): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = rng() * Math.PI * 2;
    const v = rng() * Math.PI * 2;
    positions[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
    positions[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u);
    positions[i * 3 + 2] = r * Math.sin(v);
  }
  return positions;
}

export function generateHelix(
  count: number,
  radius: number,
  height: number,
  turns: number,
  rng: Rng
): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = t * Math.PI * 2 * turns;
    const strand = rng() > 0.5 ? 1 : -1;
    const r = radius + (rng() - 0.5) * 0.15;
    positions[i * 3] = r * Math.cos(angle + strand * 0.8);
    positions[i * 3 + 1] = (t - 0.5) * height;
    positions[i * 3 + 2] = r * Math.sin(angle + strand * 0.8);
  }
  return positions;
}

export function generateCube(count: number, size: number, rng: Rng): Float32Array {
  const positions = new Float32Array(count * 3);
  const half = size / 2;
  for (let i = 0; i < count; i++) {
    const face = Math.floor(rng() * 6);
    let x = (rng() - 0.5) * size;
    let y = (rng() - 0.5) * size;
    let z = (rng() - 0.5) * size;
    if (face === 0) x = half;
    else if (face === 1) x = -half;
    else if (face === 2) y = half;
    else if (face === 3) y = -half;
    else if (face === 4) z = half;
    else z = -half;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
}

/** A wide, gently rolling terrain on the XY plane; an X rotation lays it flat. */
export function generatePlane(count: number, size: number, rng: Rng): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const x = (rng() - 0.5) * size * 12;
    const y = (rng() - 0.5) * size * 12;
    const z = Math.sin(x * 1.5) * 0.4 + Math.cos(y * 1.5) * 0.4 + (rng() - 0.5) * 0.3;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
}

/** Background dust: a loose box around the scene. */
export function generateDust(count: number, rng: Rng): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (rng() - 0.5) * 15;
    positions[i * 3 + 1] = (rng() - 0.5) * 15;
    positions[i * 3 + 2] = (rng() - 0.5) * 10;
  }
  return positions;
}

/** One random value per particle, for per-particle variation in the shaders. */
export function generateRandoms(count: number, rng: Rng): Float32Array {
  const values = new Float32Array(count);
  for (let i = 0; i < count; i++) values[i] = rng();
  return values;
}
```

- [ ] **Step 6: Run the tests and confirm they pass**

Run: `npm test`
Expected: `ℹ pass 9`, `ℹ fail 0`.

- [ ] **Step 7: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: both exit 0 with no errors.

- [ ] **Step 8: Commit**

```bash
git add package.json tsconfig.json src/components/story/particle-shapes.ts src/components/story/particle-shapes.test.ts
git commit -m "test: node test runner and seeded particle shapes"
```

---

### Task 3: Sky colour stops

**Files:**
- Create: `src/components/story/sky-stops.ts`
- Test: `src/components/story/sky-stops.test.ts`

**Interfaces:**
- Produces (used by the story director in plans 2–3):
  - `type Stop = { at: number; color: string }`
  - `NIGHT = "#07060B"`, `DAY = "#F1F3F7"`
  - `SUNRISE: Stop[]` (night → day) and `DUSK: Stop[]` (day → night)
  - `clamp01(t: number): number`
  - `hexToRgb(hex: string): [number, number, number]`
  - `rgbToHex(rgb: [number, number, number]): string`
  - `mixHex(a: string, b: string, t: number): string`
  - `sampleStops(stops: Stop[], t: number): string`
  - Every colour returned is uppercase `#RRGGBB`.

- [ ] **Step 1: Write the failing test**

Create `src/components/story/sky-stops.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DAY,
  DUSK,
  NIGHT,
  SUNRISE,
  clamp01,
  hexToRgb,
  mixHex,
  rgbToHex,
  sampleStops,
} from "./sky-stops.ts";

test("hexToRgb parses #RRGGBB in either case", () => {
  assert.deepEqual(hexToRgb("#07060B"), [7, 6, 11]);
  assert.deepEqual(hexToRgb("#f1f3f7"), [241, 243, 247]);
});

test("hexToRgb rejects other formats", () => {
  assert.throws(() => hexToRgb("#FFF"));
  assert.throws(() => hexToRgb("violet"));
});

test("rgbToHex rounds, clamps and uppercases", () => {
  assert.equal(rgbToHex([127.5, 0, 300]), "#8000FF");
});

test("mixHex hits both ends, the middle, and clamps t", () => {
  assert.equal(mixHex("#000000", "#FFFFFF", 0), "#000000");
  assert.equal(mixHex("#000000", "#FFFFFF", 1), "#FFFFFF");
  assert.equal(mixHex("#000000", "#FFFFFF", 0.5), "#808080");
  assert.equal(mixHex("#000000", "#FFFFFF", 2), "#FFFFFF");
});

test("clamp01 keeps values inside 0..1", () => {
  assert.equal(clamp01(-1), 0);
  assert.equal(clamp01(0.25), 0.25);
  assert.equal(clamp01(3), 1);
});

test("sunrise runs night to day and dusk runs day to night", () => {
  assert.equal(sampleStops(SUNRISE, 0), NIGHT);
  assert.equal(sampleStops(SUNRISE, 1), DAY);
  assert.equal(sampleStops(DUSK, 0), DAY);
  assert.equal(sampleStops(DUSK, 1), NIGHT);
});

test("sampleStops returns each stop's colour at its own position", () => {
  for (const stop of SUNRISE) assert.equal(sampleStops(SUNRISE, stop.at), stop.color);
  for (const stop of DUSK) assert.equal(sampleStops(DUSK, stop.at), stop.color);
});

test("sampleStops clamps positions outside 0..1", () => {
  assert.equal(sampleStops(SUNRISE, -0.5), NIGHT);
  assert.equal(sampleStops(SUNRISE, 9), DAY);
});

test("the sunrise only ever gets lighter", () => {
  const lightness = (hex: string) => hexToRgb(hex).reduce((sum, channel) => sum + channel, 0);
  let previous = -1;
  for (let i = 0; i <= 40; i++) {
    const current = lightness(sampleStops(SUNRISE, i / 40));
    assert.ok(current >= previous);
    previous = current;
  }
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test`
Expected: the new file fails with `ERR_MODULE_NOT_FOUND` for `sky-stops.ts`, while the 9 particle-shape tests still pass.

- [ ] **Step 3: Write the module**

Create `src/components/story/sky-stops.ts`:

```ts
/**
 * Sky colours for the night → day → dusk story (spec §6).
 * Pure functions, so the story director can be unit tested under Node.
 */

export type Stop = { at: number; color: string };

export const NIGHT = "#07060B";
export const DAY = "#F1F3F7";

const evenly = (colors: string[]): Stop[] =>
  colors.map((color, i) => ({ at: i / (colors.length - 1), color }));

export const SUNRISE: Stop[] = evenly([
  "#07060B",
  "#140C26",
  "#2F2158",
  "#6B59A8",
  "#B8AADD",
  "#E6E0F4",
  "#F1F3F7",
]);

export const DUSK: Stop[] = evenly([
  "#F1F3F7",
  "#E4DDF3",
  "#A99AD8",
  "#4E3E8E",
  "#24184A",
  "#110B20",
  "#07060B",
]);

export function clamp01(t: number): number {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

export function hexToRgb(hex: string): [number, number, number] {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) throw new Error(`Expected a #RRGGBB colour, got ${hex}`);
  const n = parseInt(match[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex([r, g, b]: [number, number, number]): string {
  const channel = (v: number) =>
    Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`.toUpperCase();
}

export function mixHex(a: string, b: string, t: number): string {
  const k = clamp01(t);
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex([ar + (br - ar) * k, ag + (bg - ag) * k, ab + (bb - ab) * k]);
}

/** The colour at position t (0..1) along stops sorted by `at`. */
export function sampleStops(stops: Stop[], t: number): string {
  const k = clamp01(t);
  for (let i = 1; i < stops.length; i++) {
    const previous = stops[i - 1];
    const next = stops[i];
    if (k <= next.at) {
      const span = next.at - previous.at;
      return mixHex(previous.color, next.color, span === 0 ? 1 : (k - previous.at) / span);
    }
  }
  return stops[stops.length - 1].color.toUpperCase();
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `npm test`
Expected: `ℹ pass 18`, `ℹ fail 0`.

- [ ] **Step 5: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/components/story/sky-stops.ts src/components/story/sky-stops.test.ts
git commit -m "feat(story): sky colour stops for sunrise and dusk"
```

---

### Task 4: Brand fonts and design tokens

**Files:**
- Modify: `src/app/layout.tsx` (the font imports and `<html>`/`<body>` classes)
- Modify: `src/app/globals.css` (the `@theme inline` block, plus a new `@theme` block after it)

**Interfaces:**
- Produces (used by every later plan):
  - Utilities `font-display` (Manrope) and `font-sans` (Inter, the default).
  - Colour utilities from the tokens: `bg-night`, `bg-night-raise`, `text-night-text`, `text-night-muted`, `text-night-dim`, `border-night-line`, `bg-day`, `bg-day-raise`, `text-day-text`, `text-day-muted`, `text-day-dim`, `border-day-line`, `bg-brand`, `text-brand-glow`, `text-brand-ink`, `bg-lavender` and `text-quiet`, along with every other colour-utility combination Tailwind generates.
  - `rounded-card` (20px).
  - Type sizes `text-hero`, `text-chapter`, `text-statement` and `text-label`, each with its own line height and tracking.
  - CSS variables `--font-inter` and `--font-manrope` set on `<html>`.

Why the font classes move to `<html>`: Tailwind defines its theme variables on `:root`. A `var(--font-...)` that is only defined on `<body>` can't resolve there, so today's `--font-sans: var(--font-geist-sans)` very likely falls back to the system font. Defining next/font's variables on `<html>` fixes that.

- [ ] **Step 1: Swap Geist for Manrope and Inter in `layout.tsx`**

Replace:

```tsx
import { Geist, Geist_Mono } from "next/font/google";
```

with:

```tsx
import { Inter, Manrope } from "next/font/google";
```

Replace:

```tsx
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

with:

```tsx
// Brand type (spec §6): Manrope for display and headings, Inter for body.
// The variables live on <html> so Tailwind's :root theme variables can use them.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});
```

Replace:

```tsx
    <html lang="en">
```

with:

```tsx
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
```

Replace:

```tsx
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-black text-zinc-100 antialiased`}
```

with:

```tsx
        className="min-h-dvh bg-night text-zinc-100 antialiased"
```

- [ ] **Step 2: Point the theme fonts at Manrope and Inter in `globals.css`**

Inside the existing `@theme inline` block, replace:

```css
  --color-background: #000000;
  --color-foreground: #f4f4f5;
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
```

with:

```css
  --color-background: #07060b;
  --color-foreground: #f4f4f5;
  --font-sans: var(--font-inter);
  --font-display: var(--font-manrope);
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
```

- [ ] **Step 3: Add the brand tokens**

Directly after the closing `}` of the `@theme inline` block (the line after `--color-purple-400: #c084fc;`), insert:

```css

/* Night-into-day tokens (spec §6). */
@theme {
  --color-night: #07060b;
  --color-night-raise: #0e0c15;
  --color-night-text: #f4f4f5;
  --color-night-muted: #a1a1aa;
  --color-night-dim: #8a8a93;
  --color-night-line: rgb(255 255 255 / 0.08);
  --color-day: #f1f3f7;
  --color-day-raise: #ffffff;
  --color-day-text: #0f172a;
  --color-day-muted: #475569;
  --color-day-dim: #56637a;
  --color-day-line: #e2e8f0;
  --color-brand: #7c3aed;
  --color-brand-glow: #a855f7;
  --color-brand-ink: #6d28d9;
  --color-lavender: #ede9fe;
  --color-quiet: #7b8698;

  --radius-card: 20px;

  --text-hero: clamp(2.625rem, 5.85vw, 5.25rem);
  --text-hero--line-height: 0.95;
  --text-hero--letter-spacing: -0.045em;
  --text-chapter: clamp(2.375rem, 4.45vw, 4rem);
  --text-chapter--line-height: 0.96;
  --text-chapter--letter-spacing: -0.045em;
  --text-statement: clamp(1.875rem, 3.5vw, 3.125rem);
  --text-statement--line-height: 1.14;
  --text-statement--letter-spacing: -0.03em;
  --text-label: 0.8125rem;
  --text-label--letter-spacing: 0.04em;
}
```

- [ ] **Step 4: Check in the browser that the fonts actually apply**

Run (background): `npm run dev`
Open `http://localhost:3000/` in the browser pane and bring its tab to the front, because a hidden tab pauses rendering. Wait about 4 s for the intro, then run in the page:

```js
({
  body: getComputedStyle(document.body).fontFamily,
  interLoaded: document.fonts.check('16px "Inter"'),
  manropeVar: getComputedStyle(document.documentElement).getPropertyValue("--font-manrope"),
  bg: getComputedStyle(document.body).backgroundColor,
})
```

Expected:
- `body` contains `Inter`.
- `interLoaded` is `true`.
- `manropeVar` is a non-empty value containing `Manrope`.
- `bg` is `rgb(7, 6, 11)`.

Then open `http://localhost:3000/services/local-seo-hamilton` and confirm its small mono labels (like "https://yourbusiness.com") now use the system monospace, with no layout break. Take a screenshot of each page for the record, then stop the dev server.

- [ ] **Step 5: Type-check, lint and build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all exit 0. The build's route list is unchanged.

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat(type): Manrope and Inter with the brand tokens"
```

---

### Task 5: Motion engine (Lenis on GSAP's clock)

**Files:**
- Modify: `package.json`, `package-lock.json` (via npm)
- Create: `src/lib/motion/gsap.ts`
- Modify: `src/components/smooth-scroll.tsx`

**Interfaces:**
- Produces (used by plans 2–6):
  - `import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION_QUERIES } from "@/lib/motion/gsap"`, for client components only.
  - `MOTION_QUERIES.desktop`, `.phone` and `.reduced` are the three `gsap.matchMedia()` conditions from spec §7.
  - `useSmoothScroll()` and `window.__lenis` keep their current meaning. Lenis now runs on `gsap.ticker` and calls `ScrollTrigger.update` on every scroll.

- [ ] **Step 1: Install GSAP**

Run: `npm install gsap@^3.15.0 @gsap/react@^2.1.2`
Expected: `package.json` `dependencies` gains `"@gsap/react": "^2.1.2"` and `"gsap": "^3.15.0"` (npm may write the exact latest 3.x/2.x). No peer-dependency errors.

- [ ] **Step 2: Create `src/lib/motion/gsap.ts`**

```ts
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
```

- [ ] **Step 3: Put Lenis on GSAP's ticker in `smooth-scroll.tsx`**

Replace the whole file with:

```tsx
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
```

- [ ] **Step 4: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: both exit 0.

- [ ] **Step 5: Check in the browser that the ticker drives Lenis**

Run (background): `npm run dev`
Open `http://localhost:3000/` in the browser pane, bring the tab to the front, and wait about 4 s for the intro. Then run in the page:

```js
await Promise.race([
  new Promise((resolve) =>
    window.__lenis.scrollTo(1500, { duration: 0.6, onComplete: () => resolve(Math.round(window.scrollY)) })
  ),
  new Promise((resolve) => setTimeout(() => resolve("timeout: nothing is ticking Lenis"), 3000)),
])
```

Expected: `1500`. A timeout means `gsap.ticker` isn't driving Lenis, or the tab is hidden.

Then check by hand, at desktop size:
1. Mouse-wheel scrolling feels as smooth as before.
2. The navbar hides while scrolling down and returns while scrolling up.
3. The hero headline still drifts as you scroll (framer-motion parallax).
4. The hero's "Start Your Project" glides to the contact form.
5. The console shows no errors.

Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/lib/motion/gsap.ts src/components/smooth-scroll.tsx
git commit -m "feat(motion): run Lenis on GSAP's clock"
```

---

### Task 6: One particle stage over a CSS sky

**Files:**
- Create: `src/components/story/particle-shaders.ts`
- Create: `src/components/story/particle-stage.tsx`
- Create: `src/components/story/sky.tsx`
- Modify: `src/app/globals.css` (append the sky rules)
- Modify: `src/app/layout.tsx` (swap `SphereBackground` for `Sky` + `ParticleStage`)
- Modify: `tsconfig.json`, `eslint.config.mjs` (ignore `archive/`)
- Create: `archive/2026-09-night-into-day/README.md`
- Move: `src/components/sphere-background.tsx` → `archive/2026-09-night-into-day/src/components/sphere-background.tsx`

**Interfaces:**
- Consumes: the generators and `mulberry32` from Task 2.
- Produces (used by plans 2–3):
  - `<ParticleStage />` (client component, no props) renders the fixed WebGL layer. In this plan that's ambient mode only, identical in behaviour to the old sphere.
  - `<Sky />` (server component, no props) renders `<div class="sky">`.
  - The CSS variables `--sky-top`, `--sky-bottom` and `--sky-glow` on `:root` paint the sky. Later plans set them with `document.documentElement.style.setProperty`.
  - The shader strings `PARTICLE_VERTEX`, `PARTICLE_FRAGMENT`, `DUST_VERTEX` and `DUST_FRAGMENT`.

- [ ] **Step 1: Keep the archive out of type-checking and lint**

In `tsconfig.json`, replace:

```json
  "exclude": ["node_modules"]
```

with:

```json
  "exclude": ["node_modules", "archive"]
```

In `eslint.config.mjs`, replace:

```js
    "next-env.d.ts",
  ]),
```

with:

```js
    "next-env.d.ts",
    // Files moved aside by the night-into-day revamp (never compiled).
    "archive/**",
  ]),
```

- [ ] **Step 2: Create `src/components/story/particle-shaders.ts`**

These are the old sphere's shaders, moved verbatim:

```ts
/** GLSL for the particle stage, moved verbatim from the old sphere-background.tsx. */

export const PARTICLE_VERTEX = /* glsl */ `
  attribute vec3 aTarget1;
  attribute vec3 aTarget2;
  attribute vec3 aTarget3;
  attribute vec3 aTarget4;
  attribute float aRandom;

  uniform float uTime;
  uniform float uMorph;
  uniform float uPixelRatio;
  uniform vec3 uMouse; // Mouse position in particle local space
  uniform float uMouseInfluence;

  varying float vAlpha;
  varying float vColorMix;
  varying vec3 vPos;
  varying float vMouseProximity;

  // Smooth step between shapes
  vec3 getShapePosition(float morph) {
    vec3 pos;

    if (morph < 1.0) {
      pos = mix(position, aTarget1, smoothstep(0.0, 1.0, morph));
    } else if (morph < 2.0) {
      pos = mix(aTarget1, aTarget2, smoothstep(0.0, 1.0, morph - 1.0));
    } else if (morph < 3.0) {
      pos = mix(aTarget2, aTarget3, smoothstep(0.0, 1.0, morph - 2.0));
    } else {
      pos = mix(aTarget3, aTarget4, smoothstep(0.0, 1.0, morph - 3.0));
    }

    return pos;
  }

  void main() {
    // Add per-particle delay to morphing for organic feel
    float particleDelay = aRandom * 0.4;
    float adjustedMorph = max(uMorph - particleDelay, 0.0);

    vec3 pos = getShapePosition(adjustedMorph);
    vPos = pos;

    // Subtle floating motion, tied slightly to morph progress
    float floatSpeed = 0.5 + aRandom * 0.5;
    pos.x += sin(uTime * floatSpeed + aRandom * 6.28) * 0.05;
    pos.y += cos(uTime * floatSpeed * 0.7 + aRandom * 6.28) * 0.05;
    pos.z += sin(uTime * floatSpeed * 0.5 + aRandom * 3.14) * 0.05;

    // Mouse interaction - repulsion effect
    // uMouse is already in particle local space (calculated in JS)
    vec3 toMouse = pos - uMouse;
    float distToMouse = length(toMouse.xy);

    // Repulsion radius and strength
    float repulsionRadius = 1.5;
    float repulsionStrength = 0.8;

    // Calculate repulsion (particles push away from mouse)
    float repulsion = smoothstep(repulsionRadius, 0.0, distToMouse);
    vec3 repulsionDir = normalize(toMouse + vec3(0.001)); // Prevent division by zero
    pos += repulsionDir * repulsion * repulsionStrength * uMouseInfluence;

    // Add slight z-push for depth effect near mouse
    pos.z += repulsion * 0.5 * uMouseInfluence;

    // Store mouse proximity for fragment shader glow
    vMouseProximity = repulsion * uMouseInfluence;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Size attenuation - increased base size for strong glow
    // Particles near mouse get slightly larger
    float mouseSize = 1.0 + vMouseProximity * 0.5;
    float size = (20.0 + aRandom * 25.0) * uPixelRatio * mouseSize;
    gl_PointSize = size * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    // Alpha based on distance from center (core is bright, edges fade)
    float dist = length(pos);
    vAlpha = 0.35 + 0.35 * (1.0 - smoothstep(0.0, 8.0, dist));
    vAlpha *= 0.4 + aRandom * 0.3;

    // Boost alpha near mouse for glow effect
    vAlpha += vMouseProximity * 0.2;

    // Color variation based on position and randomness
    vColorMix = fract(aRandom + sin(pos.y * 2.0 + uTime) * 0.1);
  }
`;

export const PARTICLE_FRAGMENT = /* glsl */ `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uTime;
  uniform float uMorph;

  varying float vAlpha;
  varying float vColorMix;
  varying vec3 vPos;
  varying float vMouseProximity;

  void main() {
    // Soft circular particle with a sharper core
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;

    // Create a glow effect (bright center, soft falloff)
    float glow = 1.0 - (d * 2.0);
    float core = pow(glow, 3.0);
    float halo = pow(glow, 1.5) * 0.5;
    float strength = core + halo;

    // Boost glow near mouse
    strength += vMouseProximity * 0.4;

    // Color shifts as shape morphs
    vec3 baseColor = mix(uColor1, uColor2, vColorMix);
    // Add depth color based on local position
    float depthMix = smoothstep(-2.0, 2.0, vPos.z);
    vec3 finalColor = mix(baseColor, uColor3, depthMix * 0.7);

    // Shift toward brighter/whiter color near mouse for energy effect
    vec3 mouseHighlight = vec3(1.0, 0.9, 1.0);
    finalColor = mix(finalColor, mouseHighlight, vMouseProximity * 0.4);

    // Subtle shimmer
    float shimmer = sin(uTime * 3.0 + vColorMix * 20.0) * 0.15 + 0.85;

    // Dim overall output so text in the foreground stays readable
    gl_FragColor = vec4(finalColor * 0.9, strength * vAlpha * shimmer * 0.9);
  }
`;

export const DUST_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;

  varying float vAlpha;

  void main() {
    vec3 pos = position;
    pos.y += sin(uTime * 0.2 + position.x) * 0.2;
    pos.x += cos(uTime * 0.15 + position.z) * 0.2;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (4.0 + sin(uTime * 2.0 + position.x) * 2.0) * uPixelRatio * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    vAlpha = 0.08 + 0.06 * sin(uTime + position.x * 5.0);
  }
`;

export const DUST_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float strength = pow(1.0 - d * 2.0, 1.5);
    gl_FragColor = vec4(uColor, strength * vAlpha);
  }
`;
```

- [ ] **Step 3: Create `src/components/story/particle-stage.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import * as THREE from "three";
import {
  generateCube,
  generateDust,
  generateHelix,
  generatePlane,
  generateRandoms,
  generateSphere,
  generateTorus,
  mulberry32,
} from "./particle-shapes";
import {
  DUST_FRAGMENT,
  DUST_VERTEX,
  PARTICLE_FRAGMENT,
  PARTICLE_VERTEX,
} from "./particle-shaders";

/** Fixed seed, so the particle field looks the same on every visit. */
const SEED = 20260927;

/**
 * The single WebGL layer behind the site (spec §8).
 *
 * Plan 1 ports the old sphere-background.tsx like-for-like as "ambient" mode:
 * the sphere morphs through torus, helix, cube and terrain across the page's
 * scroll. The homepage's story beats arrive in plan 2.
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

    const isMobileViewport = window.innerWidth < 768;
    const PARTICLE_COUNT = isHomepage
      ? isMobileViewport
        ? 7000
        : 9000
      : isMobileViewport
        ? 3000
        : 4500;
    const DUST_COUNT = isHomepage ? (isMobileViewport ? 400 : 650) : 300;

    // Track the inner cleanup so it runs even if the timer fires after unmount
    let innerCleanup: (() => void) | null = null;
    let destroyed = false;

    // Defer heavy WebGL set-up so the page can paint first
    const initTimer = setTimeout(() => {
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
        return;
      }

      const rng = mulberry32(SEED);
      const mouse = { x: 0, y: 0 };
      const targetMouse = { x: 0, y: 0 };

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 4.5;

      const pixelRatioCap = isMobileViewport ? 1 : 1.25;
      const currentPixelRatio = Math.min(window.devicePixelRatio, pixelRatioCap);

      Object.assign(renderer.domElement.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        display: "block",
      });
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      renderer.setPixelRatio(currentPixelRatio);
      container.appendChild(renderer.domElement);

      const shapes = [
        generateSphere(PARTICLE_COUNT, 2.5, rng),
        generateTorus(PARTICLE_COUNT, 1.8, 0.8, rng),
        generateHelix(PARTICLE_COUNT, 1.5, 4.5, 5, rng),
        generateCube(PARTICLE_COUNT, 3.5, rng),
        generatePlane(PARTICLE_COUNT, 3.0, rng),
      ];

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(shapes[0], 3));
      geometry.setAttribute("aTarget1", new THREE.BufferAttribute(shapes[1], 3));
      geometry.setAttribute("aTarget2", new THREE.BufferAttribute(shapes[2], 3));
      geometry.setAttribute("aTarget3", new THREE.BufferAttribute(shapes[3], 3));
      geometry.setAttribute("aTarget4", new THREE.BufferAttribute(shapes[4], 3));
      geometry.setAttribute(
        "aRandom",
        new THREE.BufferAttribute(generateRandoms(PARTICLE_COUNT, rng), 1)
      );

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uPixelRatio: { value: currentPixelRatio },
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
        new THREE.BufferAttribute(generateDust(DUST_COUNT, rng), 3)
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

      // Scroll tracking
      let scrollY = 0;
      let targetScroll = 0;
      let maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      let startX = window.innerWidth < 768 ? 0 : 1.5;
      function handleScroll() {
        targetScroll = window.scrollY;
      }
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();

      // Mouse tracking (window-level, so it never blocks other interactions)
      let mouseActive = false;
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
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        material.uniforms.uPixelRatio.value = Math.min(
          window.devicePixelRatio,
          window.innerWidth < 768 ? 1 : 1.25
        );
        maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        startX = window.innerWidth < 768 ? 0 : 1.5;
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

      let baseRotationY = 0;
      let baseTimeX = 0;
      let dustTimeY = 0;
      let currentMouseInfluence = 0;

      // Reused vectors for mouse unprojection
      const mouseWorldPos = new THREE.Vector3();
      const mouseLocalPos = new THREE.Vector3();
      const inverseMatrix = new THREE.Matrix4();

      function animate() {
        animationId = requestAnimationFrame(animate);
        if (!isDocumentVisible) return;

        const delta = Math.min(clock.getDelta(), 0.033);
        const elapsed = clock.elapsedTime;

        baseRotationY += delta * 0.05;
        baseTimeX += delta * 0.02;
        dustTimeY += delta * 0.02;

        scrollY += (targetScroll - scrollY) * 0.08;
        mouse.x += (targetMouse.x - mouse.x) * 0.08;
        mouse.y += (targetMouse.y - mouse.y) * 0.08;

        const targetInfluence = mouseActive ? 1.0 : 0.0;
        currentMouseInfluence += (targetInfluence - currentMouseInfluence) * 0.05;

        if (currentMouseInfluence > 0.001) {
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
        material.uniforms.uMouseInfluence.value = currentMouseInfluence;

        const scrollProgress = scrollY / maxScroll;

        // 5 shapes = 4 transitions; 4.5 lets delayed particles reach the last shape
        material.uniforms.uMorph.value = scrollProgress * 4.5;

        // Slide from right of centre to the middle as you scroll
        particles.position.x = startX - scrollProgress * startX;

        const mouseRotationX = mouse.y * 0.15 * currentMouseInfluence;
        const mouseRotationY = mouse.x * 0.2 * currentMouseInfluence;

        particles.rotation.y = baseRotationY + scrollProgress * Math.PI * 2.0 + mouseRotationY;
        particles.rotation.x = Math.sin(baseTimeX) * 0.1 + scrollProgress * 1.55 + mouseRotationX;
        particles.rotation.z = scrollProgress * 0.2;

        // Lift the terrain so it sits behind the footer
        particles.position.y = -(scrollProgress * 1.2);
        particles.position.z = -(scrollProgress * 3.5);

        dust.rotation.y = dustTimeY + scrollProgress * Math.PI;
        dust.position.y = -(scrollProgress * 2.0);

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
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        dustGeometry.dispose();
        dustMaterial.dispose();
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
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{
        // Soften particles so foreground text stays easy to read
        filter: "blur(1px) brightness(0.92)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease-out",
        contain: "layout paint size",
        overflow: "hidden",
      }}
    />
  );
}
```

- [ ] **Step 4: Create `src/components/story/sky.tsx`**

```tsx
/**
 * The page's backdrop (spec §4 and §8). The story director scrubs
 * --sky-top, --sky-bottom and --sky-glow on <html> in later plans;
 * until then the defaults in globals.css paint tonight's sky.
 */
export function Sky() {
  return <div aria-hidden="true" className="sky" />;
}
```

- [ ] **Step 5: Add the sky rules to `globals.css`**

Append at the end of `src/app/globals.css`:

```css

/* Sky backdrop (spec §4). The story director scrubs these on <html>. */
:root {
  --sky-top: #07060b;
  --sky-bottom: #07060b;
  --sky-glow: 1;
}

.sky {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(180deg, var(--sky-top), var(--sky-bottom));
}

.sky::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, #0f0b18 0%, rgb(15 11 24 / 0) 70%);
  opacity: var(--sky-glow);
}
```

- [ ] **Step 6: Mount the sky and the stage in `layout.tsx`**

Replace:

```tsx
import { SphereBackground } from "@/components/sphere-background";
```

with:

```tsx
import { ParticleStage } from "@/components/story/particle-stage";
import { Sky } from "@/components/story/sky";
```

Replace:

```tsx
          <SphereBackground />
```

with:

```tsx
          <Sky />
          <ParticleStage />
```

- [ ] **Step 7: Move the old sphere into the archive**

```bash
mkdir -p archive/2026-09-night-into-day/src/components
git mv src/components/sphere-background.tsx archive/2026-09-night-into-day/src/components/sphere-background.tsx
```

Create `archive/2026-09-night-into-day/README.md`:

```markdown
# Archive: night-into-day revamp (2026-09)

Files the homepage revamp replaced, moved here instead of deleted (repo rule:
"Never delete a file. Move it aside and log it."). Each keeps its original path
under this folder. Nothing here is compiled, type-checked or linted.

Spec: `docs/superpowers/specs/2026-09-27-night-into-day-homepage-design.md`.
Every move is logged in the business folder's `HANDOFF.md`.
```

- [ ] **Step 8: Tests, type-check, lint and build**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected:
- The tests report `ℹ pass 18`.
- The other three exit 0.
- `grep -rn "sphere-background" src` returns nothing.

- [ ] **Step 9: Check the stage in the browser**

Run (background): `npm run dev`
In the browser pane, bring the tab to the front, open `http://localhost:3000/` and wait about 4 s for the intro. Compare with `.lighthouse/shots/baseline-home-1440.png`, then check:

1. **Hero.** The violet particle sphere sits right of centre, with the same dim glow on a near-black sky.
2. **Cursor.** Moving the mouse over the sphere pushes nearby particles away.
3. **Scrolling to the footer.** The sphere morphs through torus, helix and cube into the terrain behind the footer, just as before.
4. **Canvas count.** Run `document.querySelectorAll("canvas").length`. It should be `1` once the intro has finished.
5. **Sky.** Run `getComputedStyle(document.querySelector(".sky")).backgroundImage`. It should contain `linear-gradient`.
6. **Inner page.** Open `http://localhost:3000/pricing`. The sphere shows with fewer particles, and the console is clean.

Take screenshots of the hero and the footer. Then stop the dev server.

- [ ] **Step 10: Commit**

```bash
git add tsconfig.json eslint.config.mjs src/app/globals.css src/app/layout.tsx \
  src/components/story/particle-shaders.ts src/components/story/particle-stage.tsx \
  src/components/story/sky.tsx archive/2026-09-night-into-day/README.md \
  archive/2026-09-night-into-day/src/components/sphere-background.tsx
git commit -m "feat(story): one seeded particle stage over a CSS sky"
```

Run `git status --short` afterwards. The only untracked file left should be `AGENTS.md`, and `src/components/sphere-background.tsx` should show as renamed in the last commit (`git show --stat HEAD`).

---

### Task 7: CSS-only route fade

**Files:**
- Modify: `src/app/template.tsx`
- Modify: `src/app/globals.css` (append the fade rules)

**Interfaces:**
- Produces: every route's content is wrapped in `<div class="page-in">`, which fades in from first paint (0.5 s, no delay) and skips the animation under reduced motion. It no longer depends on framer-motion.

Why: today, `motion.div initial={{ opacity: 0 }}` renders `opacity:0` into the server HTML. Every page's content then stays invisible until JavaScript hydrates, and after that it waits another 0.4 s (spec §7, §11).

- [ ] **Step 1: Replace `src/app/template.tsx`**

```tsx
/**
 * Route fade-in (spec §7). Pure CSS, so content paints at first paint
 * instead of waiting for JavaScript. The styles live in globals.css (.page-in).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
```

- [ ] **Step 2: Add the fade to `globals.css`**

Append at the end of `src/app/globals.css`:

```css

/* Route fade-in: CSS only, so it plays at first paint (spec §7). */
@keyframes page-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.page-in {
  animation: page-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .page-in {
    animation: none;
  }
}
```

- [ ] **Step 3: Type-check, lint and build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all exit 0.

- [ ] **Step 4: Confirm the server HTML no longer hides the page**

Run (background): `npm run start -- -p 3100`

Then run:

```bash
curl -s http://localhost:3100/ | grep -o '<main class="relative z-10"><div[^>]*>'
```

Expected: `<main class="relative z-10"><div class="page-in">`, with no inline `opacity:0` on that wrapper.

Next, in the browser pane, go to `http://localhost:3100/blog` and then click the logo to return home. Content should fade up immediately, with no half-second pause. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/app/template.tsx src/app/globals.css
git commit -m "perf: CSS-only route fade with no delay"
```

---

### Task 8: Verify against the baseline and hand off

**Files:**
- Modify: `docs/superpowers/plans/2026-09-27-night-into-day-log.md`
- Modify: `/Users/sheldonsteele/ZailaAIDesignsBusiness/HANDOFF.md` (the IN FLIGHT line, plus a LOG entry)

**Interfaces:**
- Consumes: `scripts/lh-summary.mjs` and `scripts/shot.sh` (Task 1), and everything built in Tasks 2–7.

- [ ] **Step 1: Run the full check suite**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: `ℹ pass 18`, and everything else exits 0.

- [ ] **Step 2: Measure the branch the same way as the baseline**

Start the server in the background with `npm run start -- -p 3100`, then run:

```bash
for i in 1 2 3; do
  npx --yes lighthouse@12 http://localhost:3100/ --quiet \
    --chrome-flags="--headless=new" \
    --only-categories=performance,accessibility,best-practices,seo \
    --output=json --output-path=".lighthouse/plan1-$i.json"
done
node scripts/lh-summary.mjs .lighthouse/plan1-*.json
```

Expected: 11 rows. Compare them with the baseline in the log:

| Metric | Required |
|---|---|
| Performance | within 3 points of the baseline, or better |
| LCP | within 0.2 s of the baseline, or better |
| Accessibility | 100 |
| SEO | 100 |
| CLS | ≤ 0.1 |

Script transfer is expected to grow by roughly 45 KB (GSAP). If a required metric misses, stop and report the numbers instead of continuing.

- [ ] **Step 3: Capture after-frames and compare**

```bash
bash scripts/shot.sh "http://localhost:3100/" .lighthouse/shots/plan1-home-1440.png 1440 900
bash scripts/shot.sh "http://localhost:3100/" .lighthouse/shots/plan1-home-390.png 390 844
bash scripts/shot.sh "http://localhost:3100/#process" .lighthouse/shots/plan1-process-1440.png 1440 900
bash scripts/shot.sh "http://localhost:3100/pricing" .lighthouse/shots/plan1-pricing-1440.png 1440 900
```

Open each one next to its `baseline-*` twin with the Read tool. Expected: the same layout, with type now in Inter; no clipped or overlapping text; and the pricing page unchanged apart from the font. Stop the server.

- [ ] **Step 4: Record the results in the log**

Append to `docs/superpowers/plans/2026-09-27-night-into-day-log.md`, replacing the two capitalised markers with the `git rev-parse --short HEAD` output and the rows printed in Step 2:

```markdown

## After plan 1 (foundation)

Commit SHORT_SHA. Same method as the baseline.

| Metric | Value |
|---|---|
| ROWS FROM STEP 2 | |

Changes behind the difference:
- Manrope and Inter (fonts now resolve from `<html>`).
- The route fade is CSS-only, with no hydration wait and no 0.4 s delay.
- One seeded particle stage replaces the sphere background, drawn over a CSS sky.
- GSAP (roughly 45 KB) now drives Lenis.
```

- [ ] **Step 5: Commit the log**

```bash
git add docs/superpowers/plans/2026-09-27-night-into-day-log.md
git commit -m "docs: plan 1 measurements"
```

- [ ] **Step 6: Update the handoff file and snapshot it**

In `/Users/sheldonsteele/ZailaAIDesignsBusiness/HANDOFF.md`, in the IN FLIGHT line for `zaila-ai-designs`, replace:

```
(awaiting Waldo's review)
```

with this, where SHORT_SHA is the output of `git rev-parse --short HEAD`:

```
(approved 2026-09-27); plan 1 (foundation) done at `SHORT_SHA`, plan 2 (night: intro, hero, the reality) next
```

Then append this entry at the end of the LOG, filling in the timestamp from `date "+%Y-%m-%d %H:%M"` and the numbers from the log file:

```markdown

## [TIMESTAMP] Claude | zailaai.com night-into-day: plan 1 (foundation) done

- Branch `feat/night-into-day-2026-09` in `Zaila AI Designs/zaila-ai-designs`, not pushed.
- **Plan 1 of 6:**
  - Manrope and Inter; the fonts now actually resolve (the old Geist variables sat on `<body>` where Tailwind's `:root` theme couldn't see them).
  - Brand tokens.
  - GSAP with Lenis on one clock.
  - One seeded particle stage over a CSS sky.
  - A CSS-only route fade.
  - `npm test` (Node's built-in runner, 18 tests).
- **Moved aside, not deleted:** `src/components/sphere-background.tsx` → `archive/2026-09-night-into-day/src/components/sphere-background.tsx`.
- **Lighthouse mobile (median of 3, localhost):** baseline Performance BASE_PERF, LCP BASE_LCP s → plan 1 Performance NEW_PERF, LCP NEW_LCP s. Full table in `docs/superpowers/plans/2026-09-27-night-into-day-log.md`.
- **→ Waldo:** nothing to do yet. The spec's open questions (On The Snap wording, 20- vs 30-minute call, copy approvals) block the merge, not the next plan.
```

Then run:

```bash
bash /Users/sheldonsteele/ZailaAIDesignsBusiness/_AI/snapshot.sh "zailaai.com night-into-day plan 1 done" "Claude" HANDOFF.md
```

Expected: the script prints `about to commit: HANDOFF.md` and a commit line.
