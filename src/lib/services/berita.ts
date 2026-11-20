import { unstable_cache } from "next/cache";
import { z } from "zod";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import { BeritaRow } from "@/lib/supabase/types";

export const BERITA_KATEGORI_OPTIONS = [
  "Kegiatan",
  "Prestasi",
  "Pengumuman",
  "Akademik",
] as const;

export const beritaFormSchema = z.object({
  judul: z
    .string()
    .trim()
    .min(5, "Judul berita minimal 5 karakter")
    .max(160, "Judul berita maksimal 160 karakter"),
  kategori: z.enum(BERITA_KATEGORI_OPTIONS, {
    errorMap: () => ({ message: "Pilih kategori berita yang valid" }),
  }),
  tanggal_kegiatan: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal kegiatan harus YYYY-MM-DD"),
  ringkasan: z
    .string()
    .trim()
    .min(10, "Ringkasan berita minimal 10 karakter")
    .max(320, "Ringkasan berita maksimal 320 karakter"),
  konten: z
    .string()
    .trim()
    .min(20, "Isi berita minimal 20 karakter")
    .max(10000, "Isi berita terlalu panjang"),
  published: z.boolean(),
});

export type BeritaFormInput = z.infer<typeof beritaFormSchema>;

export function isMissingBeritaTableError(message: string | undefined): boolean {
  if (!message) return false;
  return (
    message.includes("berita_sekolah") &&
    (message.includes("schema cache") ||
      message.includes("does not exist") ||
      message.includes("Could not find"))
  );
}

export const getPublishedBeritaList = unstable_cache(
  async (limit = 6): Promise<{ items: BeritaRow[]; tableReady: boolean }> => {
    if (!isSupabaseConfigured()) {
      return { items: [], tableReady: false };
    }

    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from("berita_sekolah")
        .select("*")
        .eq("published", true)
        .order("tanggal_kegiatan", { ascending: false })
        .order("id", { ascending: false })
        .limit(limit);

      if (error) {
        return {
          items: [],
          tableReady: !isMissingBeritaTableError(error.message),
        };
      }

      return { items: (data ?? []) as BeritaRow[], tableReady: true };
    } catch {
      return { items: [], tableReady: false };
    }
  },
  ["landing-berita"],
  { revalidate: 60, tags: ["landing-berita"] }
);
