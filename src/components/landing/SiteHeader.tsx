import Link from "next/link";
import { Menu } from "lucide-react";

interface SiteHeaderProps {
  isLoggedIn: boolean;
}

export function SiteHeader({ isLoggedIn }: SiteHeaderProps) {
  const adminHref = isLoggedIn ? "/admin" : "/login";
  const adminLabel = isLoggedIn ? "Buka Panel Admin" : "Masuk Admin";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-[#faf9f6]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-3 text-slate-900"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-800 text-sm font-bold text-white">
            S1M
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-bold leading-tight text-slate-900">
              SMPN 1 Merawang
            </span>
            <span className="text-xs text-slate-600">
              Ayo Berhitung
            </span>
          </span>
        </Link>

        <nav aria-label="Utama" className="flex items-center">
          <button
            type="button"
            popoverTarget="landing-mobile-menu"
            popoverTargetAction="toggle"
            aria-controls="landing-mobile-menu"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-800 hover:bg-slate-50 md:hidden"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
            <span>Menu</span>
          </button>

          <ul
            id="landing-mobile-menu"
            popover="auto"
            className="m-0 mr-4 mt-16 w-[min(80dvw,18rem)] rounded-xl border border-slate-200 bg-white p-3 shadow-lg md:hidden"
          >
            <li>
              <a
                href="#statistik"
                className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                Statistik Pengguna
              </a>
            </li>
            <li>
              <a
                href="#tentang-sekolah"
                className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                Tentang Sekolah
              </a>
            </li>
            <li>
              <a
                href="#cara-belajar"
                className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                Alur Belajar
              </a>
            </li>
            <li className="mt-2 border-t border-slate-200 pt-2">
              <Link
                href={adminHref}
                className="flex min-h-11 items-center justify-center rounded-lg bg-indigo-800 px-4 text-sm font-semibold text-white hover:bg-indigo-900"
              >
                {adminLabel}
              </Link>
            </li>
          </ul>

          <ul className="hidden items-center gap-1 md:flex">
            <li>
              <a
                href="#statistik"
                className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-200/60 hover:text-slate-900"
              >
                Statistik
              </a>
            </li>
            <li>
              <a
                href="#tentang-sekolah"
                className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-200/60 hover:text-slate-900"
              >
                Tentang Sekolah
              </a>
            </li>
            <li>
              <a
                href="#cara-belajar"
                className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-200/60 hover:text-slate-900"
              >
                Alur Belajar
              </a>
            </li>
            <li className="ml-2">
              <Link
                href={adminHref}
                className="inline-flex min-h-11 items-center rounded-lg bg-indigo-800 px-4 text-sm font-semibold text-white transition hover:bg-indigo-900"
              >
                {adminLabel}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
