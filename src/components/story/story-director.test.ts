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
