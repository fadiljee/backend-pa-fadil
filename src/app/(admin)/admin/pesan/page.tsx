import { env } from "@/lib/config/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { isMissingPesanTableError, type PesanRow } from "@/lib/services/pesan";
import { Pagination } from "@/components/admin/Pagination";
import { ConfirmActionForm } from "@/components/ui/ConfirmActionForm";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deletePesanAction } from "./actions";
import { AlertTriangle, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = env.ADMIN_PAGE_SIZE;

function formatWaktu(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(d);
}

export default async function PesanMasukPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page ?? "1") || 1, 1);
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = getSupabaseAdmin();
  const { data, count, error } = await supabase
    .from("pesan_pengunjung")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  const missingTable = isMissingPesanTableError(error?.message);
  const rows = (data ?? []) as PesanRow[];
  const totalPages = Math.max(Math.ceil((count ?? 0) / PAGE_SIZE), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pesan Masuk</h1>
        <p className="text-sm text-slate-600">
          Pertanyaan dari pengunjung melalui formulir &quot;Hubungi Sekolah&quot; di halaman profil.
        </p>
      </div>

      {missingTable && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
          <div>
            <p className="font-semibold">Tabel pesan_pengunjung belum tersedia di Supabase.</p>
            <p className="mt-1 text-amber-800">
              Jalankan SQL di{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">
                supabase/migrations/0003_pesan_pengunjung.sql
              </code>{" "}
              pada SQL Editor Supabase agar formulir di halaman profil dapat menyimpan pesan.
            </p>
          </div>
        </div>
      )}

      {!missingTable && error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Gagal memuat pesan: {error.message}
        </div>
      )}

      <Card className="gap-0 overflow-hidden border-slate-200 py-0">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="px-4 py-3">Pengirim</TableHead>
              <TableHead className="px-4 py-3">Keperluan</TableHead>
              <TableHead className="px-4 py-3">Pesan</TableHead>
              <TableHead className="px-4 py-3">Waktu</TableHead>
              <TableHead className="px-4 py-3 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-10 text-center text-slate-600">
                  Belum ada pesan masuk. Pesan dari formulir halaman profil akan tampil di sini.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="px-4 py-3 align-top">
                    <div className="font-semibold text-slate-900">{row.nama}</div>
                    <a href={`mailto:${row.email}`} className="block text-xs text-primary hover:underline">
                      {row.email}
                    </a>
                    <a href={`tel:${row.no_hp}`} className="block text-xs text-slate-600 hover:underline">
                      {row.no_hp}
                    </a>
                  </TableCell>
                  <TableCell className="px-4 py-3 align-top">
                    <Badge variant="secondary">{row.keperluan}</Badge>
                  </TableCell>
                  <TableCell className="max-w-md whitespace-pre-line px-4 py-3 align-top text-sm text-slate-700">
                    {row.pesan || <span className="text-slate-500">Tanpa pesan tambahan</span>}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3 align-top text-sm text-slate-700">
                    {formatWaktu(row.created_at)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right align-top">
                    <ConfirmActionForm
                      action={deletePesanAction.bind(null, row.id)}
                      title="Hapus Pesan?"
                      description={`Pesan dari "${row.nama}" akan dihapus permanen.`}
                      confirmLabel="Ya, Hapus"
                      cancelLabel="Batal"
                      variant="danger"
                      triggerAriaLabel={`Hapus pesan dari ${row.nama}`}
                      triggerClassName="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </ConfirmActionForm>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/pesan" />
      </Card>
    </div>
  );
}
