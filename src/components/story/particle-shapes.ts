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

/**
 * Where the intro's particles start: a ring just outside the view, all in
 * front of the camera (z from -3 to 1.5), so none sweeps past the lens.
 */
export function generateScatter(count: number, inner: number, outer: number, rng: Rng): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = rng() * Math.PI * 2;
    const r = inner + rng() * (outer - inner);
    positions[i * 3] = r * Math.cos(angle);
    positions[i * 3 + 1] = r * Math.sin(angle);
    positions[i * 3 + 2] = rng() * 4.5 - 3;
  }
  return positions;
}

/**
 * Unpack the logo's precomputed points (scripts/sample-logo-points.py writes
 * them). Returns x,y pairs in -0.5 to 0.5, measured on the logo's longer
 * side, with y pointing up.
 */
export function decodeLogoPoints(base64: string): Float32Array {
  const bytes = atob(base64);
  const out = new Float32Array(bytes.length / 2);
  for (let i = 0; i < out.length; i++) {
    const value = bytes.charCodeAt(i * 2) | (bytes.charCodeAt(i * 2 + 1) << 8);
    out[i] = value / 65535 - 0.5;
  }
  return out;
}

/**
 * Targets that draw the logo, centred on the origin and facing the camera.
 * `points` comes from decodeLogoPoints; `size` is the logo's longer side in
 * world units. Extra particles reuse the points with a jitter of about half
 * the spacing between them, so the strokes fill in rather than doubling up.
 */
export function generateLogo(count: number, points: Float32Array, size: number, rng: Rng): Float32Array {
  const positions = new Float32Array(count * 3);
  const n = points.length / 2;
  const jitter = size * 0.008;
  for (let i = 0; i < count; i++) {
    const j = i % n;
    positions[i * 3] = points[j * 2] * size + (rng() - 0.5) * jitter;
    positions[i * 3 + 1] = points[j * 2 + 1] * size + (rng() - 0.5) * jitter;
    positions[i * 3 + 2] = (rng() - 0.5) * size * 0.05;
  }
  return positions;
}

/**
 * The leak (spec §5): four floats per particle. [0] is when it leaves, as a
 * share of the leak (0 to 0.75, or 2 for never); [1] and [2] are the height
 * and depth it exits at; [3] is how far past the right edge it drifts.
 */
export function generateLeak(count: number, fraction: number, rng: Rng): Float32Array {
  const values = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const leaves = rng() < fraction;
    values[i * 4] = leaves ? rng() * 0.75 : 2;
    values[i * 4 + 1] = (rng() - 0.5) * 3.2;
    values[i * 4 + 2] = (rng() - 0.5) * 2;
    values[i * 4 + 3] = rng() * 1.5;
  }
  return values;
}
