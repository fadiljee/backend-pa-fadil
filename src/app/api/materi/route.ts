import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { MateriRow } from "@/lib/supabase/types";
import { requireSiswa } from "@/lib/auth/siswa-token";
import { getGambarUrl } from "@/lib/storage";
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
    .from("materis")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return jsonError(req, error.message, 500);
  }

  const data = ((rows ?? []) as MateriRow[]).map((m) => ({
    id: m.id,
    judul: m.judul,
    konten: m.konten,
    gambar_url: getGambarUrl(m.gambar, origin),
  }));

  return jsonSuccess(req, data);
}
