"use client";

import Link from "next/link";
import Image from "next/image";

export function FooterNew() {
  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement, options?: { offset?: number }) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(el, { offset: 0 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 px-6 pb-8 pt-24">
      {/* Top fade gradient */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black/50" />

      <div className="relative mx-auto max-w-6xl">
        {/* Main footer content */}
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr] pb-16">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-2 -ml-2">
              <Image
                src="/logo.png"
                alt="Zaila AI Designs"
                width={280}
                height={80}
                className="h-[201px] w-auto object-contain"
              />
            </div>
            <p className="text-[15px] leading-[1.8] text-zinc-400 max-w-xs mb-8">
              AI-powered web design and automation for businesses that want to grow.
            </p>
            <Link
              href="mailto:zailaaidesigns@gmail.com"
              className="inline-flex items-center gap-2 text-[14px] text-zinc-400 hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
              zailaaidesigns@gmail.com
            </Link>
          </div>

          {/* Navigation columns */}
          <div>
            <h3 className="text-[12px] uppercase tracking-[0.2em] text-zinc-500 mb-6">
              Navigation
            </h3>
            <nav className="space-y-4">
              {[
                { label: "Services", id: "services" },
                { label: "Process", id: "process" },
                { label: "Work", id: "testimonials" },
                { label: "Contact", id: "contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="block text-[14px] text-zinc-400 hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-[12px] uppercase tracking-[0.2em] text-zinc-500 mb-6">
              Services
            </h3>
            <nav className="space-y-4">
              <span className="block text-[14px] text-zinc-400">Websites</span>
              <span className="block text-[14px] text-zinc-400">AI Chatbots</span>
              <span className="block text-[14px] text-zinc-400">Automation</span>
              <span className="block text-[14px] text-zinc-400">Growth Plans</span>
            </nav>
          </div>

          <div>
            <h3 className="text-[12px] uppercase tracking-[0.2em] text-zinc-500 mb-6">
              Contact
            </h3>
            <div className="space-y-4">
              <Link
                href="mailto:zailaaidesigns@gmail.com"
                className="block text-[14px] text-zinc-400 hover:text-white transition-colors"
              >
                zailaaidesigns@gmail.com
              </Link>
              <span className="block text-[14px] text-zinc-400">Hamilton, ON</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-zinc-600">
            &copy; {currentYear} Zaila AI Designs. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[13px] text-zinc-500">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
