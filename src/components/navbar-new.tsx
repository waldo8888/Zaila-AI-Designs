"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useSmoothScroll } from "@/components/smooth-scroll";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const lenis = useSmoothScroll();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      // Pause Lenis while menu is open
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, lenis]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    lastScrollY.current = latest;

    // Show/hide based on scroll direction
    if (latest > 100) {
      setScrolled(true);
      if (latest > previous && latest > 300) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    } else {
      setScrolled(false);
      setHidden(false);
    }
  });

  function handleNav(id: string) {
    setMobileOpen(false);
    if (isHome) {
      const el = document.getElementById(id);
      if (!el) return;
      if (lenis) {
        lenis.scrollTo(el, { offset: 0 });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/#${id}`);
    }
  }

  const navItems = [
    { label: "Services", id: "services" },
    { label: "Process", id: "process" },
    { label: "Work", href: "/growth-stories" },
    { label: "Blog", href: "/blog" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "py-3"
          : "py-5"
          }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="group relative z-10">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2"
            >
              <Image
                src="/logo.png"
                alt="Zaila AI Designs"
                width={80}
                height={80}
                className="w-20 h-16 md:h-20 object-contain drop-shadow-[0_0_12px_rgba(217,70,239,0.3)]"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop nav - pill style */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`hidden md:flex items-center gap-1 rounded-full px-2 py-1.5 transition-all duration-500 ${scrolled
              ? "bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06]"
              : "bg-transparent"
              }`}
          >
            {navItems.map((item, i) => (
              <DesktopNavItem key={item.label} item={item} i={i} handleNav={handleNav} />
            ))}
          </motion.nav>

          {/* CTA Button */}
          <motion.button
            onClick={() => handleNav("contact")}
            className="hidden md:flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-[13px] font-medium text-black transition-all hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)]"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span>Start Project</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:translate-x-0.5">
              <path d="M2 7H12M12 7L7 2M12 7L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>

          {/* Mobile toggle */}
          <motion.button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05] md:hidden"
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-5 h-5">
              <motion.span
                className="absolute left-0 w-5 h-0.5 bg-white rounded-full"
                animate={{
                  top: mobileOpen ? "50%" : "30%",
                  rotate: mobileOpen ? 45 : 0,
                  y: mobileOpen ? "-50%" : 0,
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 top-1/2 w-5 h-0.5 bg-white rounded-full -translate-y-1/2"
                animate={{ opacity: mobileOpen ? 0 : 1, x: mobileOpen ? -10 : 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 w-5 h-0.5 bg-white rounded-full"
                animate={{
                  top: mobileOpen ? "50%" : "70%",
                  rotate: mobileOpen ? -45 : 0,
                  y: mobileOpen ? "-50%" : 0,
                }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile menu - full screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl md:hidden"
          >
            <nav className="flex flex-col items-center justify-center h-full gap-8 px-6">
              <Image
                src="/logo.png"
                alt="Zaila AI Designs"
                width={280}
                height={84}
                className="h-20 md:h-24 w-auto object-contain drop-shadow-[0_0_12px_rgba(217,70,239,0.3)] mb-4"
              />
              {navItems.map((item, i) => (
                <MobileNavItem key={item.label} item={item} i={i} handleNav={handleNav} setMobileOpen={setMobileOpen} />
              ))}
              <motion.button
                onClick={() => handleNav("contact")}
                className="mt-8 rounded-full bg-white px-10 py-4 text-[16px] font-medium text-black"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
              >
                Start a Project
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function DesktopNavItem({ item, i, handleNav }: { item: any; i: number; handleNav: (id: string) => void }) {
  if ("href" in item && item.href) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + i * 0.05 }}
      >
        <Link
          href={item.href}
          className="group relative px-5 py-2 text-[13px] text-zinc-400 transition-colors hover:text-white"
        >
          <span className="relative z-10">{item.label}</span>
        </Link>
      </motion.div>
    );
  }
  return (
    <motion.button
      onClick={() => handleNav(item.id!)}
      className="group relative px-5 py-2 text-[13px] text-zinc-400 transition-colors hover:text-white"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + i * 0.05 }}
    >
      <span className="relative z-10">{item.label}</span>
      <motion.div
        className="absolute inset-0 rounded-full bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity"
        layoutId="nav-hover"
      />
    </motion.button>
  );
}

function MobileNavItem({ item, i, handleNav, setMobileOpen }: { item: any; i: number; handleNav: (id: string) => void; setMobileOpen: (v: boolean) => void }) {
  if ("href" in item && item.href) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.1 + i * 0.05 }}
      >
        <Link
          href={item.href}
          onClick={() => setMobileOpen(false)}
          className="text-[32px] font-semibold text-white tracking-tight"
        >
          {item.label}
        </Link>
      </motion.div>
    );
  }
  return (
    <motion.button
      onClick={() => handleNav(item.id!)}
      className="text-[32px] font-semibold text-white tracking-tight"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: 0.1 + i * 0.05 }}
    >
      {item.label}
    </motion.button>
  );
}
