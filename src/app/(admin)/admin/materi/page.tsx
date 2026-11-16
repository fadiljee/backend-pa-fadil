import Link from "next/link";
import { env } from "@/lib/config/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { MateriRow } from "@/lib/supabase/types";
import { getGambarUrl } from "@/lib/storage";
import { Pagination } from "@/components/admin/Pagination";
import { deleteMateriAction } from "./actions";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = env.ADMIN_PAGE_SIZE;

export default async function MateriListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page ?? "1") || 1, 1);
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = getSupabaseAdmin();
  const { data, count } = await supabase
    .from("materis")
    .select("*", { count: "exact" })
    .order("id", { ascending: true })
    .range(offset, offset + PAGE_SIZE - 1);

  const rows = (data ?? []) as MateriRow[];
  const totalItems = count ?? 0;
  const totalPages = Math.max(Math.ceil(totalItems / PAGE_SIZE), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Materi</h1>
          <p className="text-sm text-slate-500">Kelola materi pembelajaran matematika</p>
        </div>
        <Link
          href="/admin/materi/tambah"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Tambah Materi
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Gambar</th>
                <th className="px-4 py-3">Judul Materi</th>
                <th className="px-4 py-3">Ringkasan Konten</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Belum ada materi.
                  </td>
                </tr>
              ) : (
                rows.map((m) => {
                  const imgUrl = getGambarUrl(m.gambar);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-slate-500">{m.id}</td>
                      <td className="px-4 py-3">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={m.judul}
                            className="w-14 h-10 object-cover rounded border border-slate-200"
                          />
                        ) : (
                          <div className="w-14 h-10 rounded border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">{m.judul}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-md truncate">
                        {m.konten}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/admin/materi/${m.id}/edit`}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <form action={deleteMateriAction.bind(null, m.id)}>
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

        <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/materi" />
      </div>
    </div>
  );
}
