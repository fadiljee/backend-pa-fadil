import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { requireSiswa } from "@/lib/auth/siswa-token";
import { formatKuisItem, KuisWithMateriRow } from "@/lib/services/kuis-mapper";
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

  const origin = req.nextUrl.origin;
  const supabase = getSupabaseAdmin();
  const { data: rows, error } = await supabase
    .from("kuis")
    .select("*, materis(*)")
    .order("id", { ascending: true });

  if (error) {
    return jsonError(req, error.message, 500);
  }

  const data = ((rows ?? []) as unknown as KuisWithMateriRow[]).map((row) =>
    formatKuisItem(row, origin)
  );

  return jsonSuccess(req, { kuis: data });
}
