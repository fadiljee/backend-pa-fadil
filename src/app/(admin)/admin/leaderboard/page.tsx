import { env } from "@/lib/config/env";
import { computeGelarInfo } from "@/lib/services/learning";
import { getAggregatedLeaderboard } from "@/lib/services/leaderboard";
import { Pagination } from "@/components/admin/Pagination";
import { Trophy } from "lucide-react";

export const dynamic = "force-dynamic";

const badgeStyles: Record<string, string> = {
  warning: "bg-amber-100 text-amber-800 border-amber-200",
  info: "bg-sky-100 text-sky-800 border-sky-200",
  primary: "bg-indigo-100 text-indigo-800 border-indigo-200",
  success: "bg-emerald-100 text-emerald-800 border-emerald-200",
  secondary: "bg-slate-200 text-slate-700 border-slate-300",
  light: "bg-slate-100 text-slate-500 border-slate-200",
};

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page ?? "1") || 1, 1);
  const pageSize = env.ADMIN_PAGE_SIZE;

  const allSorted = await getAggregatedLeaderboard();
  const totalItems = allSorted.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  const offset = (page - 1) * pageSize;
  const pagedRows = allSorted.slice(offset, offset + pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
          <Trophy className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leaderboard Siswa</h1>
          <p className="text-sm text-slate-500">
            Peringkat total skor siswa (dibatasi maksimal {env.MAX_TOTAL_SCORE}) beserta gelar pencapaian
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Peringkat</th>
                <th className="px-4 py-3">Nama Siswa</th>
                <th className="px-4 py-3">Kelas</th>
                <th className="px-4 py-3">Total Skor</th>
                <th className="px-4 py-3">Gelar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Belum ada data leaderboard.
                  </td>
                </tr>
              ) : (
                pagedRows.map((row, idx) => {
                  const gelar = computeGelarInfo(row.totalSkor);
                  return (
                    <tr key={row.siswaId} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-700">
                        #{offset + idx + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">{row.nama}</td>
                      <td className="px-4 py-3 text-slate-700">{row.kelas}</td>
                      <td className="px-4 py-3 font-bold text-indigo-700">{row.totalSkor}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            badgeStyles[gelar.variant]
                          }`}
                        >
                          {gelar.teks}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/leaderboard" />
      </div>
    </div>
  );
}
