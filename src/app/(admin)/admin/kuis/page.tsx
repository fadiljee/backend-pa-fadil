import Link from "next/link";
import { env } from "@/lib/config/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { KuisRow } from "@/lib/supabase/types";
import { Pagination } from "@/components/admin/Pagination";
import { deleteKuisAction } from "./actions";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = env.ADMIN_PAGE_SIZE;

export default async function KuisListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page ?? "1") || 1, 1);
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = getSupabaseAdmin();
  const { data, count } = await supabase
    .from("kuis")
    .select("*, materis(judul)", { count: "exact" })
    .order("id", { ascending: true })
    .range(offset, offset + PAGE_SIZE - 1);

  const rows = (data ?? []) as unknown as (KuisRow & {
    materis: { judul: string } | { judul: string }[] | null;
  })[];

  const totalItems = count ?? 0;
  const totalPages = Math.max(Math.ceil(totalItems / PAGE_SIZE), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Kuis</h1>
          <p className="text-sm text-slate-500">Kelola bank soal pilihan ganda per materi</p>
        </div>
        <Link
          href="/admin/kuis/tambah"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Tambah Kuis
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Materi</th>
                <th className="px-4 py-3">Pertanyaan</th>
                <th className="px-4 py-3">Kunci</th>
                <th className="px-4 py-3">Nilai</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Belum ada soal kuis.
                  </td>
                </tr>
              ) : (
                rows.map((k, idx) => {
                  const m = Array.isArray(k.materis) ? k.materis[0] : k.materis;
                  return (
                    <tr key={k.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-500">{offset + idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-indigo-700">
                        {m?.judul ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-800 max-w-md truncate">
                        {k.pertanyaan}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase text-xs">
                          {k.jawaban_benar}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{k.nilai}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/admin/kuis/${k.id}/edit`}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <form action={deleteKuisAction.bind(null, k.id)}>
                            <button
                              type="submit"
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/kuis" />
      </div>
    </div>
  );
}
