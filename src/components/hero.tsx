"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useSyncExternalStore } from "react";
import { useSmoothScrollTo } from "@/hooks/use-scroll-animation";

const subscribe = () => () => { };

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const scrollTo = useSmoothScrollTo();

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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_50%_50%,rgba(168,85,247,0.06),transparent_50%)]" />

      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center"
      >
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0, 1] }}
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

        {/* Main headline */}
        <motion.div style={{ y: titleY }}>
          <motion.h1
            className="text-[clamp(2.8rem,8vw,6rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-white"
            initial={{ opacity: 0, y: 60 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.1, 0, 1] }}
          >
            Websites that{" "}
            <span className="text-gradient">grow</span>
            <br />
            your business
          </motion.h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div style={{ y: subtitleY }}>
          <motion.p
            className="mt-6 max-w-md text-[17px] leading-[1.7] text-zinc-400"
            initial={{ opacity: 0, y: 40 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.7, ease: [0.25, 0.1, 0, 1] }}
          >
            AI-powered design and automation that launches in days, not months.
          </motion.p>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 40 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.9, ease: [0.25, 0.1, 0, 1] }}
        >
          <button
            onClick={() => scrollTo("contact")}
            className="group relative overflow-hidden rounded-full bg-white px-10 py-4 text-[15px] font-medium text-black transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.3)]"
          >
            <span className="relative z-10">Start a Project</span>
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-200 to-violet-200 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ duration: 1.5, delay: 2 }}
      >
        <button
          onClick={() => scrollTo("story")}
          className="group flex flex-col items-center gap-4 text-zinc-500 transition-colors hover:text-zinc-300"
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
