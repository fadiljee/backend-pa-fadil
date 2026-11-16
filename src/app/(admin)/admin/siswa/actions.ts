"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { siswaFormSchema } from "@/lib/validators/schemas";

export type FormActionState = {
  error?: string;
};

export async function createSiswaAction(
  _prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  await requireAdminSession();

  const parsed = siswaFormSchema.safeParse({
    nama: formData.get("nama"),
    nisn: formData.get("nisn"),
    kelas: formData.get("kelas"),
    sekolah: formData.get("sekolah") || null,
    alamat: formData.get("alamat") || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data siswa tidak valid" };
  }

  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase
    .from("data_siswa")
    .select("id")
    .eq("nisn", parsed.data.nisn)
    .maybeSingle();

  if (existing) {
    return { error: "NISN sudah terdaftar pada siswa lain" };
  }

  const { error } = await supabase.from("data_siswa").insert({
    nama: parsed.data.nama,
    nisn: parsed.data.nisn,
    kelas: parsed.data.kelas,
    sekolah: parsed.data.sekolah ?? null,
    alamat: parsed.data.alamat ?? null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/siswa");
  redirect("/admin/siswa");
}

export async function updateSiswaAction(
  id: number,
  _prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  await requireAdminSession();

  const parsed = siswaFormSchema.safeParse({
    nama: formData.get("nama"),
    nisn: formData.get("nisn"),
    kelas: formData.get("kelas"),
    sekolah: formData.get("sekolah") || null,
    alamat: formData.get("alamat") || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data siswa tidak valid" };
  }

  const supabase = getSupabaseAdmin();
  const { data: duplicate } = await supabase
    .from("data_siswa")
    .select("id")
    .eq("nisn", parsed.data.nisn)
    .neq("id", id)
    .maybeSingle();

  if (duplicate) {
    return { error: "NISN sudah digunakan oleh siswa lain" };
  }

  const { error } = await supabase
    .from("data_siswa")
    .update({
      nama: parsed.data.nama,
      nisn: parsed.data.nisn,
      kelas: parsed.data.kelas,
      sekolah: parsed.data.sekolah ?? null,
      alamat: parsed.data.alamat ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/siswa");
  redirect("/admin/siswa");
}

export async function deleteSiswaAction(id: number) {
  await requireAdminSession();
  const supabase = getSupabaseAdmin();
  await supabase.from("data_siswa").delete().eq("id", id);
  revalidatePath("/admin/siswa");
}
