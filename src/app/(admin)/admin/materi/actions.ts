"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { MateriRow } from "@/lib/supabase/types";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { materiFormSchema } from "@/lib/validators/schemas";
import { deleteImageFile, uploadImageFile } from "@/lib/storage";

export type MateriActionState = {
  error?: string;
};

export async function createMateriAction(
  _prevState: MateriActionState,
  formData: FormData
): Promise<MateriActionState> {
  await requireAdminSession();

  const parsed = materiFormSchema.safeParse({
    judul: formData.get("judul"),
    konten: formData.get("konten"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data materi tidak valid" };
  }

  let gambarKey: string | null = null;
  const file = formData.get("gambar");
  if (file instanceof File && file.size > 0) {
    try {
      gambarKey = await uploadImageFile(file, "materi_gambar");
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "Gagal mengunggah gambar",
      };
    }
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("materis").insert({
    judul: parsed.data.judul,
    konten: parsed.data.konten,
    gambar: gambarKey,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/materi");
  redirect("/admin/materi");
}

export async function updateMateriAction(
  id: number,
  _prevState: MateriActionState,
  formData: FormData
): Promise<MateriActionState> {
  await requireAdminSession();

  const parsed = materiFormSchema.safeParse({
    judul: formData.get("judul"),
    konten: formData.get("konten"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data materi tidak valid" };
  }

  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase
    .from("materis")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!existing) {
    return { error: "Materi tidak ditemukan" };
  }

  const typedExisting = existing as MateriRow;
  let gambarKey = typedExisting.gambar;
  const file = formData.get("gambar");
  if (file instanceof File && file.size > 0) {
    try {
      const newKey = await uploadImageFile(file, "materi_gambar");
      await deleteImageFile(typedExisting.gambar);
      gambarKey = newKey;
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "Gagal mengunggah gambar",
      };
    }
  }

  const { error } = await supabase
    .from("materis")
    .update({
      judul: parsed.data.judul,
      konten: parsed.data.konten,
      gambar: gambarKey,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/materi");
  redirect("/admin/materi");
}

export async function deleteMateriAction(id: number) {
  await requireAdminSession();

  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase
    .from("materis")
    .select("id, gambar")
    .eq("id", id)
    .maybeSingle();

  if (existing) {
    await deleteImageFile((existing as { gambar: string | null }).gambar);
    await supabase.from("materis").delete().eq("id", id);
  }

  revalidatePath("/admin/materi");
}
