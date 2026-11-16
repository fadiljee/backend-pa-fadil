import { z } from "zod";

export const nisnSchema = z
  .string({ required_error: "NISN wajib diisi" })
  .trim()
  .regex(/^[0-9]{10}$/, "NISN harus terdiri dari tepat 10 digit angka");

export const jawabanOpsiSchema = z
  .string({ required_error: "Jawaban wajib diisi" })
  .trim()
  .toLowerCase()
  .pipe(z.enum(["a", "b", "c", "d"], { message: "Jawaban harus a, b, c, atau d" }));

export const apiLoginSchema = z.object({
  nisn: nisnSchema,
});

export const apiSearchMateriSchema = z.object({
  judul: z
    .string({ required_error: "Parameter judul wajib diisi" })
    .trim()
    .min(3, "Judul pencarian minimal 3 karakter"),
});

export const apiStoreHasilKuisSchema = z.object({
  kuis_id: z.coerce.number().int().positive("kuis_id harus berupa bilangan bulat positif"),
  jawaban_user: jawabanOpsiSchema,
});

export const apiUnlockNextMateriSchema = z.object({
  materi_id: z.coerce.number().int().positive("materi_id diperlukan"),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const siswaFormSchema = z.object({
  nama: z.string().trim().min(5, "Nama minimal 5 karakter").max(255),
  nisn: nisnSchema,
  kelas: z.string().trim().min(1, "Kelas wajib diisi").max(50),
  sekolah: z.string().trim().max(255).optional().nullable(),
  alamat: z.string().trim().max(500).optional().nullable(),
});

export const materiFormSchema = z.object({
  judul: z.string().trim().min(1, "Judul wajib diisi").max(255),
  konten: z.string().trim().min(1, "Konten materi wajib diisi"),
});

export const kuisFormSchema = z.object({
  materi_id: z.coerce.number().int().positive("Materi wajib dipilih"),
  pertanyaan: z.string().trim().min(1, "Pertanyaan wajib diisi"),
  jawaban_a: z.string().trim().min(1, "Pilihan A wajib diisi").max(255),
  jawaban_b: z.string().trim().min(1, "Pilihan B wajib diisi").max(255),
  jawaban_c: z.string().trim().min(1, "Pilihan C wajib diisi").max(255),
  jawaban_d: z.string().trim().min(1, "Pilihan D wajib diisi").max(255),
  jawaban_benar: jawabanOpsiSchema,
  nilai: z.coerce.number().int().min(1, "Nilai minimal 1").default(10),
  pembahasan: z.string().trim().optional().nullable(),
});
