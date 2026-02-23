import { SectionHeading } from "@/components/ui/section-heading";

export default function ContactPage() {
  return (
    <div className="py-12">
      <SectionHeading
        eyebrow="Contact"
        title="Free Consultation"
        description="Tell us what you need. We'll reply with a quick plan + quote."
      />

      <form className="mt-10 grid gap-5 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 md:max-w-2xl">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-zinc-300">
            Business name
          </label>
          <input
            className="rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3.5 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-fuchsia-400/40"
            placeholder="e.g., The Pool Hall"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-zinc-300">Email</label>
          <input
            type="email"
            className="rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3.5 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-fuchsia-400/40"
            placeholder="you@business.com"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-zinc-300">
            What do you want built?
          </label>
          <textarea
            rows={5}
            className="rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3.5 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-fuchsia-400/40"
            placeholder="Pages, booking, payments, chatbot, streaming, etc."
          />
        </div>

        <button
          type="button"
          className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Send request
        </button>

        <p className="text-xs text-zinc-600">
          (This is a UI-only form. Hook it up to email, Formspark, or a backend
          when you&apos;re ready.)
        </p>
      </form>
    </div>
  );
}
