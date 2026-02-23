"use client";

import { Card } from "@/components/ui/card";
import { useReveal } from "@/components/use-reveal";

const features = [
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="7" cy="6" r="1" fill="currentColor" />
        <circle cx="10" cy="6" r="1" fill="currentColor" />
      </svg>
    ),
    title: "AI Websites",
    desc: "Modern, mobile-first sites that load fast and look premium. Built for conversion, not just aesthetics.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 4v16" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Bookings & Payments",
    desc: "Scheduling, deposits, and checkout flows that save you time and close sales automatically.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M12 3C7.03 3 3 6.58 3 11c0 2.42 1.34 4.57 3.42 5.98L5 21l4.3-2.15c.87.2 1.78.15 2.7.15 4.97 0 9-3.58 9-8s-4.03-8-9-8z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8.5" cy="11" r="1" fill="currentColor" />
        <circle cx="12" cy="11" r="1" fill="currentColor" />
        <circle cx="15.5" cy="11" r="1" fill="currentColor" />
      </svg>
    ),
    title: "AI Assistants",
    desc: "24/7 chatbot that answers FAQs, captures leads, and books appointments while you sleep.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 3C12 3 8 8 8 12s4 9 4 9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 3c0 0 4 5 4 9s-4 9-4 9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Local SEO Setup",
    desc: "Foundational SEO and performance optimization so local customers find you first.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M15 10l4.5-4.5M19.5 5.5l-1.5-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 20h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 16v4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Video & Streaming",
    desc: "Embed live streams, highlights, menus, or event content with clean, responsive layouts.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M12 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 12l4-4 3 3 4-4 3 3 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Monthly Growth",
    desc: "Care plans for continuous updates, optimization, and AI-powered improvements.",
  },
];

export function FeatureGrid() {
  const ref = useReveal();

  return (
    <div ref={ref} className="grid gap-4 md:grid-cols-3">
      {features.map((f, i) => (
        <div
          key={f.title}
          data-animate
          className={`animate-fade-in-up stagger-${i + 1}`}
        >
          <Card className="group p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-400 transition-colors group-hover:bg-fuchsia-500/20">
              {f.icon}
            </div>
            <div className="text-lg font-semibold">{f.title}</div>
            <div className="mt-2 text-sm leading-relaxed text-zinc-400">
              {f.desc}
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
