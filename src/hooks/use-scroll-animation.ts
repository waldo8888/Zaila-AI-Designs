"use client";

import { useEffect, useRef, useState, useCallback, RefObject } from "react";

// Hook for tracking scroll progress within a section
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress: 0 when element enters viewport, 1 when it leaves
      const start = windowHeight;
      const end = -rect.height;
      const current = rect.top;

      const progress = Math.max(0, Math.min(1, (start - current) / (start - end)));
      setProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref]);

  return progress;
}

// Hook for detecting when element is in viewport
export function useInViewport(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// Hook for parallax effect
export function useParallax(speed = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const distance = elementCenter - viewportCenter;
      setOffset(distance * speed);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return { ref, offset };
}

// Hook for sticky section with scroll progress
export function useStickyScroll(stickyHeight = "200vh") {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const windowHeight = window.innerHeight;

      // Calculate sticky progress
      const scrollableDistance = containerHeight - windowHeight;
      const scrolled = -rect.top;

      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      setProgress(progress);
      setIsSticky(rect.top <= 0 && rect.bottom >= windowHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { containerRef, progress, isSticky };
}

// Hook for text reveal animation
export function useTextReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setRevealed(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay]);

  return { ref, revealed };
}

// Smooth scroll to element (uses Lenis if available, falls back to native)
export function smoothScrollTo(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Access Lenis instance from the global scope if available
  const lenis = (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement, options?: { offset?: number }) => void } }).__lenis;
  if (lenis) {
    lenis.scrollTo(element, { offset: 0 });
  } else {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

// Get scroll direction
export function useScrollDirection() {
  const [direction, setDirection] = useState<"up" | "down">("down");
  const [prevScroll, setPrevScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setDirection(currentScroll > prevScroll ? "down" : "up");
      setPrevScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScroll]);

  return direction;
}
