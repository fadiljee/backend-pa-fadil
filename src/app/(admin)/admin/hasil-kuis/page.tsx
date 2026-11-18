import Link from "next/link";
import { env } from "@/lib/config/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { SiswaRow } from "@/lib/supabase/types";
import { Pagination } from "@/components/admin/Pagination";
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
import { Search, History } from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = env.ADMIN_PAGE_SIZE;

export default async function HasilKuisListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; kelas?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page ?? "1") || 1, 1);
  const search = (sp.search ?? "").trim();
  const kelas = (sp.kelas ?? "").trim();

  const supabase = getSupabaseAdmin();

  const [{ data: allSiswaKelas }, { data: hasilSiswaIds }] = await Promise.all([
    supabase.from("data_siswa").select("kelas").order("kelas", { ascending: true }),
    supabase.from("hasil_kuis").select("siswa_id"),
  ]);

  const kelasList = Array.from(
    new Set((allSiswaKelas ?? []).map((r) => r.kelas as string).filter(Boolean))
  );

  const activeSiswaIds = Array.from(
    new Set((hasilSiswaIds ?? []).map((r) => r.siswa_id as number))
  );

  let siswaList: SiswaRow[] = [];
  let totalItems = 0;
  const offset = (page - 1) * PAGE_SIZE;

  if (activeSiswaIds.length > 0) {
    let query = supabase
      .from("data_siswa")
      .select("*", { count: "exact" })
      .in("id", activeSiswaIds)
      .order("nama", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (search) {
      query = query.ilike("nama", `%${search}%`);
    }
    if (kelas) {
      query = query.eq("kelas", kelas);
    }

    const { data, count } = await query;
    siswaList = (data ?? []) as SiswaRow[];
    totalItems = count ?? 0;
  }

  const totalPages = Math.max(Math.ceil(totalItems / PAGE_SIZE), 1);

  const extraParams: Record<string, string> = {};
  if (search) extraParams.search = search;
  if (kelas) extraParams.kelas = kelas;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hasil Kuis Siswa</h1>
        <p className="text-sm text-slate-600">
          Pilih siswa untuk melihat riwayat detail jawaban kuis
        </p>
      </div>

      <Card className="overflow-hidden border-slate-200 py-0 gap-0">
        <div className="p-4 border-b border-slate-200">
          <form method="GET" className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <Input
                type="text"
                name="search"
                defaultValue={search}
                aria-label="Cari nama siswa"
                placeholder="Cari nama siswa..."
                className="min-h-11 pl-9"
              />
            </div>

            <select
              name="kelas"
              defaultValue={kelas}
              aria-label="Filter berdasarkan kelas"
              className="min-h-11 px-3 py-2 border border-input rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Semua Kelas</option>
              {kelasList.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>

            <Button type="submit" variant="secondary" className="min-h-11 bg-slate-800 text-white hover:bg-slate-900">
              Filter
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
              <TableHead className="px-4 py-3 text-right">Riwayat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {siswaList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-8 text-center text-slate-600">
                  Belum ada siswa yang mengerjakan kuis.
                </TableCell>
              </TableRow>
            ) : (
              siswaList.map((s, idx) => (
                <TableRow key={s.id}>
                  <TableCell className="px-4 py-3 text-slate-600">{offset + idx + 1}</TableCell>
                  <TableCell className="px-4 py-3 font-mono text-slate-700">{s.nisn}</TableCell>
                  <TableCell className="px-4 py-3 font-medium text-slate-900">{s.nama}</TableCell>
                  <TableCell className="px-4 py-3 text-slate-700">{s.kelas}</TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/hasil-kuis/${s.id}/riwayat`}
                      className="inline-flex min-h-11 items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-light hover:bg-sky-100 text-primary text-xs font-semibold"
                    >
                      <History className="w-3.5 h-3.5" aria-hidden="true" />
                      Lihat Riwayat
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/admin/hasil-kuis"
          extraParams={extraParams}
        />
      </Card>
    </div>
  );
}
