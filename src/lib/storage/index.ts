import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { env } from "@/lib/config/env";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

export function detectImageExtension(buffer: Buffer): "jpg" | "png" | null {
  if (buffer.length < 8) return null;

  // JPEG magic bytes: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }

  // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "png";
  }

  return null;
}

export function validateImageUpload(
  buffer: Buffer,
  mimeType: string
): { ext: "jpg" | "png"; contentType: string } {
  if (buffer.length > env.MAX_UPLOAD_IMAGE_BYTES) {
    const maxMb = Math.round((env.MAX_UPLOAD_IMAGE_BYTES / (1024 * 1024)) * 10) / 10;
    throw new Error(`Ukuran gambar maksimal ${maxMb} MB`);
  }

  const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedMimes.includes(mimeType.toLowerCase())) {
    throw new Error("Format gambar harus JPG, JPEG, atau PNG");
  }

  const detectedExt = detectImageExtension(buffer);
  if (!detectedExt) {
    throw new Error("File gambar tidak valid (magic bytes tidak sesuai JPG/PNG)");
  }

  return {
    ext: detectedExt,
    contentType: detectedExt === "png" ? "image/png" : "image/jpeg",
  };
}

export function getGambarUrl(
  key: string | null | undefined,
  originOverride?: string
): string | null {
  if (!key) return null;
  if (
    key.startsWith("http://") ||
    key.startsWith("https://") ||
    key.startsWith("/images/")
  ) {
    return key;
  }

  const cleanKey = key.replace(/^\/+/, "");

  if (env.SUPABASE_URL) {
    const supabaseUrl = env.SUPABASE_URL.replace(/\/+$/, "");
    return `${supabaseUrl}/storage/v1/object/public/${env.SUPABASE_STORAGE_BUCKET}/${cleanKey}`;
  }

  const appUrl = (originOverride || env.APP_URL).replace(/\/+$/, "");
  return `${appUrl}/uploads/${cleanKey}`;
}

export async function uploadImageFile(
  file: File,
  folder = "materi_gambar"
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const { ext, contentType } = validateImageUpload(buffer, file.type);

  const randomName = `${crypto.randomBytes(16).toString("hex")}.${ext}`;
  const key = `${folder}/${randomName}`;

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .upload(key, buffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      throw new Error(`Gagal mengunggah gambar ke Supabase Storage: ${error.message}`);
    }
    return key;
  }

  // Fallback lokal untuk development jika Supabase belum dikonfigurasi
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, randomName), buffer);
  return key;
}

export async function deleteImageFile(key: string | null | undefined): Promise<void> {
  if (
    !key ||
    key.startsWith("http://") ||
    key.startsWith("https://") ||
    key.startsWith("/images/")
  ) {
    return;
  }

  const cleanKey = key.replace(/^\/+/, "");

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      await supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).remove([cleanKey]);
    } catch (err) {
      console.error("Gagal menghapus gambar dari Supabase Storage:", err);
    }
    return;
  }

  const filePath = path.join(process.cwd(), "public", "uploads", cleanKey);
  try {
    await fs.unlink(filePath);
  } catch {
    // Abaikan jika file sudah tidak ada
  }
}
