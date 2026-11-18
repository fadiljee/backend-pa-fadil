import { env } from "@/lib/config/env";
import { computeGelarInfo } from "@/lib/services/learning";
import { getAggregatedLeaderboard } from "@/lib/services/leaderboard";
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
import { Trophy } from "lucide-react";

export const dynamic = "force-dynamic";

const badgeStyles: Record<string, string> = {
  warning: "bg-amber-100 text-amber-800 border-amber-200",
  info: "bg-sky-100 text-sky-800 border-sky-200",
  primary: "bg-indigo-100 text-indigo-800 border-indigo-200",
  success: "bg-emerald-100 text-emerald-800 border-emerald-200",
  secondary: "bg-slate-200 text-slate-700 border-slate-300",
  light: "bg-slate-100 text-slate-600 border-slate-200",
};

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page ?? "1") || 1, 1);
  const pageSize = env.ADMIN_PAGE_SIZE;

  const allSorted = await getAggregatedLeaderboard();
  const totalItems = allSorted.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  const offset = (page - 1) * pageSize;
  const pagedRows = allSorted.slice(offset, offset + pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
          <Trophy className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leaderboard Siswa</h1>
          <p className="text-sm text-slate-600">
            Peringkat total skor siswa (dibatasi maksimal {env.MAX_TOTAL_SCORE}) beserta gelar pencapaian
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200 py-0 gap-0">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="px-4 py-3">Peringkat</TableHead>
              <TableHead className="px-4 py-3">Nama Siswa</TableHead>
              <TableHead className="px-4 py-3">Kelas</TableHead>
              <TableHead className="px-4 py-3">Total Skor</TableHead>
              <TableHead className="px-4 py-3">Gelar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-8 text-center text-slate-600">
                  Belum ada data leaderboard.
                </TableCell>
              </TableRow>
            ) : (
              pagedRows.map((row, idx) => {
                const gelar = computeGelarInfo(row.totalSkor);
                return (
                  <TableRow key={row.siswaId}>
                    <TableCell className="px-4 py-3 font-bold text-slate-700">
                      #{offset + idx + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium text-slate-900">{row.nama}</TableCell>
                    <TableCell className="px-4 py-3 text-slate-700">{row.kelas}</TableCell>
                    <TableCell className="px-4 py-3 font-bold text-primary">{row.totalSkor}</TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant="outline" className={badgeStyles[gelar.variant]}>
                        {gelar.teks}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/leaderboard" />
      </Card>
    </div>
  );
}
