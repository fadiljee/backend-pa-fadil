import Link from "next/link";
import { env } from "@/lib/config/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { MateriRow } from "@/lib/supabase/types";
import { getGambarUrl } from "@/lib/storage";
import { Pagination } from "@/components/admin/Pagination";
import { ConfirmActionForm } from "@/components/ui/ConfirmActionForm";
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
          <p className="text-sm text-slate-600">Kelola materi pembelajaran matematika</p>
        </div>
        <Button
          nativeButton={false}
          render={
            <Link href="/admin/materi/tambah" className="min-h-11 gap-2 px-4 shadow-sm">
              <Plus className="w-4 h-4" aria-hidden="true" />
              Tambah Materi
            </Link>
          }
        />
      </div>

      <Card className="overflow-hidden border-slate-200 py-0 gap-0">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="px-4 py-3">ID</TableHead>
              <TableHead className="px-4 py-3">Gambar</TableHead>
              <TableHead className="px-4 py-3">Judul Materi</TableHead>
              <TableHead className="px-4 py-3">Ringkasan Konten</TableHead>
              <TableHead className="px-4 py-3 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-8 text-center text-slate-600">
                  Belum ada materi.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((m) => {
                const imgUrl = getGambarUrl(m.gambar);
                return (
                  <TableRow key={m.id}>
                    <TableCell className="px-4 py-3 font-mono text-slate-600">{m.id}</TableCell>
                    <TableCell className="px-4 py-3">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={`Ilustrasi materi ${m.judul}`}
                          width={56}
                          height={40}
                          className="w-14 h-10 object-cover rounded border border-slate-200"
                        />
                      ) : (
                        <div className="w-14 h-10 rounded border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500">
                          <ImageIcon className="w-4 h-4" aria-hidden="true" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium text-slate-900">{m.judul}</TableCell>
                    <TableCell className="px-4 py-3 text-slate-600 max-w-md truncate">
                      {m.konten}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/materi/${m.id}/edit`}
                          aria-label={`Edit materi ${m.judul}`}
                          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-amber-700 hover:bg-amber-50"
                        >
                          <Pencil className="w-4 h-4" aria-hidden="true" />
                        </Link>
                        <ConfirmActionForm
                          action={deleteMateriAction.bind(null, m.id)}
                          title="Hapus Materi?"
                          description={`Materi "${m.judul}" beserta seluruh soal kuis terkait akan dihapus permanen.`}
                          confirmLabel="Ya, Hapus"
                          cancelLabel="Batal"
                          variant="danger"
                          triggerAriaLabel={`Hapus materi ${m.judul}`}
                          triggerClassName="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </ConfirmActionForm>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/materi" />
      </Card>
    </div>
  );
}
