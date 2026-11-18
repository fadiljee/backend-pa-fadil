import Link from "next/link";
import { env } from "@/lib/config/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { SiswaRow } from "@/lib/supabase/types";
import { Pagination } from "@/components/admin/Pagination";
import { ConfirmActionForm } from "@/components/ui/ConfirmActionForm";
import { deleteSiswaAction } from "./actions";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = env.ADMIN_PAGE_SIZE;

export default async function SiswaListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page ?? "1") || 1, 1);
  const search = (sp.search ?? "").trim();

  const offset = (page - 1) * PAGE_SIZE;
  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("data_siswa")
    .select("*", { count: "exact" })
    .order("nama", { ascending: true })
    .range(offset, offset + PAGE_SIZE - 1);

  if (search) {
    query = query.or(`nama.ilike.%${search}%,nisn.ilike.%${search}%`);
  }

  const { data, count } = await query;
  const rows = (data ?? []) as SiswaRow[];
  const totalItems = count ?? 0;
  const totalPages = Math.max(Math.ceil(totalItems / PAGE_SIZE), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Siswa</h1>
          <p className="text-sm text-slate-500">Kelola akun siswa dan NISN untuk login aplikasi</p>
        </div>
        <Link
          href="/admin/siswa/tambah"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Tambah Siswa
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <form method="GET" className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                aria-label="Cari nama atau NISN siswa"
                placeholder="Cari nama atau NISN..."
                className="w-full min-h-11 pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-800"
              />
            </div>
            <button
              type="submit"
              className="min-h-11 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg"
            >
              Cari
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
                <th className="px-4 py-3">Sekolah</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada data siswa.
                  </td>
                </tr>
              ) : (
                rows.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-500">{offset + idx + 1}</td>
                    <td className="px-4 py-3 font-mono text-slate-800">{s.nisn}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{s.nama}</td>
                    <td className="px-4 py-3 text-slate-700">{s.kelas}</td>
                    <td className="px-4 py-3 text-slate-500">{s.sekolah ?? "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/siswa/${s.id}/edit`}
                          aria-label={`Edit data siswa ${s.nama}`}
                          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-amber-700 hover:bg-amber-50"
                        >
                          <Pencil className="w-4 h-4" aria-hidden="true" />
                        </Link>
                        <ConfirmActionForm
                          action={deleteSiswaAction.bind(null, s.id)}
                          title="Hapus Data Siswa?"
                          description={`Data siswa ${s.nama} (${s.nisn}) beserta riwayat kuisnya akan dihapus permanen.`}
                          confirmLabel="Ya, Hapus"
                          cancelLabel="Batal"
                          variant="danger"
                          triggerAriaLabel={`Hapus data siswa ${s.nama}`}
                          triggerClassName="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </ConfirmActionForm>
                      </div>
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
          basePath="/admin/siswa"
          extraParams={search ? { search } : {}}
        />
      </div>
    </div>
  );
}
