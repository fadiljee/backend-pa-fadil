import { describe, it, expect } from "vitest";
import {
  apiLoginSchema,
  apiStoreHasilKuisSchema,
  kuisFormSchema,
  siswaFormSchema,
} from "@/lib/validators/schemas";
import { detectImageExtension, validateImageUpload } from "@/lib/storage";

describe("Zod Validators", () => {
  it("memvalidasi NISN tepat 10 digit angka", () => {
    expect(apiLoginSchema.safeParse({ nisn: "0123456789" }).success).toBe(true);
    expect(apiLoginSchema.safeParse({ nisn: "12345" }).success).toBe(false);
    expect(apiLoginSchema.safeParse({ nisn: "012345678a" }).success).toBe(false);
  });

  it("menormalisasi jawaban kuis ke huruf kecil a-d", () => {
    const res = apiStoreHasilKuisSchema.safeParse({ kuis_id: 1, jawaban_user: "B" });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.jawaban_user).toBe("b");
    }

    const formRes = kuisFormSchema.safeParse({
      materi_id: 1,
      pertanyaan: "1+1?",
      jawaban_a: "1",
      jawaban_b: "2",
      jawaban_c: "3",
      jawaban_d: "4",
      jawaban_benar: "B",
      nilai: 10,
    });
    expect(formRes.success).toBe(true);
    if (formRes.success) {
      expect(formRes.data.jawaban_benar).toBe("b");
    }
  });

  it("memvalidasi nama siswa minimal 5 karakter", () => {
    expect(
      siswaFormSchema.safeParse({ nama: "Budi", nisn: "0123456789", kelas: "7A" }).success
    ).toBe(false);
    expect(
      siswaFormSchema.safeParse({ nama: "Budi Santoso", nisn: "0123456789", kelas: "7A" }).success
    ).toBe(true);
  });
});

describe("Image Upload Magic Bytes Validation", () => {
  it("menerima buffer JPEG dan PNG yang valid", () => {
    const jpegBuf = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);
    const pngBuf = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

    expect(detectImageExtension(jpegBuf)).toBe("jpg");
    expect(detectImageExtension(pngBuf)).toBe("png");
    expect(validateImageUpload(jpegBuf, "image/jpeg").ext).toBe("jpg");
    expect(validateImageUpload(pngBuf, "image/png").ext).toBe("png");
  });

  it("menolak file palsu dengan magic bytes tidak sesuai", () => {
    const fakePng = Buffer.from("<html>not an image</html>");
    expect(detectImageExtension(fakePng)).toBeNull();
    expect(() => validateImageUpload(fakePng, "image/png")).toThrow();
  });
});
