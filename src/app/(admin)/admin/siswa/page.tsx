import Link from "next/link";
import { env } from "@/lib/config/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { SiswaRow } from "@/lib/supabase/types";
import { Pagination } from "@/components/admin/Pagination";
import { ConfirmActionForm } from "@/components/ui/ConfirmActionForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
          <p className="text-sm text-slate-600">Kelola akun siswa dan NISN untuk login aplikasi</p>
        </div>
        <Button
          nativeButton={false}
          render={
            <Link
              href="/admin/siswa/tambah"
              className="min-h-11 gap-2 px-4 shadow-sm"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Tambah Siswa
            </Link>
          }
        />
      </div>

      <Card className="overflow-hidden border-slate-200 py-0 gap-0">
        <div className="p-4 border-b border-slate-200">
          <form method="GET" className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <Input
                type="text"
                name="search"
                defaultValue={search}
                aria-label="Cari nama atau NISN siswa"
                placeholder="Cari nama atau NISN..."
                className="min-h-11 pl-9"
              />
            </div>
            <Button type="submit" variant="secondary" className="min-h-11 bg-slate-800 text-white hover:bg-slate-900">
              Cari
            </Button>
          </form>
        </div>

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="px-4 py-3">No</TableHead>
              <TableHead className="px-4 py-3">NISN</TableHead>
              <TableHead className="px-4 py-3">Nama Siswa</TableHead>
              <TableHead className="px-4 py-3">Kelas</TableHead>
              <TableHead className="px-4 py-3">Sekolah</TableHead>
              <TableHead className="px-4 py-3 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="px-4 py-8 text-center text-slate-600">
                  {search ? "Tidak ada siswa yang cocok dengan pencarian." : "Belum ada data siswa."}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((s, idx) => (
                <TableRow key={s.id}>
                  <TableCell className="px-4 py-3 text-slate-600">{offset + idx + 1}</TableCell>
                  <TableCell className="px-4 py-3 font-mono text-slate-800">{s.nisn}</TableCell>
                  <TableCell className="px-4 py-3 font-medium text-slate-900">{s.nama}</TableCell>
                  <TableCell className="px-4 py-3 text-slate-700">{s.kelas}</TableCell>
                  <TableCell className="px-4 py-3 text-slate-600">{s.sekolah ?? "-"}</TableCell>
                  <TableCell className="px-4 py-3 text-right">
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/admin/siswa"
          extraParams={search ? { search } : {}}
        />
      </Card>
    </div>
  );
}
