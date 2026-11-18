# design.md — Landing Page Media Pembelajaran Matematika (SMPN 1 Merawang)

**Stack:** Next.js (App Router) + Tailwind CSS · **Referensi visual:** layout "The Planner Education" (foto referensi, lebar 736px)
**Tujuan dokumen:** panduan desain yang cukup detail agar halaman bisa dibangun **semirip mungkin dengan referensi**, termasuk responsive mobile, state, dan aksesibilitas.

---

## 1. Gaya Visual

Bersih, akademik, dan ramah. Dominan **putih + biru navy**, sudut membulat besar, ilustrasi isometrik 3D, dan doodle alat tulis garis tipis sebagai dekorasi latar.

| Ciri khas referensi | Cara menerapkannya |
|---|---|
| Satu warna aksi (navy) | Semua tombol, label section, ikon bulat, kartu aktif, dan panel galeri memakai navy yang sama |
| Hero abu-biru pucat berujung **gelombang putih** | Gradien + SVG wave di dasar hero |
| Kartu dengan **strip warna tipis di bawahnya** | Hijau / biru / pink di bawah kartu non-aktif |
| Ilustrasi isometrik buku + topi toga | SVG/PNG transparan di hero |
| Pill keunggulan **miring dan zig-zag** | Rotate −6° + offset kiri-kanan di desktop |
| Panel galeri navy bersudut besar | Container navy radius 32px berisi masonry foto |
| Doodle garis tipis (globe, kertas, gunting, kuas, tabung) | SVG stroke 1px abu, opacity 40–50%, tidak menimpa teks |

---

## 2. Design Tokens

### 2.1 Warna

| Nama | Hex | Pemakaian |
|---|---|---|
| `primary` | `#054E85` | Tombol, label section, ikon bulat, kartu aktif, panel galeri, link aktif nav |
| `primary-dark` | `#043B66` | Hover tombol, footer |
| `primary-light` | `#E6EFF7` | Hover outline button, latar ikon ringan |
| `heading` | `#1B2433` | H1–H3, menu nav |
| `body` | `#3A4350` | Paragraf |
| `muted` | `#6B7685` | Caption, copyright |
| `soft` | `#F3F5F8` | Latar pill keunggulan |
| `card-border` | `#8FB3D6` | Border kartu non-aktif |
| `hero-from` / `hero-to` | `#E6EBF3` / `#F6F8FB` | Gradien hero (atas → bawah) |
| `accent-green` | `#A8DB8F` | Strip kartu 2 |
| `accent-blue` | `#8EC5F0` | Strip kartu 3 |
| `accent-pink` | `#F7B6CF` | Strip kartu 4 |
| `accent-yellow` | `#F6D45B` | Strip kartu 1, tassel ilustrasi |
| `doodle` | `#9AA5B1` | Stroke doodle |

> Aturan: navy hanya untuk aksi dan identitas. Warna aksen hanya untuk strip kartu dan ilustrasi.

### 2.2 Tipografi

Font: **Noto Sans** (weight 400, 500, 600, 700, 800), dimuat dengan `next/font/google` dan diset sebagai `font-sans`.

| Elemen | Mobile | Tablet | Desktop | Weight | Catatan |
|---|---|---|---|---|---|
| Hero H1 | 28/1.25 | 36/1.25 | 40/1.25 | 700 | Warna `heading`, 2 baris |
| H2 section | 20 | 24 | 26 | 700 | |
| Label section | 13 | 14 | 14 | 700 | Uppercase, `primary`, tracking 0.04em |
| Judul kartu materi | 26 | 28 | 30 | 800 | Uppercase, `primary` (putih bila aktif) |
| Body | 14 | 14 | 15 | 400 | line-height 1.7–1.8 |
| Deskripsi kartu | 11 | 11 | 12 | 400 | |
| Nav | — | — | 13 | 600 | |
| Pill keunggulan | 11 | 12 | 12 | 800 | Uppercase italic |

### 2.3 Layout

Skala referensi 736px dikonversi ke desktop 1440px (±×1,63):

| Bagian | Nilai desktop |
|---|---|
| Lebar navbar & panel galeri | `max-w-[1080px]` |
| Lebar konten (hero teks, kartu, about) | `max-w-[960px]` |
| Padding horizontal | 20px (mobile) · 32px (tablet) · 48px (desktop) |
| Tinggi navbar | 64px |
| Tinggi hero | min 560–620px (desktop) |
| Jarak antar section | 96px (desktop) · 64px (mobile) |

### 2.4 Radius, Shadow, Border

