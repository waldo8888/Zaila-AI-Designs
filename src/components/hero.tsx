import Link from "next/link";
import { HamiltonTime } from "@/components/ui/hamilton-time";
import { ScrollLink } from "@/components/ui/scroll-link";

/**
 * Screen 1, at night (spec §5). The orb behind the end of the headline is the
 * particle stage. The entrance is CSS only (globals.css, "Hero entrance"): it
 * plays at first paint, or as the intro's curtain lifts.
 */
export function Hero() {
  return (
    <section className="hero relative flex min-h-svh flex-col">
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 items-end px-5 pb-28 pt-24 lg:items-center lg:px-20 lg:pb-24">
        <div className="max-w-[1060px]">
          <h1 className="font-display text-hero font-extrabold text-night-text">
            <span className="hero-line">
              <span>Premium websites for</span>
            </span>{" "}
            <span className="hero-line">
              <span>service businesses that</span>
            </span>{" "}
            <span className="hero-line">
              <span>
                want <span className="text-brand-glow">more leads.</span>
              </span>
            </span>
          </h1>
          <p className="hero-fade mt-5 max-w-[520px] text-[15px] leading-[1.6] text-night-muted lg:mt-9 lg:text-lg">
            Zaila designs and builds fast, modern websites with optional booking, payments, and
            AI support — so your business looks credible and works harder online. Live in days,
            not months.
          </p>
          <div className="hero-fade hero-fade-late mt-[26px] flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7 lg:mt-11">
            <ScrollLink
              to="contact"
              className="inline-flex h-[52px] items-center justify-center rounded-full bg-night-text px-8 text-base font-semibold text-night transition-colors hover:bg-white lg:h-14"
            >
              Start Your Project
            </ScrollLink>
            <Link
              href="/pricing"
              className="text-center text-sm text-night-muted transition-colors hover:text-night-text lg:text-[15px]"
            >
              <span className="sm:hidden">See pricing — from $800 →</span>
              <span className="hidden sm:inline">
                See pricing — builds from $800, care from $69/mo →
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-fade hero-fade-late absolute inset-x-0 bottom-5 lg:bottom-[30px]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] items-center px-5 text-xs text-night-dim lg:grid-cols-[1fr_auto_1fr] lg:px-20 lg:text-[13px] lg:tracking-[0.02em]">
          {/* Starts past the chat launcher (chat-widget.tsx: 80px wide, 24px from the left) */}
          <span className="pl-[100px] lg:pl-12">
            Hamilton, ON
            <HamiltonTime />
          </span>
          <ScrollLink to="story" className="hidden transition-colors hover:text-night-text lg:block">
            (Scroll)
          </ScrollLink>
          <span className="inline-flex items-center gap-2 justify-self-end">
            <span aria-hidden="true" className="size-[7px] rounded-full bg-[#34D399]" />
            <span className="lg:hidden">Available</span>
            <span className="hidden lg:inline">Available for new projects</span>
          </span>
        </div>
      </div>
    </section>
  );
}
