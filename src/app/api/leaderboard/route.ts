import { NextRequest } from "next/server";
import { env } from "@/lib/config/env";
import { requireSiswa } from "@/lib/auth/siswa-token";
import { computeGelar } from "@/lib/services/learning";
import { getAggregatedLeaderboard } from "@/lib/services/leaderboard";
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

  const limitParam = Number(
    req.nextUrl.searchParams.get("limit") ?? String(env.LEADERBOARD_DEFAULT_LIMIT)
  );
  const limit =
    Number.isInteger(limitParam) && limitParam > 0
      ? Math.min(limitParam, 100)
      : env.LEADERBOARD_DEFAULT_LIMIT;

  try {
    const allSorted = await getAggregatedLeaderboard();
    const leaderboard = allSorted.slice(0, limit).map((item, idx) => ({
      rank: idx + 1,
      nama: item.nama,
      kelas: item.kelas,
      total_skor: item.totalSkor,
      gelar: computeGelar(item.totalSkor),
    }));

    return jsonSuccess(req, leaderboard);
  } catch (err) {
    return jsonError(req, err instanceof Error ? err.message : "Gagal memuat leaderboard", 500);
  }
}
