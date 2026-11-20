"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import { isMissingPesanTableError, pesanFormSchema } from "@/lib/services/pesan";

export interface PesanFormState {
  status?: "success" | "error";
  message?: string;
  field?: string;
  submittedAt?: number;
}

export async function submitPesanAction(
  _prev: PesanFormState,
  formData: FormData
): Promise<PesanFormState> {
  // Honeypot: bot biasanya mengisi field tersembunyi ini.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return {
      status: "success",
      message: "Terima kasih, pesan Anda sudah kami terima.",
      submittedAt: Date.now(),
    };
  }

  const parsed = pesanFormSchema.safeParse({
    nama: String(formData.get("nama") ?? ""),
    email: String(formData.get("email") ?? ""),
    no_hp: String(formData.get("no_hp") ?? ""),
    keperluan: String(formData.get("keperluan") ?? ""),
    pesan: String(formData.get("pesan") ?? ""),
  });

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      status: "error",
      message: issue?.message ?? "Periksa kembali isian formulir.",
      field: String(issue?.path[0] ?? ""),
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message:
        "Layanan pesan sedang tidak tersedia. Silakan hubungi sekolah melalui kontak di bagian bawah halaman.",
    };
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("pesan_pengunjung").insert({
    nama: parsed.data.nama,
    email: parsed.data.email,
    no_hp: parsed.data.no_hp,
    keperluan: parsed.data.keperluan,
    pesan: parsed.data.pesan || null,
  });

  if (error) {
    return {
      status: "error",
      message: isMissingPesanTableError(error.message)
        ? "Layanan pesan belum aktif. Silakan hubungi sekolah melalui kontak di bagian bawah halaman."
        : "Pesan gagal dikirim. Coba lagi beberapa saat lagi.",
    };
  }

  revalidatePath("/admin/pesan");
  return {
    status: "success",
    message: `Terima kasih, ${parsed.data.nama}. Pesan Anda sudah diterima pengelola sekolah.`,
    submittedAt: Date.now(),
  };
}
