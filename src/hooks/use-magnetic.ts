"use client";

import { useRef, useEffect } from "react";
import { useMotionValue, useSpring } from "framer-motion";

/**
 * Magnetic element effect — element shifts toward cursor proximity
 * Returns { ref, style } to spread onto a motion element
 */
export function useMagnetic(strength: number = 0.35, radius: number = 100) {
  const ref = useRef<HTMLElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 150, damping: 15, mass: 0.1 });
  const y = useSpring(rawY, { stiffness: 150, damping: 15, mass: 0.1 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);

      if (dist < radius) {
        rawX.set(distX * strength);
        rawY.set(distY * strength);
      } else {
        rawX.set(0);
        rawY.set(0);
      }
    };

    const onMouseLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    el.addEventListener("mousemove", onMouseMove as EventListener);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mousemove", onMouseMove as EventListener);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [rawX, rawY, strength, radius]);

  return { ref, style: { x, y } };
}
