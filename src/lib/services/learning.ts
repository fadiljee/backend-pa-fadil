import { env } from "@/lib/config/env";

export type JawabanOpsi = "a" | "b" | "c" | "d";

export type GelarInfo = {
  teks: string;
  variant: "warning" | "info" | "primary" | "success" | "secondary" | "light";
};

/**
 * Menghitung skor untuk satu soal kuis.
 * Jawaban benar mendapat `nilai` (default 10), salah mendapat 0.
 */
export function calculateScore(
  jawabanBenar: string,
  jawabanUser: string,
  nilai?: number | null
): number {
  const normalizedBenar = jawabanBenar.trim().toLowerCase();
  const normalizedUser = jawabanUser.trim().toLowerCase();
  if (normalizedBenar === normalizedUser) {
    return nilai ?? 10;
  }
  return 0;
}

/**
 * Membatasi total skor maksimal sesuai konfigurasi (default 100).
 */
export function capTotalSkor(totalSkor: number, maxScore = env.MAX_TOTAL_SCORE): number {
  if (!Number.isFinite(totalSkor) || totalSkor <= 0) {
    return 0;
  }
  return Math.min(Math.floor(totalSkor), maxScore);
}

/**
 * Menentukan gelar siswa berdasarkan total skor (sudah di-cap 0..100).
 */
export function computeGelar(skor: number): string {
  const capped = capTotalSkor(skor);
  if (capped >= 81) return "Juara Matematika";
  if (capped >= 61) return "Master Operasi Hitung";
  if (capped >= 41) return "Ahli Hitung Dasar";
  if (capped >= 21) return "Penjelajah Angka";
  if (capped >= 1) return "Pemula Matematika";
  return "Belum Ada Gelar";
}

/**
 * Informasi gelar lengkap dengan badge variant untuk tampilan admin.
 */
export function computeGelarInfo(skor: number): GelarInfo {
  const capped = capTotalSkor(skor);
  if (capped >= 81) return { teks: "Juara Matematika", variant: "warning" };
  if (capped >= 61) return { teks: "Master Operasi Hitung", variant: "info" };
  if (capped >= 41) return { teks: "Ahli Hitung Dasar", variant: "primary" };
  if (capped >= 21) return { teks: "Penjelajah Angka", variant: "success" };
  if (capped >= 1) return { teks: "Pemula Matematika", variant: "secondary" };
  return { teks: "Belum Ada Gelar", variant: "light" };
}

/**
 * Menentukan apakah materi berikutnya dapat dibuka berdasarkan persentase skor minimum (default 70%).
 */
export function canUnlockNext(
  skorDidapat: number,
  skorMaksimumMateri: number,
  threshold = env.UNLOCK_MIN_PERCENTAGE
): boolean {
  if (skorMaksimumMateri <= 0 || skorDidapat <= 0) {
    return false;
  }
  return skorDidapat / skorMaksimumMateri >= threshold;
}
