"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  HelpCircle,
  ClipboardCheck,
  Trophy,
  LogOut,
  GraduationCap,
  Menu,
  Globe,
} from "lucide-react";
import { logoutAdminAction } from "@/app/login/actions";
import { ConfirmActionForm } from "@/components/ui/ConfirmActionForm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/siswa", label: "Data Siswa", icon: Users },
  { href: "/admin/materi", label: "Materi", icon: BookOpen },
  { href: "/admin/kuis", label: "Kuis", icon: HelpCircle },
  { href: "/admin/hasil-kuis", label: "Hasil Kuis", icon: ClipboardCheck },
  { href: "/admin/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/admin/landing", label: "Landing Page", icon: Globe },
];

function SidebarContent({
  adminName,
  pathname,
  onNavigate,
}: {
  adminName: string;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-100">
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-bold leading-tight">SMPN 1 Merawang</div>
          <div className="text-xs text-slate-300">Panel Admin</div>
        </div>
      </div>

      <nav aria-label="Navigasi panel admin" className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition focus-visible:outline-white ${
                isActive
                  ? "bg-primary text-white"
                  : "text-slate-200 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="mb-3 truncate text-xs text-slate-300">
          Masuk sebagai: <span className="font-semibold text-white">{adminName}</span>
        </div>
        <ConfirmActionForm
          action={logoutAdminAction}
          title="Keluar dari Panel Admin?"
          description="Sesi Anda akan diakhiri. Anda harus masuk kembali menggunakan email dan password untuk mengakses panel admin."
          confirmLabel="Ya, Keluar"
          cancelLabel="Batal"
          variant="danger"
          triggerClassName="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-red-700 hover:text-white focus-visible:outline-white"
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Keluar</span>
        </ConfirmActionForm>
      </div>
    </div>
  );
}

export function Sidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 text-slate-100 md:hidden">
        <Link href="/admin" className="flex items-center gap-2.5 focus-visible:outline-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <span className="text-sm font-bold">SMPN 1 Merawang</span>
        </Link>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            render={
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3.5 text-sm font-medium text-slate-100 hover:bg-slate-700 focus-visible:outline-white"
              >
                <Menu className="h-4 w-4" aria-hidden="true" />
                <span>Menu</span>
              </button>
            }
          />
          <SheetContent side="left" className="w-[min(18rem,85dvw)] border-slate-800 bg-slate-900 p-0 text-slate-100">
            <SheetHeader className="sr-only">
              <SheetTitle>Menu Navigasi Admin</SheetTitle>
            </SheetHeader>
            <div className="h-full overflow-y-auto">
              <SidebarContent
                adminName={adminName}
                pathname={pathname}
                onNavigate={() => setIsOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <aside className="hidden w-64 shrink-0 md:block">
        <div className="sticky top-0 h-dvh overflow-y-auto">
          <SidebarContent adminName={adminName} pathname={pathname} />
        </div>
      </aside>
    </>
  );
}
