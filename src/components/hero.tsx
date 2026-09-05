"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useSmoothScrollTo } from "@/hooks/use-scroll-animation";
import { useMagnetic } from "@/hooks/use-magnetic";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTo = useSmoothScrollTo();
  const { ref: magneticCtaRef, style: magneticCtaStyle } = useMagnetic(0.3, 90);

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
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.02] px-5 py-2.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[13px] text-zinc-400">Available for new projects</span>
          </div>
        </div>

        {/* Main headline */}
        <motion.div style={{ y: titleY }}>
          <h1
            className="text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white"
          >
            Premium websites for service businesses that want{" "}
            <span className="text-gradient">more leads</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div style={{ y: subtitleY }}>
          <p
            className="mt-6 max-w-xl text-[17px] leading-[1.7] text-zinc-400"
          >
            Zaila designs and builds fast, modern websites with optional booking, payments, and AI support — so your business looks credible and works harder online. Live in days, not months.
          </p>
        </motion.div>

        {/* CTA */}
        <div className="mt-10">
          <motion.button
            ref={magneticCtaRef as React.RefObject<HTMLButtonElement>}
            style={magneticCtaStyle}
            onClick={() => scrollTo("contact")}
            className="group relative overflow-hidden rounded-full bg-white px-10 py-4 text-[15px] font-medium text-black transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.3)]"
          >
            <span className="relative z-10">Start your project</span>
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-200 to-violet-200 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </motion.button>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
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
