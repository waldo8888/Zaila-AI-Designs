"use client";

import { Card } from "@/components/ui/card";
import { useReveal } from "@/components/use-reveal";

const testimonials = [
  {
    quote:
      "Zaila AI Designs completely transformed our online presence. We went from zero to a professional, conversion-focused site in under a week.",
    name: "Local Business Owner",
    role: "Hamilton, ON",
  },
  {
    quote:
      "The AI chatbot alone has saved us hours per week. It handles FAQs and captures leads while we focus on running the business.",
    name: "Service Provider",
    role: "Hamilton, ON",
  },
  {
    quote:
      "Agency-level quality at a fraction of the cost. The monthly growth plan keeps our site fresh and performing at its best.",
    name: "Startup Founder",
    role: "Hamilton, ON",
  },
];

export function Testimonials() {
  const ref = useReveal();

  return (
    <div ref={ref} className="grid gap-6 md:grid-cols-3">
      {testimonials.map((t, i) => (
        <div
          key={t.name}
          data-animate
          className={`animate-fade-in-up stagger-${i + 1}`}
        >
          <Card className="flex h-full flex-col justify-between p-6">
            <p className="text-sm leading-relaxed text-zinc-300">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500/30 to-violet-500/20 text-sm font-semibold text-fuchsia-300">
                {t.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">{t.name}</p>
                <p className="text-xs text-zinc-500">{t.role}</p>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
