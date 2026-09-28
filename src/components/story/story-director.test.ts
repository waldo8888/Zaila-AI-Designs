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
