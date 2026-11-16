import Link from "next/link";
import { env } from "@/lib/config/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { SiswaRow } from "@/lib/supabase/types";
import { Pagination } from "@/components/admin/Pagination";
import { Search, History } from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = env.ADMIN_PAGE_SIZE;

export default async function HasilKuisListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; kelas?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page ?? "1") || 1, 1);
  const search = (sp.search ?? "").trim();
  const kelas = (sp.kelas ?? "").trim();

  const supabase = getSupabaseAdmin();

  const [{ data: allSiswaKelas }, { data: hasilSiswaIds }] = await Promise.all([
    supabase.from("data_siswa").select("kelas").order("kelas", { ascending: true }),
    supabase.from("hasil_kuis").select("siswa_id"),
  ]);

  const kelasList = Array.from(
    new Set((allSiswaKelas ?? []).map((r) => r.kelas as string).filter(Boolean))
  );

  const activeSiswaIds = Array.from(
    new Set((hasilSiswaIds ?? []).map((r) => r.siswa_id as number))
  );

  let siswaList: SiswaRow[] = [];
  let totalItems = 0;
  const offset = (page - 1) * PAGE_SIZE;

  if (activeSiswaIds.length > 0) {
    let query = supabase
      .from("data_siswa")
      .select("*", { count: "exact" })
      .in("id", activeSiswaIds)
      .order("nama", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (search) {
      query = query.ilike("nama", `%${search}%`);
    }
    if (kelas) {
      query = query.eq("kelas", kelas);
    }

    const { data, count } = await query;
    siswaList = (data ?? []) as SiswaRow[];
    totalItems = count ?? 0;
  }

  const totalPages = Math.max(Math.ceil(totalItems / PAGE_SIZE), 1);

  const extraParams: Record<string, string> = {};
  if (search) extraParams.search = search;
  if (kelas) extraParams.kelas = kelas;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hasil Kuis Siswa</h1>
        <p className="text-sm text-slate-500">
          Pilih siswa untuk melihat riwayat detail jawaban kuis
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <form method="GET" className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Cari nama siswa..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              name="kelas"
              defaultValue={kelas}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Semua Kelas</option>
              {kelasList.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg cursor-pointer"
            >
              Filter
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">NISN</th>
                <th className="px-4 py-3">Nama Siswa</th>
                <th className="px-4 py-3">Kelas</th>
                <th className="px-4 py-3 text-right">Riwayat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {siswaList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Belum ada siswa yang mengerjakan kuis.
                  </td>
                </tr>
              ) : (
                siswaList.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-500">{offset + idx + 1}</td>
                    <td className="px-4 py-3 font-mono text-slate-700">{s.nisn}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{s.nama}</td>
                    <td className="px-4 py-3 text-slate-700">{s.kelas}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/hasil-kuis/${s.id}/riwayat`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold"
                      >
                        <History className="w-3.5 h-3.5" />
                        Lihat Riwayat
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/admin/hasil-kuis"
          extraParams={extraParams}
        />
      </div>
    </div>
  );
}
