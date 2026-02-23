"use client";

import { Card } from "@/components/ui/card";
import { useReveal } from "@/components/use-reveal";

const steps = [
  {
    title: "Consultation",
    desc: "We learn your business, goals, and must-have features through a quick discovery call.",
  },
  {
    title: "AI Build Sprint",
    desc: "We build fast with an AI-assisted workflow, clean design, and constant feedback loops.",
  },
  {
    title: "Launch",
    desc: "Deploy on Vercel, optimize performance, connect your domain, and go live.",
  },
  {
    title: "Monthly Growth",
    desc: "Ongoing updates, improvements, and AI upgrades through your care plan.",
  },
];

export function Process() {
  const ref = useReveal();

  return (
    <div ref={ref} className="relative grid gap-6 md:grid-cols-4">
      {/* Connecting line */}
      <div className="pointer-events-none absolute top-14 hidden h-px w-full bg-gradient-to-r from-transparent via-fuchsia-500/30 to-transparent md:block" />

      {steps.map((s, i) => (
        <div
          key={s.title}
          data-animate
          className={`animate-fade-in-up stagger-${i + 1}`}
        >
          <Card className="relative p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-fuchsia-400/30 bg-gradient-to-br from-fuchsia-500/20 to-violet-500/10 text-sm font-bold text-fuchsia-300">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="text-lg font-semibold">{s.title}</div>
            <div className="mt-2 text-sm leading-relaxed text-zinc-400">
              {s.desc}
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
