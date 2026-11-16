"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { kuisFormSchema } from "@/lib/validators/schemas";

export type KuisActionState = {
  error?: string;
};

export async function createKuisAction(
  _prevState: KuisActionState,
  formData: FormData
): Promise<KuisActionState> {
  await requireAdminSession();

  const parsed = kuisFormSchema.safeParse({
    materi_id: formData.get("materi_id"),
    pertanyaan: formData.get("pertanyaan"),
    jawaban_a: formData.get("jawaban_a"),
    jawaban_b: formData.get("jawaban_b"),
    jawaban_c: formData.get("jawaban_c"),
    jawaban_d: formData.get("jawaban_d"),
    jawaban_benar: formData.get("jawaban_benar"),
    nilai: formData.get("nilai") || 10,
    pembahasan: formData.get("pembahasan") || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data kuis tidak valid" };
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("kuis").insert({
    materi_id: parsed.data.materi_id,
    pertanyaan: parsed.data.pertanyaan,
    jawaban_a: parsed.data.jawaban_a,
    jawaban_b: parsed.data.jawaban_b,
    jawaban_c: parsed.data.jawaban_c,
    jawaban_d: parsed.data.jawaban_d,
    jawaban_benar: parsed.data.jawaban_benar,
    nilai: parsed.data.nilai,
    pembahasan: parsed.data.pembahasan ?? null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/kuis");
  redirect("/admin/kuis");
}

export async function updateKuisAction(
  id: number,
  _prevState: KuisActionState,
  formData: FormData
): Promise<KuisActionState> {
  await requireAdminSession();

  const parsed = kuisFormSchema.safeParse({
    materi_id: formData.get("materi_id"),
    pertanyaan: formData.get("pertanyaan"),
    jawaban_a: formData.get("jawaban_a"),
    jawaban_b: formData.get("jawaban_b"),
    jawaban_c: formData.get("jawaban_c"),
    jawaban_d: formData.get("jawaban_d"),
    jawaban_benar: formData.get("jawaban_benar"),
    nilai: formData.get("nilai") || 10,
    pembahasan: formData.get("pembahasan") || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data kuis tidak valid" };
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("kuis")
    .update({
      materi_id: parsed.data.materi_id,
      pertanyaan: parsed.data.pertanyaan,
      jawaban_a: parsed.data.jawaban_a,
      jawaban_b: parsed.data.jawaban_b,
      jawaban_c: parsed.data.jawaban_c,
      jawaban_d: parsed.data.jawaban_d,
      jawaban_benar: parsed.data.jawaban_benar,
      nilai: parsed.data.nilai,
      pembahasan: parsed.data.pembahasan ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/kuis");
  redirect("/admin/kuis");
}

export async function deleteKuisAction(id: number) {
  await requireAdminSession();
  const supabase = getSupabaseAdmin();
  await supabase.from("kuis").delete().eq("id", id);
  revalidatePath("/admin/kuis");
}
