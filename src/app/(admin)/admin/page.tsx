import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { MateriRow } from "@/lib/supabase/types";
import { computeGelar } from "@/lib/services/learning";
import { getAggregatedLeaderboard } from "@/lib/services/leaderboard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, HelpCircle, Trophy } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = getSupabaseAdmin();

  const [
    { count: siswaCount },
    { count: materiCount },
    { count: kuisCount },
    { data: materiTerbaru },
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

  const topSiswa = allScores.slice(0, 3);

  let tinggi = 0;
  let sedang = 0;
  let rendah = 0;
  for (const row of allScores) {
    if (row.totalSkor >= 85) tinggi++;
    else if (row.totalSkor >= 70) sedang++;
    else rendah++;
  }
  const totalEvaluated = Math.max(allScores.length, 1);

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-primary text-white shadow-sm">
        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Admin</h1>
            <p className="text-sky-100 text-sm mt-1">
              Ringkasan aktivitas belajar, materi, dan capaian kuis siswa SMPN 1 Merawang
            </p>
          </div>
          <Badge className="bg-white/15 text-white border-0 self-start sm:self-auto px-3 py-1.5 text-xs">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              <Users className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{siswaCount ?? 0}</div>
              <div className="text-sm text-slate-600">Total Siswa</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <BookOpen className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{materiCount ?? 0}</div>
              <div className="text-sm text-slate-600">Total Materi</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{kuisCount ?? 0}</div>
              <div className="text-sm text-slate-600">Total Soal Kuis</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">
              Distribusi Nilai Siswa ({allScores.length} siswa aktif)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Nilai ≥ 85</span>
                <span className="font-semibold text-emerald-700">
                  {tinggi} siswa ({Math.round((tinggi / totalEvaluated) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${(tinggi / totalEvaluated) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Nilai 70 sampai 84</span>
                <span className="font-semibold text-amber-700">
                  {sedang} siswa ({Math.round((sedang / totalEvaluated) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-600 h-full rounded-full"
                  style={{ width: `${(sedang / totalEvaluated) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Nilai &lt; 70</span>
                <span className="font-semibold text-red-700">
                  {rendah} siswa ({Math.round((rendah / totalEvaluated) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-red-600 h-full rounded-full"
                  style={{ width: `${(rendah / totalEvaluated) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-600" aria-hidden="true" />
              Top 3 Peringkat Siswa
            </CardTitle>
            <Link
              href="/admin/leaderboard"
              className="text-xs font-medium text-primary hover:underline"
            >
              Lihat semua peringkat
            </Link>
          </CardHeader>
          <CardContent>
            {topSiswa.length === 0 ? (
              <p className="text-sm text-slate-600">Belum ada data pengerjaan kuis.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {topSiswa.map((s, idx) => (
                  <div key={s.siswaId} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 text-sm">
                        #{idx + 1} {s.nama}
                      </div>
                      <div className="text-xs text-slate-600">
                        Kelas {s.kelas} · {computeGelar(s.totalSkor)}
                      </div>
                    </div>
                    <Badge className="bg-primary-light text-primary font-bold">
                      {s.totalSkor} pts
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-900">5 Materi Terbaru</CardTitle>
          <Link
            href="/admin/materi"
            className="text-xs font-medium text-primary hover:underline"
          >
            Kelola semua materi
          </Link>
        </CardHeader>
        <CardContent>
          {!materiTerbaru || materiTerbaru.length === 0 ? (
            <p className="text-sm text-slate-600">Belum ada materi.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {(materiTerbaru as MateriRow[]).map((m) => (
                <li key={m.id} className="py-2.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-800">{m.judul}</span>
                  <span className="text-xs text-slate-600">
                    {new Date(m.created_at).toLocaleDateString("id-ID")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
