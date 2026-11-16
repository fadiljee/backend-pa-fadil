import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { requireSiswa } from "@/lib/auth/siswa-token";
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
    .from("materi_siswa_unlock")
    .select("materi_id")
    .eq("siswa_id", siswa.id);

  const unlockedMateriIds = (rows ?? []).map((r) => r.materi_id as number);
  if (!unlockedMateriIds.includes(1)) {
    unlockedMateriIds.unshift(1);
  }

  return jsonSuccess(req, {
    unlocked_materi_ids: unlockedMateriIds,
  });
}
