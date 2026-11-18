"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAdminAction, LoginState } from "./actions";
import { Lock, Mail, BookOpen } from "lucide-react";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, initialState);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-800 text-white flex items-center justify-center mb-3">
            <BookOpen className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">SMPN 1 Merawang</h1>
          <p className="text-sm text-slate-600 mt-1">
            Panel Admin Media Pembelajaran Matematika
          </p>
        </div>

        {state.error && (
          <div
            role="alert"
            className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800"
          >
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-800 mb-1">
              Email Admin
            </label>
            <div className="relative">
              <Mail
                className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@smpn1merawang.sch.id"
                className="w-full min-h-11 pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-800 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock
                className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Masukkan password admin"
                className="w-full min-h-11 pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full min-h-11 py-2.5 px-4 bg-indigo-800 hover:bg-indigo-900 disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition"
          >
            {isPending ? "Memproses..." : "Masuk ke Dashboard"}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-200 pt-4 text-center">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-sm font-medium text-indigo-800 hover:underline"
          >
            Kembali ke Beranda Sekolah
          </Link>
        </div>
      </div>
    </main>
  );
}
