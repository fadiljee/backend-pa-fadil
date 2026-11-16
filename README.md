# Backend & Panel Admin Media Pembelajaran Matematika (SMPN 1 Merawang)

Aplikasi backend REST API (untuk aplikasi Flutter *Ayo Berhitung*) dan Panel Admin Web yang dibangun menggunakan **Next.js (App Router, TypeScript)**, **Supabase** (Database & Storage), dan **Tailwind CSS**.

## Prasyarat

- Node.js 20+ / 22 LTS
- Project **Supabase**

## Setup dengan Supabase

1. **Buat Skema Database di Supabase:**
   - Buka **Supabase Dashboard → SQL Editor**.
   - Salin dan jalankan isi file `supabase/migrations/0000_init.sql`.
   - Buka **Storage → New bucket**, buat bucket publik bernama `materi` untuk gambar materi.

2. **Konfigurasi Environment:**
   ```bash
   cp .env.example .env
   ```
   Isi:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL project Supabase Anda.
   - `SUPABASE_SERVICE_ROLE_KEY`: Service Role Key (dari **Project Settings → API**).
   - `SUPABASE_STORAGE_BUCKET`: Nama bucket Storage (default `materi`).
   - `SESSION_SECRET`: String acak minimal 32 karakter.

3. **Instal Dependensi & Jalankan Seed:**
   ```bash
   npm install
   npm run db:seed
   ```

4. **Jalankan Server Development:**
   ```bash
   npm run dev
   ```
   - Panel Admin: `http://localhost:3000/login`
   - Healthcheck API: `http://localhost:3000/api/health`

## Pengujian & Verifikasi

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Deployment ke Vercel

1. Set environment variables di Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`, `NEXT_PUBLIC_APP_URL`, `SESSION_SECRET`, `CORS_ALLOWED_ORIGINS`).
2. Deploy melalui Git integration atau `vercel --prod`.
