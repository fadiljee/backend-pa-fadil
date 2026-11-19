import { unstable_cache } from "next/cache";
import { z } from "zod";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

export const landingSettingsSchema = z.object({
  schoolName: z.string().trim().min(2, "Nama sekolah minimal 2 karakter").max(80),
  schoolSubtitle: z.string().trim().min(2, "Subjudul sekolah minimal 2 karakter").max(80),
  heroTitle: z.string().trim().min(5, "Judul hero minimal 5 karakter").max(160),
  heroDescription: z.string().trim().min(10, "Deskripsi hero minimal 10 karakter").max(320),
  heroPrimaryCta: z.string().trim().min(2, "Teks tombol utama minimal 2 karakter").max(40),
  heroSecondaryCta: z.string().trim().min(2, "Teks tombol sekunder minimal 2 karakter").max(40),
  showStats: z.boolean(),
  coursesEyebrow: z.string().trim().min(2, "Label section materi minimal 2 karakter").max(40),
  coursesTitle: z.string().trim().min(4, "Judul section materi minimal 4 karakter").max(120),
  aboutEyebrow: z.string().trim().min(2, "Label section tentang minimal 2 karakter").max(40),
  aboutTitle: z.string().trim().min(4, "Judul section tentang minimal 4 karakter").max(120),
  aboutParagraph1: z.string().trim().min(10, "Paragraf 1 minimal 10 karakter").max(500),
  aboutParagraph2: z.string().trim().min(10, "Paragraf 2 minimal 10 karakter").max(500),
  aboutShowStudentCount: z.boolean(),
  aboutHighlights: z
    .array(z.string().trim().min(2, "Poin keunggulan minimal 2 karakter").max(60))
    .min(1, "Minimal 1 poin keunggulan")
    .max(4, "Maksimal 4 poin keunggulan"),
  galleryEyebrow: z.string().trim().min(2, "Label section galeri minimal 2 karakter").max(40),
  galleryTitle: z.string().trim().min(4, "Judul section galeri minimal 4 karakter").max(120),
  galleryTagline: z.string().trim().max(100),
  footerDescription: z.string().trim().min(10, "Deskripsi footer minimal 10 karakter").max(260),
  contactAddress: z.string().trim().max(200),
  contactEmail: z
    .string()
    .trim()
    .refine((val) => val === "" || z.string().email().safeParse(val).success, {
      message: "Masukkan format email yang valid (contoh: info@sekolah.sch.id)",
    }),
  contactPhone: z.string().trim().max(40),
  copyrightText: z.string().trim().min(4, "Teks hak cipta minimal 4 karakter").max(120),
});

export type LandingSettings = z.infer<typeof landingSettingsSchema>;

export const DEFAULT_LANDING_SETTINGS: LandingSettings = {
  schoolName: "SMPN 1 Merawang",
  schoolSubtitle: "Portal Sekolah",
  heroTitle: "Selamat Datang di SMPN 1 Merawang.",
  heroDescription:
    "Portal informasi sekolah, data siswa aktif, serta akses materi pembelajaran bagi seluruh warga SMPN 1 Merawang.",
  heroPrimaryCta: "Lihat Materi",
  heroSecondaryCta: "Tentang Sekolah",
  showStats: true,
  coursesEyebrow: "Materi",
  coursesTitle: "Materi Pembelajaran SMPN 1 Merawang.",
  aboutEyebrow: "Tentang Sekolah",
  aboutTitle: "Mengenal SMPN 1 Merawang.",
  aboutParagraph1:
    "SMPN 1 Merawang merupakan sekolah menengah pertama di Kecamatan Merawang yang berkomitmen menghadirkan pembelajaran yang tertib, terarah, dan mudah diakses oleh seluruh siswa.",
  aboutParagraph2:
    "Melalui portal ini, guru dan pengelola sekolah dapat mengelola data siswa serta menyusun materi pembelajaran agar siswa tetap terhubung dengan bahan ajar sekolah.",
  aboutShowStudentCount: true,
  aboutHighlights: [
    "Lingkungan Belajar Aktif",
    "Materi Pembelajaran Terbuka",
    "Pendampingan Guru Sekolah",
    "SMPN 1 Merawang, Bangka",
  ],
  galleryEyebrow: "Galeri",
  galleryTitle: "Kegiatan dan Materi Sekolah.",
  galleryTagline: "Belajar | Berkarya | Berprestasi",
  footerDescription:
    "Portal informasi resmi, data siswa aktif, dan materi pembelajaran SMPN 1 Merawang.",
  contactAddress: "Kecamatan Merawang, Kabupaten Bangka",
  contactEmail: "",
  contactPhone: "",
  copyrightText: "© 2026 SMPN 1 Merawang. All rights reserved.",
};

export const getLandingSettings = unstable_cache(
  async (): Promise<{
    settings: LandingSettings;
    persisted: boolean;
  }> => {
    if (!isSupabaseConfigured()) {
      return { settings: DEFAULT_LANDING_SETTINGS, persisted: false };
    }

    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from("landing_settings")
        .select("data")
        .eq("id", 1)
        .maybeSingle();

      if (error || !data?.data) {
        return { settings: DEFAULT_LANDING_SETTINGS, persisted: false };
      }

      const parsed = landingSettingsSchema.safeParse({
        ...DEFAULT_LANDING_SETTINGS,
        ...(typeof data.data === "object" && data.data !== null ? data.data : {}),
      });

      if (!parsed.success) {
        return { settings: DEFAULT_LANDING_SETTINGS, persisted: false };
      }

      return { settings: parsed.data, persisted: true };
    } catch {
      return { settings: DEFAULT_LANDING_SETTINGS, persisted: false };
    }
  },
  ["landing-settings"],
  { revalidate: 60, tags: ["landing-settings"] }
);

export async function saveLandingSettings(
  settings: LandingSettings
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Konfigurasi Supabase belum tersedia di .env." };
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("landing_settings").upsert(
      {
        id: 1,
        data: settings,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      if (error.message.includes("landing_settings")) {
        return {
          ok: false,
          error:
            "Tabel landing_settings belum dibuat di Supabase. Jalankan migrasi supabase/migrations/0001_landing_settings.sql terlebih dahulu.",
        };
      }
      return { ok: false, error: `Gagal menyimpan pengaturan: ${error.message}` };
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data.",
    };
  }
}