| Elemen | Nilai |
|---|---|
| Tombol | radius 10px, shadow `0 4px 10px rgba(5,78,133,.25)` |
| Kartu materi | radius 16px, border 1px `card-border`, shadow `0 6px 18px rgba(20,40,80,.06)` |
| Kartu aktif | tanpa border, shadow `0 10px 24px rgba(5,78,133,.30)` |
| Panel galeri | radius 32px (24px di mobile) |
| Foto galeri | radius 12px |
| Pill keunggulan | radius 16px, shadow `0 6px 14px rgba(0,0,0,.06)` |
| Ikon bulat | 60px, border putih 4px, shadow `0 4px 12px rgba(0,0,0,.15)` |

### 2.5 Konfigurasi Tailwind

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#054E85", dark: "#043B66", light: "#E6EFF7" },
        heading: "#1B2433", body: "#3A4350", muted: "#6B7685",
        soft: "#F3F5F8", cardborder: "#8FB3D6", doodle: "#9AA5B1",
        accent: { green: "#A8DB8F", blue: "#8EC5F0", pink: "#F7B6CF", yellow: "#F6D45B" },
      },
      fontFamily: { sans: ["var(--font-noto)", "Inter", "system-ui", "sans-serif"] },
      borderRadius: { card: "16px", btn: "10px", panel: "32px" },
      boxShadow: {
        card: "0 6px 18px rgba(20,40,80,.06)",
        cardActive: "0 10px 24px rgba(5,78,133,.30)",
        btn: "0 4px 10px rgba(5,78,133,.25)",
      },
      keyframes: { float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } } },
      animation: { float: "float 4s ease-in-out infinite" },
    },
  },
} satisfies Config;
```

Breakpoint memakai bawaan Tailwind: `sm 640` · `md 768` · `lg 1024` · `xl 1280`.

---

## 3. Struktur Proyek Next.js

```text
app/
  layout.tsx          # next/font Noto Sans, metadata, <html lang="id">
  page.tsx            # menyusun section (Server Component)
  globals.css         # @tailwind, smooth scroll, reduced-motion, scroll-margin
components/
  Navbar.tsx          # "use client" (hamburger, shadow saat scroll)
  Hero.tsx            # server
  Courses.tsx         # "use client" (carousel, kartu aktif)
  About.tsx           # server
  Gallery.tsx         # server (next/image)
  Footer.tsx          # server
  FloatingBar.tsx     # server
  Reveal.tsx          # "use client" (IntersectionObserver)
  Doodles.tsx         # kumpulan SVG dekor
public/
  illustrations/hero-books.svg
  images/gallery/1.webp … 9.webp
```

- Section memakai `id` (`home`, `materi`, `tentang`, `galeri`, `kontak`) dengan `scroll-mt-20`.
- Hanya komponen yang butuh state yang jadi Client Component.
- Semua gambar lewat `next/image` (hero `priority`, galeri `loading="lazy"` dengan `sizes` yang benar).

---

## 4. Spesifikasi Section

### 4.1 Navbar
- `sticky top-0 z-50 bg-white h-16`. Shadow tipis muncul setelah scroll > 8px.
- Kiri: logo ikon topi toga navy + teks dua baris ("SMPN 1 Merawang" kecil, "Matematika" tebal), tinggi ±40px.
- Kanan (≥1024px): `Beranda · Materi · Kuis · Gelar · Tentang · Galeri · Kontak`, gap 24–32px, 13px/600. Aktif = navy, hover = navy.
- **Mobile (<1024px):** ikon hamburger 44×44px. Menu membuka **drawer dari kanan** (lebar 78%, maks 320px) dengan overlay hitam 40%, daftar menu vertikal dipisah garis `soft`, dan tombol "Mulai Belajar" di bawah. Body scroll dikunci saat drawer terbuka, dan menu menutup saat link diklik.

### 4.2 Hero
- Latar gradien `hero-from → hero-to`; dasar hero memakai **dua lapis SVG gelombang putih** (lapis belakang opacity 55%, depan solid). Tinggi gelombang: 90px (mobile) · 120px (tablet) · 150px (desktop).
- Grid 2 kolom (`lg:grid-cols-2`), teks kiri vertikal-tengah, ilustrasi kanan rata kanan.
- Teks: H1 *"Belajar Matematika Lebih Seru dan Terarah."* → subteks 2 baris (maks 384px) → tombol **Mulai Belajar** (primary) + **Pelajari Lebih Lanjut** (outline).
- Ilustrasi: tumpukan 4 buku isometrik (merah paling bawah, biru, hijau tua, oranye) + topi toga hitam bertali kuning, bayangan abu muda di lantai. Ukuran desktop ±460px, animasi `float` 4s.
- Doodle: globe garis tipis di sebelah bawah tombol, lembar kertas berspiral di dekat gelombang (hanya ≥1024px).
- **Mobile:** 1 kolom, teks center, ilustrasi di bawah teks (lebar 78%, maks 300px), tombol di-wrap dan di-center, padding bawah ekstra agar tidak tertimpa gelombang.

### 4.3 Materi (Carousel)
- Header center: label **MATERI** → H2 *"Belajar Bertahap, Raih Gelar Juara."*
- Kartu: ±220 × 240px di desktop (rasio referensi 134×146), gap 24px. Isi: judul besar uppercase → deskripsi 2–3 baris (maks 190px, center) → "Lihat Detail →" di dasar.
- Daftar materi: Bilangan, Aljabar, Geometri, Statistika, Peluang, Rasio. Hanya materi pertama yang terbuka, sisanya memakai ikon gembok kecil sebelum "Lihat Detail" (sesuai aturan unlock bertahap).
- **State kartu:**

| State | Tampilan |
|---|---|
| Aktif (default kartu 1) | Latar `primary`, teks putih, shadow `cardActive`, tanpa strip |
| Normal | Putih, border `card-border`, judul navy, strip warna 6px di bawah |
| Hover/focus | Naik 4px dan menjadi aktif |

- Panah bulat 32px di luar kartu: kiri abu `#E5E8EC`, kanan navy; menggeser 80% lebar track.
- Tombol **Materi Lainnya** (primary kecil) center di bawah carousel.
- **Responsive:** 4 kartu (≥1024) · 2 kartu (≥640) · 1,4 kartu dengan peek di mobile (lebar 68%) memakai `scroll-snap-x`; panah disembunyikan di mobile dan diganti swipe; scrollbar disembunyikan.

