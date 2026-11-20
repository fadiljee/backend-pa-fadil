"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  HelpCircle,
  ClipboardCheck,
  Trophy,
  LogOut,
  GraduationCap,
  Globe,
  PanelLeftClose,
  X,
} from "lucide-react";
import { logoutAdminAction } from "@/app/login/actions";
import { ConfirmActionForm } from "@/components/ui/ConfirmActionForm";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/siswa", label: "Data Siswa", icon: Users },
  { href: "/admin/materi", label: "Materi", icon: BookOpen },
  { href: "/admin/kuis", label: "Kuis", icon: HelpCircle },
  { href: "/admin/hasil-kuis", label: "Hasil Kuis", icon: ClipboardCheck },
  { href: "/admin/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/admin/landing", label: "Landing Page", icon: Globe },
];

function getActiveNavLabel(pathname: string): string {
  const match = navItems.find((item) =>
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(item.href)
  );
  return match?.label ?? "Panel Admin";
}

function AdminSidebarInner({
  adminName,
  pinnedOpen,
  onCloseSidebar,
  onHoverEnter,
  onHoverLeave,
}: {
  adminName: string;
  pinnedOpen: boolean;
  onCloseSidebar: () => void;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
}) {
  const pathname = usePathname();
  const { isMobile, setOpen, setOpenMobile } = useSidebar();

  React.useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  const handleCloseClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
      onCloseSidebar();
    }
  };

  return (
    <ShadcnSidebar
      collapsible="icon"
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
      className="border-r border-sidebar-border motion-reduce:transition-none"
    >
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
          <Link
            href="/admin"
            onClick={() => isMobile && setOpenMobile(false)}
            className="flex min-w-0 items-center gap-2.5 rounded-lg p-1 text-sidebar-foreground transition-colors hover:bg-sidebar-accent focus-visible:outline-white"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <div className="truncate text-sm font-bold leading-tight text-white">
                SMPN 1 Merawang
              </div>
              <div className="truncate text-xs text-slate-300">Panel Admin</div>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleCloseClick}
            aria-label={isMobile ? "Tutup menu navigasi" : "Tutup sidebar"}
            title={
              isMobile
                ? "Tutup menu"
                : pinnedOpen
                  ? "Tutup sidebar (Ctrl+B)"
                  : "Kembali ke mode ikon"
            }
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-sidebar-accent hover:text-white focus-visible:outline-white group-data-[collapsible=icon]:hidden"
          >
            {isMobile ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-slate-300">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      size="default"
                      className="min-h-10 rounded-lg px-3 text-slate-200 hover:bg-sidebar-accent hover:text-white data-active:bg-sidebar-primary data-active:font-semibold data-active:text-white focus-visible:outline-white group-data-[collapsible=icon]:min-h-9 group-data-[collapsible=icon]:size-9!"
                      render={
                        <Link
                          href={item.href}
                          onClick={() => isMobile && setOpenMobile(false)}
                          aria-current={isActive ? "page" : undefined}
                        />
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="mb-2 truncate px-1 text-xs text-slate-300 group-data-[collapsible=icon]:hidden">
          Masuk sebagai:{" "}
          <span className="font-semibold text-white">{adminName}</span>
        </div>
        <ConfirmActionForm
          action={logoutAdminAction}
          title="Keluar dari Panel Admin?"
          description="Sesi Anda akan diakhiri. Anda harus masuk kembali menggunakan email dan password untuk mengakses panel admin."
          confirmLabel="Ya, Keluar"
          cancelLabel="Batal"
          variant="danger"
          triggerClassName="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-red-700 hover:text-white focus-visible:outline-white group-data-[collapsible=icon]:min-h-9 group-data-[collapsible=icon]:px-0"
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="group-data-[collapsible=icon]:sr-only">Keluar</span>
        </ConfirmActionForm>
      </SidebarFooter>

      <SidebarRail />
    </ShadcnSidebar>
  );
}

export function AdminShell({
  adminName,
  defaultOpen = true,
  children,
}: {
  adminName: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [pinnedOpen, setPinnedOpen] = React.useState(defaultOpen);
  const [isHovered, setIsHovered] = React.useState(false);

  const effectiveOpen = pinnedOpen || isHovered;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (isHovered && !pinnedOpen) {
        // Jika sedang terbuka karena hover lalu user klik trigger/close, kunci tetap tertutup.
        setPinnedOpen(false);
        setIsHovered(false);
        return;
      }
      setPinnedOpen(nextOpen);
      if (!nextOpen) {
        setIsHovered(false);
      }
    },
    [isHovered, pinnedOpen]
  );

  const handleCloseSidebar = React.useCallback(() => {
    setPinnedOpen(false);
    setIsHovered(false);
  }, []);

  const handleHoverEnter = React.useCallback(() => {
    if (!pinnedOpen) {
      setIsHovered(true);
    }
  }, [pinnedOpen]);

  const handleHoverLeave = React.useCallback(() => {
    setIsHovered(false);
  }, []);

  const activeLabel = getActiveNavLabel(pathname);

  return (
    <TooltipProvider delay={150}>
      <SidebarProvider open={effectiveOpen} onOpenChange={handleOpenChange}>
        <a
          href="#admin-main"
          className="sr-only focus:not-sr-only fixed left-3 top-3 z-50 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md"
        >
          Lewati ke konten utama
        </a>

        <AdminSidebarInner
          adminName={adminName}
          pinnedOpen={pinnedOpen}
          onCloseSidebar={handleCloseSidebar}
          onHoverEnter={handleHoverEnter}
          onHoverLeave={handleHoverLeave}
        />

        <SidebarInset className="min-w-0 bg-slate-50">
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <SidebarTrigger
                aria-label={
                  effectiveOpen
                    ? "Tutup sidebar navigasi"
                    : "Buka sidebar navigasi"
                }
                className="min-h-11 min-w-11 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              />
              <Separator
                orientation="vertical"
                className="h-5 bg-slate-200"
              />
              <span className="truncate text-sm font-semibold text-slate-900">
                {activeLabel}
              </span>
            </div>

            <div className="hidden truncate text-xs text-slate-600 sm:block">
              Admin: <span className="font-semibold text-slate-900">{adminName}</span>
            </div>
          </header>

          <main
            id="admin-main"
            tabIndex={-1}
            className="min-w-0 flex-1 p-4 sm:p-6 md:p-8"
          >
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
