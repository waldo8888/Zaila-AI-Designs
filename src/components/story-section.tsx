"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const storyPoints = [
  {
    label: "The Problem",
    title: "Building a website shouldn't take months",
    description:
      "Traditional agencies are slow, expensive, and leave you with outdated technology. DIY tools look generic. You deserve better.",
    highlight: "months",
    stats: [
      { value: "3–6mo", label: "Avg. agency timeline" },
      { value: "$8K+", label: "Typical agency cost" },
      { value: "72%", label: "SMBs unhappy with site" },
    ],
    accent: "fuchsia",
  },
  {
    label: "The Reality",
    title: "Every day without a great site costs you customers",
    description:
      "Visitors bounce in seconds. Leads slip through the cracks. Your competition is already ahead.",
    highlight: "costs",
    stats: [
      { value: "53%", label: "Bounce if load > 3s" },
      { value: "88%", label: "Won't return after bad UX" },
      { value: "$0", label: "Revenue from lost leads" },
    ],
    accent: "violet",
  },
  {
    label: "The Solution",
    title: "AI-powered design that works while you don't",
    description:
      "We combine cutting-edge AI with human creativity to build sites that launch in days. Fast, beautiful, and built to convert.",
    highlight: "days",
    stats: [
      { value: "48hr", label: "Average launch time" },
      { value: "99%", label: "Performance score" },
      { value: "$0", label: "Contracts required" },
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
  scrollProgress: any;
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
          <h2 className="mb-8 text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
            {point.title.split(point.highlight).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="text-gradient">{point.highlight}</span>
                )}
              </span>
            ))}
          </h2>

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

        {/* Right - Stats panel */}
        <div className="hidden md:flex flex-col gap-4">
          {point.stats.map((stat, i) => (
            <div
              key={i}
              className={`glass-card rounded-2xl p-6 bg-gradient-to-br ${accent.split(" ").slice(0, 2).join(" ")} border ${accent.split(" ")[2]}`}
            >
              <div className={`text-[32px] font-bold leading-none mb-1 ${accent.split(" ").slice(-1)[0]}`}>
                {stat.value}
              </div>
              <div className="text-[13px] text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
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
  scrollProgress: any;
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
