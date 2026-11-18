import Link from "next/link";
import { env } from "@/lib/config/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { KuisRow } from "@/lib/supabase/types";
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
          <p className="text-sm text-slate-600">Kelola bank soal pilihan ganda per materi</p>
        </div>
        <Button
          nativeButton={false}
          render={
            <Link href="/admin/kuis/tambah" className="min-h-11 gap-2 px-4 shadow-sm">
              <Plus className="w-4 h-4" aria-hidden="true" />
              Tambah Kuis
            </Link>
          }
        />
      </div>

      <Card className="overflow-hidden border-slate-200 py-0 gap-0">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="px-4 py-3">No</TableHead>
              <TableHead className="px-4 py-3">Materi</TableHead>
              <TableHead className="px-4 py-3">Pertanyaan</TableHead>
              <TableHead className="px-4 py-3">Kunci</TableHead>
              <TableHead className="px-4 py-3">Nilai</TableHead>
              <TableHead className="px-4 py-3 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="px-4 py-8 text-center text-slate-600">
                  Belum ada soal kuis.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((k, idx) => {
                const m = Array.isArray(k.materis) ? k.materis[0] : k.materis;
                return (
                  <TableRow key={k.id}>
                    <TableCell className="px-4 py-3 text-slate-600">{offset + idx + 1}</TableCell>
                    <TableCell className="px-4 py-3 font-medium text-primary">
                      {m?.judul ?? "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-slate-800 max-w-md truncate">
                      {k.pertanyaan}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge className="bg-emerald-100 text-emerald-800 uppercase font-bold">
                        {k.jawaban_benar}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-slate-700">{k.nilai}</TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/kuis/${k.id}/edit`}
                          aria-label={`Edit soal kuis nomor ${offset + idx + 1}`}
                          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-amber-700 hover:bg-amber-50"
                        >
                          <Pencil className="w-4 h-4" aria-hidden="true" />
                        </Link>
                        <ConfirmActionForm
                          action={deleteKuisAction.bind(null, k.id)}
                          title="Hapus Soal Kuis?"
                          description={`Soal kuis "${k.pertanyaan.slice(0, 80)}${k.pertanyaan.length > 80 ? "..." : ""}" akan dihapus permanen dari bank soal.`}
                          confirmLabel="Ya, Hapus"
                          cancelLabel="Batal"
                          variant="danger"
                          triggerAriaLabel={`Hapus soal kuis nomor ${offset + idx + 1}`}
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

        <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/kuis" />
      </Card>
    </div>
  );
}
