import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { HasilKuisRow, KuisRow } from "@/lib/supabase/types";
import { requireSiswa } from "@/lib/auth/siswa-token";
import { apiStoreHasilKuisSchema } from "@/lib/validators/schemas";
import { calculateScore } from "@/lib/services/learning";
import { handleCorsOptions } from "@/lib/http/cors";
import {
  jsonError,
  jsonSuccess,
  jsonValidationError,
  parseJsonBody,
} from "@/lib/http/response";

export async function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req);
}

export async function POST(req: NextRequest) {
  const siswa = await requireSiswa(req);
  if (!siswa) {
    return jsonError(req, "Unauthenticated", 401);
  }

  const body = await parseJsonBody(req);
  if (!body.ok) return body.response;

  const parsed = apiStoreHasilKuisSchema.safeParse(body.data);
  if (!parsed.success) {
    return jsonValidationError(req, parsed.error);
  }

  const supabase = getSupabaseAdmin();
  const { data: soal, error: soalErr } = await supabase
    .from("kuis")
    .select("*")
    .eq("id", parsed.data.kuis_id)
    .maybeSingle();

  if (soalErr || !soal) {
    return jsonError(req, "Kuis tidak ditemukan", 404);
  }

  const typedSoal = soal as KuisRow;
  const skor = calculateScore(typedSoal.jawaban_benar, parsed.data.jawaban_user, typedSoal.nilai);
  const nowIso = new Date().toISOString();

  const { data: hasil, error: upsertErr } = await supabase
    .from("hasil_kuis")
    .upsert(
      {
        siswa_id: siswa.id,
        kuis_id: parsed.data.kuis_id,
        jawaban_user: parsed.data.jawaban_user,
        skor,
        waktu_dikerjakan: nowIso,
        updated_at: nowIso,
      },
      { onConflict: "siswa_id,kuis_id" }
    )
    .select("*")
    .single();

  if (upsertErr || !hasil) {
    return jsonError(req, upsertErr?.message ?? "Gagal menyimpan hasil kuis", 500);
  }

  const { data: allScores } = await supabase
    .from("hasil_kuis")
    .select("skor")
    .eq("siswa_id", siswa.id);

  const totalSkor = (allScores ?? []).reduce((acc, r) => acc + (r.skor ?? 0), 0);
  const typedHasil = hasil as HasilKuisRow;

  return jsonSuccess(req, {
    status: "success",
    hasil: {
      id: typedHasil.id,
      siswa_id: typedHasil.siswa_id,
      kuis_id: typedHasil.kuis_id,
      jawaban_user: typedHasil.jawaban_user,
      skor: typedHasil.skor,
      waktu_dikerjakan: typedHasil.waktu_dikerjakan,
    },
    total_skor: totalSkor,
  });
}
