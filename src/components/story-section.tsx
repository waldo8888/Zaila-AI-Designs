"use client";

import { motion } from "framer-motion";

/**
 * Why most business websites underperform — three short beats.
 * Plain scrolling section (replaced the 3.25-screen pinned scroll-jack).
 * Facts only — no invented statistics.
 */
const storyPoints = [
  {
    label: "The problem",
    title: "Building a website shouldn't take months",
    description:
      "Most agencies quote a three-month timeline and a five-figure invoice. DIY builders get you live fast, but everything ends up looking like everyone else. Neither is a great deal.",
    facts: [
      { value: "Months", label: "Typical agency timeline" },
      { value: "Template", label: "What DIY builders hand you" },
      { value: "Stuck", label: "Where most owners end up" },
    ],
    accent: "text-fuchsia-400",
    ring: "from-fuchsia-500/20 to-fuchsia-500/5 border-fuchsia-500/10",
  },
  {
    label: "The reality",
    title: "Every day without a great site costs you customers",
    description:
      "Someone Googles you tonight, lands on a slow page with no way to book, and calls the next place on the list. You never hear about it. That's the leak we fix.",
    facts: [
      { value: "Slow", label: "They leave before it loads" },
      { value: "No button", label: "Nowhere to book or ask" },
      { value: "Gone", label: "Leads you never hear about" },
    ],
    accent: "text-violet-400",
    ring: "from-violet-500/20 to-violet-500/5 border-violet-500/10",
  },
  {
    label: "The fix",
    title: "A premium site, live in days",
    description:
      "We figure out what's actually losing you leads, then design and build for that. Booking, payments, and AI support come in when they earn their spot — not because our name has AI in it. (Long story.)",
    facts: [
      { value: "Days", label: "Launch, not months" },
      { value: "Mobile", label: "First, built to convert" },
      { value: "Monthly", label: "Care plan, no lock-in" },
    ],
    accent: "text-emerald-400",
    ring: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/10",
  },
];

const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

export function StorySection() {
  return (
    <section id="story" className="relative py-24 md:py-32 px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_30%,rgba(120,50,200,0.06),transparent_70%)]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <motion.div {...reveal} transition={{ duration: 0.6 }} className="max-w-2xl mb-14 md:mb-20">
          <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 mb-4">
            Why we exist
          </p>
          <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
            Most business websites quietly{" "}
            <span className="text-gradient">underperform</span>. Here&apos;s why.
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {storyPoints.map((point, index) => (
            <motion.article
              key={point.label}
              {...reveal}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              className="glass-card rounded-3xl p-7 md:p-8 flex flex-col"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className={`text-[11px] uppercase tracking-[0.3em] ${point.accent}`}>
                  {point.label}
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              <h3 className="text-[22px] md:text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-white mb-4">
                {point.title}
              </h3>

              <p className="text-[15px] leading-[1.75] text-zinc-400 mb-8 flex-1">
                {point.description}
              </p>

              <ul className="grid gap-2">
                {point.facts.map((fact) => (
                  <li
                    key={fact.label}
                    className={`flex items-baseline justify-between gap-4 rounded-xl border bg-gradient-to-br ${point.ring} px-4 py-3`}
                  >
                    <span className={`text-[15px] font-semibold ${point.accent}`}>{fact.value}</span>
                    <span className="text-[12px] text-zinc-400 text-right">{fact.label}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
