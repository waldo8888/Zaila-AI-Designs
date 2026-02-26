"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
} from "framer-motion";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

interface CaseStudy {
  client: string;
  industry: string;
  quote: string;
  person: string;
  role: string;
  stats: { label: string; value: string; detail: string }[];
  before: string[];
  after: string[];
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

// --- Animated number counter ---
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayed, setDisplayed] = useState(value);

  const prefix = value.match(/^[^0-9]+/)?.[0] ?? "";
  const cleanValue = prefix ? value.slice(prefix.length) : value;
  const cleanNum = cleanValue.match(/^(\d+)/);
  const finalNum = cleanNum ? parseInt(cleanNum[1], 10) : null;
  const finalSuffix = cleanNum ? cleanValue.slice(cleanNum[1].length) : cleanValue;

  useEffect(() => {
    if (!isInView || finalNum === null) return;
    const duration = 1200;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * finalNum!);
      setDisplayed(`${prefix}${current}${finalSuffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [isInView, finalNum, prefix, finalSuffix]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1] }}
      whileHover={{ scale: 1.04, y: -2 }}
      className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center overflow-hidden transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
    >
      {/* Shine sweep on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.03)_45%,rgba(255,255,255,0.06)_50%,rgba(255,255,255,0.03)_55%,transparent_60%)] bg-[length:200%_100%] group-hover:animate-[shine_1.5s_ease-in-out]" />
      <div className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
        {displayed}
      </div>
      <div className="mt-1 text-xs text-zinc-500 uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
}

// --- 3D tilt stat card ---
function TiltStatCard({
  stat,
  colorText,
  delay,
}: {
  stat: { value: string; label: string; detail: string };
  colorText: string;
  delay: number;
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 cursor-default will-change-transform"
    >
      <div className={`text-3xl font-bold ${colorText} leading-none mb-1`}>
        {stat.value}
      </div>
      <div className="text-sm font-medium text-white mb-0.5">{stat.label}</div>
      <div className="text-xs text-zinc-500">{stat.detail}</div>
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

// --- Case study card ---
function CaseStudyCard({
  study,
  colors,
  index,
}: {
  study: CaseStudy;
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
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10"
        >
          <div>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className={`inline-block rounded-full ${colors.bg} ${colors.text} px-3 py-1 text-xs font-medium uppercase tracking-wider mb-3`}
            >
              {study.industry}
            </motion.span>
            <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              {study.client}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className={`h-10 w-10 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center border ${colors.border}`}
            >
              <span className="text-sm font-semibold text-white">
                {study.person.charAt(0)}
              </span>
            </motion.div>
            <div>
              <p className="text-sm font-medium text-white">{study.person}</p>
              <p className="text-xs text-zinc-400">
                {study.role}, {study.client}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quote with animated border */}
        <motion.blockquote
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="relative text-lg md:text-xl font-light text-zinc-300 leading-relaxed pl-6 mb-10"
        >
          {/* Animated quote bar */}
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
            className={`absolute left-0 top-0 w-[2px] bg-gradient-to-b ${colors.gradient} rounded-full`}
          />
          &ldquo;{study.quote}&rdquo;
        </motion.blockquote>

        {/* Stats row — 3D tilt cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {study.stats.map((stat, i) => (
            <TiltStatCard
              key={stat.label}
              stat={stat}
              colorText={colors.text}
              delay={0.3 + i * 0.1}
            />
          ))}
        </div>

        {/* Before / After with staggered list reveals */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
          >
            <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-4">
              Before Zaila
            </h4>
            <ul className="space-y-3">
              {study.before.map((item, i) => (
                <StaggeredListItem key={item} delay={0.5 + i * 0.08}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="mt-0.5 shrink-0 text-zinc-600"
                  >
                    <path
                      d="M4 4L12 12M12 4L4 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-zinc-400">{item}</span>
                </StaggeredListItem>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className={`rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.gradient} p-6`}
          >
            <h4
              className={`text-xs font-medium uppercase tracking-wider ${colors.text} mb-4`}
            >
              After Zaila
            </h4>
            <ul className="space-y-3">
              {study.after.map((item, i) => (
                <StaggeredListItem key={item} delay={0.55 + i * 0.08}>
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
  caseStudies,
  colorMap,
}: {
  caseStudies: CaseStudy[];
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
          Growth Stories
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Real results, not{" "}
          <span className="text-gradient-animated">promises</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          See how businesses like yours grew with AI-powered websites. Real
          metrics, real outcomes.
        </p>
      </motion.div>

      {/* Stats banner — animated counters */}
      <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: "48hr", label: "Avg. launch time" },
          { value: "3x", label: "Avg. lead increase" },
          { value: "99", label: "Lighthouse score" },
          { value: "$0", label: "Contracts required" },
        ].map((stat) => (
          <AnimatedStat key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>

      {/* Case studies with vertical timeline */}
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

          {/* Node dots for each case study */}
          {caseStudies.map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
              className="absolute left-1/2 -translate-x-1/2 h-3 w-3 rounded-full border-2 border-white/20 bg-black"
              style={{ top: `${(i / (caseStudies.length - 1)) * 100}%` }}
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
          {caseStudies.map((study, index) => (
            <CaseStudyCard
              key={study.client}
              study={study}
              colors={colorMap[study.color]}
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
              Ready to be the next growth story?
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-4 max-w-xl mx-auto text-zinc-400"
            >
              Get a free consultation and see how an AI-powered website can
              transform your business in days, not months.
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
