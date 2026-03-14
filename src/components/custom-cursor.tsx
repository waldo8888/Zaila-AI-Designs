"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorMode = "default" | "hover" | "view" | "drag" | "text";

export function CustomCursor() {
  const [mode, setMode] = useState<CursorMode>("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) {
      setIsTouch(true);
      return;
    }

    document.body.style.cursor = "none";

    const style = document.createElement("style");
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const closest = (sel: string) => target.closest(sel);

      // Check for data-cursor attribute first
      const cursorEl = target.closest("[data-cursor]") as HTMLElement | null;
      if (cursorEl) {
        const val = cursorEl.dataset.cursor as CursorMode;
        setMode(val || "hover");
        return;
      }

      // Check for text inputs
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      ) {
        setMode("text");
        return;
      }

      // Standard interactive elements
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        closest("a") ||
        closest("button") ||
        target.classList.contains("interactive")
      ) {
        setMode("hover");
        return;
      }

      setMode("default");
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.body.style.cursor = "auto";
      document.head.removeChild(style);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouch) return null;

  const isHovered = mode !== "default";

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-8 w-8 rounded-full border border-fuchsia-500/50 mix-blend-difference hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
          backgroundColor: isHovered ? "rgba(217, 70, 239, 0.1)" : "transparent",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />


      {/* Inner Dot — hidden when label is showing */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[10000] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: 13,
          translateY: 13,
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
