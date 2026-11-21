"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, School, Search, X } from "lucide-react";
import { NAV_MENU, SITE_INFO } from "@/lib/content";
import { PENDING_SECTION_STORAGE_KEY, scrollToSection } from "./SectionLink";

interface NavbarProps {
  schoolName?: string;
}

export function Navbar({ schoolName = SITE_INFO.schoolName }: NavbarProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navListRef = useRef<HTMLUListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (window.location.hash) {
      const hashTarget = window.location.hash.replace(/^#/, "");
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      if (hashTarget) {
        requestAnimationFrame(() => scrollToSection(hashTarget));
      }
    } else {
      try {
        const pending = window.sessionStorage.getItem(PENDING_SECTION_STORAGE_KEY);
        if (pending) {
          window.sessionStorage.removeItem(PENDING_SECTION_STORAGE_KEY);
          requestAnimationFrame(() => scrollToSection(pending));
        }
      } catch {
        // ignore storage errors
      }
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy active indicator via IntersectionObserver
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
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  // Focus inline search input when opened
  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  // Body scroll lock & Esc handler for mobile drawer
  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    requestAnimationFrame(() => {
      hamburgerRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawerOpen, closeDrawer]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setDrawerOpen(false);
    setSearchOpen(false);
    router.push(q ? `/berita?q=${encodeURIComponent(q)}` : "/berita");
  };

  return (
    <header
      className={`sticky top-0 z-50 h-[72px] w-full border-b border-line bg-surface transition-shadow ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="mx-auto flex h-full w-full max-w-[1200px] items-center justify-between gap-4 px-5 md:px-8 lg:px-12">
        {/* Desktop Left: Search trigger / inline search */}
        <div className="hidden min-w-[140px] items-center lg:flex">
          {searchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
              <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => {
                  if (!searchQuery.trim()) setSearchOpen(false);
                }}
                placeholder={SITE_INFO.searchPlaceholder}
                aria-label={SITE_INFO.searchPlaceholder}
                className="h-9 w-40 rounded-full border border-line bg-surface-soft px-3 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
              />
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span>Search</span>
            </button>
          )}
        </div>

        {/* Mobile Left: School Logo */}
        <button
          type="button"
          onClick={() => scrollToSection("home")}
          className="flex min-h-[44px] items-center gap-2.5 text-left lg:hidden"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white">
            <School className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-bold tracking-tight text-ink">
            {schoolName}
          </span>
        </button>

        {/* Desktop Center: Menu items (gap 40px, 14px/500) */}
        <nav aria-label="Utama" className="hidden items-center lg:flex">
          <ul ref={navListRef} className="scrollspy-nav flex items-center gap-10">
            {NAV_MENU.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  data-section-target={item.targetId}
                  onClick={() => scrollToSection(item.targetId)}
                  className="inline-flex min-h-[44px] items-center border-b-2 border-transparent text-sm font-medium text-ink transition-colors hover:border-brand/50 hover:text-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Right: Balancing spacer (admin login hanya via URL /login atau /admin) */}
        <div className="hidden min-w-[140px] lg:flex" aria-hidden="true" />

        {/* Mobile Right: Hamburger */}
        <button
          ref={hamburgerRef}
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Buka menu navigasi"
          aria-expanded={drawerOpen}
          aria-controls="mobile-nav-drawer"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line text-ink transition hover:border-brand hover:bg-brand-light hover:text-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30 lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Drawer (<1024px) */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          id="mobile-nav-drawer"
          aria-label="Menu navigasi mobile"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-[1px]"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Sheet from right (78%, max 320px) */}
          <nav
            aria-label="Menu mobile"
            className="fixed inset-y-0 right-0 z-10 flex w-[78%] max-w-[320px] flex-col bg-surface shadow-2xl"
          >
            <div className="flex h-[72px] items-center justify-between border-b border-line px-5">
              <span className="text-sm font-bold text-ink">{schoolName}</span>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Tutup menu navigasi"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink transition hover:bg-brand-light hover:text-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="border-b border-line p-5">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={SITE_INFO.searchPlaceholder}
                  aria-label={SITE_INFO.searchPlaceholder}
                  className="h-11 w-full rounded-full border border-line bg-surface-soft pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
                />
              </div>
            </form>

            {/* Vertical Nav Links */}
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5 py-2 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              {NAV_MENU.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => {
                      closeDrawer();
                      scrollToSection(item.targetId);
                    }}
                    className="flex min-h-[48px] w-full items-center text-left text-sm font-medium text-ink transition-colors hover:text-brand"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
