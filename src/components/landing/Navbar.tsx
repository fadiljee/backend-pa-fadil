"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mail, MapPin, Menu, Phone, School, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scrollToSection } from "./SectionLink";

interface NavbarProps {
  schoolName: string;
  schoolSubtitle: string;
  contactAddress: string;
  contactEmail: string;
  contactPhone: string;
}

const navLinks = [
  { targetId: "home", label: "Beranda" },
  { targetId: "profil", label: "Profil" },
  { targetId: "materi", label: "Akademik" },
  { targetId: "galeri", label: "Kegiatan" },
  { targetId: "berita", label: "Berita" },
  { targetId: "lokasi", label: "Lokasi" },
  { targetId: "kontak", label: "Kontak" },
];

export function Navbar({
  schoolName,
  schoolSubtitle,
  contactAddress,
  contactEmail,
  contactPhone,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navListRef = useRef<HTMLUListElement>(null);
  const drawerRef = useRef<HTMLDialogElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const navList = navListRef.current;
    if (!navList) return;
    const buttons = Array.from(
      navList.querySelectorAll<HTMLButtonElement>("button[data-section-target]")
    );

    const targets = buttons
      .map((btn) => document.getElementById(btn.dataset.sectionTarget ?? ""))
      .filter((el): el is HTMLElement => Boolean(el));

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            buttons.forEach((btn) => {
              const isActive = btn.dataset.sectionTarget === id;
              btn.classList.toggle("target-current", isActive);
              btn.setAttribute("aria-current", isActive ? "true" : "false");
            });
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  const openDrawer = useCallback(async () => {
    const drawer = drawerRef.current;
    const scroller = scrollerRef.current;
    if (!drawer || !scroller || drawer.open) return;

    drawer.showModal();

    if (typeof CSS === "undefined" || !CSS.supports("scroll-initial-target", "nearest")) {
      scroller.scrollTo({ left: 0, behavior: "instant" });
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
    }

    scroller.scrollTo({ left: scroller.scrollWidth, behavior: "auto" });
  }, []);

  const closeDrawer = useCallback(() => {
    const drawer = drawerRef.current;
    const scroller = scrollerRef.current;
    if (!drawer || !scroller || !drawer.open) return;
    scroller.scrollTo({ left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const drawer = drawerRef.current;
    const scroller = scrollerRef.current;
    const sheet = sheetRef.current;
    if (!drawer || !scroller || !sheet) return;

    const visibleThreshold = 1 / Math.max(window.innerWidth, 320);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.at(-1);
        if (!entry || !drawer.open) return;

        if (entry.intersectionRatio < visibleThreshold) {
          drawer.close();
          setDrawerOpen(false);
        } else if (entry.intersectionRatio >= 0.99) {
          setDrawerOpen(true);
        }
      },
      { root: drawer, threshold: [visibleThreshold, 0.99] }
    );
    observer.observe(sheet);

    const handleCancel = (event: Event) => {
      if (event.cancelable) {
        event.preventDefault();
        closeDrawer();
      }
    };
    drawer.addEventListener("cancel", handleCancel);

    const handleClose = () => setDrawerOpen(false);
    drawer.addEventListener("close", handleClose);

    const supportsScrollTimeline =
      typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()");

    const handleFallbackBackdrop = () => {
      if (sheet.offsetWidth <= 0) return;
      const ratio = Math.min(1, Math.max(0, scroller.scrollLeft / sheet.offsetWidth));
      drawer.style.setProperty("--drawer-backdrop", String(ratio));
    };

    if (!supportsScrollTimeline) {
      scroller.addEventListener("scroll", handleFallbackBackdrop, { passive: true });
    }

    return () => {
      observer.disconnect();
      drawer.removeEventListener("cancel", handleCancel);
      drawer.removeEventListener("close", handleClose);
      if (!supportsScrollTimeline) {
        scroller.removeEventListener("scroll", handleFallbackBackdrop);
      }
    };
  }, [closeDrawer]);

  const hasTopBar = Boolean(contactAddress || contactPhone || contactEmail);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-shadow ${
        scrolled ? "shadow-md" : "border-b border-slate-200/80"
      }`}
    >
      {/* Top Crimson Bar (matches reference top strip) */}
      {hasTopBar && (
        <div className="hidden w-full bg-crimson text-white md:block">
          <div className="mx-auto flex w-full max-w-[1360px] items-center justify-between gap-4 px-6 py-2 text-xs lg:px-14">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
              {contactAddress && (
                <span className="inline-flex items-center gap-1.5 text-white/95">
                  <MapPin className="h-3.5 w-3.5 text-gold-light" aria-hidden="true" />
                  <span>{contactAddress}</span>
                </span>
              )}
              {contactPhone && (
                <a
                  href={`tel:${contactPhone}`}
                  className="inline-flex items-center gap-1.5 text-white/95 hover:underline"
                >
                  <Phone className="h-3.5 w-3.5 text-gold-light" aria-hidden="true" />
                  <span>{contactPhone}</span>
                </a>
              )}
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-1.5 text-white/95 hover:underline"
                >
                  <Mail className="h-3.5 w-3.5 text-gold-light" aria-hidden="true" />
                  <span>{contactEmail}</span>
                </a>
              )}
            </div>

            <div className="flex items-center gap-4 text-white/95">
              <button
                type="button"
                onClick={() => scrollToSection("profil")}
                className="font-medium hover:text-gold-light hover:underline"
              >
                Visi &amp; Misi
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("berita")}
                className="font-medium hover:text-gold-light hover:underline"
              >
                Pengumuman
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("lokasi")}
                className="font-medium hover:text-gold-light hover:underline"
              >
                Peta Sekolah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main White Navigation Bar */}
      <div className="mx-auto flex h-16 w-full max-w-[1360px] items-center justify-between gap-4 px-4 sm:h-[74px] sm:px-6 md:px-10 lg:px-14">
        <button
          type="button"
          onClick={() => scrollToSection("home")}
          className="flex min-h-11 items-center gap-3 text-left text-ink"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-crimson text-gold-light shadow-sm ring-2 ring-crimson/15">
            <School className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col">
            <span className="font-heading text-base font-extrabold uppercase leading-tight tracking-tight text-crimson sm:text-lg">
              {schoolName}
            </span>
            <span className="text-[11px] font-semibold tracking-wide text-muted">
              {schoolSubtitle}
            </span>
          </span>
        </button>

        <nav aria-label="Utama" className="hidden items-center gap-6 lg:flex">
          <ul ref={navListRef} className="scrollspy-nav flex items-center gap-5 xl:gap-6">
            {navLinks.map((link) => (
              <li key={link.targetId}>
                <button
                  type="button"
                  data-section-target={link.targetId}
                  onClick={() => scrollToSection(link.targetId)}
                  className="inline-flex min-h-11 items-center border-b-2 border-transparent text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:text-crimson"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <Button
            type="button"
            onClick={() => scrollToSection("hubungi")}
            className="min-h-11 rounded-md bg-crimson px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-crimson-dark"
          >
            Hubungi Kami
          </Button>
        </nav>

        <Button
          type="button"
          variant="outline"
          onClick={openDrawer}
          aria-label="Buka menu navigasi"
          aria-expanded={drawerOpen}
          aria-controls="mobile-nav-drawer"
          className="min-h-11 gap-2 rounded-md border-slate-300 bg-white px-3.5 text-xs font-bold text-ink hover:bg-crimson-light hover:text-crimson lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
          <span>Menu</span>
        </Button>
      </div>

      {/* Native swipeable <dialog> navigation drawer */}
      <dialog
        ref={drawerRef}
        id="mobile-nav-drawer"
        aria-label="Menu navigasi mobile"
        className="nav-drawer"
        onClick={(event) => {
          if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
            closeDrawer();
          }
        }}
      >
        <div ref={scrollerRef} className="nav-drawer-scroller">
          <nav
            ref={sheetRef}
            aria-label="Menu mobile"
            className="nav-drawer-sheet bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-crimson-dark bg-crimson px-5 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold bg-crimson-dark text-gold-light">
                  <School className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="font-heading text-sm font-extrabold leading-tight text-white">
                    {schoolName}
                  </span>
                  <span className="text-[11px] text-gold-light">{schoolSubtitle}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                autoFocus
                aria-label="Tutup menu navigasi"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-white transition hover:bg-crimson-dark"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <ul className="divide-y divide-slate-100 px-5 py-3">
              {navLinks.map((link) => (
                <li key={link.targetId}>
                  <button
                    type="button"
                    onClick={() => {
                      closeDrawer();
                      scrollToSection(link.targetId);
                    }}
                    className="flex min-h-12 w-full items-center py-2 text-left text-[15px] font-semibold text-ink transition-colors hover:text-crimson"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-slate-100 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <Button
                type="button"
                onClick={() => {
                  closeDrawer();
                  scrollToSection("hubungi");
                }}
                className="min-h-11 w-full rounded-md bg-crimson text-xs font-bold uppercase tracking-wider text-white hover:bg-crimson-dark"
              >
                Hubungi Sekolah
              </Button>
            </div>
          </nav>
        </div>
      </dialog>
    </header>
  );
}
