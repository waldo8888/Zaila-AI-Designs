"use client";

import {
  motion,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { useRef, useEffect, useState, useMemo } from "react";

/* ================================================================
   DATA TYPES
   ================================================================ */

interface Feature {
  title: string;
  description: string;
}
interface Stat {
  value: string;
  label: string;
}
interface FAQ {
  q: string;
  a: string;
}

interface ServicePageProps {
  slug: string;
  title: string;
  h1: string;
  subtitle: string;
  intro: string;
  features: Feature[];
  stats: Stat[];
  faq: FAQ[];
}

/* ================================================================
   SHARED EASING
   ================================================================ */

const smoothEase = [0.25, 0.1, 0, 1] as const;

/* ================================================================
   ANIMATED STAT COUNTER  (reusable)
   ================================================================ */

function AnimatedStat({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [displayed, setDisplayed] = useState(value);

  const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
  const cleaned = value.slice(prefix.length);
  const numMatch = cleaned.match(/^(\d+)/);
  const finalNum = numMatch ? parseInt(numMatch[1], 10) : null;
  const suffix = numMatch ? cleaned.slice(numMatch[1].length) : cleaned;

  useEffect(() => {
    if (!isInView || finalNum === null) return;
    const duration = 1200;
    const start = performance.now();
    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayed(`${prefix}${Math.round(eased * finalNum!)}${suffix}`);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isInView, finalNum, prefix, suffix]);

  return (
    <div ref={ref} className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
      {displayed}
    </div>
  );
}

/* ================================================================
   3-D TILT STAT CARD
   ================================================================ */

function TiltStatCard({ stat, index }: { stat: Stat; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: smoothEase }}
      whileHover={{ scale: 1.03, rotateX: -3, rotateY: 3 }}
      style={{ transformPerspective: 800 }}
      className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center overflow-hidden will-change-transform"
    >
      {/* Shine sweep on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.03)_45%,rgba(255,255,255,0.06)_50%,rgba(255,255,255,0.03)_55%,transparent_60%)] bg-[length:200%_100%] group-hover:animate-[shine_1.5s_ease-in-out]" />
      <AnimatedStat value={stat.value} />
      <div className="mt-1 text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</div>
    </motion.div>
  );
}

/* ================================================================
   FEATURE CARD WITH GRADIENT BORDER SHIMMER
   ================================================================ */

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: smoothEase }}
      className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 overflow-hidden"
    >
      {/* Gradient border shimmer on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            padding: "1px",
            background: "conic-gradient(from var(--shimmer-angle, 0deg), transparent 60%, rgba(232,121,249,0.3) 75%, rgba(167,139,250,0.3) 85%, transparent 100%)",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            animation: "spin 4s linear infinite",
          }}
        />
      </div>
      {/* Hover glow */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-fuchsia-500/[0.04] to-violet-500/[0.04]" />

      <div className="relative">
        <span className="inline-block mb-3 text-xs font-mono text-fuchsia-400/60 tracking-wider">
          0{index + 1}
        </span>
        <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
}

/* ================================================================
   FAQ ACCORDION ITEM
   ================================================================ */

function FAQItem({ item, index }: { item: FAQ; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: smoothEase }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-6 text-left cursor-pointer group"
      >
        <h3 className="text-base font-semibold text-white pr-4 group-hover:text-fuchsia-300 transition-colors duration-300">
          {item.q}
        </h3>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: smoothEase }}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-white/10 text-zinc-400 text-sm"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: smoothEase }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-sm text-zinc-400 leading-relaxed">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ================================================================
   PAGE-SPECIFIC HERO VISUALS
   ================================================================ */

/* --- AI Web Design: Browser mock + Lighthouse gauge --- */
function BrowserMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1400;
    const start = performance.now();
    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setScore(Math.round(eased * 99));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isInView]);

  // SVG gauge
  const circumference = 2 * Math.PI * 42;
  const strokeDash = (score / 100) * circumference;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, rotateY: -8 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: smoothEase }}
      style={{ transformPerspective: 1200 }}
      className="relative"
    >
      {/* Browser frame */}
      <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden backdrop-blur-sm">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 mx-4">
            <div className="h-5 rounded-md bg-white/[0.04] flex items-center px-3">
              <span className="text-[10px] text-zinc-500 font-mono">https://yourbusiness.com</span>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-6 space-y-3">
          {[75, 60, 90, 45, 80].map((w, i) => (
            <motion.div
              key={i}
              initial={{ width: 0, opacity: 0 }}
              animate={isInView ? { width: `${w}%`, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.12, ease: smoothEase }}
              className={`h-2 rounded-full ${i === 0 ? "bg-gradient-to-r from-fuchsia-500/40 to-violet-500/40 h-4" : "bg-white/[0.06]"}`}
            />
          ))}
          <div className="flex gap-3 mt-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                className="flex-1 h-16 rounded-lg bg-white/[0.03] border border-white/[0.04]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lighthouse gauge - floating alongside */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 20 }}
        animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute -right-4 -bottom-4 md:-right-8 md:-bottom-6 bg-black/90 rounded-2xl border border-white/[0.08] p-3 shadow-2xl"
      >
        <svg width="80" height="80" viewBox="0 0 96 96" className="block">
          <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <motion.circle
            cx="48"
            cy="48"
            r="42"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - strokeDash}
            transform="rotate(-90 48 48)"
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset: circumference - strokeDash } : {}}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>
          <text x="48" y="44" textAnchor="middle" fill="white" fontSize="22" fontWeight="700">{score}</text>
          <text x="48" y="58" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8" fontWeight="500">PERFORMANCE</text>
        </svg>
      </motion.div>

      {/* Floating glow */}
      <div className="pointer-events-none absolute -inset-8 bg-gradient-to-br from-fuchsia-500/[0.06] to-violet-500/[0.06] rounded-3xl blur-2xl -z-10" />
    </motion.div>
  );
}

