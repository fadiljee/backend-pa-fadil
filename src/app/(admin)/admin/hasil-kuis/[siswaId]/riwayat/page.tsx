import Link from "next/link";
import { notFound } from "next/navigation";
import { env } from "@/lib/config/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { HasilKuisRow, KuisRow, SiswaRow } from "@/lib/supabase/types";
import { Pagination } from "@/components/admin/Pagination";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = env.ADMIN_HISTORY_PAGE_SIZE;

export default async function RiwayatSiswaPage({
  params,
  searchParams,
}: {
  params: Promise<{ siswaId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { siswaId: rawId } = await params;
  const siswaId = Number(rawId);
  if (!Number.isInteger(siswaId) || siswaId <= 0) {
    notFound();
  }

  const supabase = getSupabaseAdmin();
  const { data: siswaData } = await supabase
    .from("data_siswa")
    .select("*")
    .eq("id", siswaId)
    .maybeSingle();

  if (!siswaData) {
    notFound();
  }
  const siswa = siswaData as SiswaRow;

  const sp = await searchParams;
  const page = Math.max(Number(sp.page ?? "1") || 1, 1);
  const offset = (page - 1) * PAGE_SIZE;

  const { data, count } = await supabase
    .from("hasil_kuis")
    .select("*, kuis(pertanyaan, jawaban_benar, materis(judul))", { count: "exact" })
    .eq("siswa_id", siswaId)
    .order("waktu_dikerjakan", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  const totalItems = count ?? 0;
  const totalPages = Math.max(Math.ceil(totalItems / PAGE_SIZE), 1);

  type RiwayatJoined = HasilKuisRow & {
    kuis:
      | (Pick<KuisRow, "pertanyaan" | "jawaban_benar"> & {
          materis: { judul: string } | { judul: string }[] | null;
        })
      | null;
  };

  const rows = (data ?? []) as unknown as RiwayatJoined[];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/hasil-kuis"
          className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Riwayat Kuis: {siswa.nama}
          </h1>
          <p className="text-sm text-slate-500">
            NISN: {siswa.nisn} • Kelas: {siswa.kelas}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Materi</th>
                <th className="px-4 py-3">Pertanyaan</th>
                <th className="px-4 py-3">Jawaban Siswa</th>
                <th className="px-4 py-3">Kunci</th>
                <th className="px-4 py-3">Skor</th>
                <th className="px-4 py-3">Waktu (WIB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Belum ada riwayat pengerjaan kuis.
                  </td>
                </tr>
              ) : (
                rows.map((r, idx) => {
                  const k = r.kuis;
                  const mRaw = k?.materis;
                  const m = Array.isArray(mRaw) ? mRaw[0] : mRaw;
                  const benar = r.jawaban_user === k?.jawaban_benar;
                  return (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-500">{offset + idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-indigo-700">
                        {m?.judul ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-800 max-w-sm truncate">
                        {k?.pertanyaan ?? "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold uppercase text-xs ${
                            benar
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {r.jawaban_user}
                        </span>
                      </td>
                      <td className="px-4 py-3 uppercase font-semibold text-slate-600">
                        {k?.jawaban_benar ?? "-"}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">{r.skor}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(r.waktu_dikerjakan).toLocaleString("id-ID", {
                          timeZone: "Asia/Jakarta",
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={`/admin/hasil-kuis/${siswaId}/riwayat`}
        />
      </div>
    </div>
  );
}