### 4.4 Tentang
- Grid 2 kolom di desktop (`lg:grid-cols-2`, items-center), 1 kolom di bawahnya.
- Kiri: label **TENTANG KAMI** → H2 *"Belajar Matematika Lebih Menyenangkan."* → 3 paragraf 13px (line-height 1.8, maks 448px) yang menjelaskan materi terstruktur, kuis + pembahasan, aturan skor ≥ 70 untuk membuka materi, dan gelar pencapaian.
- Kanan: 4 pill keunggulan: **Materi Terstruktur · Kuis & Pembahasan · Buka Materi Bertahap · Gelar Pencapaian**.
  - Anatomi: ikon bulat navy 60px menempel di kiri, kapsul `soft` di kanan (`-ml-5`, padding kiri 36px).
  - Desktop: rotate −6° dan offset kiri berbeda per pill (`ml-14`, `ml-2`, `ml-44`, `ml-24`) untuk efek zig-zag seperti referensi.
  - Mobile/tablet: tanpa rotasi dan offset, tersusun lurus, lebar maks 448px, di-center.
- Doodle: gunting di atas teks kanan, kuas di bawah kiri (≥1024px).

### 4.5 Galeri
- Container navy `primary`, radius 32px (24px mobile), padding 48px (16–32px di mobile), margin horizontal 12px di mobile agar panel terlihat "melayang".
- Header putih center: label **GALERI** → H2 *"Belajar bersama, tumbuh bersama."* → tagline tebal **Berpikir | Berlatih | Berprestasi**. Doodle tabung reaksi putih opacity 30% di pojok kanan atas.
- Grid masonry memakai CSS columns: **4 kolom (≥1024) · 2 kolom (di bawahnya)**, gap 16px (12px mobile), `break-inside-avoid`. Rasio foto bervariasi (landscape 4:3, 4:2.6, portrait 3.4:5) agar kolom terlihat berombak seperti referensi.
- Isi foto: siswa menulis, diskusi kelompok, membaca, belajar sendiri, guru membimbing. Tone hangat dan natural. Format WebP ≤ 200KB, `object-cover`, hover `scale-[1.03]`.
- Bila foto belum tersedia, tampilkan placeholder gradien hangat dengan ikon gambar.

### 4.6 Footer
- Latar `primary-dark`, teks putih. Grid 3 kolom di ≥768px, 1 kolom di mobile: logo versi putih + deskripsi · tautan cepat · kontak (alamat, email, telepon dengan ikon).
- Baris bawah: `© 2026 SMPN 1 Merawang. All rights reserved.` 12px, putih 60%, dipisah garis `white/10`.

### 4.7 Floating Action Bar
- **Desktop/tablet (≥640px):** `fixed` menempel di sisi kanan (±28% dari atas), lebar 40px, latar navy, radius kiri 12px, dua ikon vertikal (kontak/profil, chat).
- **Mobile:** berubah menjadi kapsul horizontal di pojok kanan bawah (`bottom-4 right-3`), tiap tombol 44×44px, tidak menutupi konten utama.

---

## 5. Komponen Dasar

