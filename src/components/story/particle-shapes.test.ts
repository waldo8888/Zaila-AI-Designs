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
