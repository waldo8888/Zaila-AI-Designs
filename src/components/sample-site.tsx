const check = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 12.5l5 5L20 7" />
  </svg>
);

/**
 * The made-up salon site that builds itself in 02 The fix (spec §5). It's
 * plainly a sample: a placeholder domain and a labelled photo placeholder.
 * data-build says how far the build has got: "all" in the server HTML, then
 * 1 to 4 while the chapter plays (fix-scenes.tsx). Its typeface, Fraunces, is
 * defined in layout.tsx. Styles: globals.css, "The sample salon site".
 */
export function SampleSite() {
  return (
    <figure
      className="fix-frame-wrap"
      data-build="all"
      role="img"
      aria-label="A sample site for a made-up salon, built one service at a time: the page, then a booking button and next openings, then a chat reply offering a time, then a monthly care plan check-in."
    >
      <div className="fix-frame">
        <div className="ss-chrome">
          <span className="ss-dot" />
          <span className="ss-dot" />
          <span className="ss-dot" />
          <span className="ss-url">yourbusiness.ca</span>
        </div>
        <div className="ss-page">
          <div className="ss-nav">
            <span className="ss-brand">Your Salon</span>
            <span className="ss-link">Services</span>
            <span className="ss-link">Prices</span>
            <span className="ss-link">Visit</span>
            <span className="ss-book ss-2">
              <span>Book now</span>
            </span>
          </div>
          <div className="ss-hero">
            <div>
              <p className="ss-headline">Your best hair day starts here.</p>
              <p className="ss-sub">Cuts, colour and blowouts. Book online anytime.</p>
              <span className="ss-cta ss-2">
                <span>Book an appointment</span>
              </span>
            </div>
            <div className="ss-photo">
              <span className="ss-photo-label">[Salon photo]</span>
              <div className="ss-chat ss-3">
                <span className="ss-bubble">Hi, any openings Saturday?</span>
                <span className="ss-bubble ss-reply">Yes, 10:30 or 1:15. Want me to book one?</span>
              </div>
            </div>
          </div>
          <div className="ss-openings ss-2">
            <span className="ss-openings-label">Next openings</span>
            <span className="ss-slot">Sat 10:30</span>
            <span className="ss-slot">Sat 1:15</span>
            <span className="ss-slot ss-slot-picked">Sun 11:00</span>
          </div>
        </div>
      </div>
      <div className="ss-care ss-4">
        <p className="ss-care-kicker">
          <span className="ss-care-dot" />
          Care plan
        </p>
        <p className="ss-care-title">This month&apos;s check-in</p>
        <ul className="ss-care-list">
          <li>{check}Hosting</li>
          <li>{check}Updates</li>
          <li>{check}Performance check</li>
        </ul>
      </div>
    </figure>
  );
}
