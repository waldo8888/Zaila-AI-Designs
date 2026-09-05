"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { submitContactForm } from "@/app/actions";

// Metadata is exported from a separate layout since this is a client component
// See contact/layout.tsx

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const currentUrl = new URL(window.location.href);
    const params = currentUrl.searchParams;
    formData.set("sourcePage", currentUrl.pathname || "/contact");
    formData.set("sourceUrl", currentUrl.toString());
    formData.set("sourceReferrer", document.referrer || "");
    formData.set("submittedFrom", "contact-page");
    formData.set("utmSource", params.get("utm_source") ?? "");
    formData.set("utmMedium", params.get("utm_medium") ?? "");
    formData.set("utmCampaign", params.get("utm_campaign") ?? "");
    formData.set("utmTerm", params.get("utm_term") ?? "");
    formData.set("utmContent", params.get("utm_content") ?? "");
    const result = await submitContactForm(formData);
    setLoading(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-28 py-12">
      <SectionHeading
        eyebrow="Contact"
        title="Free Consultation"
        description="Tell us what you need. We'll reply with a quick plan + quote."
      />

      {submitted ? (
        <div className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-12 md:max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
              <path d="M3 12l6 6L21 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">Request sent.</h3>
          <p className="text-zinc-400">We&apos;ll get back to you within 24 hours with a custom proposal.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative mt-10 grid gap-5 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 md:max-w-2xl">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-300">
              Your name
            </label>
            <input
              name="name"
              required
              className="rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3.5 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-fuchsia-400/40"
              placeholder="e.g., Sheldon Steele"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-300">
              Business name
            </label>
            <input
              name="business"
              required
              className="rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3.5 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-fuchsia-400/40"
              placeholder="e.g., The Pool Hall"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-300">Email</label>
              <input
                type="email"
                name="email"
                required
                className="rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3.5 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-fuchsia-400/40"
                placeholder="you@business.com"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-300">Phone</label>
              <input
                type="tel"
                name="phone"
                className="rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3.5 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-fuchsia-400/40"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-300">
              Current website
            </label>
            <input
              type="url"
              name="website"
              className="rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3.5 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-fuchsia-400/40"
              placeholder="https://yourbusiness.com"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-300">
                Budget range
              </label>
              <select
                name="budgetRange"
                className="rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3.5 text-sm text-zinc-100 outline-none transition-colors focus:border-fuchsia-400/40"
                defaultValue=""
              >
                <option value="" className="bg-black">Not sure yet</option>
                <option value="$800-$1,800" className="bg-black">$800-$1,800</option>
                <option value="$1,800-$3,500" className="bg-black">$1,800-$3,500</option>
                <option value="$3,500+" className="bg-black">$3,500+</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-300">
                Timeline
              </label>
              <select
                name="urgency"
                className="rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3.5 text-sm text-zinc-100 outline-none transition-colors focus:border-fuchsia-400/40"
                defaultValue=""
              >
                <option value="" className="bg-black">Just exploring</option>
                <option value="ASAP" className="bg-black">ASAP</option>
                <option value="This month" className="bg-black">This month</option>
                <option value="1-3 months" className="bg-black">1-3 months</option>
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-300">
              Primary goal
            </label>
            <select
              name="primaryGoal"
              className="rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3.5 text-sm text-zinc-100 outline-none transition-colors focus:border-fuchsia-400/40"
              defaultValue=""
            >
              <option value="" className="bg-black">Choose one</option>
              <option value="More leads" className="bg-black">More leads</option>
              <option value="Better design" className="bg-black">Better design</option>
              <option value="Booking automation" className="bg-black">Booking automation</option>
              <option value="AI chatbot" className="bg-black">AI chatbot</option>
              <option value="Full website system" className="bg-black">Full website system</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-300">
              What do you want built?
            </label>
            <textarea
              rows={5}
              name="message"
              required
              className="rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3.5 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-fuchsia-400/40"
              placeholder="Pages, booking, payments, chatbot, streaming, etc."
            />
          </div>

          <div
            aria-hidden="true"
            className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
          >
            <label>
              Website URL
              <input
                type="text"
                name="website_url"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send request"}
          </button>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
        </form>
      )}
    </div>
  );
}
