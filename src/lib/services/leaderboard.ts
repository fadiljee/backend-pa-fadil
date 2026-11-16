import { getSupabaseAdmin } from "@/lib/supabase/server";
import { SiswaRow } from "@/lib/supabase/types";
import { capTotalSkor } from "./learning";

export interface SiswaScoreSummary {
  siswaId: number;
  nama: string;
  nisn: string;
  kelas: string;
  totalSkor: number;
}

/**
 * Mengagregasi total skor tiap siswa dari tabel `hasil_kuis` (diurutkan tertinggi).
 */
export async function getAggregatedLeaderboard(): Promise<SiswaScoreSummary[]> {
  const supabase = getSupabaseAdmin();
  const { data: rows, error } = await supabase
    .from("hasil_kuis")
    .select("siswa_id, skor, data_siswa(id, nama, nisn, kelas)");

  if (error) {
    throw new Error(`Gagal memuat leaderboard: ${error.message}`);
  }

  const map = new Map<
    number,
    { siswaId: number; nama: string; nisn: string; kelas: string; total: number }
  >();

  for (const row of rows ?? []) {
    const sRaw = row.data_siswa as unknown as SiswaRow | SiswaRow[] | null;
    const s = Array.isArray(sRaw) ? sRaw[0] : sRaw;
    if (!s) continue;

    const prev = map.get(s.id) ?? {
      siswaId: s.id,
      nama: s.nama,
      nisn: s.nisn,
      kelas: s.kelas,
      total: 0,
    };
    prev.total += (row.skor as number) ?? 0;
    map.set(s.id, prev);
  }

  return Array.from(map.values())
    .map((item) => ({
      siswaId: item.siswaId,
      nama: item.nama,
      nisn: item.nisn,
      kelas: item.kelas,
      totalSkor: capTotalSkor(item.total),
    }))
    .sort((a, b) => b.totalSkor - a.totalSkor);
}
