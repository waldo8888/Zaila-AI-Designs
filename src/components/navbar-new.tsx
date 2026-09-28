"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useSmoothScroll } from "@/components/smooth-scroll";
import { ChipMark } from "@/components/ui/chip-mark";

type NavItem =
  | { type: "section"; label: string; id: string }
  | { type: "link"; label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { type: "section", label: "Services", id: "services" },
  { type: "section", label: "Process", id: "process" },
  { type: "link", label: "How we work", href: "/growth-stories" },
  { type: "link", label: "Blog", href: "/blog" },
  { type: "link", label: "Pricing", href: "/pricing" },
];

/**
 * The nav (spec §5). Night theme by default; over the day chapters the story
 * director sets <html data-nav-theme="day"> and the colours follow the --nav-*
 * variables in globals.css. On the homepage it marks the section under the
 * middle of the screen as current.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const lenis = useSmoothScroll();
  const currentId = isHome ? current : null;

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

  // Which homepage section crosses the middle of the screen
  useEffect(() => {
    if (!isHome) return;
    const sections = NAV_ITEMS.flatMap((item) =>
      item.type === "section" ? [document.getElementById(item.id)] : []
    ).filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) setCurrent(id);
          else setCurrent((value) => (value === id ? null : value));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

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

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0, 1] }}
        data-menu-open={mobileOpen ? "" : undefined}
        className={`site-nav fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "py-3 bg-(--nav-scrolled) backdrop-blur-xl"
          : "py-5"
          }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 lg:px-20">
          {/* Logo */}
          <Link href="/" className="group relative z-10">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 font-display text-[15px] font-extrabold tracking-[-0.02em] text-(--nav-text) transition-colors lg:gap-2.5 lg:text-[17px]"
            >
              <ChipMark className="size-6 text-(--nav-mark) transition-colors lg:size-7" />
              <span>Zaila AI Designs</span>
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <motion.nav
            aria-label="Main"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden items-center gap-8 lg:flex"
          >
            {NAV_ITEMS.map((item, i) => (
              <DesktopNavItem
                key={item.label}
                item={item}
                i={i}
                current={item.type === "section" && item.id === currentId}
                handleNav={handleNav}
              />
            ))}
          </motion.nav>

          {/* CTA Button */}
          <motion.button
            onClick={() => handleNav("contact")}
            className="hidden h-11 items-center rounded-full bg-(--nav-cta-bg) px-[22px] text-sm font-semibold text-(--nav-cta-text) transition-colors hover:bg-(--nav-cta-hover) lg:inline-flex"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Start Your Project
          </motion.button>

          {/* Mobile toggle */}
          <motion.button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-(--nav-toggle-border) bg-(--nav-toggle-bg) transition-colors lg:hidden"
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-5 h-5">
              <motion.span
                className="absolute left-0 w-5 h-0.5 bg-(--nav-toggle-bar) rounded-full"
                animate={{
                  top: mobileOpen ? "50%" : "30%",
                  rotate: mobileOpen ? 45 : 0,
                  y: mobileOpen ? "-50%" : 0,
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 top-1/2 w-5 h-0.5 bg-(--nav-toggle-bar) rounded-full -translate-y-1/2"
                animate={{ opacity: mobileOpen ? 0 : 1, x: mobileOpen ? -10 : 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 w-5 h-0.5 bg-(--nav-toggle-bar) rounded-full"
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
            className="fixed inset-0 z-40 bg-night/95 backdrop-blur-2xl lg:hidden"
          >
            <nav aria-label="Main" className="flex flex-col items-center justify-center h-full gap-8 px-6">
              <div className="mb-4 flex items-center gap-3 font-display text-2xl font-extrabold tracking-[-0.02em] text-night-text">
                <ChipMark className="size-10 text-brand-glow" />
                <span>Zaila AI Designs</span>
              </div>
              {NAV_ITEMS.map((item, i) => (
                <MobileNavItem key={item.label} item={item} i={i} handleNav={handleNav} setMobileOpen={setMobileOpen} />
              ))}
              <motion.button
                onClick={() => handleNav("contact")}
                className="mt-8 rounded-full bg-night-text px-10 py-4 text-[16px] font-semibold text-night"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
              >
                Start Your Project
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const desktopLinkClass =
  "text-sm text-(--nav-muted) transition-colors hover:text-(--nav-text) aria-[current=true]:font-semibold aria-[current=true]:text-(--nav-text)";

function DesktopNavItem({
  item,
  i,
  current,
  handleNav,
}: {
  item: NavItem;
  i: number;
  current: boolean;
  handleNav: (id: string) => void;
}) {
  const entrance = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.3 + i * 0.05 },
  };
  if (item.type === "link") {
    return (
      <motion.div {...entrance}>
        <Link href={item.href} className={desktopLinkClass}>
          {item.label}
        </Link>
      </motion.div>
    );
  }
  return (
    <motion.button
      {...entrance}
      onClick={() => handleNav(item.id)}
      aria-current={current ? "true" : undefined}
      className={desktopLinkClass}
    >
      {item.label}
    </motion.button>
  );
}

function MobileNavItem({
  item,
  i,
  handleNav,
  setMobileOpen,
}: {
  item: NavItem;
  i: number;
  handleNav: (id: string) => void;
  setMobileOpen: (v: boolean) => void;
}) {
  if (item.type === "link") {
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
      onClick={() => handleNav(item.id)}
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
