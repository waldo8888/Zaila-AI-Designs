import Link from "next/link";
import { Card } from "@/components/ui/card";

const rows: [string, boolean, boolean, boolean][] = [
  ["Mobile-first design", true, true, true],
  ["Contact form", true, true, true],
  ["Basic SEO setup", true, true, true],
  ["Vercel deployment", true, true, true],
  ["Booking integration", false, true, true],
  ["AI chatbot (basic)", false, true, true],
  ["Reviews + social proof", false, true, true],
  ["Google Analytics", false, true, true],
  ["Payments integration", false, false, true],
  ["Streaming / video section", false, false, true],
  ["Advanced API integrations", false, false, true],
  ["Priority build queue", false, false, true],
];

function Check({ ok }: { ok: boolean }) {
  return (
    <span
      className={[
        "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
        ok
          ? "bg-emerald-500/20 text-emerald-400"
          : "bg-white/5 text-zinc-600",
      ].join(" ")}
    >
      {ok ? "✓" : "—"}
    </span>
  );
}

export function PricingFull() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="text-lg font-semibold">Starter Launch</div>
          <div className="mt-3 text-4xl font-bold tracking-tight">$499</div>
          <div className="mt-1 text-sm text-zinc-400">
            1–3 pages. Fast launch.
          </div>
          <Link
            href="/contact"
            className="mt-5 block rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-white/5"
          >
            Get started
          </Link>
        </Card>

        <Card className="relative p-6 border-fuchsia-400/30 bg-gradient-to-b from-fuchsia-500/[0.08] to-violet-500/[0.03]">
          <div className="absolute -top-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent" />
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Growth Website</div>
            <span className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs font-medium text-fuchsia-200">
              POPULAR
            </span>
          </div>
          <div className="mt-3 text-4xl font-bold tracking-tight">$699</div>
          <div className="mt-1 text-sm text-zinc-400">
            Booking + chatbot + social proof.
          </div>
          <Link
            href="/contact"
            className="mt-5 block rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-4 py-3 text-center text-sm font-semibold text-white hover:opacity-90"
          >
            Get started
          </Link>
        </Card>

        <Card className="p-6">
          <div className="text-lg font-semibold">Smart AI Website</div>
          <div className="mt-3 text-4xl font-bold tracking-tight">$999+</div>
          <div className="mt-1 text-sm text-zinc-400">
            Payments + integrations + automation.
          </div>
          <Link
            href="/contact"
            className="mt-5 block rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-white/5"
          >
            Get started
          </Link>
        </Card>
      </div>

      <Card className="p-6">
        <div className="text-lg font-semibold">Compare features</div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400">
                <th className="py-3 text-left font-medium">Feature</th>
                <th className="py-3 text-center font-medium">Starter</th>
                <th className="py-3 text-center font-medium">Growth</th>
                <th className="py-3 text-center font-medium">Smart</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r[0]} className="border-b border-white/[0.04]">
                  <td className="py-3 text-zinc-300">{r[0]}</td>
                  <td className="py-3 text-center">
                    <Check ok={r[1]} />
                  </td>
                  <td className="py-3 text-center">
                    <Check ok={r[2]} />
                  </td>
                  <td className="py-3 text-center">
                    <Check ok={r[3]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-zinc-400">
          Add-ons available anytime: payments, mini store, streaming, advanced
          API integrations.
        </div>
      </Card>
    </div>
  );
}
