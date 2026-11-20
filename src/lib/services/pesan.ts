import { z } from "zod";

export const KEPERLUAN_OPTIONS = [
  "Informasi Penerimaan Siswa Baru",
  "Kunjungan ke Sekolah",
  "Informasi Akademik",
  "Lainnya",
] as const;

export const pesanFormSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(3, "Nama minimal 3 karakter")
    .max(80, "Nama maksimal 80 karakter"),
  email: z.string().trim().email("Masukkan email yang valid, contoh: nama@email.com"),
  no_hp: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{8,20}$/, "Nomor HP berisi 8 sampai 20 digit angka"),
  keperluan: z.enum(KEPERLUAN_OPTIONS, {
    errorMap: () => ({ message: "Pilih keperluan Anda" }),
  }),
  pesan: z.string().trim().max(1000, "Pesan maksimal 1000 karakter"),
});

export interface PesanRow {
  id: number;
  nama: string;
  email: string;
  no_hp: string;
  keperluan: string;
  pesan: string | null;
  created_at: string;
}

export function isMissingPesanTableError(message: string | undefined): boolean {
  if (!message) return false;
  return (
    message.includes("pesan_pengunjung") &&
    (message.includes("schema cache") ||
      message.includes("does not exist") ||
      message.includes("Could not find"))
  );
}
