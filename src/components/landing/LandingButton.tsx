"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { scrollToSection } from "./SectionLink";

type ButtonVariant = "primary" | "primary-sm" | "white";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand px-7 py-3 text-[13px] md:text-sm font-semibold text-white shadow-xs transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30",
  "primary-sm":
    "inline-flex min-h-[44px] sm:min-h-[36px] items-center justify-center rounded-full bg-brand px-5 py-2 text-[13px] font-semibold text-white transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-sm active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30",
  white:
    "inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-7 py-3 text-[13px] md:text-sm font-semibold text-brand shadow-xs transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-brand-light hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40",
};

interface LandingButtonProps {
  variant?: ButtonVariant;
  href?: string;
  targetId?: string;
  download?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
  children: ReactNode;
}

export function LandingButton({
  variant = "primary",
  href,
  targetId,
  download,
  onClick,
  ariaLabel,
  className = "",
  children,
}: LandingButtonProps) {
  const classes = `${variantClasses[variant]} ${className}`.trim();

  if (href) {
    if (download || href.startsWith("http") || href.startsWith("/api/")) {
      return (
        <a
          href={href}
          download={download || undefined}
          aria-label={ariaLabel}
          className={classes}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} aria-label={ariaLabel} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => {
        if (targetId) {
          scrollToSection(targetId);
        }
        onClick?.();
      }}
      className={classes}
    >
      {children}
    </button>
  );
}
