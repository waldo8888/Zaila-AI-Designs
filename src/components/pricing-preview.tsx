"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useReveal } from "@/components/use-reveal";

const tiers = [
  {
    name: "Starter Launch",
    price: "$499",
    desc: "1–3 pages + fast launch",
    items: [
      "Mobile-first design",
      "Contact form",
      "Basic SEO setup",
      "Vercel deployment",
    ],
    highlight: false,
  },
  {
    name: "Growth Website",
    price: "$699",
    desc: "Most popular — booking + AI",
    items: [
      "Everything in Starter",
      "Booking integration",
      "AI chatbot (basic)",
      "Reviews & social proof",
      "Google Analytics",
    ],
    highlight: true,
  },
  {
    name: "Smart AI Website",
    price: "$999+",
    desc: "Advanced automations",
    items: [
      "Everything in Growth",
      "Payments integration",
      "Streaming / video section",
      "Advanced API integrations",
      "Priority build queue",
    ],
    highlight: false,
  },
];

export function PricingPreview() {
  const ref = useReveal();

  return (
    <div ref={ref} className="grid gap-6 md:grid-cols-3">
      {tiers.map((t, i) => (
        <div
          key={t.name}
          data-animate
          className={`animate-fade-in-up stagger-${i + 1}`}
        >
          <Card
            className={[
              "relative flex h-full flex-col p-6",
              t.highlight
                ? "border-fuchsia-400/30 bg-gradient-to-b from-fuchsia-500/[0.08] to-violet-500/[0.03]"
                : "",
            ].join(" ")}
          >
            {t.highlight && (
              <div className="absolute -top-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent" />
            )}
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">{t.name}</div>
              {t.highlight && (
                <span className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs font-medium text-fuchsia-200">
                  POPULAR
                </span>
              )}
            </div>
            <div className="mt-3 text-4xl font-bold tracking-tight">
              {t.price}
            </div>
            <div className="mt-1 text-sm text-zinc-500">{t.desc}</div>

            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {t.items.map((x) => (
                <li key={x} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                  <span className="text-zinc-300">{x}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className={[
                "mt-6 block rounded-xl px-4 py-3 text-center text-sm font-semibold transition-all",
                t.highlight
                  ? "bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white hover:opacity-90"
                  : "border border-white/15 text-white hover:bg-white/5",
              ].join(" ")}
            >
              Get started
            </Link>
          </Card>
        </div>
      ))}
    </div>
  );
}
