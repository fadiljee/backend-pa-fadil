"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAdminAction, LoginState } from "./actions";
import { Lock, Mail, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, initialState);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-hero-from to-hero-to px-4 py-10">
      <Card className="w-full max-w-md rounded-2xl border-cardborder bg-white shadow-(--shadow-card)">
        <CardHeader className="items-center text-center pt-4">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-[10px] bg-primary text-white shadow-(--shadow-btn)">
            <GraduationCap className="h-6 w-6" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl font-bold text-heading">SMPN 1 Merawang</CardTitle>
          <CardDescription className="text-sm text-body">
            Masuk ke Panel Admin Portal Sekolah
          </CardDescription>
        </CardHeader>

        <CardContent>
          {state.error && (
            <div
              role="alert"
              className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {state.error}
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
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Masukkan password admin"
                  className="min-h-11 rounded-[10px] border-cardborder pl-10 text-sm text-heading"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="min-h-11 w-full rounded-[10px] bg-primary text-sm font-semibold text-white shadow-(--shadow-btn) hover:bg-primary-dark"
            >
              {isPending ? "Memproses..." : "Masuk ke Dashboard"}
            </Button>
          </form>
        </CardContent>

        <Separator className="bg-soft" />
        <CardFooter className="justify-center py-4">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline"
          >
            Kembali ke Beranda Sekolah
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
