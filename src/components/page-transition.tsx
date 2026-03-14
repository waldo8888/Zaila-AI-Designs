"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAnimate } from "framer-motion";

export function PageTransition() {
  const pathname = usePathname();
  const [scope, animate] = useAnimate();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    async function runTransition() {
      // Sweep up from bottom, covering screen
      await animate(
        scope.current,
        { y: "0%" },
        { duration: 0.4, ease: [0.76, 0, 0.24, 1] }
      );

      // Reset scroll while screen is black
      window.scrollTo(0, 0);

      // Brief hold
      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      // Exit upward off screen
      await animate(
        scope.current,
        { y: "-100%" },
        { duration: 0.5, ease: [0.76, 0, 0.24, 1] }
      );

      // Reset silently below viewport for next navigation
      animate(scope.current, { y: "100%" }, { duration: 0 });
    }

    runTransition();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={scope}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        transform: "translateY(100%)",
        zIndex: 10000,
        pointerEvents: "none",
        background: `linear-gradient(
          to bottom,
          rgba(192, 132, 252, 0.35) 0%,
          rgba(232, 121, 249, 0.15) 3%,
          rgba(0, 0, 0, 1) 8%,
          rgba(0, 0, 0, 1) 100%
        )`,
        willChange: "transform",
      }}
    />
  );
}
