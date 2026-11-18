"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";

interface NavbarProps {
  isLoggedIn: boolean;
}

const navLinks = [
  { href: "#home", label: "Beranda" },
  { href: "#materi", label: "Materi" },
  { href: "#tentang", label: "Tentang" },
  { href: "#galeri", label: "Galeri" },
  { href: "#kontak", label: "Kontak" },
];

export function Navbar({ isLoggedIn }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDialogElement>(null);
  const drawerId = useId();

  const adminHref = isLoggedIn ? "/admin" : "/login";
  const adminLabel = isLoggedIn ? "Panel Admin" : "Masuk Admin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function openDrawer() {
    const dialog = drawerRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    setDrawerOpen(true);
  }

  function closeDrawer() {
    drawerRef.current?.close();
    setDrawerOpen(false);
  }

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
            <span className="text-[11px] font-medium leading-tight text-muted">
              SMPN 1 Merawang
            </span>
            <span className="text-sm font-extrabold leading-tight text-heading">
              Portal Sekolah
            </span>
          </span>
        </Link>

        <nav aria-label="Utama" className="hidden items-center gap-6 lg:flex">
          <ul className="flex items-center gap-7">
            {navLinks.map((link, idx) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`inline-flex min-h-11 items-center text-[13px] font-semibold transition-colors hover:text-primary ${
                    idx === 0 ? "text-primary" : "text-heading"
                  }`}
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

        <button
          type="button"
          onClick={openDrawer}
          aria-label="Buka menu navigasi"
          aria-expanded={drawerOpen}
          aria-controls={drawerId}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[10px] border border-slate-200 bg-white text-heading hover:bg-soft lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <dialog
        id={drawerId}
        ref={drawerRef}
        aria-label="Menu navigasi"
        onClose={() => setDrawerOpen(false)}
        onClick={(e) => {
          if (e.target === drawerRef.current) closeDrawer();
        }}
        className="m-0 ml-auto h-dvh max-h-dvh w-[78dvw] max-w-[320px] border-0 bg-white p-0 text-heading shadow-2xl"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-soft px-5">
            <span className="text-sm font-bold text-heading">Menu</span>
            <button
              type="button"
              autoFocus
              onClick={closeDrawer}
              aria-label="Tutup menu navigasi"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[10px] text-heading hover:bg-soft"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Menu mobile" className="flex-1 overflow-y-auto px-5 py-4">
            <ul className="divide-y divide-soft">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={closeDrawer}
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
              onClick={closeDrawer}
              className="flex min-h-11 w-full items-center justify-center rounded-[10px] bg-primary px-6 text-sm font-semibold text-white shadow-(--shadow-btn) hover:bg-primary-dark"
            >
              {adminLabel}
            </Link>
          </div>
        </div>
      </dialog>
    </header>
  );
}
