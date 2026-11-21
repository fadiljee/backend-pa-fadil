"use client";

import { useEffect, useRef, useState } from "react";

type RevealVariant = "up" | "scale" | "left" | "right";

const hiddenTransformByVariant: Record<RevealVariant, string> = {
  up: "translate-y-5 opacity-0",
  scale: "translate-y-4 scale-[0.97] opacity-0",
  left: "-translate-x-5 opacity-0",
  right: "translate-x-5 opacity-0",
};

export function Reveal({
  children,
  delayMs = 0,
  variant = "up",
  className = "",
}: {
  children: React.ReactNode;
  delayMs?: number;
  variant?: RevealVariant;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={`transition-[transform,opacity] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        visible
          ? "translate-x-0 translate-y-0 scale-100 opacity-100"
          : hiddenTransformByVariant[variant]
      } ${className}`}
    >
      {children}
    </div>
  );
}
