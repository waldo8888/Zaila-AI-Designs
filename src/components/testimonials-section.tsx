"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const testimonials = [
  {
    quote:
      "Zaila AI Designs completely transformed our online presence. We went from zero to a professional, conversion-focused site in under a week.",
    name: "Sarah Mitchell",
    role: "Owner, Mitchell & Co.",
    stat: "3x",
    statLabel: "More leads",
  },
  {
    quote:
      "The AI chatbot alone has saved us hours per week. It handles FAQs and captures leads while we focus on running the business.",
    name: "David Chen",
    role: "Founder, Chen Services",
    stat: "24/7",
    statLabel: "Availability",
  },
  {
    quote:
      "Agency-level quality at a fraction of the cost. The monthly growth plan keeps our site fresh and performing at its best.",
    name: "Emma Rodriguez",
    role: "CEO, Rodriguez Tech",
    stat: "60%",
    statLabel: "Cost savings",
  },
  {
    quote:
      "From concept to live in 48 hours. The speed and quality blew us away. Our booking rate tripled in the first month.",
    name: "Lisa Park",
    role: "Director, Serenity Wellness",
    stat: "48hr",
    statLabel: "Launch time",
  },
];

export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);

  // Auto-rotate testimonials — reset timer on user interaction
  const [userInteracted, setUserInteracted] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [userInteracted]);

  function goTo(index: number) {
    setActive(index);
    setUserInteracted((c) => c + 1);
  }

  return (
    <section
      id="testimonials"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center py-32 px-6"
    >
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(120,50,200,0.08),transparent_70%)]" />

      <motion.div
        style={{ opacity, scale }}
        className="relative w-full max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 mb-4">
            Testimonials
          </p>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-semibold text-white tracking-[-0.03em]">
            Trusted by <span className="text-gradient">ambitious</span> businesses
          </h2>
        </motion.div>

        {/* Main testimonial display */}
        <div className="relative">
          {/* Giant quote mark */}
          <div className="absolute -top-16 -left-8 md:-left-16 text-[200px] md:text-[300px] leading-none font-serif text-white/[0.02] select-none pointer-events-none">
            &ldquo;
          </div>

          <div className="relative z-10 grid md:grid-cols-[1fr_300px] gap-12 md:gap-20 items-center">
            {/* Quote */}
            <div className="min-h-[300px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
                >
                  <p className="text-[clamp(1.5rem,4vw,2.5rem)] font-light leading-[1.4] tracking-[-0.02em] text-zinc-200 mb-12">
                    {testimonials[active].quote}
                  </p>
                  <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className="relative h-14 w-14">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-500 animate-[spin_6s_linear_infinite] opacity-60" />
                      <div className="absolute inset-[2px] rounded-full bg-black" />
                      <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 flex items-center justify-center">
                        <span className="text-[20px] font-semibold text-white">
                          {testimonials[active].name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[16px] font-medium text-white">
                        {testimonials[active].name}
                      </p>
                      <p className="text-[14px] text-zinc-400">
                        {testimonials[active].role}
                      </p>
                    </div>
                    {/* Mobile stat badge */}
                    <div className="ml-auto md:hidden glass-card rounded-xl px-4 py-2 text-center">
                      <div className="text-[20px] font-bold text-gradient leading-none">
                        {testimonials[active].stat}
                      </div>
                      <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">
                        {testimonials[active].statLabel}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Stats card */}
            <div className="hidden md:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
                  className="glass-card rounded-3xl p-10 text-center"
                >
                  <div className="text-[64px] font-bold text-gradient leading-none mb-4">
                    {testimonials[active].stat}
                  </div>
                  <div className="text-[14px] text-zinc-400 uppercase tracking-wider">
                    {testimonials[active].statLabel}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-16 flex items-center justify-between">
            {/* Progress dots */}
            <div className="flex gap-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`relative h-1 rounded-full transition-all duration-500 ${
                    i === active
                      ? "w-12 bg-gradient-to-r from-fuchsia-500 to-violet-500"
                      : "w-6 bg-zinc-800 hover:bg-zinc-700"
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  goTo((active - 1 + testimonials.length) % testimonials.length)
                }
                className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={() => goTo((active + 1) % testimonials.length)}
                className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
