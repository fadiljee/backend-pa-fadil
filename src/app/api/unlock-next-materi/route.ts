import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { requireSiswa } from "@/lib/auth/siswa-token";
import { apiUnlockNextMateriSchema } from "@/lib/validators/schemas";
import { canUnlockNext } from "@/lib/services/learning";
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

  const parsed = apiUnlockNextMateriSchema.safeParse(body.data);
  if (!parsed.success) {
    return jsonValidationError(req, parsed.error);
  }

  const materiId = parsed.data.materi_id;
  const supabase = getSupabaseAdmin();

  const { data: kuisList } = await supabase
    .from("kuis")
    .select("id, nilai")
    .eq("materi_id", materiId);

  const kuisIds = (kuisList ?? []).map((k) => k.id as number);
  const skorMaksimum = (kuisList ?? []).reduce((acc, k) => acc + ((k.nilai as number) ?? 0), 0);

  let skorDidapat = 0;
  if (kuisIds.length > 0) {
    const { data: hasilList } = await supabase
      .from("hasil_kuis")
      .select("skor")
      .eq("siswa_id", siswa.id)
      .in("kuis_id", kuisIds);

    skorDidapat = (hasilList ?? []).reduce((acc, h) => acc + ((h.skor as number) ?? 0), 0);
  }

  if (canUnlockNext(skorDidapat, skorMaksimum)) {
    const { data: nextMateri } = await supabase
      .from("materis")
      .select("id")
      .gt("id", materiId)
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (nextMateri) {
      await supabase
        .from("materi_siswa_unlock")
        .upsert(
          {
            siswa_id: siswa.id,
            materi_id: nextMateri.id,
          },
          { onConflict: "siswa_id,materi_id", ignoreDuplicates: true }
        );

      return jsonSuccess(req, {
        message: "Materi berikutnya telah dibuka",
        unlocked: true,
        next_materi_id: nextMateri.id,
      });
    }

    return jsonSuccess(req, {
      message: "Semua materi telah diselesaikan",
      unlocked: true,
    });
  }

  return jsonSuccess(req, {
    message: "Nilai belum mencapai batas unlock materi berikutnya",
    unlocked: false,
    total_skor_materi: skorDidapat,
    skor_maksimum_materi: skorMaksimum,
  });
}