/* --- Next.js: Terminal build output animation --- */
function TerminalAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [visibleLines, setVisibleLines] = useState(0);

  const lines = [
    { text: "$ npx next build", color: "text-white" },
    { text: "   ▲ Next.js 16.1.6", color: "text-zinc-500" },
    { text: "", color: "" },
    { text: "   Creating an optimized production build...", color: "text-zinc-400" },
    { text: "   ✓ Compiled successfully in 2.1s", color: "text-green-400" },
    { text: "   ✓ Linting and type-checking passed", color: "text-green-400" },
    { text: "   ✓ Collecting page data", color: "text-green-400" },
    { text: "   ✓ Generating static pages (18/18)", color: "text-green-400" },
    { text: "", color: "" },
    { text: "   Route          Size      First Load", color: "text-zinc-500" },
    { text: "   ┌ ○ /          4.2 kB    87.3 kB", color: "text-zinc-400" },
    { text: "   ├ ○ /blog      1.8 kB    84.9 kB", color: "text-zinc-400" },
    { text: "   └ ● /services  2.1 kB    85.2 kB", color: "text-cyan-400" },
    { text: "", color: "" },
    { text: "   ✓ Build completed in 4.8s", color: "text-green-400" },
  ];

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= lines.length) clearInterval(interval);
    }, 180);
    return () => clearInterval(interval);
  }, [isInView, lines.length]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: smoothEase }}
      className="relative"
    >
      <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden font-mono text-xs leading-relaxed">
        {/* Terminal title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-[10px] text-zinc-600 ml-2">Terminal — next build</span>
        </div>

        {/* Lines */}
        <div className="p-4 min-h-[220px]">
          {lines.slice(0, visibleLines).map((line, i) => (
            <div key={i} className={`${line.color} whitespace-pre`}>
              {line.text || "\u00A0"}
            </div>
          ))}
          {/* Blinking cursor */}
          {visibleLines < lines.length && (
            <span className="inline-block w-2 h-4 bg-white/60 animate-pulse ml-1" />
          )}
        </div>
      </div>

      {/* Performance badge floating */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView && visibleLines >= lines.length ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
        className="absolute -right-3 -bottom-3 md:-right-6 md:-bottom-4 bg-black/90 rounded-xl border border-white/[0.08] px-4 py-3 shadow-2xl"
      >
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Bundle</div>
        <div className="text-lg font-bold text-cyan-400">87 kB</div>
      </motion.div>

      {/* Glow */}
      <div className="pointer-events-none absolute -inset-8 bg-gradient-to-br from-cyan-500/[0.05] to-blue-500/[0.05] rounded-3xl blur-2xl -z-10" />
    </motion.div>
  );
}

