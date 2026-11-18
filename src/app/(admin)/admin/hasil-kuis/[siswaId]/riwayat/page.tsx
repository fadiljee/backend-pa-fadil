import Link from "next/link";
import { notFound } from "next/navigation";
import { env } from "@/lib/config/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { HasilKuisRow, KuisRow, SiswaRow } from "@/lib/supabase/types";
import { Pagination } from "@/components/admin/Pagination";
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
          aria-label="Kembali ke daftar hasil kuis"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Riwayat Kuis: {siswa.nama}
          </h1>
          <p className="text-sm text-slate-600">
            NISN: {siswa.nisn} · Kelas: {siswa.kelas}
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200 py-0 gap-0">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="px-4 py-3">No</TableHead>
              <TableHead className="px-4 py-3">Materi</TableHead>
              <TableHead className="px-4 py-3">Pertanyaan</TableHead>
              <TableHead className="px-4 py-3">Jawaban Siswa</TableHead>
              <TableHead className="px-4 py-3">Kunci</TableHead>
              <TableHead className="px-4 py-3">Skor</TableHead>
              <TableHead className="px-4 py-3">Waktu (WIB)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="px-4 py-8 text-center text-slate-600">
                  Belum ada riwayat pengerjaan kuis.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r, idx) => {
                const k = r.kuis;
                const mRaw = k?.materis;
                const m = Array.isArray(mRaw) ? mRaw[0] : mRaw;
                const benar = r.jawaban_user === k?.jawaban_benar;
                return (
                  <TableRow key={r.id}>
                    <TableCell className="px-4 py-3 text-slate-600">{offset + idx + 1}</TableCell>
                    <TableCell className="px-4 py-3 font-medium text-primary">
                      {m?.judul ?? "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-slate-800 max-w-sm truncate">
                      {k?.pertanyaan ?? "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge
                        className={
                          benar
                            ? "bg-emerald-100 text-emerald-800 font-bold uppercase"
                            : "bg-red-100 text-red-800 font-bold uppercase"
                        }
                      >
                        {r.jawaban_user} ({benar ? "Benar" : "Salah"})
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 uppercase font-semibold text-slate-700">
                      {k?.jawaban_benar ?? "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-bold text-slate-900">{r.skor}</TableCell>
                    <TableCell className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                      {new Date(r.waktu_dikerjakan).toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                      })}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={`/admin/hasil-kuis/${siswaId}/riwayat`}
        />
      </Card>
    </div>
  );
}
