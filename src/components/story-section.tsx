"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import { KineticHeading } from "@/components/ui/split-text";

const storyPoints = [
  {
    label: "The Problem",
    title: "Building a website shouldn't take months",
    description:
      "Most agencies quote a three-month timeline and a five-figure invoice. DIY builders get you live fast, but everything ends up looking like everyone else. Neither is a great deal.",
    highlight: "months",
    stats: [
      { value: "Months", label: "Typical agency timeline" },
      { value: "Template", label: "What DIY builders hand you" },
      { value: "Stuck", label: "Where most owners end up" },
    ],
    accent: "fuchsia",
  },
  {
    label: "The Reality",
    title: "Every day without a great site costs you customers",
    description:
      "Someone Googles you tonight, lands on a slow page with no way to book, and calls the next place on the list. You never hear about it. That's the leak we fix.",
    highlight: "costs",
    stats: [
      { value: "Slow", label: "They leave before it loads" },
      { value: "No button", label: "Nowhere to book or ask" },
      { value: "Gone", label: "Leads you never hear about" },
    ],
    accent: "violet",
  },
  {
    label: "The Solution",
    title: "A premium site, live in days",
    description:
      "We figure out what's actually losing you leads, then design and build for that. Booking, payments, and AI support come in when they earn their spot — not because our name has AI in it. (Long story.)",
    highlight: "days",
    stats: [
      { value: "Days", label: "Launch, not months" },
      { value: "Mobile", label: "First, built to convert" },
      { value: "Monthly", label: "Care plan, no lock-in" },
    ],
    accent: "emerald",
  },
];

export function StorySection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="story"
      ref={containerRef}
      className="relative"
      style={{ height: `${(storyPoints.length + 0.25) * 100}vh` }}
    >
      {/* Fixed content that changes based on scroll */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(120,50,200,0.06),transparent_70%)]" />

        <div className="relative z-10 w-full max-w-6xl px-6 md:px-12">
          {storyPoints.map((point, index) => (
            <StorySlide
              key={index}
              point={point}
              index={index}
              totalPoints={storyPoints.length}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Progress indicator */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {storyPoints.map((_, index) => (
            <ProgressDot
              key={index}
              index={index}
              totalPoints={storyPoints.length}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StorySlide({
  point,
  index,
  totalPoints,
  scrollProgress,
}: {
  point: (typeof storyPoints)[0];
  index: number;
  totalPoints: number;
  scrollProgress: MotionValue<number>;
}) {
  const segmentSize = 1 / (totalPoints + 0.25);
  const start = index * segmentSize;
  const end = (index + 1) * segmentSize;
  const exitEnd = Math.min((index + 1.3) * segmentSize, 1);

  const opacity = useTransform(
    scrollProgress,
    [start, start + segmentSize * 0.3, end, exitEnd],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollProgress,
    [start, start + segmentSize * 0.3, end, exitEnd],
    [100, 0, 0, -50]
  );

  const scale = useTransform(
    scrollProgress,
    [start, start + segmentSize * 0.3, end, exitEnd],
    [0.95, 1, 1, 0.98]
  );

  const accentMap: Record<string, string> = {
    fuchsia: "from-fuchsia-500/20 to-fuchsia-500/5 border-fuchsia-500/10 text-fuchsia-400",
    violet: "from-violet-500/20 to-violet-500/5 border-violet-500/10 text-violet-400",
    emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/10 text-emerald-400",
  };

  const accent = accentMap[point.accent] ?? accentMap.fuchsia;

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="absolute inset-0 flex items-center px-6"
    >
      <div className="w-full grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-center">
        {/* Left - Copy */}
        <div>
          {/* Label */}
          <motion.div className="mb-6 flex items-center gap-4">
            <span className="text-[11px] uppercase tracking-[0.3em] text-fuchsia-400/60">
              {point.label}
            </span>
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-fuchsia-500/30 to-transparent" />
          </motion.div>

          {/* Title */}
          <KineticHeading
            as="h2"
            className="mb-8 text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white"
          >
            {point.title.split(point.highlight).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="text-gradient">{point.highlight}</span>
                )}
              </span>
            ))}
          </KineticHeading>

          {/* Description */}
          <p className="max-w-xl text-[18px] leading-[1.8] text-zinc-400">
            {point.description}
          </p>

          {/* Mobile stats row */}
          <div className="flex md:hidden gap-4 mt-8">
            {point.stats.map((stat, i) => (
              <div key={i} className={`flex-1 rounded-xl p-3 bg-gradient-to-br ${accent.split(" ").slice(0, 2).join(" ")} border ${accent.split(" ")[2]} text-center`}>
                <div className={`text-[20px] font-bold leading-none mb-1 ${accent.split(" ").slice(-1)[0]}`}>
                  {stat.value}
                </div>
                <div className="text-[11px] text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Stats panel with clip-path reveals */}
        <div className="hidden md:flex flex-col gap-4">
          {point.stats.map((stat, i) => (
            <StoryStatCard
              key={i}
              stat={stat}
              index={i}
              slideOpacity={opacity}
              accent={accent}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function StoryStatCard({
  stat,
  index,
  slideOpacity,
  accent,
}: {
  stat: { value: string; label: string };
  index: number;
  slideOpacity: MotionValue<number>;
  accent: string;
}) {
  const clipPath = useTransform(
    slideOpacity,
    [0, 0.55, 1],
    [
      "inset(0 100% 0 0 round 16px)",
      "inset(0 100% 0 0 round 16px)",
      "inset(0 0% 0 0 round 16px)",
    ]
  );

  return (
    <motion.div
      style={{ clipPath, transitionDelay: `${index * 0.08}s` }}
      className={`glass-card rounded-2xl p-6 bg-gradient-to-br ${accent.split(" ").slice(0, 2).join(" ")} border ${accent.split(" ")[2]}`}
    >
      <div className={`text-[32px] font-bold leading-none mb-1 ${accent.split(" ").slice(-1)[0]}`}>
        {stat.value}
      </div>
      <div className="text-[13px] text-zinc-400">{stat.label}</div>
    </motion.div>
  );
}

function ProgressDot({
  index,
  totalPoints,
  scrollProgress,
}: {
  index: number;
  totalPoints: number;
  scrollProgress: MotionValue<number>;
}) {
  const segmentSize = 1 / (totalPoints + 0.25);
  const start = index * segmentSize;
  const end = (index + 1) * segmentSize;

  const isActive = useTransform(
    scrollProgress,
    [start, start + 0.01, end, end + 0.01],
    [0, 1, 1, 0]
  );

  const scale = useTransform(isActive, [0, 1], [1, 1.5]);
  const bgOpacity = useTransform(isActive, [0, 1], [0.2, 1]);

  return (
    <motion.div
      style={{ scale }}
      className="relative"
    >
      <motion.div
        style={{ opacity: bgOpacity }}
        className="h-2 w-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500"
      />
      <div className="absolute inset-0 h-2 w-2 rounded-full border border-white/20" />
    </motion.div>
  );
}
