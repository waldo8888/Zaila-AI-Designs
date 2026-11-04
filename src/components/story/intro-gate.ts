/**
 * The intro gate (spec §5). A tiny script, inlined in <head>, that runs before
 * first paint and decides whether this visit gets the intro. It writes the
 * answer to <html data-intro>, which the CSS and the particle stage read, so
 * React renders the same markup on the server and the client. That is what
 * ends the hydration mismatch the old loading screen caused on every reload.
 *
 * data-intro: "play" (curtain up) → "reveal" (curtain lifting) → "done".
 * "skip", or no attribute when scripts are off, means no intro.
 *
 * The intro plays once per session, and only when the session starts on the
 * homepage. Blocked storage and reduced motion skip it.
 */

/** sessionStorage key; the old loading screen used the same one. */
export const INTRO_SEEN_KEY = "zaila_site_visited";

/** If the stage hasn't started the intro by then, the curtain lifts anyway. */
export const INTRO_START_TIMEOUT_MS = 5000;

/** Hard backstop: the curtain never outlives this. */
export const INTRO_MAX_MS = 10000;

export const INTRO_GATE_SCRIPT = `(function(){var d=document.documentElement;try{var s=window.sessionStorage;var play=location.pathname==="/"&&!s.getItem("${INTRO_SEEN_KEY}")&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches;s.setItem("${INTRO_SEEN_KEY}","true");d.dataset.intro=play?"play":"skip";if(!play)return;setTimeout(function(){if(d.dataset.intro==="play"&&!window.__zailaIntroStarted)d.dataset.intro="done"},${INTRO_START_TIMEOUT_MS});setTimeout(function(){if(d.dataset.intro!=="done")d.dataset.intro="done"},${INTRO_MAX_MS})}catch(e){d.dataset.intro="skip"}})();`;
