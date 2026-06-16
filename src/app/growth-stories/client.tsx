"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

interface Principle {
  title: string;
  summary: string;
  body: string;
  points: string[];
  color: "fuchsia" | "violet" | "cyan" | "emerald";
}

interface ColorMap {
  [key: string]: {
    gradient: string;
    border: string;
    text: string;
    bg: string;
    glow: string;
    dot: string;
  };
}

// --- 3D tilt step-number card ---
function TiltStepCard({
  index,
  colorText,
  colorBorder,
  colorGradient,
}: {
  index: number;
  colorText: string;
  colorBorder: string;
  colorGradient: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  function handleMouse(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border ${colorBorder} bg-gradient-to-br ${colorGradient} cursor-default will-change-transform`}
    >
      <span className={`text-2xl font-bold ${colorText} leading-none`}>
        {String(index + 1).padStart(2, "0")}
      </span>
    </motion.div>
  );
}

// --- Staggered list items ---
function StaggeredListItem({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
      className="flex items-start gap-3 text-sm"
    >
      {children}
    </motion.li>
  );
}

// --- Principle card ---
function PrincipleCard({
  principle,
  colors,
  index,
}: {
  principle: Principle;
  colors: ColorMap[string];
  index: number;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Parallax the glow orb
  const glowY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const glowX = useTransform(
    scrollYProgress,
    [0, 1],
    index % 2 === 0 ? [-20, 20] : [20, -20]
  );

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.1, 0, 1],
      }}
      className="relative rounded-3xl border border-white/[0.06] bg-white/[0.015] overflow-hidden"
    >
      {/* Animated gradient border shimmer */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-700">
        <div
          className="absolute inset-[-1px] rounded-3xl"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, rgba(168,85,247,0.15), transparent, rgba(232,121,249,0.15), transparent)",
            animation: "spin 8s linear infinite",
          }}
        />
      </div>

      {/* Parallax ambient glow */}
      <motion.div
        style={{ y: glowY, x: glowX }}
        className={`pointer-events-none absolute -top-24 ${
          index % 2 === 0 ? "-left-24" : "-right-24"
        } h-[350px] w-[350px] rounded-full ${colors.glow} blur-[120px] opacity-70`}
      />

      <div className="relative p-8 md:p-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="flex items-center gap-5 mb-8"
        >
          <TiltStepCard
            index={index}
            colorText={colors.text}
            colorBorder={colors.border}
            colorGradient={colors.gradient}
          />
          <div>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className={`inline-block rounded-full ${colors.bg} ${colors.text} px-3 py-1 text-xs font-medium uppercase tracking-wider mb-2`}
            >
              Step {String(index + 1).padStart(2, "0")}
            </motion.span>
            <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              {principle.title}
            </h3>
          </div>
        </motion.div>

        {/* Summary line with animated border */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="relative text-lg md:text-xl font-light text-zinc-300 leading-relaxed pl-6 mb-8"
        >
          {/* Animated accent bar */}
          <motion.span
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
            className={`absolute left-0 top-0 w-[2px] bg-gradient-to-b ${colors.gradient} rounded-full`}
          />
          {principle.summary}
        </motion.p>

        {/* Body + points */}
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-6 md:gap-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-[15px] leading-relaxed text-zinc-400"
          >
            {principle.body}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={`rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.gradient} p-6`}
          >
            <h4
              className={`text-xs font-medium uppercase tracking-wider ${colors.text} mb-4`}
            >
              What that means for you
            </h4>
            <ul className="space-y-3">
              {principle.points.map((item, i) => (
                <StaggeredListItem key={item} delay={0.5 + i * 0.08}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className={`mt-0.5 shrink-0 ${colors.text}`}
                  >
                    <path
                      d="M3 8L6.5 11.5L13 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-zinc-200">{item}</span>
                </StaggeredListItem>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

// --- Main client component ---
export function GrowthStoriesClient({
  principles,
  colorMap,
}: {
  principles: Principle[];
  colorMap: ColorMap;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Vertical progress line height
  const timelineHeight = useSpring(
    useTransform(scrollYProgress, [0.05, 0.95], ["0%", "100%"]),
    { stiffness: 100, damping: 30 }
  );

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-6xl px-6 pt-28 pb-20">
      {/* Animated page header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
      >
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-fuchsia-400">
          How we work
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          A simple way to build a site that{" "}
          <span className="text-gradient-animated">actually works</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          No mystery, no three-month timeline. Here&rsquo;s exactly how we take you
          from first conversation to a live site that earns its keep.
        </p>
      </motion.div>

      {/* The four principles with vertical timeline */}
      <div className="relative mt-20">
        {/* Vertical progress timeline */}
        <div
          ref={timelineRef}
          className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2 hidden md:block"
        >
          {/* Track */}
          <div className="absolute inset-0 bg-white/[0.04] rounded-full" />
          {/* Animated fill */}
          <motion.div
            style={{ height: timelineHeight }}
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-fuchsia-500/60 via-violet-500/60 to-cyan-500/60 rounded-full"
          />

          {/* Node dots for each step */}
          {principles.map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
              className="absolute left-1/2 -translate-x-1/2 h-3 w-3 rounded-full border-2 border-white/20 bg-black"
              style={{ top: `${(i / (principles.length - 1)) * 100}%` }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring" }}
                className="absolute inset-[2px] rounded-full bg-gradient-to-br from-fuchsia-400 to-violet-400"
              />
            </motion.div>
          ))}
        </div>

        <div className="space-y-20 md:pl-0">
          {principles.map((principle, index) => (
            <PrincipleCard
              key={principle.title}
              principle={principle}
              colors={colorMap[principle.color]}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA — animated gradient border */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
        className="relative mt-24 group"
      >
        {/* Spinning gradient border */}
        <div className="absolute -inset-[1px] rounded-3xl overflow-hidden">
          <div
            className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-700"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, #e879f9 25%, transparent 50%, #a78bfa 75%, transparent 100%)",
              animation: "spin 6s linear infinite",
            }}
          />
        </div>

        <div className="relative rounded-3xl bg-gradient-to-br from-[#12001f] via-black to-black p-10 md:p-14 overflow-hidden text-center">
          <div className="pointer-events-none absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full bg-fuchsia-500/10 blur-[80px]" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-[300px] w-[300px] rounded-full bg-violet-500/10 blur-[80px]" />
          <div className="relative">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-2xl md:text-3xl font-semibold text-white"
            >
              Want to see what this looks like for your business?
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-4 max-w-xl mx-auto text-zinc-400"
            >
              Start with a short, no-pressure conversation. We&rsquo;ll tell you
              what we&rsquo;d build and what it would take — before you commit to
              anything.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Link
                href="/contact"
                className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)] hover:scale-[1.03] active:scale-[0.98]"
              >
                Start your project
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
