/**
 * Route fade-in (spec §7). Pure CSS, so content paints at first paint
 * instead of waiting for JavaScript. The styles live in globals.css (.page-in).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
