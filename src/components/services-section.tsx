"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const services = [
  {
    num: "01",
    title: "AI-Powered Websites",
    description:
      "Modern, mobile-first sites built with Next.js. Blazing fast, beautifully designed, and engineered to convert visitors into customers.",
    features: ["Custom design", "SEO optimized", "Sub-second loads", "Mobile-first"],
    gradient: "from-fuchsia-500/20 to-violet-500/20",
    iconColor: "text-fuchsia-400",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "AI Assistants",
    description:
      "24/7 chatbots that answer FAQs, capture leads, and book appointments. Your always-on sales team that never sleeps.",
    features: ["Lead capture", "FAQ handling", "Smart routing", "Natural language"],
    gradient: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-400",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h.01" />
        <path d="M12 10h.01" />
        <path d="M16 10h.01" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Bookings & Payments",
    description:
      "Integrated scheduling, deposits, and checkout flows. Let customers self-serve and close sales while you sleep.",
    features: ["Online booking", "Payment processing", "Auto reminders", "Calendar sync"],
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Growth Plans",
    description:
      "Monthly updates, optimization, and AI-powered improvements. Your site gets better every month, not stale.",
    features: ["Monthly updates", "A/B testing", "Analytics", "SEO monitoring"],
    gradient: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-400",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 20l5-5 4 4 9-11" />
        <path d="M17 8h4v4" />
      </svg>
    ),
  },
];

export function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${(services.length - 1) * 100}vw`]
  );

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative"
      style={{ height: `${services.length * 100}vh` }}
    >
      {/* Sticky horizontal scroll container */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(120,50,200,0.04),transparent_60%)]" />

        {/* Section header - fixed */}
        <div className="absolute top-12 md:top-20 left-6 md:left-12 z-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 mb-4"
          >
            What we build
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(1.5rem,3vw,2.5rem)] font-semibold text-white tracking-[-0.02em]"
          >
            AI-powered solutions
          </motion.h2>
        </div>

        {/* Horizontal scroll track */}
        <motion.div style={{ x }} className="flex">
          {services.map((service, index) => (
            <ServiceCard
              key={service.num}
              service={service}
              index={index}
              total={services.length}
              scrollProgress={scrollYProgress}
            />
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 1 }}
          style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-zinc-400"
        >
          <span className="text-[11px] uppercase tracking-[0.2em]">Scroll to explore</span>
          <motion.svg
            width="20" height="20" viewBox="0 0 20 20" fill="none"
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </motion.div>

        {/* Progress bar */}
        <div className="absolute bottom-12 left-6 md:left-12 right-6 md:right-12 z-20">
          <div className="relative h-px bg-white/10">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="absolute inset-y-0 left-0 right-0 origin-left bg-gradient-to-r from-fuchsia-500 to-violet-500"
            />
          </div>
          <div className="mt-4 flex justify-between text-[12px] text-zinc-500">
            <span>01</span>
            <span>0{services.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
  total,
  scrollProgress,
}: {
  service: (typeof services)[0];
  index: number;
  total: number;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Each card is centered when scrollProgress = index / (total - 1)
  const center = total > 1 ? index / (total - 1) : 0;
  const halfSpan = total > 1 ? 0.5 / (total - 1) : 0.5;
  const start = Math.max(0, center - halfSpan);
  const end = Math.min(1, center + halfSpan);

  const scale = useTransform(
    scrollProgress,
    [start, center, end],
    [0.9, 1, 0.9]
  );

  const opacity = useTransform(
    scrollProgress,
    [start, center, end],
    [0.5, 1, 0.5]
  );

  return (
    <motion.div
      style={{ scale, opacity }}
      className="flex-shrink-0 w-screen h-screen flex items-center justify-center px-6 md:px-24"
    >
      <div className="w-full max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div>
            <span className="text-[64px] md:text-[96px] font-bold text-white/[0.03] leading-none block mb-[-20px] md:mb-[-40px]">
              {service.num}
            </span>
            <h3 className="text-[clamp(1.75rem,4vw,3rem)] font-semibold text-white tracking-[-0.02em] mb-6">
              {service.title}
            </h3>
            <p className="text-[17px] leading-[1.8] text-zinc-400 mb-8">
              {service.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {service.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-full bg-white/[0.03] border border-white/[0.05] px-4 py-2 text-[12px] font-medium text-zinc-400"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Right - Visual */}
          <div className="hidden md:block">
            <div
              className={`aspect-square rounded-3xl bg-gradient-to-br ${service.gradient} backdrop-blur-xl border border-white/[0.05] flex flex-col items-center justify-center gap-6 relative overflow-hidden`}
            >
              {/* Decorative grid lines */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
              </div>
              <div className={`relative ${service.iconColor}`}>
                {service.icon}
              </div>
              <span className="relative text-[14px] font-medium text-white/40 uppercase tracking-[0.2em]">
                {service.title}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
