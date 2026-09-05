import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { PricingFull } from "@/components/pricing-full";
import { CarePlans } from "@/components/care-plans";
import { PricingFaq, pricingFaq } from "@/components/pricing-faq";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pricingFaq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export const metadata: Metadata = {
  title: "Pricing — AI Websites from $800 | Zaila AI Designs",
  description:
    "Transparent pricing for AI-powered websites. Starter from $800, Growth from $1,800, Smart AI from $3,500. Monthly care plans from $69/mo. No contracts.",
  alternates: { canonical: "https://www.zailaai.com/pricing" },
  openGraph: {
    title: "Pricing — AI Websites from $800 | Zaila AI Designs",
    description:
      "Transparent pricing for AI-powered websites. No hidden fees, no contracts. Launch in days.",
    url: "https://www.zailaai.com/pricing",
  },
};

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-28 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SectionHeading
        eyebrow="Pricing"
        title="Transparent pricing"
        description="Three build tiers, three care plans, no hidden fees. Pick the one that fits — we'll tell you if you're overbuying."
      />

      <div className="mt-10">
        <PricingFull />
        <p className="mt-6 text-center text-sm text-zinc-500">
          Deposit to start: Starter 50% · Growth 35% · Smart AI 30%. Balance due at launch.
        </p>
      </div>

      <div className="mt-24">
        <SectionHeading
          eyebrow="Care Plans"
          title="Care plans"
          description="Hosting, updates, and a human keeping an eye on things. Every build needs a care plan — it's what keeps the site online. Month to month, no lock-in."
        />
        <div className="mt-10">
          <CarePlans />
        </div>
      </div>

      <div className="mt-24">
        <SectionHeading
          eyebrow="Questions"
          title="The stuff people ask before they sign"
          description="Short answers. If yours isn't here, it's a 20-minute call away."
        />
        <div className="mt-10">
          <PricingFaq />
        </div>
      </div>

      <div className="relative mt-24 rounded-3xl border border-white/[0.06] bg-gradient-to-br from-[#12001f] via-black to-black p-10 overflow-hidden">
        <div className="pointer-events-none absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full bg-fuchsia-500/10 blur-[80px]" />
        <h3 className="text-2xl font-semibold">Need something custom?</h3>
        <p className="mt-3 max-w-2xl text-zinc-400">
          If you want an advanced integration, portal, or e-commerce flow,
          we&apos;ll scope it and quote it clearly. No surprises.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Get a free consultation
        </Link>
      </div>
    </div>
  );
}
