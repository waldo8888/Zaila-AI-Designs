import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { PricingPreview } from "@/components/pricing-preview";
import { CarePlans } from "@/components/care-plans";
import { FeatureGrid } from "@/components/feature-grid";
import { Process } from "@/components/process";
import { CTA } from "@/components/cta";
import { Stats } from "@/components/stats";
import { Testimonials } from "@/components/testimonials";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="py-12">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-b from-[#12001f] via-black to-black px-8 py-16 md:px-14 md:py-24">
        {/* Glow layers */}
        <div className="pointer-events-none absolute inset-0 opacity-80 [background:radial-gradient(60%_50%_at_50%_0%,rgba(168,85,247,0.25),transparent_70%)]" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[120px]" />

        <div className="relative grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <Badge>Hamilton &bull; AI-Powered Web &amp; Automation</Badge>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
              AI-Powered Websites Built for{" "}
              <span className="bg-gradient-to-r from-fuchsia-400 to-violet-300 bg-clip-text text-transparent">
                Real Business Growth
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
              Launch faster, automate smarter, and grow your business with modern
              design + AI assistants. Agency-level results without agency
              headaches.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Get a free consultation
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
              >
                View pricing
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-zinc-400 sm:grid-cols-4">
              {[
                "Fast launch",
                "AI chatbot",
                "Bookings & payments",
                "Monthly growth",
              ].map((t) => (
                <div
                  key={t}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-center"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <Card className="p-8">
              <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
                What you get
              </p>
              <ul className="mt-6 space-y-4 text-sm">
                {[
                  "Clean, modern, mobile-first design",
                  "Vercel deployment + performance optimization",
                  "AI assistant option (FAQ + lead capture)",
                  "Bookings, deposits, payments, integrations",
                ].map((x) => (
                  <li key={x} className="flex gap-3">
                    <span className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-fuchsia-400" />
                    <span className="text-zinc-300">{x}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-2xl border border-white/[0.06] bg-gradient-to-r from-fuchsia-500/[0.08] to-violet-500/[0.05] p-5">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Starting from
                </p>
                <p className="mt-2 text-4xl font-bold tracking-tight">$499</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Ask about bundles for booking + chatbot.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── STATS (Maze-inspired animated counters) ── */}
      <section className="mt-20">
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] px-8 py-12">
          <Stats />
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="mt-24">
        <SectionHeading
          eyebrow="Services"
          title="What we build"
          description="Websites that don't just look good — they do work for your business."
        />
        <div className="mt-10">
          <FeatureGrid />
        </div>
      </section>

      {/* ── PRICING PREVIEW ── */}
      <section className="mt-24">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Pricing"
            title="Simple, transparent pricing"
            description="Starter for launch. Growth for momentum. Smart for automation."
          />
          <Link
            href="/pricing"
            className="hidden shrink-0 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/5 md:inline-block"
          >
            See full pricing
          </Link>
        </div>
        <div className="mt-10">
          <PricingPreview />
        </div>
      </section>

      {/* ── CARE PLANS ── */}
      <section className="mt-24">
        <SectionHeading
          eyebrow="Growth Plans"
          title="AI Growth Plans"
          description="Monthly updates so your site stays fresh, fast, and converting."
        />
        <div className="mt-10">
          <CarePlans />
        </div>
      </section>

      {/* ── PROCESS (Maze-inspired numbered steps) ── */}
      <section className="mt-24">
        <SectionHeading
          eyebrow="Process"
          title="How it works"
          description="A clear process so business owners always know what's next."
        />
        <div className="mt-10">
          <Process />
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="mt-24">
        <SectionHeading
          eyebrow="Testimonials"
          title="What our clients say"
          description="Real results from real Hamilton businesses."
        />
        <div className="mt-10">
          <Testimonials />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mt-24">
        <CTA />
      </section>
    </div>
  );
}
