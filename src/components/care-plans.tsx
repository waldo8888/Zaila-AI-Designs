"use client";

import { Card } from "@/components/ui/card";
import { useReveal } from "@/components/use-reveal";

const plans = [
  {
    name: "Launch Care",
    price: "$49",
    period: "/mo",
    desc: "Light support for simple sites",
    items: ["3 revisions/month", "Minor content updates", "72-hour response"],
    highlight: false,
  },
  {
    name: "Growth Care",
    price: "$119",
    period: "/mo",
    desc: "Best for most businesses",
    items: [
      "Up to 9 revisions/month",
      "Priority queue",
      "Performance checks",
      "Monthly report",
    ],
    highlight: true,
  },
  {
    name: "Pro Care",
    price: "$199",
    period: "/mo",
    desc: "For active, growing brands",
    items: [
      "Up to 15 revisions/month",
      "Monthly optimization",
      "36-hour response",
      "SEO monitoring",
    ],
    highlight: false,
  },
  {
    name: "Platinum AI Care",
    price: "$399",
    period: "/mo",
    desc: "For power users (fair use)",
    items: [
      "Unlimited revisions (fair use)",
      "24-hour response",
      "Monthly strategy session",
      "AI feature upgrades",
    ],
    highlight: false,
  },
];

export function CarePlans() {
  const ref = useReveal();

  return (
    <div ref={ref} className="grid gap-4 md:grid-cols-2">
      {plans.map((p, i) => (
        <div
          key={p.name}
          data-animate
          className={`animate-fade-in-up stagger-${i + 1}`}
        >
          <Card
            className={[
              "p-6",
              p.highlight
                ? "border-fuchsia-400/30 bg-gradient-to-b from-fuchsia-500/[0.08] to-violet-500/[0.03]"
                : "",
            ].join(" ")}
          >
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">{p.name}</div>
              {p.highlight && (
                <span className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs font-medium text-fuchsia-200">
                  POPULAR
                </span>
              )}
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight">
                {p.price}
              </span>
              <span className="text-sm text-zinc-500">{p.period}</span>
            </div>
            <div className="mt-1 text-sm text-zinc-500">{p.desc}</div>
            <ul className="mt-4 space-y-2 text-sm">
              {p.items.map((x) => (
                <li key={x} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                  <span className="text-zinc-300">{x}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ))}
    </div>
  );
}
