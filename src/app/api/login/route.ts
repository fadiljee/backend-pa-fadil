import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { SiswaRow } from "@/lib/supabase/types";
import { apiLoginSchema } from "@/lib/validators/schemas";
import { issueSiswaToken } from "@/lib/auth/siswa-token";
import { checkLoginRateLimit } from "@/lib/auth/admin-session";
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
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkLoginRateLimit(`siswa:${ip}`)) {
    return jsonError(req, "Terlalu banyak percobaan login. Silakan coba lagi nanti.", 429);
  }

  const body = await parseJsonBody(req);
  if (!body.ok) return body.response;

  const parsed = apiLoginSchema.safeParse(body.data);
  if (!parsed.success) {
    return jsonValidationError(req, parsed.error);
  }

  const supabase = getSupabaseAdmin();
  const { data: siswa, error } = await supabase
    .from("data_siswa")
    .select("*")
    .eq("nisn", parsed.data.nisn)
    .maybeSingle();

  if (error || !siswa) {
    return jsonError(req, "NISN tidak ditemukan", 404);
  }

  const typedSiswa = siswa as SiswaRow;
  const token = await issueSiswaToken(typedSiswa.id);

  return jsonSuccess(req, {
    message: "Login berhasil",
    data_siswa: {
      id: typedSiswa.id,
      nisn: typedSiswa.nisn,
      nama: typedSiswa.nama,
      kelas: typedSiswa.kelas,
      sekolah: typedSiswa.sekolah ?? null,
      alamat: typedSiswa.alamat ?? null,
      profile_picture: typedSiswa.profile_picture ?? null,
    },
    token,
  });
}
