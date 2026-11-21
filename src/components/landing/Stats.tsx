"use client";

import { useEffect, useRef, useState } from "react";
import { GraduationCap, Trophy, UserCheck, Users } from "lucide-react";
import { STATS_HEADER, type StatItemData } from "@/lib/content";
import { Confetti } from "./Confetti";
import { SectionTitle } from "./SectionTitle";

interface StatsProps {
  items: StatItemData[];
}

function StatIcon({ type }: { type: StatItemData["icon"] }) {
  const cls = "h-14 w-14 lg:h-[72px] lg:w-[72px] text-white";
  switch (type) {
    case "trophy":
      return <Trophy className={cls} strokeWidth={1.5} aria-hidden="true" />;
    case "users":
      return <Users className={cls} strokeWidth={1.5} aria-hidden="true" />;
    case "students":
      return <UserCheck className={cls} strokeWidth={1.5} aria-hidden="true" />;
    case "cap":
      return <GraduationCap className={cls} strokeWidth={1.5} aria-hidden="true" />;
  }
}

function CountUpValue({
  target,
  suffix,
  active,
  reducedMotion,
}: {
  target: number;
  suffix: string;
  active: boolean;
  reducedMotion: boolean;
}) {
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    if (!active) return;
    if (reducedMotion || target <= 0) {
      setDisplay(target);
      return;
    }

    const duration = 1400;
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    setDisplay(0);
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active, target, reducedMotion]);

  return (
    <span className="tabular-nums">
      {display.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}

export function Stats({ items }: StatsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setReducedMotion(prefersReduced);
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="statistik"
      tabIndex={-1}
      aria-label={STATS_HEADER.title}
      className="relative scroll-mt-[88px] w-full overflow-hidden bg-brand py-[72px] text-white lg:py-[96px]"
    >
      <Confetti variant="red" preset="stats" />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 text-center md:px-8 lg:px-12">
        <div className="mx-auto flex justify-center">
          <GraduationCap
            className="h-14 w-14 text-white"
            strokeWidth={1.6}
            aria-hidden="true"
          />
        </div>

        <SectionTitle
          tone="light"
          title={STATS_HEADER.title}
          subtitle={STATS_HEADER.subtitle}
          className="mt-3"
        />

        <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col items-center text-center">
              <StatIcon type={item.icon} />
              <p className="mt-4 text-[36px] font-bold leading-none text-white md:text-[44px] lg:text-[52px]">
                <CountUpValue
                  target={item.target}
                  suffix={item.suffix}
                  active={visible}
                  reducedMotion={reducedMotion}
                />
              </p>
              <p className="mt-2 text-[13px] font-normal text-white md:text-sm">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
