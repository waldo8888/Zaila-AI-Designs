# Night into day: measurement log

Every number here comes from a stated method, so before/after comparisons are fair.

## Methods

Both methods start the same way: `npm run build`, then `npm run start -- -p 3100`, then medians from `node scripts/lh-summary.mjs <files>`. Every run uses a fresh browser profile, so the first-visit intro plays each time.

**Applied throttling. This is the speed gate from plan 2 on (Waldo, 2026-09-27).**
- Command: `npx --yes lighthouse@12 http://localhost:3100/ --throttling-method=devtools --only-categories=performance`.
- Runs: three. Name the reports `applied-<label>-<n>.json`.
- What it does: Chrome genuinely slows the CPU 4× and throttles the network, then measures what actually happens.
- Pass bar: Performance within 3 points of the baseline, LCP within 0.2 s, CLS ≤ 0.1.

**Simulated throttling. Recorded alongside, not a gate.**
- Command: `npx --yes lighthouse@12 http://localhost:3100/` (Lighthouse's default).
- Runs: five. Name the reports `sim-<label>-<n>.json`.
- It estimates a slow phone from a fast trace. On this site the estimate is bimodal: runs cluster near 2.7 s or 3.5 s for the same code. That's too noisy to gate on (see "After plan 1").
- Accessibility, best practices and SEO scores come from these runs.

**Frames.** `bash scripts/shot.sh <url> <out.png> [width] [height]` wraps `scripts/cdp.mjs`, which drives headless Chrome over its DevTools protocol:
- it produces real animation frames and waits 6 s after load;
- widths under 768 px are emulated as a phone.

`node scripts/cdp.mjs <url> <waitMs> <expression>` also runs JavaScript checks. Use it whenever the browser pane is hidden: a hidden pane produces no animation frames, so Lenis, GSAP and WebGL all stall there.

Reference frames live in `.lighthouse/shots/` (not committed).

## Baseline: today's site (`main` at `fd390eb`)

**First measurement (simulated, 3 runs):** 2026-09-27 19:45, on the branch at `43bb758`, where the code is identical to `main`.

| Metric | Value |
|---|---|
| Lighthouse version | 12.8.2 |
| Runs | 3 |
| Performance | 91 |
| LCP (s) | 2.73 |
| FCP (s) | 0.92 |
| TBT (ms) | 241 |
| CLS | 0.000 |
| Accessibility | 100 |
| Best practices | 96 |
| SEO | 100 |
| Script transfer (KB) | 433 |

**Re-measured (simulated, 5 runs):** 2026-09-27 ~22:50, with `fd390eb` checked out. Performance 92, LCP 2.73 s, FCP 0.92 s, TBT 220 ms, CLS 0.000, Accessibility 100, Best practices 96, SEO 100, script 433 KB. The runs gave LCP 2.68, 2.73, 2.73, 2.73 and 3.63 s.

**Applied throttling (3 runs):** Performance 87, LCP 1.72 s, FCP 1.72 s, TBT 304 ms, CLS 0.000. The runs gave LCP 1.94, 1.71 and 1.72 s.

**Notes:**
- **Outlier run.** First measurement, run 1, scored 43 (LCP 5.61 s): a cold server plus Lighthouse downloading at the same time. The median absorbs it.
- **LCP element.** It's the navbar logo, `/logo.png` (1024 px) shown at 80 px through `next/image`. Its observed paint is about 0.1 s on this Mac. Almost all of the simulated LCP is modelled "render delay".
- **Fonts.** This site renders the system font (San Francisco on this Mac), not Geist, because the Geist variables sit on `<body>` where Tailwind's `:root` theme variables can't resolve them. Plan 1 fixes this for Manrope and Inter.
- **Why this beats the Sept 5 audit.** That audit's 69–71 and 4.4–4.8 s came from a sandbox with no GPU.
- **Kept frames:** `baseline-home-1440.png` and `baseline-pricing-1440.png`. The old `baseline-home-390.png` is laid out wider than a phone and isn't comparable.

## After plan 1 (foundation)

**First try, `7351516` (simulated, 3 runs): missed the gate.** Performance 84, LCP 3.98 s, TBT 172 ms, script 478 KB. The logo's observed paint was still about 0.1 s. The estimate grew because of the bytes loaded early:
- GSAP (about 45 KB) on every page, through the smooth-scroll code;
- 72 KB of preloaded fonts (Inter and Manrope), against 52 KB of Geist before.

**Fixes, `c7b9f56`:**
- Lenis and GSAP now load after first paint, and native scrolling works until they arrive.
- Manrope is no longer preloaded until plan 2 uses it above the fold.

**Final, `c7b9f56`, simulated (5 runs):**

| Metric | Value |
|---|---|
| Lighthouse version | 12.8.2 |
| Runs | 5 |
| Performance | 88 |
| LCP (s) | 3.55 |
| FCP (s) | 0.92 |
| TBT (ms) | 153 |
| CLS | 0.000 |
| Accessibility | 100 |
| Best practices | 96 |
| SEO | 100 |
| Script transfer (KB) | 427 |

The runs gave LCP 3.49, 3.56, 3.55, 2.37 and 3.56 s.

**Final, `c7b9f56`, applied throttling (3 runs):** Performance 87, LCP 1.80 s, FCP 1.70 s, TBT 218 ms, CLS 0.000. The runs gave LCP 1.86, 1.80 and 1.80 s.

**Verdict.**
- **Applied throttling:** same Performance (87 against 87) and LCP within 0.08 s (1.80 against 1.72). Main-thread blocking is lower (TBT 218 against 304 ms), and the page ships less script than today (427 against 433 KB).
- **Simulated estimate:** still 0.8 s higher at the median. Observed paint times overlap, though (95–197 ms before, 108–174 ms after), and both builds produce runs in both clusters.
- **Decision:** Waldo accepted plan 1 on the applied-throttling result, and made applied throttling the gate for the remaining plans.

**Frames** (`plan1-home-1440.png`, `plan1-pricing-1440.png`, `plan1-home-390.png`): same layout as the baseline, now in Inter, with the particle field, nav and logo in place. On a 390 px phone the hero fits with no horizontal overflow.

**Found along the way (for later plans):**
- **Intro hydration mismatch.** `loading-screen.tsx` decides whether to show in its `useState` initializer, using `sessionStorage`, so every reload within a session throws a React hydration mismatch. This is in plan 2's scope, since plan 2 replaces the intro.
- **Phone layout viewport.** At a 390 px phone emulation the page lays out at 406 px, so something is about 16 px too wide. Plan 1 didn't change layout, so this is probably older. It's for plan 6 (phones).
- **Dev server cache.** A CSS append made while `next dev` was running never reached the dev server's cached CSS, even across restarts, until `.next/dev` was cleared. If dev CSS looks stale, check the served chunk before debugging the code.
