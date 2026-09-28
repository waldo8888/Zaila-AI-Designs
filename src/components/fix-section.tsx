import Link from "next/link";
import { SampleSite } from "@/components/sample-site";

/** The four services, in build order. Approved copy, moved from the old services section. */
const SERVICES = [
  {
    name: "Websites",
    features: ["Custom design", "Mobile-first", "Fast loads", "SEO basics done"],
    description:
      "Premium, mobile-first sites that load fast and make you look like the obvious choice. Built on Next.js, hosted on the edge, designed to get a visitor to actually do something.",
  },
  {
    name: "Lead systems",
    features: ["Online booking", "Quote & contact forms", "Payments & deposits", "Calendar sync"],
    description:
      "Booking, quote forms, deposits, and checkout — so a visitor can book a table, request a quote, or pay without emailing you first and waiting.",
  },
  {
    name: "AI & automation",
    features: ["Lead capture", "FAQ handling", "Booking handoff", "Trained on your business"],
    description:
      "An assistant that answers the questions you're tired of answering, captures the lead, and books the call. We add it when it actually helps — not as decoration.",
  },
  {
    name: "Care plans",
    features: ["Managed hosting", "Monthly change time", "Performance checks", "SEO monitoring"],
    description:
      "Hosting, updates, and a human who checks on your site every month. A website is like a houseplant — fine in week one, quietly dying by month nine unless someone's watering it.",
  },
];

/**
 * 02 The fix (spec §5): what we build. The server HTML is the finished state,
 * every service open and the sample site fully built, so it reads in full
 * without JavaScript or with reduced motion. Styles: globals.css, "02 The fix".
 */
export function FixSection() {
  return (
    <section id="services" aria-labelledby="fix-title" className="relative bg-day text-day-text">
      <div className="fix-stage mx-auto flex w-full max-w-[1440px] flex-col px-5 py-20 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:content-center lg:items-center lg:gap-[60px] lg:px-20 lg:py-32">
        {/* On phones this column dissolves so the pricing link can follow the site, as in the phone frame */}
        <div className="max-lg:contents">
          <p className="text-xs text-day-muted lg:text-label">02 / The fix</p>
          <h2
            id="fix-title"
            className="mt-2.5 font-display text-[38px] leading-[0.98] font-extrabold tracking-[-0.045em] lg:mt-4 lg:text-[length:clamp(2.5rem,min(4.45vw,7.2vh),4rem)] lg:leading-[0.96]"
          >
            A premium site,{" "}
            <br className="max-lg:hidden" />
            live in days.
          </h2>
          <p className="max-lg:sr-only lg:mt-5 lg:text-base lg:leading-[1.65] lg:text-day-muted">
            We figure out what&apos;s actually losing you leads, then design and build for that.
            Booking, payments, and AI support come in when they earn their spot — not because our
            name has AI in it. (Long story.)
          </p>
          <ol className="mt-4 flex flex-wrap gap-2 lg:mt-6 lg:flex-col lg:flex-nowrap lg:gap-1">
            {SERVICES.map((service, i) => (
              <li key={service.name} className="fix-step" data-state="open">
                <span className="fix-step-badge" aria-hidden="true">
                  <svg
                    className="fix-step-check"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12.5l5 5L20 7" />
                  </svg>
                  <span className="fix-step-num">{`0${i + 1}`}</span>
                </span>
                <div className="fix-step-body">
                  <h3 className="fix-step-name">{service.name}</h3>
                  <p className="fix-step-features">{service.features.join(" · ")}</p>
                  <div className="fix-step-more">
                    <div>
                      <p>{service.description}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <Link
            href="/pricing"
            className="mt-6 inline-block self-start text-sm font-semibold text-brand-ink transition-colors hover:text-brand max-lg:order-2 lg:mt-6 lg:text-[15px]"
          >
            See pricing — builds from $800 →
          </Link>
          <p className="max-lg:sr-only lg:mt-2 lg:text-sm lg:text-day-dim">
            Not sure which tier? Book the discovery call. We&apos;ll tell you if you&apos;re
            overbuying.
          </p>
        </div>
        <div className="mt-8 max-lg:order-1 lg:mt-0">
          <SampleSite />
        </div>
      </div>
    </section>
  );
}
