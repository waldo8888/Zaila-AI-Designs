# Night into day: measurement log

Every number here comes from the same method, so before/after comparisons are fair.

**Method:**
1. `npm run build`, then `npm run start -- -p 3100`.
2. `npx --yes lighthouse@12 http://localhost:3100/` three times (default mobile emulation, simulated throttling, fresh profile per run, so the first-visit intro plays).
3. Medians from `node scripts/lh-summary.mjs`.

Reference frames live in `.lighthouse/shots/` (not committed).

## Baseline: today's site

Branch `feat/night-into-day-2026-09` at `43bb758`. The code is identical to `main` at `fd390eb`; the only extras are the spec and plan 1.
Measured: 2026-09-27 19:45 on Waldo's Mac.

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

**Notes:**
- **Outlier run.** Run 1 scored 43 (LCP 5.61 s): a cold server plus Lighthouse downloading at the same time. Runs 2 and 3 scored 91 and 92 (LCP 2.73 s both), and the median absorbs the outlier.
- **LCP element.** It's the navbar logo, `/logo.png` (1024 px) shown at 80 px through `next/image`, and most of its time is render delay: TTFB 458 ms, load delay 353 ms, load time 290 ms, render delay 1628 ms.
- **Fonts.** This site renders the system font (San Francisco on this Mac), not Geist. The frames show it, because the Geist variables sit on `<body>` where Tailwind's `:root` theme variables can't resolve them. Task 4 fixes this for Manrope and Inter.
- **Why this beats the Sept 5 audit.** That audit's 69–71 and 4.4–4.8 s came from a sandbox with no GPU. This Mac has one, so these numbers are the fair baseline for this revamp.
- **Capture limits.** `scripts/shot.sh` gives reliable desktop frames of the top of a page. Phone-width frames (390 px) come out laid out wider and cropped, because desktop Chrome won't go that narrow, so phone checks use the browser pane's mobile emulation. Hash-anchored URLs (`/#process`) come out black, so scrolled positions are checked in the browser pane too. The kept baseline frames are `baseline-home-1440.png` and `baseline-pricing-1440.png`.
