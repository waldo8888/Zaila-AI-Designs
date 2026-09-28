import { test } from "node:test";
import assert from "node:assert/strict";
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
