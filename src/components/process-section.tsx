"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    num: "01",
    title: "Discovery",
    subtitle: "Day 1",
    description:
      "We learn your business, goals, and must-have features in a quick 20-minute call. No commitment required.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Build Sprint",
    subtitle: "Days 2-3",
    description:
      "We design and build your site with an AI-assisted workflow. Fast iterations, clean code, constant feedback.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Launch",
    subtitle: "Day 4",
    description:
      "Your site goes live on Vercel with blazing performance, custom domain, SSL, and analytics — all set up.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v20" />
        <path d="M17 5l-5-3-5 3" />
        <path d="M17 9l-5-3-5 3" />
        <path d="M17 13l-5-3-5 3" />
        <path d="M17 17l-5-3-5 3" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Grow",
    subtitle: "Ongoing",
    description:
      "Monthly updates, AI improvements, and performance tuning through your growth plan. Your site evolves with you.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 20l5-5 4 4 9-11" />
        <path d="M17 8h4v4" />
      </svg>
    ),
  },
];

export function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineProgress = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  return (
    <section
      id="process"
      ref={containerRef}
      className="relative py-32 md:py-48 px-6"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(120,50,200,0.06),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-24 md:mb-32">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 mb-6"
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(2rem,5vw,4rem)] font-semibold text-white tracking-[-0.03em] mb-6"
          >
            Idea to launch in <span className="text-gradient">days</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto text-[17px] leading-[1.8] text-zinc-400"
          >
            A streamlined process powered by AI that gets you from concept to launch faster than you thought possible.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Animated timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px">
            <div className="h-full w-full bg-white/[0.05]" />
            <motion.div
              style={{ scaleY: lineProgress }}
              className="absolute top-0 left-0 w-full h-full origin-top bg-gradient-to-b from-fuchsia-500 to-violet-500"
            />
          </div>

          {/* Steps */}
          <div className="space-y-24 md:space-y-32">
            {steps.map((step, index) => (
              <TimelineStep
                key={step.num}
                step={step}
                index={index}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineStep({
  step,
  index,
  isLeft,
}: {
  step: (typeof steps)[0];
  index: number;
  isLeft: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.1, 0, 1] }}
      className={`relative grid md:grid-cols-2 gap-8 md:gap-16 ${
        isLeft ? "" : "md:text-right"
      }`}
    >
      {/* Timeline node */}
      <div className="absolute left-8 md:left-1/2 top-0 -translate-x-1/2 z-10">
        <div className="relative">
          <div className="h-4 w-4 rounded-full bg-black border-2 border-fuchsia-500/50" />
          <div className="absolute inset-0 h-4 w-4 rounded-full bg-fuchsia-500/30 animate-ping" />
        </div>
      </div>

      {/* Content - Left side for even indices */}
      <div
        className={`pl-20 md:pl-0 ${
          isLeft ? "md:pr-16 md:text-right" : "md:order-2 md:pl-16 md:text-left"
        }`}
      >
        {/* Mobile icon */}
        <div className="md:hidden mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/10 to-violet-500/10 border border-white/[0.05] text-zinc-400">
          {step.icon}
        </div>
        <div
          className={`inline-flex items-center gap-4 mb-4 ${
            isLeft ? "md:flex-row-reverse" : ""
          }`}
        >
          <span className="text-[48px] md:text-[64px] font-bold text-white/[0.04] leading-none">
            {step.num}
          </span>
          <span className="text-[12px] font-medium text-fuchsia-400/60 uppercase tracking-wider">
            {step.subtitle}
          </span>
        </div>
        <h3 className="text-[24px] md:text-[32px] font-semibold text-white tracking-[-0.02em] mb-4">
          {step.title}
        </h3>
        <p className="text-[16px] leading-[1.8] text-zinc-400 max-w-md inline-block">
          {step.description}
        </p>
      </div>

      {/* Icon - Right side for even indices */}
      <div
        className={`hidden md:flex items-center ${
          isLeft ? "md:order-2 justify-start pl-16" : "justify-end pr-16"
        }`}
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative glass-card glass-card-interactive rounded-2xl p-8 text-zinc-400 group-hover:text-fuchsia-400 transition-colors duration-500">
            {step.icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
