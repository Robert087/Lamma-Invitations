"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function CinematicScene({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element?.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.classList.add("is-visible");
      observer.unobserve(element);
    }, { threshold: 0.14, rootMargin: "0px 0px -32px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <section className={`lm-cinematic-scene ${className}`} ref={ref}>{children}</section>;
}
