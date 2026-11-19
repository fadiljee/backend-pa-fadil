"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GraduationCap, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavbarProps {
  isLoggedIn: boolean;
  schoolName: string;
  schoolSubtitle: string;
}

const navLinks = [
  { href: "#home", label: "Beranda" },
  { href: "#materi", label: "Materi" },
  { href: "#tentang", label: "Tentang" },
  { href: "#galeri", label: "Galeri" },
  { href: "#kontak", label: "Kontak" },
];

export function Navbar({ isLoggedIn, schoolName, schoolSubtitle }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navListRef = useRef<HTMLUListElement>(null);

  const adminHref = isLoggedIn ? "/admin" : "/login";
  const adminLabel = isLoggedIn ? "Panel Admin" : "Masuk Admin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const navList = navListRef.current;
    if (!navList) return;
    const links = Array.from(navList.querySelectorAll<HTMLAnchorElement>("a[href^='#']"));

    const targets = links
      .map((l) => document.getElementById(l.getAttribute("href")?.slice(1) ?? ""))
      .filter((el): el is HTMLElement => Boolean(el));

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            links.forEach((link) => {
              const isActive = link.getAttribute("href") === `#${id}`;
              link.classList.toggle("target-current", isActive);
              link.setAttribute("aria-current", isActive ? "true" : "false");
            });
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 h-16 bg-white transition-shadow ${
        scrolled ? "shadow-sm" : "border-b border-slate-100"
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1080px] items-center justify-between px-5 md:px-8 lg:px-12">
        <Link href="/" className="flex min-h-11 items-center gap-2.5 text-heading">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-primary text-white">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col">
            <span className="text-[11px] font-medium leading-tight text-muted-foreground">
              {schoolName}
            </span>
            <span className="text-sm font-extrabold leading-tight text-heading">
              {schoolSubtitle}
            </span>
          </span>
        </Link>

        <nav aria-label="Utama" className="hidden items-center gap-6 lg:flex">
          <ul ref={navListRef} className="scrollspy-nav flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex min-h-11 items-center border-b-2 border-transparent text-[13px] font-semibold text-heading transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href={adminHref}
            className="inline-flex min-h-11 items-center rounded-[10px] bg-primary px-5 text-[13px] font-semibold text-white shadow-(--shadow-btn) transition hover:bg-primary-dark"
          >
            {adminLabel}
          </Link>
        </nav>

        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetTrigger
            render={
              <button
                type="button"
                aria-label="Buka menu navigasi"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[10px] border border-slate-200 bg-white text-heading hover:bg-soft lg:hidden"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            }
          />
          <SheetContent side="right" className="w-[78dvw] max-w-[320px] p-0">
            <SheetHeader className="border-b border-soft px-5 py-4 text-left">
              <SheetTitle className="text-sm font-bold text-heading">Menu</SheetTitle>
            </SheetHeader>

            <nav aria-label="Menu mobile" className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="divide-y divide-soft">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className="flex min-h-11 items-center py-2 text-sm font-semibold text-heading hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-soft p-5">
              <Link
                href={adminHref}
                onClick={() => setDrawerOpen(false)}
                className="flex min-h-11 w-full items-center justify-center rounded-[10px] bg-primary px-6 text-sm font-semibold text-white shadow-(--shadow-btn) hover:bg-primary-dark"
              >
                {adminLabel}
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Indikator progres baca berbasis CSS scroll-driven animation */}
      <div
        aria-hidden="true"
        className="scroll-progress-bar pointer-events-none absolute inset-x-0 bottom-0 hidden h-[3px] bg-primary motion-safe:[@supports(animation-timeline:scroll())]:block"
      />
    </header>
  );
}
