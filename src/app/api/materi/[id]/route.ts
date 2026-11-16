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

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const siswa = await requireSiswa(req);
  if (!siswa) {
    return jsonError(req, "Unauthenticated", 401);
  }

  const { id } = await context.params;
  const materiId = Number(id);
  if (!Number.isInteger(materiId) || materiId <= 0) {
    return jsonError(req, "Materi tidak ditemukan", 404);
  }

  const supabase = getSupabaseAdmin();
  const { data: materi, error } = await supabase
    .from("materis")
    .select("*")
    .eq("id", materiId)
    .maybeSingle();

  if (error || !materi) {
    return jsonError(req, "Materi tidak ditemukan", 404);
  }

  const m = materi as MateriRow;
  return jsonSuccess(req, {
    id: m.id,
    judul: m.judul,
    konten: m.konten,
    gambar_url: getGambarUrl(m.gambar, req.nextUrl.origin),
  });
}
