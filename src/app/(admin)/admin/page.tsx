import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { MateriRow } from "@/lib/supabase/types";
import { computeGelar } from "@/lib/services/learning";
import { getAggregatedLeaderboard } from "@/lib/services/leaderboard";
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
      <div className="bg-indigo-800 text-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <p className="text-indigo-100 text-sm mt-1">
            Ringkasan aktivitas belajar, materi, dan capaian kuis siswa SMPN 1 Merawang
          </p>
        </div>
        <div className="text-xs bg-white/15 px-3 py-1.5 rounded-full self-start sm:self-auto">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{siswaCount ?? 0}</div>
            <div className="text-sm text-slate-500">Total Siswa</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{materiCount ?? 0}</div>
            <div className="text-sm text-slate-500">Total Materi</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{kuisCount ?? 0}</div>
            <div className="text-sm text-slate-500">Total Soal Kuis</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            Distribusi Nilai Siswa ({allScores.length} siswa aktif)
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Nilai ≥ 85</span>
                <span className="font-semibold text-emerald-600">
                  {tinggi} siswa ({Math.round((tinggi / totalEvaluated) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${(tinggi / totalEvaluated) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Nilai 70 sampai 84</span>
                <span className="font-semibold text-amber-600">
                  {sedang} siswa ({Math.round((sedang / totalEvaluated) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${(sedang / totalEvaluated) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Nilai &lt; 70</span>
                <span className="font-semibold text-red-600">
                  {rendah} siswa ({Math.round((rendah / totalEvaluated) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full"
                  style={{ width: `${(rendah / totalEvaluated) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Top 3 Peringkat Siswa
            </h2>
            <Link
              href="/admin/leaderboard"
              className="text-xs font-medium text-indigo-800 hover:underline"
            >
              Lihat semua peringkat
            </Link>
          </div>
          {topSiswa.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada data pengerjaan kuis.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {topSiswa.map((s, idx) => (
                <div key={s.siswaId} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-900 text-sm">
                      #{idx + 1} {s.nama}
                    </div>
                    <div className="text-xs text-slate-500">
                      Kelas {s.kelas} • {computeGelar(s.totalSkor)}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                    {s.totalSkor} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900">5 Materi Terbaru</h2>
          <Link
            href="/admin/materi"
            className="text-xs font-medium text-indigo-800 hover:underline"
          >
            Kelola semua materi
          </Link>
        </div>
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
      </div>
    </div>
  );
}
