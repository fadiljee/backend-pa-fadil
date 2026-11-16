import crypto from "crypto";
import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { SiswaRow } from "@/lib/supabase/types";

export function hashToken(plainToken: string): string {
  return crypto.createHash("sha256").update(plainToken).digest("hex");
}

export function generatePlainToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Menghapus token lama siswa lalu menerbitkan token baru (satu sesi aktif per siswa).
 */
export async function issueSiswaToken(siswaId: number): Promise<string> {
  const supabase = getSupabaseAdmin();
  const plainToken = generatePlainToken();
  const tokenHash = hashToken(plainToken);

  await supabase.from("siswa_tokens").delete().eq("siswa_id", siswaId);
  const { error } = await supabase.from("siswa_tokens").insert({
    siswa_id: siswaId,
    token_hash: tokenHash,
    last_used_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`Gagal membuat token siswa: ${error.message}`);
  }

  return plainToken;
}

export type AuthenticatedSiswa = SiswaRow;

/**
 * Memvalidasi Authorization: Bearer <token> dan mengembalikan data siswa.
 */
export async function requireSiswa(req: NextRequest): Promise<AuthenticatedSiswa | null> {
  const authHeader = req.headers.get("authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  const plainToken = authHeader.slice(7).trim();
  if (!plainToken) {
    return null;
  }

  const supabase = getSupabaseAdmin();
  const tokenHash = hashToken(plainToken);

  const { data: tokenRow, error } = await supabase
    .from("siswa_tokens")
    .select("id, expires_at, data_siswa(*)")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (error || !tokenRow || !tokenRow.data_siswa) {
    return null;
  }

  if (tokenRow.expires_at && new Date(tokenRow.expires_at).getTime() < Date.now()) {
    return null;
  }

  await supabase
    .from("siswa_tokens")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", tokenRow.id);

  const siswaData = Array.isArray(tokenRow.data_siswa)
    ? tokenRow.data_siswa[0]
    : tokenRow.data_siswa;

  return (siswaData as SiswaRow) ?? null;
}
