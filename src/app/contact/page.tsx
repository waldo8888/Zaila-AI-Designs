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
          <h3 className="text-2xl font-semibold text-white mb-3">Request sent!</h3>
          <p className="text-zinc-400">We&apos;ll get back to you within 24 hours with a custom proposal.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 grid gap-5 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 md:max-w-2xl">
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
