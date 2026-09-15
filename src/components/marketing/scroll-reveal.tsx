"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: "fade-up" | "stagger-cards" | "slide-clip" | "draw-path" | "timeline-step";
  delayMs?: number;
  as?: React.ElementType;
}

export function ScrollReveal({
  children,
  className = "",
  variant = "fade-up",
  delayMs = 0,
  as: Component = "div",
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  const variantClass = {
    "fade-up": "lm-scroll-fade-up",
    "stagger-cards": "lm-scroll-stagger",
    "slide-clip": "lm-scroll-clip",
    "draw-path": "lm-scroll-draw",
    "timeline-step": "lm-scroll-timeline",
  }[variant];

  return (
    <Component
      ref={elementRef}
      className={`${variantClass} ${isVisible ? "is-revealed" : ""} ${className}`}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </Component>
  );
}
