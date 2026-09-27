# Night into day — zailaai.com homepage revamp

- **Date:** 2026-09-27
- **Status:** design approved in chat, section by section. This written spec is awaiting Waldo's review.
- **Branch:** `feat/night-into-day-2026-09` (off `main` at `fd390eb`). Never pushed by Claude. Merging to `main` deploys production.
- **Design canvas:** https://claude.ai/artifact/RkjEadVhEvTnBaqsVRSpzz. It has 13 frames (desktop, a storyboard and phones) plus motion notes. It's private, so share it from its Share menu if anyone else needs it.
- **Inputs:** `04_Review/Zaila_Site_Audit_2026-09-05.md`, `02_Research/Site_Audits/zailaai/zailaai_SiteAudit_2026-09-27.md`, business `CLAUDE.md` §1–§8.

## 1. Summary

The homepage becomes one scroll story. It opens at night: someone is Googling you, the particles form your orb, and the leads leak away. As the fix begins, scrolling brings the sun up and the particles land as a real website that builds itself one service at a time. Then come real client work, the process and the principles in daylight. At dusk the particles return to form the logo behind "Ready to launch?".

This is project one of two. It covers the homepage and a shared motion system. Inner pages pick up the new fonts, nav and footer, and are otherwise untouched until project two.

## 2. Goals and success criteria

**Goal:** a homepage with Awwwards-level art direction and motion that still sells: what Zaila does and what it costs stay close to the top.

| # | Criterion | How it's checked |
|---|---|---|
| G1 | The pricing link is on screen 1. | Frame capture at 1440×900 and 390×844. |
| G2 | Services start arriving by about screen 2 and are fully in view by about 2.75. | Scroll-position captures on desktop. |
| G3 | The only pinned scene before services is the leak, at about 0.75 screen. | Code review plus capture. |
| G4 | Load time and the Lighthouse mobile Performance score are no worse than a fresh baseline of today's site on the same Mac, within run-to-run noise (±3 points, ±0.2 s). | Lighthouse mobile, median of 3 runs, before and after. |
| G5 | Accessibility 100, SEO 100, Best Practices ≥ 96. CLS stays in Google's "good" band (≤ 0.1). | Lighthouse. |
| G6 | Scrolling through every pinned scene has no long tasks over 50 ms on a mid-range laptop, and the particle layer does no work during the day chapters. | Chrome performance trace of a full scroll. |
| G7 | With reduced motion there are no pins or scroll-driven animation, and all content is visible. | Emulated `prefers-reduced-motion`. |
| G8 | Every line of copy is approved or already approved, and every client shown has agreed. | Waldo sign-off before merge. |
| G9 | Lint, type-check, production build and unit tests pass. | `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm test`. |

## 3. Decisions (all 2026-09-27, Waldo)

