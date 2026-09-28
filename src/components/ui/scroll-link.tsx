"use client";

import { useSmoothScrollTo } from "@/hooks/use-scroll-animation";

/**
 * An in-page link that glides with Lenis when it's running. Without
 * JavaScript it's a plain anchor, so it still works.
 */
export function ScrollLink({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: React.ReactNode;
}) {
  const scrollTo = useSmoothScrollTo();
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        scrollTo(to);
      }}
    >
      {children}
    </a>
  );
}