/* --- AI Chatbot: Chat conversation animation --- */
function ChatAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [showTyping, setShowTyping] = useState(false);

  const messages = useMemo(() => [
    { from: "user" as const, text: "Hi, do you offer emergency plumbing?" },
    { from: "bot" as const, text: "Yes! We offer 24/7 emergency plumbing across Hamilton. Would you like to book a same-day appointment?" },
    { from: "user" as const, text: "How much does it cost?" },
    { from: "bot" as const, text: "Emergency calls start at $120. I can check availability for you right now — what time works best?" },
    { from: "user" as const, text: "This afternoon if possible" },
    { from: "bot" as const, text: "I have a 2:30 PM slot open today. Shall I book that for you? I'll just need your name and address." },
  ], []);

  useEffect(() => {
    if (!isInView) return;
    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    function scheduleNext(index: number) {
      if (cancelled || index >= messages.length) return;
      if (messages[index].from === "bot") {
        setShowTyping(true);
        const t1 = setTimeout(() => {
          if (cancelled) return;
          setShowTyping(false);
          setVisibleMessages(index + 1);
          const t2 = setTimeout(() => scheduleNext(index + 1), 800);
          timeouts.push(t2);
        }, 1000);
        timeouts.push(t1);
      } else {
        setVisibleMessages(index + 1);
        const t = setTimeout(() => scheduleNext(index + 1), 600);
        timeouts.push(t);
      }
    }

    const initial = setTimeout(() => scheduleNext(0), 500);
    timeouts.push(initial);

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [isInView, messages]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: smoothEase }}
      className="relative"
    >
      <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-500 flex items-center justify-center text-[11px] font-bold text-white">
              AI
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0a0a]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">AI Assistant</div>
            <div className="text-[10px] text-emerald-400">Online now</div>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 space-y-3 min-h-[240px] max-h-[280px] overflow-hidden">
          {messages.slice(0, visibleMessages).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: smoothEase }}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.from === "user"
                    ? "bg-fuchsia-500/20 text-fuchsia-100 rounded-br-sm"
                    : "bg-white/[0.06] text-zinc-300 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          {/* Typing indicator */}
          {showTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/[0.06] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    className="w-1.5 h-1.5 rounded-full bg-zinc-500"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Lead captured badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView && visibleMessages >= messages.length ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
        className="absolute -right-3 -bottom-3 md:-right-6 md:-bottom-4 bg-black/90 rounded-xl border border-emerald-500/20 px-4 py-3 shadow-2xl"
      >
        <div className="text-[10px] text-emerald-400 uppercase tracking-wider mb-0.5">Lead Captured</div>
        <div className="text-lg font-bold text-emerald-400">✓</div>
      </motion.div>

      {/* Glow */}
      <div className="pointer-events-none absolute -inset-8 bg-gradient-to-br from-fuchsia-500/[0.05] to-emerald-500/[0.04] rounded-3xl blur-2xl -z-10" />
    </motion.div>
  );
}

/* ================================================================
   HERO VISUAL PICKER
   ================================================================ */

function HeroVisual({ slug }: { slug: string }) {
  switch (slug) {
    case "ai-web-design-hamilton":
      return <BrowserMockup />;
    case "nextjs-website-hamilton":
      return <TerminalAnimation />;
    case "ai-chatbot-ontario":
      return <ChatAnimation />;
    default:
      return null;
  }
}

/* ================================================================
   MAIN CLIENT COMPONENT
   ================================================================ */

export function ServicePageClient({
  slug,
  title,
  h1,
  subtitle,
  intro,
  features,
  stats,
  faq,
}: ServicePageProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-28 pb-20">
      {/* ───── HERO ───── */}
      <div ref={heroRef} className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Text side */}
        <div className="max-w-xl">
          {/* Animated badge */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="mb-3 text-sm font-medium uppercase tracking-widest text-fuchsia-400"
          >
            {title}
          </motion.p>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: smoothEase }}
            className="text-3xl font-semibold tracking-tight md:text-5xl text-gradient-animated"
          >
            {h1}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
            className="mt-4 text-xl text-zinc-400"
          >
            {subtitle}
          </motion.p>

          {/* Intro */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: smoothEase }}
            className="mt-6 text-[15px] leading-[1.8] text-zinc-300 max-w-2xl"
          >
            {intro}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: smoothEase }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/contact"
              className="group relative rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-all hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)]"
            >
              <span className="relative z-10">Get a free consultation</span>
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-white/10 px-7 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-white/20 hover:text-white"
            >
              View pricing
            </Link>
          </motion.div>
        </div>

        {/* Visual side */}
        <div className="relative">
          <HeroVisual slug={slug} />
        </div>
      </div>

      {/* ───── STATS ───── */}
      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <TiltStatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* ───── FEATURES ───── */}
      <div className="mt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-10">
            What you get
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>

      {/* ───── FAQ ───── */}
      <div className="mt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-10">
            Frequently asked questions
          </h2>
        </motion.div>
        <div className="space-y-4 max-w-3xl">
          {faq.map((item, i) => (
            <FAQItem key={item.q} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* ───── BOTTOM CTA ───── */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.9, ease: smoothEase }}
        className="relative mt-28"
      >
        {/* Spinning gradient border */}
        <div className="absolute -inset-[1px] rounded-3xl overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: "conic-gradient(from 0deg, transparent 40%, rgba(232,121,249,0.4) 50%, rgba(167,139,250,0.4) 60%, transparent 70%)",
              animation: "spin 6s linear infinite",
            }}
          />
        </div>

        <div className="relative rounded-3xl bg-gradient-to-br from-[#12001f] via-black to-black p-10 md:p-14 overflow-hidden text-center">
          {/* Parallax glow orbs — CSS animation for performance */}
          <div
            className="pointer-events-none absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full bg-fuchsia-500/10 blur-[80px] animate-[float_6s_ease-in-out_infinite]"
          />
          <div
            className="pointer-events-none absolute -right-20 -bottom-20 h-[300px] w-[300px] rounded-full bg-violet-500/10 blur-[80px] animate-[float_7s_ease-in-out_infinite_reverse]"
          />

          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              Ready to get started?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-zinc-400">
              Free consultation. Custom quote within 24 hours. No commitments.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)] hover:translate-y-[-2px]"
            >
              Start your project
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
