/**
 * The page's backdrop (spec §4 and §8). The story director scrubs
 * --sky-top, --sky-bottom and --sky-glow on <html> in later plans;
 * until then the defaults in globals.css paint tonight's sky.
 */
export function Sky() {
  return <div aria-hidden="true" className="sky" />;
}
