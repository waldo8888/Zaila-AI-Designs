"use client";

import { motion } from "framer-motion";
import { useInViewport } from "@/hooks/use-scroll-animation";

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  type?: "chars" | "words" | "lines";
}

export function SplitText({
  children,
  className = "",
  delay = 0,
  staggerDelay = 0.02,
  type = "chars",
}: SplitTextProps) {
  const { ref, isInView } = useInViewport(0.3);

  const splitContent = () => {
    if (type === "chars") {
      return children.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: delay + i * staggerDelay,
            ease: [0.25, 0.1, 0, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ));
    }

    if (type === "words") {
      return children.split(" ").map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: delay + i * staggerDelay * 3,
            ease: [0.25, 0.1, 0, 1],
          }}
        >
          {word}
        </motion.span>
      ));
    }

    return children;
  };

  return (
    <span ref={ref} className={className}>
      {splitContent()}
    </span>
  );
}

// Reveal container with mask animation
export function RevealText({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isInView } = useInViewport(0.2);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : {}}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.25, 0.1, 0, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Fade up animation
export function FadeUp({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isInView } = useInViewport(0.2);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1,
        delay,
        ease: [0.25, 0.1, 0, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Scale reveal
export function ScaleReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isInView } = useInViewport(0.2);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.25, 0.1, 0, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Line reveal with gradient mask
export function LineReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isInView } = useInViewport(0.3);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-black via-black to-transparent z-10"
        initial={{ x: 0 }}
        animate={isInView ? { x: "100%" } : {}}
        transition={{
          duration: 1.2,
          delay,
          ease: [0.25, 0.1, 0, 1],
        }}
      />
      {children}
    </div>
  );
}