| Komponen | Spesifikasi |
|---|---|
| Tombol primary | `bg-primary text-white text-[13px] font-semibold px-7 py-3 rounded-btn shadow-btn`, hover `bg-primary-dark`, transition 180ms |
| Tombol outline | border 1.5px `primary`, teks `primary`, hover `bg-primary-light` |
| Panah carousel | 32px bulat, ikon chevron 18px |
| Ikon | Lucide, 20–24px, putih di dalam lingkaran navy |
| Doodle | SVG stroke 1.2px, `doodle` opacity 40–50%, `aria-hidden`, `pointer-events-none`, maks satu per area |

---

## 6. Responsive Ringkas

| Area | < 640 (mobile) | 640–1023 (tablet) | ≥ 1024 (desktop) |
|---|---|---|---|
| Navbar | Hamburger + drawer | Hamburger + drawer | Menu horizontal |
| Hero | 1 kolom, center, ilustrasi di bawah | 1 kolom, ilustrasi lebih besar | 2 kolom, teks kiri |
| Gelombang hero | 90px | 120px | 150px |
| Kartu materi | Swipe 1,4 kartu | 2 kartu + panah | 4 kartu + panah |
| Tentang | 1 kolom, pill lurus | 1 kolom, pill lurus | 2 kolom, pill zig-zag miring |
| Galeri | 2 kolom, padding 16px | 2 kolom | 4 kolom |
| Footer | 1 kolom | 3 kolom | 3 kolom |
| Floating bar | Kapsul pojok bawah | Bar kanan | Bar kanan |
| Doodle dekor | Disembunyikan | Sebagian | Tampil |

Uji pada lebar **360, 390, 768, 1024, 1280, 1440px**. Tidak boleh ada scroll horizontal (`overflow-x: hidden` di body, carousel hanya scroll di dalam track-nya).

---

## 7. Interaksi & Animasi

- **Scroll reveal:** fade + naik 16px, 500ms ease-out, stagger 80ms pada pill dan kartu. Dipicu `IntersectionObserver` (threshold 0,15) dan hanya sekali.
- **Ilustrasi hero:** floating ±10px, 4s, infinite.
- **Kartu materi:** hover naik 4px dan berpindah ke state aktif.
- **Anchor link:** smooth scroll, `scroll-margin-top: 72px` agar tidak tertutup navbar.
- Semua animasi dimatikan di bawah `prefers-reduced-motion: reduce`.

---

## 8. Aksesibilitas & Kualitas

- Kontras putih di atas `#054E85` ≈ 8,9:1 (WCAG AAA); `body` di atas putih lolos AA.
- Target sentuh ≥ 44×44px di mobile. Fokus keyboard terlihat (outline 3px navy 45%).
- Satu `<h1>` per halaman, urutan heading benar. Landmark `header`, `nav`, `main`, `footer`.
- Hamburger memakai `aria-label` dan `aria-expanded`. Carousel bisa digeser dengan keyboard (Tab ke kartu) dan tombol panah memiliki label.
- Gambar bermakna punya `alt`; doodle dan elemen dekor memakai `aria-hidden`.
- Informasi tidak disampaikan hanya lewat warna (strip kartu hanya dekorasi, gembok punya teks).
- SEO: `metadata` (title, description, theme-color), `lang="id"`.
- Performa: font via `next/font` (tanpa layout shift), hero `priority`, galeri lazy dengan `sizes`, target Lighthouse ≥ 90.

---

## 9. Aset yang Dibutuhkan

| Aset | Format | Catatan |
|---|---|---|
| Logo sekolah/aplikasi | SVG | Versi navy dan putih |
| Ilustrasi hero (buku + toga) | SVG/PNG transparan | ±920×760px |
| Doodle: globe, kertas, gunting, kuas, tabung | SVG | Stroke 1px |
| Gelombang hero | SVG inline | Putih, `preserveAspectRatio="none"` |
| Foto galeri (9) | WebP | Rasio campuran, ≤ 200KB |
| Favicon / OG image | PNG | Topi toga navy; OG 1200×630 |

---

## 10. Checklist Kemiripan dengan Referensi

- [ ] Hero abu-biru pucat dengan gelombang putih di dasar
- [ ] Ilustrasi isometrik buku + topi toga di kanan hero
- [ ] Kartu pertama navy solid, tiga lainnya putih berborder biru muda dengan strip warna di bawah
- [ ] Panah carousel: kiri abu, kanan navy
- [ ] Pill keunggulan miring dan zig-zag, ikon bulat navy ber-border putih
- [ ] Panel galeri navy bersudut besar dengan masonry 4 kolom
- [ ] Floating bar navy di sisi kanan layar
- [ ] Hanya satu warna aksi (navy) di seluruh halaman
- [ ] Setiap section berpola label kecil → judul → konten
- [ ] Tampilan mobile 360px rapi tanpa scroll horizontal