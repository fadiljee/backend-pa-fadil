"use client";

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
} from "lucide-react";
import { logoutAdminAction } from "@/app/login/actions";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/siswa", label: "Data Siswa", icon: Users },
  { href: "/admin/materi", label: "Materi", icon: BookOpen },
  { href: "/admin/kuis", label: "Kuis", icon: HelpCircle },
  { href: "/admin/hasil-kuis", label: "Hasil Kuis", icon: ClipboardCheck },
  { href: "/admin/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function Sidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen flex flex-col shrink-0">
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800">
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-bold text-sm leading-tight">SMPN 1 Merawang</div>
          <div className="text-xs text-slate-400">Admin Panel</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
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
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-400 mb-2 truncate">
          Login sebagai: <span className="text-slate-200 font-medium">{adminName}</span>
        </div>
        <form action={logoutAdminAction}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-200 hover:text-white text-sm font-medium transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
