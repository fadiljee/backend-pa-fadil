"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { loginAdminAction, LoginState } from "./actions";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-hero-from to-hero-to px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-[10px] px-2 text-sm font-semibold text-primary transition-colors hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Kembali ke Beranda Sekolah
          </Link>
        </div>

        <Card className="grid overflow-hidden rounded-2xl border-cardborder bg-white p-0 shadow-(--shadow-card) md:grid-cols-2">
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <CardHeader className="px-0 pt-0 pb-6 text-left">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-primary text-white shadow-(--shadow-btn)">
                  <GraduationCap className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    Portal Admin
                  </p>
                  <h1 className="text-xl font-bold text-heading sm:text-2xl">
                    SMPN 1 Merawang
                  </h1>
                </div>
              </div>
              <CardDescription className="text-sm leading-relaxed text-body">
                Masuk menggunakan akun admin untuk mengelola materi, kuis, dan data siswa.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0 pb-0">
              {state.error && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-2.5 rounded-[10px] border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                  <span>{state.error}</span>
                </div>
              )}

              <form action={formAction} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-semibold text-heading">
                    Email Admin
                  </Label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="admin@smpn1merawang.sch.id"
                      className="min-h-11 rounded-[10px] border-cardborder pl-10 text-sm text-heading"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm font-semibold text-heading">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      placeholder="Masukkan password admin"
                      className="min-h-11 rounded-[10px] border-cardborder pl-10 pr-12 text-sm text-heading"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                      aria-pressed={showPassword}
                      className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[10px] text-muted-foreground transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="mt-2 min-h-11 w-full cursor-pointer rounded-[10px] bg-primary text-sm font-semibold text-white shadow-(--shadow-btn) hover:bg-primary-dark disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Memproses...
                    </>
                  ) : (
                    "Masuk ke Dashboard"
                  )}
                </Button>
              </form>

              <Separator className="my-6 bg-soft" />
              <p className="text-center text-xs text-muted">
                Media Pembelajaran Matematika · SMPN 1 Merawang
              </p>
            </CardContent>
          </div>

          <aside className="hidden flex-col justify-between bg-primary p-8 text-white md:flex lg:p-10">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-accent-yellow">
                Panel Administrasi
              </p>
              <h2 className="text-2xl font-bold leading-snug">
                Kelola Pembelajaran Matematika SMPN 1 Merawang
              </h2>
              <p className="text-sm leading-relaxed text-white/85">
                Halaman ini khusus untuk pengelola sekolah guna memperbarui materi ajar, soal kuis, dan memantau hasil belajar siswa.
              </p>
            </div>

            <div className="space-y-3 border-t border-white/15 pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/75">
                Cakupan Pengelolaan
              </p>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• Pengaturan materi &amp; status kunci modul</li>
                <li>• Pengelolaan bank soal dan skor kuis</li>
                <li>• Pemantauan papan peringkat siswa</li>
              </ul>
            </div>
          </aside>
        </Card>
      </div>
    </main>
  );
}
