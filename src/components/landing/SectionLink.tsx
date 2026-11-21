"use client";

import type { ReactNode } from "react";

export const PENDING_SECTION_STORAGE_KEY = "smpn1_pending_section";

export function scrollToSection(sectionId: string) {
  if (typeof window === "undefined") return;

  if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  const target = document.getElementById(sectionId);
  if (!target) {
    try {
      window.sessionStorage.setItem(PENDING_SECTION_STORAGE_KEY, sectionId);
    } catch {
      // ignore storage errors
    }
    window.location.assign("/");
    return;
  }

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({
    behavior: prefersReduced ? "auto" : "smooth",
    block: "start",
  });
}

interface SectionButtonProps {
  targetId: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  onNavigate?: () => void;
}

export function SectionButton({
  targetId,
  children,
  className,
  ariaLabel,
  onNavigate,
}: SectionButtonProps) {
  return (
    <button
      type="button"
      data-section-target={targetId}
      aria-label={ariaLabel}
      onClick={() => {
        onNavigate?.();
        scrollToSection(targetId);
      }}
      className={className}
    >
      {children}
    </button>
  );
}
