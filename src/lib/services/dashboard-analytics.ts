import { getSupabaseAdmin } from "@/lib/supabase/server";
import { SiswaScoreSummary } from "./leaderboard";

export interface DailyQuizActivityPoint {
  dateKey: string;
  shortLabel: string;
  fullLabel: string;
  jumlahPengerjaan: number;
  siswaAktif: number;
}

export interface ScoreDistributionItem {
  key: "tinggi" | "sedang" | "rendah";
  label: string;
  rangeLabel: string;
  jumlahSiswa: number;
  persentase: number;
}

export interface MateriUnlockProgressItem {
  materiId: number;
  judul: string;
  judulSingkat: string;
  jumlahSiswa: number;
  persentase: number;
}

export interface DashboardAnalyticsData {
  dailyActivity30d: DailyQuizActivityPoint[];
  scoreDistribution: ScoreDistributionItem[];
  totalEvaluatedSiswa: number;
  materiUnlockProgress: MateriUnlockProgressItem[];
  totalRegisteredSiswa: number;
}

const JAKARTA_TZ = "Asia/Jakarta";

function formatDateKeyJakarta(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: JAKARTA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatShortLabelJakarta(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: JAKARTA_TZ,
    day: "numeric",
    month: "short",
  }).format(date);
}

function formatFullLabelJakarta(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: JAKARTA_TZ,
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function truncateTitle(title: string, maxLength = 24): string {
  const clean = title.trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trimEnd()}…`;
}

/**
 * Mengambil dan mengagregasi data asli dari Supabase untuk 3 grafik dashboard admin:
 * 1. Aktivitas pengerjaan kuis harian (30 hari terakhir, zona waktu Asia/Jakarta)
 * 2. Distribusi kategori nilai siswa aktif
 * 3. Progres pembukaan (unlock) materi per judul materi
 */
export async function getDashboardAnalytics(
  allScores: SiswaScoreSummary[],
  totalRegisteredSiswa: number
): Promise<DashboardAnalyticsData> {
  const supabase = getSupabaseAdmin();

  const now = new Date();
  const windowStart = new Date(now);
  windowStart.setDate(windowStart.getDate() - 31);

  const [hasilRes, materisRes, unlocksRes] = await Promise.all([
    supabase
      .from("hasil_kuis")
      .select("siswa_id, waktu_dikerjakan")
      .gte("waktu_dikerjakan", windowStart.toISOString()),
    supabase
      .from("materis")
      .select("id, judul")
      .order("id", { ascending: true }),
    supabase.from("materi_siswa_unlock").select("materi_id, siswa_id"),
  ]);

  if (hasilRes.error) {
    throw new Error(`Gagal memuat data aktivitas kuis: ${hasilRes.error.message}`);
  }
  if (materisRes.error) {
    throw new Error(`Gagal memuat daftar materi: ${materisRes.error.message}`);
  }
  if (unlocksRes.error) {
    throw new Error(`Gagal memuat data progres unlock materi: ${unlocksRes.error.message}`);
  }

  // 1. Siapkan bucket 30 hari kalender terakhir (termasuk hari ini)
  const dailyBuckets = new Map<
    string,
    {
      dateKey: string;
      shortLabel: string;
      fullLabel: string;
      count: number;
      siswaSet: Set<number>;
    }
  >();

  for (let offset = 29; offset >= 0; offset--) {
    const d = new Date(now);
    d.setDate(now.getDate() - offset);
    const key = formatDateKeyJakarta(d);
    if (!dailyBuckets.has(key)) {
      dailyBuckets.set(key, {
        dateKey: key,
        shortLabel: formatShortLabelJakarta(d),
        fullLabel: formatFullLabelJakarta(d),
        count: 0,
        siswaSet: new Set<number>(),
      });
    }
  }

  for (const row of hasilRes.data ?? []) {
    if (!row.waktu_dikerjakan) continue;
    const parsed = new Date(row.waktu_dikerjakan as string);
    if (Number.isNaN(parsed.getTime())) continue;
    const key = formatDateKeyJakarta(parsed);
    const bucket = dailyBuckets.get(key);
    if (!bucket) continue;
    bucket.count += 1;
    if (typeof row.siswa_id === "number") {
      bucket.siswaSet.add(row.siswa_id);
    }
  }

  const dailyActivity30d: DailyQuizActivityPoint[] = Array.from(dailyBuckets.values()).map(
    (b) => ({
      dateKey: b.dateKey,
      shortLabel: b.shortLabel,
      fullLabel: b.fullLabel,
      jumlahPengerjaan: b.count,
      siswaAktif: b.siswaSet.size,
    })
  );

  // 2. Distribusi kategori nilai siswa aktif
  let tinggi = 0;
  let sedang = 0;
  let rendah = 0;
  for (const row of allScores) {
    if (row.totalSkor >= 85) tinggi += 1;
    else if (row.totalSkor >= 70) sedang += 1;
    else rendah += 1;
  }

  const totalEvaluatedSiswa = allScores.length;
  const pct = (value: number, total: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  const scoreDistribution: ScoreDistributionItem[] = [
    {
      key: "tinggi",
      label: "Tinggi",
      rangeLabel: "Nilai ≥ 85",
      jumlahSiswa: tinggi,
      persentase: pct(tinggi, totalEvaluatedSiswa),
    },
    {
      key: "sedang",
      label: "Sedang",
      rangeLabel: "Nilai 70 sampai 84",
      jumlahSiswa: sedang,
      persentase: pct(sedang, totalEvaluatedSiswa),
    },
    {
      key: "rendah",
      label: "Perlu Bimbingan",
      rangeLabel: "Nilai < 70",
      jumlahSiswa: rendah,
      persentase: pct(rendah, totalEvaluatedSiswa),
    },
  ];

  // 3. Progres unlock tiap materi (diurutkan sesuai urutan kurikulum / id ASC)
  const unlockMap = new Map<number, Set<number>>();
  for (const row of unlocksRes.data ?? []) {
    const materiId = row.materi_id as number;
    const siswaId = row.siswa_id as number;
    if (!unlockMap.has(materiId)) {
      unlockMap.set(materiId, new Set<number>());
    }
    unlockMap.get(materiId)!.add(siswaId);
  }

  const materiUnlockProgress: MateriUnlockProgressItem[] = (materisRes.data ?? []).map(
    (m) => {
      const materiId = m.id as number;
      const judul = String(m.judul ?? "");
      const jumlahSiswa = unlockMap.get(materiId)?.size ?? 0;
      return {
        materiId,
        judul,
        judulSingkat: truncateTitle(judul, 24),
        jumlahSiswa,
        persentase: pct(jumlahSiswa, totalRegisteredSiswa),
      };
    }
  );

  return {
    dailyActivity30d,
    scoreDistribution,
    totalEvaluatedSiswa,
    materiUnlockProgress,
    totalRegisteredSiswa,
  };
}
