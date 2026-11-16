import { NextRequest } from "next/server";
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

  return jsonSuccess(req, {
    id: siswa.id,
    nisn: siswa.nisn,
    nama: siswa.nama,
    kelas: siswa.kelas,
    sekolah: siswa.sekolah ?? null,
    alamat: siswa.alamat ?? null,
    profile_picture: siswa.profile_picture ?? null,
  });
}
