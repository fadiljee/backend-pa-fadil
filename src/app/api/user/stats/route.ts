import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { requireSiswa } from "@/lib/auth/siswa-token";
import { capTotalSkor, computeGelar } from "@/lib/services/learning";
import { handleCorsOptions } from "@/lib/http/cors";
import { jsonError, jsonSuccess } from "@/lib/http/response";

export async function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req);
}

export async function GET(req: NextRequest) {
  const siswa = await requireSiswa(req);
  if (!siswa) {
    return jsonError(req, "Unauthenticated", 401);
  }

  const supabase = getSupabaseAdmin();
  const { data: rows } = await supabase
    .from("hasil_kuis")
    .select("skor")
    .eq("siswa_id", siswa.id);

  const total = (rows ?? []).reduce((acc, r) => acc + (r.skor ?? 0), 0);
  const skorAkhir = capTotalSkor(total);
  const gelar = computeGelar(skorAkhir);

  return jsonSuccess(req, {
    total_skor: skorAkhir,
    gelar,
  });
}
