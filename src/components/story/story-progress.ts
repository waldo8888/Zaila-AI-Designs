/**
 * Chapter progress that the homepage's scroll scenes publish for the particle
 * stage (spec §9, data flow). A plain object the stage reads every frame, so
 * scrolling never re-renders React.
 */
export const storyProgress: {
  /** The reality chapter's fill (reality-section.tsx). */
  reality: number;
  /** 0 → 1 as the fix arrives, from its top at the bottom of the screen to its pin (fix-scenes.tsx). */
  sunrise: number;
  /** 0 → 1 as the sky turns back to night (interim-dusk.tsx until plan 5). */
  dusk: number;
  /** The sample site's browser frame, where the particles land (fix-scenes.tsx). */
  landingTarget: HTMLElement | null;
} = { reality: 0, sunrise: 0, dusk: 0, landingTarget: null };