1. **Pinning: story with guardrails.** Pins come back, each one short. Services and the pricing link stay within the first two to three screens. The biggest set piece, the sunrise into the site build, *is* the services chapter. That reads the guardrail by its intent (don't delay what we sell), and Waldo accepted it.
2. **Art direction: C, night into day.** A dark, particle-led opening that turns into the light brand palette as the fix begins, then dusk at the end.
3. **Work chapter: yes, real sites only.** Shown: Pub 36 (both sites), 100 Men Who Care Hamilton, and On The Snap once its listing bug is fixed. **Afro Fusion Resto is not shown**, by Waldo's choice.
4. **Intro: keep the particle logo, improved and refined.** It stays a full-screen moment on the first visit each session. The particles now hand off into the hero orb instead of scattering.
5. **Build approach: one particle stage plus GSAP.** GSAP (ScrollTrigger and SplitText) runs the scroll choreography. framer-motion stays where it already is (nav, chat widget, inner pages).
6. **Part 3 approved:** type and tokens, the motion engine, the particle stage, the speed budget, the checks and the rollout, as below.

## 4. Story structure (desktop)

One unit is one screen of scrolling (100vh). "Pinned" means the page holds still while the scene plays.

| Chapter | Anchor | Length | Pinned | Sky | Particle layer |
|---|---|---|---|---|---|
| Intro (first visit per session) | — | ~2.5 s, time-based | full-screen | night | on (logo) |
| Hero | top | 1 | — | night | on (orb) |
| 01 The reality | `#story` | 1.75 | 0.75 | night | on (leak) |
| Sunrise handoff | — | overlaps the reality exit and the fix entry, ~1 screen | — | night → day | on (horizon, then landing) |
| 02 The fix = what we build | `#services` | 2.5 | 1.5 | day | off after landing |
| 03 Selected work | `#work` | ~1.75 | — | day | off |
| 04 Process | `#process` | ~1.6 | — | day | off |
| 05 How we work | `#approach` | ~1.5 | — | day | off |
| What you get (marquee) | — | 0.4 | — | day → dusk | off |
| 06 Ready to launch? | `#contact` | ~1.3 | — | dusk → night | on (logo bookend) |
| Footer | — | ~0.6 | — | night | on until it leaves |

The existing anchors (`#story`, `#services`, `#process`, `#approach`, `#contact`) keep their names, so the nav, the footer and the `SiteNavigationElement` JSON-LD keep working. `#work` is new, and the nav gains a "Work" link.

**Phones (< 1024px):** the only pin is a shorter site build (1 screen). The reality sentence fills in as it scrolls through the middle of the viewport. The sky changes the same way. The particle count is lighter.

**Reduced motion:** no pins and no scroll scrubbing. The sky switches per section without blending, the orb holds still, and the intro is skipped (as today).

## 5. Chapters

Frames on the canvas are named in brackets.

### Intro [Intro · first visit]
- A full-screen night curtain. The particles fly in and build the real logo (chip mark and wordmark), hold a beat, then stream into the orb's position while the curtain fades to show the hero.
- The logo's points are precomputed from `public/logo.png` into a small data module (~20 KB), so load no longer fetches the 136 KB PNG or samples it on a canvas.
- It keeps today's rules: first visit per session (`sessionStorage`), skipped for reduced motion, and a safety net (WebGL failure or a 5 s backstop dismisses it).
- During the intro the stage draws above the curtain, and it drops back behind the content once the handoff ends.

### Hero [Hero · night] — screen 1
- Left-aligned headline in Manrope 800, 84px at 1440 wide, over three lines: "Premium websites for / service businesses that / want **more leads.**" "More leads." is violet `#A855F7`.
- The approved subhead, then "Start Your Project" (white pill) and "See pricing — builds from $800, care from $69/mo →". On phones: "See pricing — from $800 →".
- Meta row: live Hamilton time ("Hamilton, ON · 9:47 PM", `America/Toronto`), "(Scroll)", and "Available for new projects".
- The orb sits right of center, behind the end of the headline. It turns slowly and moves away from the cursor, like today.
- The entrance is **pure CSS** (masked line rise), so it plays at first paint without waiting for JavaScript.
- Nav in its night theme: chip mark with "Zaila AI Designs"; Services · Work · Process · How we work · Blog · Pricing; "Start Your Project". It hides on the way down and returns on the way up, like today.

### 01 The reality [01 The reality · pinned]
- Label "01 / The reality" (the section's `h2`, styled small).
- Pinned 0.75 screen. The approved sentence fills in word by word as you scroll: "Someone Googles you tonight, lands on a slow page with no way to book, and calls the next place on the list." It's followed by "You never hear about it." in violet and "That's the leak we fix."
- About 45% of the particles peel off the orb and drift off the right edge in proportion to scroll. The movement is fully reversible: scrolling back pulls them home.
- A thin progress line at the left edge tracks the fill.

### Sunrise handoff [Sunrise · night into day]
- Driven by scroll across roughly one screen. It starts when the reality pin releases and ends when the fix section's top reaches the top of the viewport.
- The sky moves from `#07060B` through violet to mist `#F1F3F7`.
- The remaining particles fall and settle into a horizon, then converge on the sample site's position on screen and fade as it fades in.

### 02 The fix = what we build [02 The fix · last step] + [storyboard]
- Day palette. Heading: "A premium site, live in days." Body: the approved fix description.
- Pinned 1.5 screens. A sample client site, "Your Salon", clearly a made-up sample with a labelled photo placeholder, builds in four steps at 0–25–50–75–100% of the pin:
  1. **Websites:** layout, type and photo land.
  2. **Lead systems:** "Book now", "Book an appointment" and the next-openings row snap in.
  3. **AI & automation:** the chat exchange appears.
  4. **Care plans:** a "This month's check-in" card appears (Hosting, Updates, Performance check).
- The left column is an ordered list of the four services. Each row has the approved feature line, and the active row expands to show that service's full approved description. All four descriptions are in the HTML.
- It ends on "See pricing — builds from $800 →" and the approved "Not sure which tier? Book the discovery call. We'll tell you if you're overbuying."
- The nav switches to its day theme here and marks "Services" as current.

### 03 Selected work [03 Selected work]
- White background. Heading "Work you can visit." with the sub "Live sites we designed and built around Hamilton. Go poke around." (both **draft**). An index on the right lists the projects.
- Each project gets a browser frame holding a tall full-page capture of the live site. As the frame arrives, it opens from an inset to full size (`clip-path`). The site inside then scrolls with your scroll (the capture's `translateY` follows scroll). There are no video files.
- Each project also shows its name, a one-line meta, "What we built" (or "What we do"), two short factual points and a link to the live site. All of this copy is **draft**.
- The data lives in `src/lib/work.ts`. Each item has an `enabled` flag, plus `linkEnabled` for the live link:
  - **Pub 36 on Hess:** enabled. Venue site plus the After Dark event site as a second, overlapping frame.
  - **100 Men Who Care Hamilton:** enabled, but its link stays off until `100menhamilton-wentworth.com` serves the new build. Today the domain still serves the old site. The capture comes from the Vercel deployment.
  - **On The Snap:** off until the "(Copy)" tournament listing and the stale March events are fixed in the OnTheSnap repo.

### 04 Process [04 Process]
- "Idea to launch in **days**" (the approved heading) in 96px Manrope.
- Below it, two columns. On the left is today's "problem" beat: "Building a website shouldn't take months." plus its approved paragraph. On the right is the approved section sub.
- A horizontal timeline for Discovery, Build Sprint, Launch and Grow, with the approved step copy. Its line draws left to right as you scroll through the section. Each step rises in when the line reaches it, and upcoming steps stay dim.

### 05 How we work [05 How we work]
- "What working with us looks like" (approved), with the four principles as one list: Diagnose first, Launch in days, Built to convert, Care that lasts, each with its approved quote.
- The active principle follows your scroll. It's full contrast with a lavender stat chip (for example "Days · Not months"), and the others dim but stay legible (≥ 3:1).
- This replaces the auto-rotating carousel. All four principles are in the server HTML, which fixes finding #12 in the 09-27 audit.

### What you get + 06 Ready to launch? + footer [What you get · 06 Ready to launch? · footer]
- **Marquee.** Big Manrope words with small labels, using the approved items. It keeps today's scroll-speed-reactive behavior. The sky starts turning to dusk across it.
- **Contact at dusk.** Label "06 / Get started", heading "Ready to **launch**?", the approved sub and the email line. The particles wake once more and form the logo behind the heading, at about 50% opacity, as the section arrives.
- **The form keeps every field and value.** These are Name, Email, Business name, Phone, Current website, Project type, Primary goal, Budget range, Timeline, Message and the honeypot. The hidden attribution fields stay too, so leads still reach ZailaOS unchanged.
  - Left column: email, Hamilton, and the 24h / Days / Monthly facts.
  - The three "Quick Response / No Commitment / Transparent Pricing" rows are dropped (pending approval, see §10).
- **Footer.** It's restyled on the night palette with the approved tagline and columns, and the navigation column gains "Work".

## 6. Visual system

**Fonts.** Manrope (600, 700, 800) for display and headings, Inter (400, 500, 600) for body and UI. Both load through `next/font/google`, which self-hosts them with size-adjusted fallbacks. They replace Geist and Geist Mono site-wide in `layout.tsx`.

**Tokens** (CSS custom properties in `globals.css`; Tailwind v4 `@theme` where useful):

| Token | Value | Use |
|---|---|---|
| `--night` / `--night-raise` | `#07060B` / `#0E0C15` | night background / raised surfaces (form card) |
| `--night-text` / `--night-muted` / `--night-dim` | `#F4F4F5` / `#A1A1AA` / `#8A8A93` | text on night |
| `--night-line` | `rgba(255,255,255,.08)` | hairlines on night |
| `--day` / `--day-raise` | `#F1F3F7` / `#FFFFFF` | mist background / white surfaces |
| `--day-text` / `--day-muted` / `--day-dim` | `#0F172A` / `#475569` / `#56637A` | text on day |
| `--day-line` | `#E2E8F0` | hairlines on day |
| `--violet` / `--violet-glow` / `--violet-ink` | `#7C3AED` / `#A855F7` / `#6D28D9` | CTA on day / accent on night / links on day |
| `--lavender` | `#EDE9FE` | chips, completed-step badges |
| `--quiet` | `#7B8698` | dimmed large type on white (≥ 3:1) |

- **Sky stops.** Sunrise: `#07060B → #140C26 → #2F2158 → #6B59A8 → #B8AADD → #E6E0F4 → #F1F3F7`. Dusk: `#F1F3F7 → #E4DDF3 → #A99AD8 → #4E3E8E → #24184A → #110B20 → #07060B`.
- **Violet is for accents only:** the key word, the day CTA, active states and links. Fuchsia, cyan, emerald and orange are removed from the homepage, as are glass cards and gradient text.

**Type scale** (desktop px, fluid with `clamp()`): hero 84, chapter headings 64–96, fill sentence 50, project names 40, service names 17, body 16–19, labels 13 (tracking 0.04em, tabular numbers). Display line-height is 0.95–1.0 with tracking −0.045em.

**Shape and spacing.** Cards 20px radius, small cards 16px, pills 999px. The spacing scale is 8/16/24/40 inside components. Chapters get 120–160px of padding on desktop and 80px on phones.

## 7. Motion system

- **Engine.** `gsap` with ScrollTrigger and SplitText (`@gsap/react`'s `useGSAP` for lifecycle), registered once in `src/lib/motion/gsap.ts`. Everything homepage-specific is imported only from homepage components, so it isn't in inner-page bundles.
- **Lenis stays** as the smooth scroll and runs on GSAP's clock: `gsap.ticker` drives `lenis.raf`, and Lenis scroll events call `ScrollTrigger.update`. It stays disabled on touch and for reduced motion, as today.
- **Pins are CSS `position: sticky`** inside a tall section. ScrollTrigger only reads progress (`scrub`) and drives timelines. It never rewraps the markup, so React keeps ownership of the DOM.
- **Line reveals** use SplitText with `mask: "lines"` and `autoSplit` (re-splits on resize). Its default `aria` handling keeps the full sentence readable by screen readers. Word-by-word fills use the same split.
- **Hero entrance** is CSS keyframes (masked line rise, subhead and CTA fade-up) that start at first paint.
- **Modes**, via `gsap.matchMedia()`:
  - **Desktop** (≥ 1024px, motion OK): all pins and scrubs.
  - **Phones** (< 1024px, motion OK): only the fix pins (1 screen). Everything else reveals on entry, and the sky still scrubs.
  - **Reduced motion:** no pins or scrubs, final states only, the sky set per section, the stage static.
- **Easing and timing.** Reveals run 0.8–1.0 s with `power4.out` and a 0.06–0.1 s stagger. Scrubs use light smoothing (`scrub: 0.6`). There are no page transitions (Waldo's standing preference) and no cursor labels (also his standing preference).
- **`template.tsx`.** The route fade becomes CSS-only with no delay. Today it holds every page's content at `opacity: 0` until hydration plus 0.4 s.

## 8. Particle stage and director

- **One WebGL layer**, `src/components/story/particle-stage.tsx`, replaces `sphere-background.tsx` and the WebGL inside `loading-screen.tsx`. That's one context instead of two during the intro.
- **Shapes** (`particle-shapes.ts`, pure and seeded, so they're deterministic):
  - logo, from the precomputed points
  - orb (Fibonacci sphere, like today)
  - leak paths (a per-particle threshold and exit point)
  - horizon plane
  - landing (a rectangle measured from the sample site's DOM box each frame, in screen space)
- **Director** (`story-director.ts`, pure). It maps chapter progress (hero exit, reality pin, sunrise, fix landing, contact entry) to:
  - stage state: shape weights, leak amount, horizon amount, landing amount, opacity, and whether the stage is running
  - sky stops (`--sky-top`, `--sky-bottom`)
  - nav theme

  Positions are a function of progress, not accumulated over time, so every scene reverses cleanly. Idle motion (breathing, cursor push) is layered on top.
- **Sleep and wake.** Rendering stops once the landing completes and restarts when the dusk section approaches. The tab-visibility pause stays.
- **Budgets.** 9,000 particles on desktop and ~5,000 on phones (down from 7,000). Device pixel ratio is capped at 1.25 on desktop and 1 on phones, as today.
- **Inner pages** get an `ambient` mode that reproduces today's sphere behavior, so they don't change until project two.

## 9. Architecture

**New**
- `src/lib/motion/gsap.ts`: plugin registration, the Lenis bridge, `matchMedia` modes
- `src/components/story/particle-stage.tsx`, `particle-shapes.ts`, `story-director.ts`, `logo-points.ts` (generated), `sky.tsx`, `intro-curtain.tsx`
- `src/components/ui/split-reveal.tsx`: the SplitText line and word reveal wrapper
- Sections: `reality-section.tsx`, `fix-section.tsx`, `work-section.tsx`, `principles-section.tsx`
- `src/lib/work.ts`, plus captures in `public/work/*.webp`
- `scripts/sample-logo-points.py`, which regenerates `logo-points.ts` from `public/logo.png`. It's Python with Pillow because the repo has no PNG decoder. It's dev-only: run by hand, output committed, never part of the build.
- Unit tests beside the pure modules (`*.test.ts`), run with Node's built-in test runner. A `test` script is added to `package.json`, with no new test library.

**Changed**
- `src/app/layout.tsx`: fonts, mount `Sky` and `ParticleStage`, retire `SphereBackground`
- `src/app/page.tsx`: the new chapter order
- `src/app/globals.css`: tokens and sky variables. Utilities only this work stops using get removed.
- `src/app/template.tsx`: CSS-only fade, no delay
- `src/components/smooth-scroll.tsx`: Lenis on the GSAP clock
- `hero.tsx`, `process-section.tsx`, `social-proof-strip.tsx`, `contact-section.tsx`, `footer-new.tsx`, `navbar-new.tsx` (themes, "Work", current section)
- `package.json`: add `gsap` (^3.15.0), `@gsap/react` (^2.1.2) and the `test` script
- `tsconfig.json` and `eslint.config.mjs`: exclude `archive/`, plus whatever the Node test runner needs (settled in plan task 1)

**Archived, not deleted** (repo rule: "Never delete a file. Move it aside and log it."): `story-section.tsx`, `services-section.tsx`, `testimonials-section.tsx`, `sphere-background.tsx`, `loading-screen.tsx`, and `ui/split-text.tsx` once nothing imports it. They move to `archive/2026-09-night-into-day/` and each move is logged in HANDOFF.

**Data flow:** scroll (Lenis) → ScrollTrigger progress per chapter → director → (a) stage uniforms and running flag, (b) `--sky-*` on the sky element, (c) `data-nav-theme` on the header. Section timelines (text fills, the site build, frame openings) are ScrollTrigger timelines local to each section.

## 10. Content

**Approved copy, reused verbatim:** the hero; the reality and fix sentences; the fix description; the service names and feature lines, and each service's full description (in the expanding rows); the process heading, sub, "problem" beat and the four steps; the four principles and their stats; the marquee items; the contact heading, sub, email line, facts and form; the footer tagline and columns.

**Draft copy, needs Waldo's approval:**
- Nav and footer: "Work"
- Work chapter: "Work you can visit." / "Live sites we designed and built around Hamilton. Go poke around." / project metas / "What we built", "What we do" / each project's two points
- Care card: "Care plan", "This month's check-in", "Hosting", "Updates", "Performance check"
- Sample site (clearly a sample): "Your Salon", "Your best hair day starts here.", "Cuts, colour and blowouts. Book online anytime.", "Book an appointment", "Next openings", chat lines
- Chapter labels: "01 / The reality" … "06 / Get started"

**Dropped from the homepage, needs Waldo's approval:**
- Story header: "Why we exist" / "Most business websites quietly underperform. Here's why."
- Story fact chips (Months / Template / Stuck, Slow / No button / Gone, Days / Mobile / Monthly)
- The reality title: "Every day without a great site costs you customers"
- Services header: "What we build" / "Websites, lead flow, and the stuff that keeps them working" and its one-journey sub
- Contact feature rows: "Quick Response", "No Commitment", "Transparent Pricing"

Draft copy follows the house voice: sentence case, no exclamation marks, one joke at most, no invented metrics or testimonials.

## 11. Performance budget

- **Baseline first.** Before any change, run `next build && next start` on `main` and take Lighthouse mobile ×3 (median), plus the homepage's first-load JS from the build output.
- **Additions.** GSAP, ScrollTrigger and SplitText add about 45 KB compressed, homepage only. Work captures are ≤ 350 KB each (WebP), lazy-loaded.
- **Offsets:**
  - one WebGL context instead of two
  - no `logo.png` fetch or canvas sampling at load
  - template fade without the hydration wait and 0.4 s delay
  - the stage asleep through the day
  - framer-motion removed from the rewritten homepage sections (it stays loaded for the nav)
- **Targets:** G4–G6 above. The intro keeps the load-time cost Waldo accepted on 2026-09-11, and the aim is not to add to it.

## 12. Accessibility and SEO

- One `h1` (hero) and an `h2` for every chapter; ordered lists for steps and principles; labelled nav landmarks; the form keeps real labels.
- All copy is in the server-rendered HTML, including the four principles and all four service descriptions. Nothing essential exists only after JavaScript runs.
- Tokens meet WCAG AA: 4.5:1 for body text and 3:1 for large type. The unfilled part of the fill sentence is a visual state only, since screen readers get the whole sentence.
- Pinned sections don't trap focus, and keyboard order follows reading order.
- The reduced-motion path is complete (G7).
- Anchors stay stable. The homepage metadata and JSON-LD stay as they are, since the 09-27 audit found them on-positioning.

## 13. Verification

1. **Baseline** (§11), recorded in the plan's log.
2. **Every phase:** lint, type-check, production build and unit tests (director mappings, shape generation and determinism).
3. **Frame captures** at 1440×900 and 390×844 at each chapter's key scroll positions, compared with the canvas frames.
4. **Reduced motion:** emulate it and confirm no pins, all content visible, and the sky set per section.
5. **Performance:** Lighthouse mobile ×3 on the branch against the baseline; a performance trace of a full scroll for long tasks; confirm the stage stops rendering in the day chapters.
6. **Browsers:** Chrome and Safari on the Mac, plus an iPhone-sized check (simulator or device).
7. **Waldo's review on a Vercel preview**, after he pushes the branch.

## 14. Rollout and process

- **Commits.** One or more per phase on `feat/night-into-day-2026-09`, with no `Co-Authored-By` lines (Waldo's preference). Paths are always staged explicitly; the untracked `AGENTS.md` isn't this project's.
- **Build order:**
  1. Foundation: fonts, tokens, engine, sky, nav themes, stage at parity
  2. Intro, hero and the reality
  3. Sunrise and the fix
  4. Selected work (captures and data)
  5. Process, how we work, marquee, dusk contact and footer
  6. Phones, reduced motion, the speed pass and verification
- **Claude never pushes.** Waldo pushes the branch for a Vercel preview, reviews it, and merges when G8 is met. Merging to `main` deploys production.
- **HANDOFF.** The IN FLIGHT claim was added on 2026-09-27. Archive moves are logged as they happen, and the claim is cleared with a log entry at the end.

## 15. Dependencies and open questions

| # | Item | Owner | Blocks |
|---|---|---|---|
| D1 | Confirm Pub 36, 100 Men and On The Snap are happy to be shown | Waldo | merge |
| D2 | Fix On The Snap's "(Copy)" tournament listing and stale March events (OnTheSnap repo) | separate task | On The Snap's `enabled` flag |
| D3 | Point `100menhamilton-wentworth.com` at the new build (Vercel domain / DNS) | Waldo | 100 Men's `linkEnabled` |
| Q1 | On The Snap: did Zaila build the site or only maintain it? Current draft: "We look after the site every month." | Waldo | its copy |
| Q2 | Discovery call length: the site says 20 minutes, ZailaOS booking says 30 | Waldo | process step 01 copy |
| Q3 | Approve the draft copy and the dropped copy (§10) | Waldo | merge |

## 16. Out of scope (noted, untouched)

- **The 09-27 audit's items:**
  - `/pricing` title and OG
  - legal-page canonicals and layouts
  - "Growth Plan" in `/terms`
  - the Local SEO post's 2.0 s claim
  - `/growth-stories` naming
  - `meta-keywords`
- Inner-page redesigns (project two), the chat widget's look, and a custom 404.
- Unused dependencies (`@splinetool/*`) and dead components (`page-transition.tsx`, `noise-overlay.tsx`): mentioned here, not removed.
