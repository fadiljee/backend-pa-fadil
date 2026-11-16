import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Supabase (Server-side)
  SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(""),
  SUPABASE_STORAGE_BUCKET: z.string().min(1).default("materi"),

  // App & URL
  APP_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().or(z.literal("")),

  // Admin Session
  SESSION_SECRET: z.string().default(""),
  SESSION_COOKIE_NAME: z.string().min(1).default("smpn1_admin_session"),
  SESSION_MAX_AGE_SECONDS: z.coerce.number().int().positive().default(86400),

  // CORS & Rate Limit
  CORS_ALLOWED_ORIGINS: z.string().default("*"),
  LOGIN_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(300000),
  LOGIN_RATE_LIMIT_MAX_ATTEMPTS: z.coerce.number().int().positive().default(15),

  // Pagination & Upload
  ADMIN_PAGE_SIZE: z.coerce.number().int().positive().default(10),
  ADMIN_HISTORY_PAGE_SIZE: z.coerce.number().int().positive().default(15),
  LEADERBOARD_DEFAULT_LIMIT: z.coerce.number().int().positive().default(10),
  MAX_UPLOAD_IMAGE_BYTES: z.coerce.number().int().positive().default(2097152),

  // Aturan Bisnis Gamifikasi
  MAX_TOTAL_SCORE: z.coerce.number().int().positive().default(100),
  UNLOCK_MIN_PERCENTAGE: z.coerce.number().min(0.1).max(1).default(0.7),

  // Seed Accounts
  SEED_ADMIN_EMAIL: z.string().email().default("admin@smpn1merawang.sch.id"),
  SEED_ADMIN_PASSWORD: z.string().min(6).default("admin12345"),
  SEED_ADMIN_PHONE: z.string().default("081234567890"),
  SEED_GURU_EMAIL: z.string().email().default("guru@smpn1merawang.sch.id"),
  SEED_GURU_PASSWORD: z.string().min(6).default("guru12345"),
  SEED_GURU_PHONE: z.string().default("081298765432"),
});

function loadServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Konfigurasi environment tidak valid:", parsed.error.flatten().fieldErrors);
    throw new Error("Konfigurasi environment server tidak valid.");
  }

  const data = parsed.data;
  const supabaseUrl = data.SUPABASE_URL || data.NEXT_PUBLIC_SUPABASE_URL || "";
  const appUrl = data.APP_URL || data.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (data.NODE_ENV === "production" && data.SESSION_SECRET.length < 32) {
    throw new Error("SESSION_SECRET wajib diisi minimal 32 karakter di production.");
  }

  return {
    ...data,
    SUPABASE_URL: supabaseUrl,
    APP_URL: appUrl,
    SESSION_SECRET:
      data.SESSION_SECRET.length >= 32
        ? data.SESSION_SECRET
        : "dev-only-session-secret-key-min-32-chars!!",
  };
}

export const env = loadServerEnv();
