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
