# design.md — Token & Gaya Visual

Gaya: **bersih, institusional, hangat**. Latar putih, **band merah solid** sebagai penanda section penting, foto berkelas dengan sudut membulat, tombol pill merah, dan **confetti/doodle kecil** (lingkaran, segitiga teal, kotak, garis bergelombang) menyebar di latar putih dan merah.

## Warna
| Token | Hex | Pemakaian |
|---|---|---|
| `brand` | `#C1121F` | Band statistik, banner, footer, tombol pill, judul kartu aktif |
| `brand-dark` | `#8E0E18` | Hover tombol, bayangan band, footer bawah |
| `brand-light` | `#FDECEE` | Latar hover ringan, badge |
| `ink` | `#111111` | Judul utama (H1/H2) |
| `body` | `#3D3D3D` | Paragraf |
| `muted` | `#7A7A7A` | Tanggal, caption, copyright |
| `line` | `#E8E8E8` | Garis pemisah, border kartu |
| `surface` | `#FFFFFF` | Latar halaman, kartu |
| `surface-soft` | `#F7F7F8` | Latar bergantian |
| `teal` | `#1FA79A` | Confetti segitiga/titik |
| `gold` | `#F2B705` | Confetti kecil |
| `navy` | `#1E3A8A` | Confetti kecil (jarang) |

> Merah = identitas dan aksi. Teal/gold/navy **hanya** untuk confetti dekoratif, bukan untuk tombol atau teks.

## Tipografi
Font: **Poppins** (400, 500, 600, 700) via `next/font/google` → variabel `--font-poppins`.

| Elemen | Mobile | Tablet | Desktop | Weight |
|---|---|---|---|---|
| H2 section (Welcome, News) | 26/1.2 | 32/1.2 | 40/1.15 | 700 |
| H2 di band merah | 26 | 32 | 40 | 600 putih |
| Subjudul band | 14 | 15 | 16 | 400 putih/85% |
| Angka statistik | 36 | 44 | 52 | 700 putih |
| Label statistik | 13 | 14 | 14 | 400 putih/90% |
| Judul kartu berita | 16 | 17 | 18 | 600 |
| Body | 14/1.7 | 15/1.7 | 16/1.75 | 400 |
| Nav | — | — | 14 | 500 |
| Tombol | 13 | 14 | 14 | 600 |
| Tanggal/caption | 12 | 12 | 13 | 400 |

## Layout
- Container konten: `max-w-[1200px]`, padding horizontal 20 / 32 / 48 (mobile/tablet/desktop).
- Band merah & hero: lebar penuh (full-bleed), konten di dalam container.
- Jarak vertikal antar section: 64 (mobile) / 88 (tablet) / 112 (desktop).
- Grid 12 kolom, gap 16 / 24 / 32.

## Radius, Border, Shadow
| Elemen | Nilai |
|---|---|
| Tombol pill | `rounded-full` |
| Kartu berita | radius 12px, shadow `0 8px 24px rgba(0,0,0,.08)`, foto atas radius 12px |
| Foto mosaik | radius 14px |
| Kartu hero carousel | radius 18px, shadow `0 16px 40px rgba(0,0,0,.25)` |
| Baris pengumuman | radius 14px, shadow `0 6px 18px rgba(0,0,0,.08)` |
| Band merah | sudut lurus (tanpa radius) |

## Confetti / Dekorasi
- Bentuk: lingkaran outline, titik penuh, segitiga (teal), kotak outline, tanda plus/bintang, garis bergelombang pendek.
- Ukuran 8–28px, opacity 60–100%, warna `brand`/`teal`/`gold` di latar putih; putih/semi-transparan di band merah.
- Posisi absolut di sudut section, **tidak boleh menimpa teks atau tombol**, `pointer-events-none`, `aria-hidden`.
- Maks 8–12 elemen per section; sembunyikan sebagian di mobile (lihat `responsive.md`).

## Tailwind Config
```ts
import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#C1121F", dark: "#8E0E18", light: "#FDECEE" },
        ink: "#111111", body: "#3D3D3D", muted: "#7A7A7A", line: "#E8E8E8",
        soft: "#F7F7F8", teal: "#1FA79A", gold: "#F2B705", navy: "#1E3A8A",
      },
      fontFamily: { sans: ["var(--font-poppins)", "system-ui", "sans-serif"] },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,.08)",
        row: "0 6px 18px rgba(0,0,0,.08)",
        hero: "0 16px 40px rgba(0,0,0,.25)",
      },
      borderRadius: { card: "12px", tile: "14px", slide: "18px" },
      keyframes: { float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } } },
      animation: { float: "float 5s ease-in-out infinite" },
    },
  },
} satisfies Config;
```
Breakpoint bawaan: `sm 640` · `md 768` · `lg 1024` · `xl 1280`.
