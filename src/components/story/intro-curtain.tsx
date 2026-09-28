/**
 * The intro's night curtain (spec §5). It covers the page while the particle
 * stage draws the logo above it. <html data-intro> shows, lifts and removes it
 * (see intro-gate.ts and globals.css), so it needs no JavaScript of its own.
 */
export function IntroCurtain() {
  return <div aria-hidden="true" className="intro-curtain" />;
}
