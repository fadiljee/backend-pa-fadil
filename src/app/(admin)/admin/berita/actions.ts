"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { BeritaRow } from "@/lib/supabase/types";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { beritaFormSchema, isMissingBeritaTableError } from "@/lib/services/berita";
import { deleteImageFile, uploadImageFile } from "@/lib/storage";

export type BeritaActionState = {
  error?: string;
};

export async function createBeritaAction(
  _prevState: BeritaActionState,
  formData: FormData
): Promise<BeritaActionState> {
  await requireAdminSession();

  const parsed = beritaFormSchema.safeParse({
    judul: String(formData.get("judul") ?? ""),
    kategori: String(formData.get("kategori") ?? "Kegiatan"),
    tanggal_kegiatan: String(formData.get("tanggal_kegiatan") ?? ""),
    ringkasan: String(formData.get("ringkasan") ?? ""),
    konten: String(formData.get("konten") ?? ""),
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data berita tidak valid",
    };
  }

  let gambarKey: string | null = null;
  const file = formData.get("gambar");
  if (file instanceof File && file.size > 0) {
    try {
      gambarKey = await uploadImageFile(file, "berita_gambar");
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "Gagal mengunggah gambar",
      };
    }
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("berita_sekolah").insert({
    judul: parsed.data.judul,
    kategori: parsed.data.kategori,
    tanggal_kegiatan: parsed.data.tanggal_kegiatan,
    ringkasan: parsed.data.ringkasan,
    konten: parsed.data.konten,
    published: parsed.data.published,
    gambar: gambarKey,
  });

  if (error) {
    if (isMissingBeritaTableError(error.message)) {
      return {
        error:
          "Tabel berita_sekolah belum dibuat di Supabase. Jalankan migrasi supabase/migrations/0002_berita_sekolah.sql terlebih dahulu.",
      };
    }
    return { error: error.message };
  }

  revalidateTag("landing-berita");
  revalidatePath("/");
  revalidatePath("/admin/berita");
  redirect("/admin/berita");
}

export async function updateBeritaAction(
  id: number,
  _prevState: BeritaActionState,
  formData: FormData
): Promise<BeritaActionState> {
  await requireAdminSession();

  const parsed = beritaFormSchema.safeParse({
    judul: String(formData.get("judul") ?? ""),
    kategori: String(formData.get("kategori") ?? "Kegiatan"),
    tanggal_kegiatan: String(formData.get("tanggal_kegiatan") ?? ""),
    ringkasan: String(formData.get("ringkasan") ?? ""),
    konten: String(formData.get("konten") ?? ""),
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data berita tidak valid",
    };
  }

  const supabase = getSupabaseAdmin();
  const { data: existing, error: fetchError } = await supabase
    .from("berita_sekolah")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    if (isMissingBeritaTableError(fetchError.message)) {
      return {
        error:
          "Tabel berita_sekolah belum dibuat di Supabase. Jalankan migrasi supabase/migrations/0002_berita_sekolah.sql terlebih dahulu.",
      };
    }
    return { error: fetchError.message };
  }

  if (!existing) {
    return { error: "Berita tidak ditemukan" };
  }

  const typedExisting = existing as BeritaRow;
  let gambarKey = typedExisting.gambar;

  if (formData.get("hapus_gambar") === "on") {
    await deleteImageFile(typedExisting.gambar);
    gambarKey = null;
  }

  const file = formData.get("gambar");
  if (file instanceof File && file.size > 0) {
    try {
      const newKey = await uploadImageFile(file, "berita_gambar");
      await deleteImageFile(typedExisting.gambar);
      gambarKey = newKey;
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "Gagal mengunggah gambar",
      };
    }
  }

  const { error } = await supabase
    .from("berita_sekolah")
    .update({
      judul: parsed.data.judul,
      kategori: parsed.data.kategori,
      tanggal_kegiatan: parsed.data.tanggal_kegiatan,
      ringkasan: parsed.data.ringkasan,
      konten: parsed.data.konten,
      published: parsed.data.published,
      gambar: gambarKey,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidateTag("landing-berita");
  revalidatePath("/");
  revalidatePath("/admin/berita");
  redirect("/admin/berita");
}

export async function deleteBeritaAction(id: number) {
  await requireAdminSession();

  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase
    .from("berita_sekolah")
    .select("id, gambar")
    .eq("id", id)
    .maybeSingle();

  if (existing) {
    await deleteImageFile((existing as { gambar: string | null }).gambar);
    await supabase.from("berita_sekolah").delete().eq("id", id);
  }

  revalidateTag("landing-berita");
  revalidatePath("/");
  revalidatePath("/admin/berita");
}
