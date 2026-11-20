import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { MateriRow } from "@/lib/supabase/types";
import { computeGelar } from "@/lib/services/learning";
import { getAggregatedLeaderboard } from "@/lib/services/leaderboard";
import { getDashboardAnalytics } from "@/lib/services/dashboard-analytics";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, HelpCircle, Trophy } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = getSupabaseAdmin();

  const [
    { count: siswaCount, error: siswaErr },
    { count: materiCount, error: materiErr },
    { count: kuisCount, error: kuisErr },
    { data: materiTerbaru, error: materiListErr },
    allScores,
  ] = await Promise.all([
    supabase.from("data_siswa").select("*", { count: "exact", head: true }),
    supabase.from("materis").select("*", { count: "exact", head: true }),
    supabase.from("kuis").select("*", { count: "exact", head: true }),
    supabase
      .from("materis")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
    getAggregatedLeaderboard(),
  ]);

  if (siswaErr || materiErr || kuisErr || materiListErr) {
    throw new Error(
      siswaErr?.message ??
        materiErr?.message ??
        kuisErr?.message ??
        materiListErr?.message ??
        "Gagal memuat ringkasan data dashboard."
    );
  }

  const analytics = await getDashboardAnalytics(allScores, siswaCount ?? 0);
  const topSiswa = allScores.slice(0, 3);

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-primary text-white shadow-sm">
        <CardContent className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-balance text-2xl font-bold">Dashboard Admin</h1>
            <p className="mt-1 text-pretty text-sm text-sky-100">
              Ringkasan aktivitas belajar, materi, dan capaian kuis siswa SMPN 1 Merawang
            </p>
          </div>
          <Badge className="self-start border-0 bg-white/15 px-3 py-1.5 text-xs text-white sm:self-auto">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
              <Users className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{siswaCount ?? 0}</div>
              <div className="text-sm text-slate-600">Total Siswa</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <BookOpen className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{materiCount ?? 0}</div>
              <div className="text-sm text-slate-600">Total Materi</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <HelpCircle className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{kuisCount ?? 0}</div>
              <div className="text-sm text-slate-600">Total Soal Kuis</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3 Grafik Analitik Utama (shadcn/ui Charts + Recharts) */}
      <DashboardCharts data={analytics} />

      {/* Ringkasan Operasional: Top 3 Peringkat Siswa & 5 Materi Terbaru */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="min-w-0 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <Trophy className="h-4 w-4 text-amber-600" aria-hidden="true" />
              <h2>Top 3 Peringkat Siswa</h2>
            </CardTitle>
            <Link
              href="/admin/leaderboard"
              className="inline-flex min-h-11 items-center text-xs font-semibold text-primary hover:underline"
            >
              Lihat semua peringkat
            </Link>
          </CardHeader>
          <CardContent>
            {topSiswa.length === 0 ? (
              <p className="text-sm text-slate-600">
                Belum ada data pengerjaan kuis untuk menyusun peringkat.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {topSiswa.map((s, idx) => (
                  <div
                    key={s.siswaId}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-slate-900">
                        #{idx + 1} {s.nama}
                      </div>
                      <div className="text-xs text-slate-600">
                        Kelas {s.kelas} · {computeGelar(s.totalSkor)}
                      </div>
                    </div>
                    <Badge className="shrink-0 bg-primary-light font-bold text-primary">
                      {s.totalSkor} pts
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base font-semibold text-slate-900">
              <h2>5 Materi Terbaru</h2>
            </CardTitle>
            <Link
              href="/admin/materi"
              className="inline-flex min-h-11 items-center text-xs font-semibold text-primary hover:underline"
            >
              Kelola semua materi
            </Link>
          </CardHeader>
          <CardContent>
            {!materiTerbaru || materiTerbaru.length === 0 ? (
              <p className="text-sm text-slate-600">
                Belum ada materi. Tambahkan materi baru melalui halaman Kelola Materi.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {(materiTerbaru as MateriRow[]).map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm"
                  >
                    <span className="truncate font-medium text-slate-800">{m.judul}</span>
                    <span className="shrink-0 text-xs text-slate-600">
                      {new Date(m.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
