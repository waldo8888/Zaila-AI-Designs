"use client";

import { useEffect, useRef } from "react";
import { useSmoothScroll } from "@/components/smooth-scroll";

const proofItems = [
  { metric: "48hr", label: "Average launch time" },
  { metric: "99", label: "Lighthouse score" },
  { metric: "3x", label: "Avg. lead increase" },
  { metric: "60%", label: "Cost savings vs agencies" },
  { metric: "$0", label: "Lock-in contracts" },
  { metric: "24/7", label: "AI chatbot uptime" },
];

function MarqueeRow({
  items,
  direction,
  baseDuration,
  velocityRef,
}: {
  items: typeof proofItems;
  direction: "left" | "right";
  baseDuration: number;
  velocityRef: React.RefObject<number>;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const posRef = useRef(0);
  const pausedRef = useRef(false);

  // Pixel-per-frame velocity-based marquee
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    // Clone content width (duplicated for seamless loop)
    const getContentWidth = () => row.scrollWidth / 2;

    function animate() {
      if (!row) return;

      const speed = pausedRef.current ? 0.2 : Math.max(0.5, 0.8 + Math.abs(velocityRef.current ?? 0) * 0.3);
      const sign = direction === "left" ? -1 : 1;

      posRef.current += sign * speed;

      const contentWidth = getContentWidth();
      if (direction === "left" && posRef.current <= -contentWidth) {
        posRef.current += contentWidth;
      } else if (direction === "right" && posRef.current >= 0) {
        posRef.current -= contentWidth;
      }

      row.style.transform = `translateX(${posRef.current}px)`;
      frameRef.current = requestAnimationFrame(animate);
    }

    // Start at correct offset for right-direction row
    if (direction === "right") {
      posRef.current = -(rowRef.current?.scrollWidth ?? 0) / 2;
    }

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [direction, velocityRef, baseDuration]);

  const doubled = [...items, ...items];

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <div
        ref={rowRef}
        className="flex items-center gap-0 will-change-transform"
        style={{ width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center">
            <div className="flex items-center gap-3 px-8 py-3">
              <span className="text-[22px] md:text-[28px] font-bold bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent leading-none tabular-nums">
                {item.metric}
              </span>
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider whitespace-nowrap">
                {item.label}
              </span>
            </div>
            <span className="text-fuchsia-500/25 text-sm select-none">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SocialProofStrip() {
  const lenis = useSmoothScroll();
  const velocityRef = useRef<number>(0);

  // Subscribe to Lenis scroll to capture velocity
  useEffect(() => {
    if (!lenis) return;
    const onScroll = ({ velocity }: { velocity: number }) => {
      velocityRef.current = velocity;
    };
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Divider lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <p className="text-center text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-10">
        By the numbers
      </p>

      <div className="space-y-4">
        <MarqueeRow
          items={proofItems}
          direction="left"
          baseDuration={30}
          velocityRef={velocityRef}
        />
        <MarqueeRow
          items={proofItems}
          direction="right"
          baseDuration={35}
          velocityRef={velocityRef}
        />
      </div>
    </section>
  );
}
