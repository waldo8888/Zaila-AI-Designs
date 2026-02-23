import Link from "next/link";

export function CTA() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a0826] via-black to-[#0d0015] p-10 md:p-14">
      {/* Glow effects */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full bg-fuchsia-500/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-[300px] w-[300px] rounded-full bg-violet-500/15 blur-[100px]" />

      <div className="relative">
        <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Ready to launch your{" "}
          <span className="bg-gradient-to-r from-fuchsia-400 to-violet-300 bg-clip-text text-transparent">
            AI-powered
          </span>{" "}
          site?
        </h3>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          Tell us what you need — we&apos;ll respond with a simple plan and a clear
          price. No contracts, no surprises.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Get a free consultation
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
          >
            View pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
