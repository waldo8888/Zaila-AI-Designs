import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.06]">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-fuchsia-400 to-violet-300 bg-clip-text text-lg font-semibold text-transparent">
                Zaila AI
              </span>
              <span className="text-zinc-300">Designs</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-zinc-500">
              AI-powered web design, automation, and growth plans for local
              businesses. Hamilton, ON.
            </p>
          </div>

          <div className="flex gap-10 text-sm">
            <div className="flex flex-col gap-3">
              <p className="font-medium text-zinc-300">Pages</p>
              <Link href="/" className="text-zinc-500 transition-colors hover:text-white">
                Home
              </Link>
              <Link href="/pricing" className="text-zinc-500 transition-colors hover:text-white">
                Pricing
              </Link>
              <Link href="/contact" className="text-zinc-500 transition-colors hover:text-white">
                Contact
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-medium text-zinc-300">Connect</p>
              <a
                href="mailto:hello@zailaai.com"
                className="text-zinc-500 transition-colors hover:text-white"
              >
                Email us
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-xs text-zinc-600 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Zaila AI Designs. All rights reserved.</p>
          <p>Designed with AI. Built for growth.</p>
        </div>
      </div>
    </footer>
  );
}
