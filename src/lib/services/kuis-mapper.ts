import { KuisRow, MateriRow } from "@/lib/supabase/types";
import { getGambarUrl } from "@/lib/storage";

export type KuisWithMateriRow = KuisRow & {
  materis: MateriRow | MateriRow[] | null;
};

export function formatKuisItem(row: KuisWithMateriRow, origin: string) {
  const m = Array.isArray(row.materis) ? row.materis[0] : row.materis;
  return {
    id: row.id,
    pertanyaan: row.pertanyaan,
    jawaban_a: row.jawaban_a,
    jawaban_b: row.jawaban_b,
    jawaban_c: row.jawaban_c,
    jawaban_d: row.jawaban_d,
    jawaban_benar: row.jawaban_benar,
    nilai: row.nilai,
    materi_id: row.materi_id,
    pembahasan: row.pembahasan,
    materi: m
      ? {
          id: m.id,
          judul: m.judul,
          konten: m.konten,
          gambar: m.gambar,
          gambar_url: getGambarUrl(m.gambar, origin),
        }
      : null,
  };
}
