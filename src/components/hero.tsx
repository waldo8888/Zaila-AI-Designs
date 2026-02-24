"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useSyncExternalStore } from "react";
import { smoothScrollTo } from "@/hooks/use-scroll-animation";

const subscribe = () => () => { };

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
    >
      {/* Gradient overlays for depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,50,200,0.15),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_80%_50%,rgba(168,85,247,0.08),transparent_50%)]" />

      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 w-full max-w-7xl px-6 md:px-12"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="text-left">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0, 1] }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.02] px-5 py-2.5 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[13px] text-zinc-400">Available for new projects</span>
              </div>
            </motion.div>

            {/* Brand name */}
            <motion.p
              className="mb-4 text-[21px] uppercase tracking-[0.3em] font-semibold text-fuchsia-400/80"
              initial={{ opacity: 0 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Zaila AI Designs
            </motion.p>

            {/* Main headline */}
            <motion.div style={{ y: titleY }}>
              <motion.h1
                className="text-[clamp(2rem,5vw,2.8125rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-white"
                initial={{ opacity: 0, y: 60 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.1, 0, 1] }}
              >
                Websites that
                <br />
                <span className="text-gradient">grow</span> your
                <br />
                business
              </motion.h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div style={{ y: subtitleY }}>
              <motion.p
                className="mt-8 max-w-md text-[17px] leading-[1.8] text-zinc-400"
                initial={{ opacity: 0, y: 40 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.1, 0, 1] }}
              >
                AI-powered design and automation that launches in days, not months. We build digital experiences that convert visitors into customers.
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="mt-12 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 40 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.25, 0.1, 0, 1] }}
            >
              <button
                onClick={() => smoothScrollTo("contact")}
                className="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-[14px] font-medium text-black transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.3)]"
              >
                <span className="relative z-10">Start a Project</span>
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-200 to-violet-200 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </button>
              <button
                onClick={() => smoothScrollTo("testimonials")}
                className="group flex items-center gap-3 rounded-full border border-white/[0.1] px-8 py-4 text-[14px] font-medium text-zinc-300 transition-all duration-500 hover:border-white/[0.2] hover:bg-white/[0.02]"
              >
                See Our Work
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform duration-500 group-hover:translate-x-1"
                >
                  <path
                    d="M3 8H13M13 8L8 3M13 8L8 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </motion.div>
          </div>

          {/* Right column - Visual element (sphere is background, so this creates asymmetry) */}
          <motion.div
            className="hidden md:flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ duration: 2, delay: 1 }}
          >
            {/* Stats floating around the sphere */}
            <div className="relative w-full h-[500px]">
              {/* Floating stat cards */}
              <motion.div
                className="absolute top-8 right-8 glass-card rounded-2xl p-5 backdrop-blur-xl"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={mounted ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 1.2 }}
              >
                <div className="text-[32px] font-semibold text-white">48hr</div>
                <div className="text-[13px] text-zinc-400">Average launch time</div>
              </motion.div>

              <motion.div
                className="absolute bottom-24 left-0 glass-card rounded-2xl p-5 backdrop-blur-xl"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={mounted ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 1.4 }}
              >
                <div className="text-[32px] font-semibold text-white">99%</div>
                <div className="text-[13px] text-zinc-400">Performance score</div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 right-0 translate-y-[-50%] glass-card rounded-2xl p-5 backdrop-blur-xl"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={mounted ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 1.6 }}
              >
                <div className="text-[32px] font-semibold text-white">24/7</div>
                <div className="text-[13px] text-zinc-400">AI availability</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Mobile stats row */}
          <motion.div
            className="flex md:hidden justify-center gap-4 mt-12 col-span-full"
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1 }}
          >
            {[
              { value: "48hr", label: "Launch time" },
              { value: "99%", label: "Performance" },
              { value: "24/7", label: "AI uptime" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-xl px-5 py-4 text-center backdrop-blur-xl">
                <div className="text-[20px] font-semibold text-white">{stat.value}</div>
                <div className="text-[11px] text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ duration: 1.5, delay: 2 }}
      >
        <button
          onClick={() => smoothScrollTo("story")}
          className="group flex flex-col items-center gap-4 text-zinc-600 transition-colors hover:text-zinc-400"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-60">
              <path
                d="M12 4V20M12 20L6 14M12 20L18 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </button>
      </motion.div>
    </section>
  );
}
