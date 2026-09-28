/**
 * Sky colours for the night → day → dusk story (spec §6).
 * Pure functions, so the story director can be unit tested under Node.
 */

export type Stop = { at: number; color: string };

export const NIGHT = "#07060B";
export const DAY = "#F1F3F7";

const evenly = (colors: string[]): Stop[] =>
  colors.map((color, i) => ({ at: i / (colors.length - 1), color }));

export const SUNRISE: Stop[] = evenly([
  "#07060B",
  "#140C26",
  "#2F2158",
  "#6B59A8",
  "#B8AADD",
  "#E6E0F4",
  "#F1F3F7",
]);

export const DUSK: Stop[] = evenly([
  "#F1F3F7",
  "#E4DDF3",
  "#A99AD8",
  "#4E3E8E",
  "#24184A",
  "#110B20",
  "#07060B",
]);

export function clamp01(t: number): number {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

export function hexToRgb(hex: string): [number, number, number] {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) throw new Error(`Expected a #RRGGBB colour, got ${hex}`);
  const n = parseInt(match[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex([r, g, b]: [number, number, number]): string {
  const channel = (v: number) =>
    Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`.toUpperCase();
}

export function mixHex(a: string, b: string, t: number): string {
  const k = clamp01(t);
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex([ar + (br - ar) * k, ag + (bg - ag) * k, ab + (bb - ab) * k]);
}

/** The colour at position t (0..1) along stops sorted by `at`. */
export function sampleStops(stops: Stop[], t: number): string {
  const k = clamp01(t);
  for (let i = 1; i < stops.length; i++) {
    const previous = stops[i - 1];
    const next = stops[i];
    if (k <= next.at) {
      const span = next.at - previous.at;
      return mixHex(previous.color, next.color, span === 0 ? 1 : (k - previous.at) / span);
    }
  }
  return stops[stops.length - 1].color.toUpperCase();
}

/** WCAG relative luminance of a #RRGGBB colour: 0 for black to 1 for white. */
export function luminance(hex: string): number {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}
