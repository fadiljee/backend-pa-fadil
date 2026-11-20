import Link from "next/link";
import { env } from "@/lib/config/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { BeritaRow } from "@/lib/supabase/types";
import { getGambarUrl } from "@/lib/storage";
import { isMissingBeritaTableError } from "@/lib/services/berita";
import { Pagination } from "@/components/admin/Pagination";
import { ConfirmActionForm } from "@/components/ui/ConfirmActionForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteBeritaAction } from "./actions";
import { Plus, Pencil, Trash2, Image as ImageIcon, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = env.ADMIN_PAGE_SIZE;

function formatTanggal(dateStr: string): string {
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export default async function BeritaListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page ?? "1") || 1, 1);
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = getSupabaseAdmin();
  const { data, count, error } = await supabase
    .from("berita_sekolah")
    .select("*", { count: "exact" })
    .order("tanggal_kegiatan", { ascending: false })
    .order("id", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  const missingTable = isMissingBeritaTableError(error?.message);
  const rows = (data ?? []) as BeritaRow[];
  const totalItems = count ?? 0;
  const totalPages = Math.max(Math.ceil(totalItems / PAGE_SIZE), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Berita & Kegiatan Sekolah</h1>
          <p className="text-sm text-slate-600">
            Kelola berita, pengumuman, prestasi, dan dokumentasi kegiatan yang tampil di halaman profil sekolah.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={
            <Link href="/admin/berita/tambah" className="min-h-11 gap-2 px-4 shadow-sm">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Tambah Berita
            </Link>
          }
        />
      </div>

      {missingTable && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
          <div>
            <p className="font-semibold">Tabel berita_sekolah belum tersedia di Supabase.</p>
            <p className="mt-1 text-amber-800">
              Jalankan SQL di{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">
                supabase/migrations/0002_berita_sekolah.sql
              </code>{" "}
              pada SQL Editor Supabase agar admin dapat menambahkan dan menerbitkan berita kegiatan sekolah.
            </p>
          </div>
        </div>
      )}

      {!missingTable && error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          Gagal memuat data berita: {error.message}
        </div>
      )}

      <Card className="gap-0 overflow-hidden border-slate-200 py-0">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="px-4 py-3">Foto</TableHead>
              <TableHead className="px-4 py-3">Judul & Ringkasan</TableHead>
              <TableHead className="px-4 py-3">Kategori</TableHead>
              <TableHead className="px-4 py-3">Tanggal</TableHead>
              <TableHead className="px-4 py-3">Status</TableHead>
              <TableHead className="px-4 py-3 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="px-4 py-10 text-center text-slate-600">
                  Belum ada berita kegiatan sekolah. Klik &quot;Tambah Berita&quot; untuk membuat berita pertama.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((item) => {
                const imgUrl = getGambarUrl(item.gambar);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="px-4 py-3">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={`Foto berita ${item.judul}`}
                          width={64}
                          height={44}
                          className="h-11 w-16 rounded border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-16 items-center justify-center rounded border border-slate-200 bg-slate-50 text-slate-500">
                          <ImageIcon className="h-4 w-4" aria-hidden="true" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="max-w-md px-4 py-3">
                      <div className="font-semibold text-slate-900">{item.judul}</div>
                      <div className="mt-0.5 truncate text-xs text-slate-600">
                        {item.ringkasan}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant="secondary">{item.kategori}</Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                      {formatTanggal(item.tanggal_kegiatan)}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {item.published ? (
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
                          Terbit
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                          Draf
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/berita/${item.id}/edit`}
                          aria-label={`Edit berita ${item.judul}`}
                          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-amber-700 hover:bg-amber-50"
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <ConfirmActionForm
                          action={deleteBeritaAction.bind(null, item.id)}
                          title="Hapus Berita?"
                          description={`Berita "${item.judul}" akan dihapus permanen dari daftar kegiatan sekolah.`}
                          confirmLabel="Ya, Hapus"
                          cancelLabel="Batal"
                          variant="danger"
                          triggerAriaLabel={`Hapus berita ${item.judul}`}
                          triggerClassName="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </ConfirmActionForm>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/berita" />
      </Card>
    </div>
  );
}
