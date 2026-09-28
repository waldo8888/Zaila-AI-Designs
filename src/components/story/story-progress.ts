/**
 * Chapter progress that the homepage's scroll scenes publish for the particle
 * stage (spec §9, data flow). A plain object the stage reads every frame, so
 * scrolling never re-renders React. Each chapter writes its own 0 → 1 value.
 */
export const storyProgress = {
  /** The reality chapter's fill (reality-section.tsx). */
  reality: 0,
};
