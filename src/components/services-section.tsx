"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const services = [
  {
    num: "01",
    title: "Websites",
    description:
      "Premium, mobile-first sites that load fast and make you look like the obvious choice. Built on Next.js, hosted on the edge, designed to get a visitor to actually do something.",
    features: ["Custom design", "Mobile-first", "Fast loads", "SEO basics done"],
    gradient: "from-fuchsia-500/20 to-violet-500/20",
    iconColor: "text-fuchsia-400",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Lead systems",
    description:
      "Booking, quote forms, deposits, and checkout — so a visitor can book a table, request a quote, or pay without emailing you first and waiting.",
    features: ["Online booking", "Quote & contact forms", "Payments & deposits", "Calendar sync"],
    gradient: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-400",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h.01" />
        <path d="M12 10h.01" />
        <path d="M16 10h.01" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "AI & automation",
    description:
      "An assistant that answers the questions you're tired of answering, captures the lead, and books the call. We add it when it actually helps — not as decoration.",
    features: ["Lead capture", "FAQ handling", "Booking handoff", "Trained on your business"],
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Care plans",
    description:
      "Hosting, updates, and a human who checks on your site every month. A website is like a houseplant — fine in week one, quietly dying by month nine unless someone's watering it.",
    features: ["Managed hosting", "Monthly change time", "Performance checks", "SEO monitoring"],
    gradient: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-400",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 20l5-5 4 4 9-11" />
        <path d="M17 8h4v4" />
      </svg>
    ),
  },
];

const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

/**
 * What we build — plain 2x2 grid.
 * Replaced the pinned horizontal-scroll track (4 screens of scroll before pricing).
 */
export function ServicesSection() {
  return (
    <section id="services" className="relative py-24 md:py-32 px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(120,50,200,0.04),transparent_60%)]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <motion.div {...reveal} transition={{ duration: 0.6 }} className="max-w-2xl mb-14 md:mb-20">
          <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 mb-4">
            What we build
          </p>
          <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
            Websites, lead flow, and the stuff that{" "}
            <span className="text-gradient">keeps them working</span>
          </h2>
          <p className="mt-5 text-[17px] leading-[1.8] text-zinc-400">
            One journey: we build the site, keep it running, and add booking, payments, or AI only where it moves the needle.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service, index) => (
            <motion.article
              key={service.num}
              {...reveal}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              data-cursor="view"
              className="glass-card glass-card-interactive rounded-3xl p-7 md:p-9 relative overflow-hidden transition-transform duration-300"
            >
              <div className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${service.gradient} blur-3xl opacity-60`} />

              <div className="relative">
                <div className="mb-6 flex items-start justify-between">
                  <span className={`${service.iconColor} opacity-90`}>{service.icon}</span>
                  <span className="text-[12px] font-medium tracking-[0.2em] text-zinc-500">{service.num}</span>
                </div>

                <h3 className="text-[clamp(1.5rem,2.5vw,2rem)] font-semibold text-white tracking-[-0.02em] mb-4">
                  {service.title}
                </h3>
                <p className="text-[16px] leading-[1.8] text-zinc-400 mb-7">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full bg-white/[0.03] border border-white/[0.06] px-3.5 py-1.5 text-[12px] font-medium text-zinc-400"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div {...reveal} transition={{ duration: 0.6, delay: 0.2 }} className="mt-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-white/5"
          >
            See pricing — builds from $800
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <p className="text-[14px] text-zinc-500">
            Not sure which tier? Book the discovery call. We&apos;ll tell you if you&apos;re overbuying.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
