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
