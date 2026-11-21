"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { loginAdminAction, LoginState } from "./actions";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  School,
} from "lucide-react";
import { Confetti } from "@/components/landing/Confetti";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-surface-soft px-5 py-10 md:px-8">
      <Confetti variant="white" preset="announcements" />

      <div className="relative z-10 w-full max-w-[960px]">
        <div className="mb-5">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-3 text-sm font-semibold text-brand transition-colors hover:bg-brand-light focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Kembali ke Beranda Sekolah</span>
          </Link>
        </div>

        <div className="grid overflow-hidden rounded-[18px] border border-line bg-surface shadow-[0_16px_40px_rgba(0,0,0,0.08)] md:grid-cols-12">
          {/* Left: Login Form */}
          <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-11 md:col-span-7">
            <div className="mb-7">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-sm">
                  <School className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                    Portal Administrasi
                  </p>
                  <h1 className="text-[22px] font-bold leading-tight text-ink sm:text-2xl">
                    SMPN 1 Merawang
                  </h1>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-body">
                Masuk menggunakan akun pengelola sekolah untuk mengakses panel administrasi.
              </p>
            </div>

            {state.error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2.5 rounded-[12px] border border-brand/25 bg-brand-light px-4 py-3 text-sm font-medium text-brand-dark"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                <span>{state.error}</span>
              </div>
            )}

            <form action={formAction} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-semibold text-ink">
                  Email Pengelola
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="admin@smpn1merawang.sch.id"
                    className="min-h-[46px] w-full rounded-[12px] border border-line bg-surface-soft/70 pl-10 pr-4 text-sm text-ink placeholder:text-muted transition focus:border-brand focus:bg-surface focus:outline-none focus:ring-4 focus:ring-brand/15"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-ink">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                    aria-hidden="true"
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Masukkan kata sandi"
                    className="min-h-[46px] w-full rounded-[12px] border border-line bg-surface-soft/70 pl-10 pr-12 text-sm text-ink placeholder:text-muted transition focus:border-brand focus:bg-surface focus:outline-none focus:ring-4 focus:ring-brand/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    aria-pressed={showPassword}
                    className="absolute right-0.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="mt-2 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-px hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Masuk ke Dashboard</span>
                )}
              </button>
            </form>

            <div className="mt-7 border-t border-line pt-5 text-center text-xs text-muted">
              © 2026 SMPN 1 Merawang · Kecamatan Merawang, Kabupaten Bangka
            </div>
          </div>

          {/* Right: Brand Red Showcase Panel matching Landing Page */}
          <aside className="relative hidden flex-col justify-between overflow-hidden bg-brand p-8 text-white md:col-span-5 md:flex lg:p-10">
            <Confetti variant="red" preset="stats" />

            <div className="relative z-10 space-y-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
                <GraduationCap className="h-6 w-6 text-white" aria-hidden="true" />
              </div>

              <div className="overflow-hidden rounded-[14px] border border-white/20 shadow-md">
                <img
                  src="/images/hero-smpn1-merawang.webp"
                  alt="Lingkungan SMPN 1 Merawang"
                  width={600}
                  height={272}
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold leading-snug text-white">
                  Panel Pengelolaan Sekolah
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/90">
                  Halaman khusus pengelola SMPN 1 Merawang untuk memperbarui informasi profil sekolah, galeri dokumentasi, dan data akademik.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-8 border-t border-white/20 pt-5">
              <ul className="space-y-2.5 text-sm text-white/95">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                  <span>Kelola profil, galeri &amp; berita sekolah</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                  <span>Kelola data siswa &amp; konten pembelajaran</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                  <span>Pantau ringkasan statistik &amp; pesan masuk</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
