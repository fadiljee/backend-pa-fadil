# Design Direction — SMPN 1 Merawang (Ayo Berhitung)

> Reading this as: School learning platform landing page and admin panel for SMPN 1 Merawang teachers/admins and students, in an editorial academic-notebook style, dial ENERGY 2 / RHYTHM 2 / MOTION 1.

Dial: ENERGY 2 / RHYTHM 2 / MOTION 1

## Identity & Character

- **Product:** Backend, Landing Page, dan Panel Admin Media Pembelajaran Matematika (*Ayo Berhitung*) untuk **SMPN 1 Merawang**.
- **Tone:** Tenang, terstruktur, informatif, dan layak dipercaya untuk lingkungan sekolah menengah pertama. Menghindari gaya startup SaaS generik (tanpa gradien biru-ungu satu layar, tanpa badge kapsul dekoratif, tanpa klaim yang dibuat-buat).
- **Identity Motif:** Kertas hangat (`#FAF9F6`) dipadukan dengan bingkai kartu tipis (`#E2E8F0`) dan penanda aksen amber (`#B45309`) hanya pada elemen fokus utama (angka pengguna siswa dan penanda peringkat).

## Color Palette (R-29)

- **Neutral Base:**
  - `#FAF9F6` (Warm paper background)
  - `#FFFFFF` (Card / surface)
  - `#1E293B` (Primary ink, rasio 13.89:1 di atas `#FAF9F6`)
  - `#475569` (Secondary ink, rasio 7.20:1 di atas `#FAF9F6` dan > 7.5:1 di atas `#FFFFFF`)
- **Core 1 (Primary):** `#3730A3` (Deep school indigo, rasio 9.93:1 dengan teks `#FFFFFF`)
- **Core 2 (Dark Surface):** `#0F172A` (Sidebar admin)
- **Accent:** `#B45309` (Warm amber untuk sorotan statistik utama dan gelar tertinggi, rasio 5.02:1 dengan `#FFFFFF`)

## Typography & Icons (R-04, R-06)

- **Typeface:** `Inter` (`next/font/google`), dipilih karena keterbacaan angka NISN, skor, tabel administratif, dan teks Bahasa Indonesia pada berbagai ukuran layar.
- **Scale:** Fluid heading pada landing page menggunakan `clamp()` agar proporsional dari layar ponsel hingga desktop.
- **Icons:** `lucide-react` digunakan khusus untuk navigasi dan aksi tabel di panel admin (dengan `aria-hidden="true"`), bukan sebagai hiasan kartu di landing page.

## Dials

- **ENERGY 2 (Balanced):** Kontras tipografi jelas antara judul, angka statistik nyata, dan teks isi; tanpa dekorasi berlebihan.
- **RHYTHM 2 (Consistent with breaks):** Komposisi bervariasi antar bagian (hero asimetris, profil sekolah narasi + tabel fakta `<dl>`, alur belajar bernomor, footer satu baris).
- **MOTION 1 (Hover & focus states only):** Transisi warna/fokus ringan yang langsung berhenti pada `prefers-reduced-motion: reduce`.
