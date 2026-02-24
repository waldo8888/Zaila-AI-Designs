import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { PricingFull } from "@/components/pricing-full";
import { CarePlans } from "@/components/care-plans";

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-28 py-12">
      <SectionHeading
        eyebrow="Pricing"
        title="Transparent pricing"
        description="Packages that undercut traditional agency pricing — without cutting quality."
      />

      <div className="mt-10">
        <PricingFull />
      </div>

      <div className="mt-24">
        <SectionHeading
          eyebrow="Growth Plans"
          title="AI Growth Plans"
          description="Ongoing updates and optimization. Upgrade anytime."
        />
        <div className="mt-10">
          <CarePlans />
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
