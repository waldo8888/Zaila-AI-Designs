"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-fuchsia-400 to-violet-300 bg-clip-text text-lg text-transparent">
            Zaila AI
          </span>
          <span className="text-zinc-300">Designs</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={[
                "rounded-lg px-4 py-2 text-sm transition-colors",
                pathname === l.href
                  ? "text-white"
                  : "text-zinc-400 hover:text-white",
              ].join(" ")}
            >
              {l.label}
            </Link>
          ))}
          <Link
            className="ml-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            href="/contact"
          >
            Free consult
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            className="text-zinc-300"
          >
            {mobileOpen ? (
              <path
                d="M4 4L14 14M14 4L4 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ) : (
              <>
                <path d="M2 5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M2 9H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M2 13H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-white/[0.06] bg-black/95 px-4 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={[
                  "rounded-lg px-4 py-3 text-sm transition-colors",
                  pathname === l.href
                    ? "bg-white/5 text-white"
                    : "text-zinc-400 hover:text-white",
                ].join(" ")}
              >
                {l.label}
              </Link>
            ))}
            <Link
              className="mt-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-5 py-3 text-center text-sm font-semibold text-white"
              href="/contact"
              onClick={() => setMobileOpen(false)}
            >
              Free consult
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
