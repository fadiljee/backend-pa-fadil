# CLAUDE.md — Aturan Proyek Landing Page Matematika SMPN 1 Merawang

Landing page ini meniru **gaya dan layout** referensi "Oxford Grace School" (tema merah, band statistik, mosaik foto, berita, pengumuman), dengan **konten** Media Pembelajaran Matematika SMPN 1 Merawang.

## Stack
- Next.js 14+ (App Router, TypeScript) · Tailwind CSS 3.4 · lucide-react · `next/font` (Poppins) · `next/image`
- Tanpa library UI besar. Carousel dan animasi dibuat sendiri (CSS + IntersectionObserver).

## Urutan membaca (WAJIB sebelum menulis kode)
1. `design.md` — token warna, font, radius, shadow
2. `sections.md` — spesifikasi tiap section (sumber utama kemiripan)
3. `components.md` — komponen berulang
4. `content.md` — semua teks final
5. `assets.md` — daftar gambar/ikon dan lokasinya
6. `responsive.md`, `interactions.md`, `seo-a11y.md`, `structure.md`
7. Lihat gambar di `reference/` sebelum mengerjakan tiap section
8. Selesai satu section → cek `checklist.md`

## Aturan keras
- Jangan mengubah warna, font, urutan section, atau menambah section di luar `sections.md`.
- Jangan mengarang teks. Pakai `content.md`. Jika teks tidak ada, tulis `TODO` dan beri tahu.
- Jangan memakai lorem ipsum. Jika foto belum ada, pakai placeholder sesuai `assets.md`.
- Semua nilai warna/ukuran lewat token Tailwind (`design.md`), bukan hex acak di komponen.
- Mobile-first. Tiap section harus rapi di 360px tanpa scroll horizontal.
- Server Component secara default; `"use client"` hanya untuk komponen bernilai state/efek (lihat `structure.md`).
- Satu section = satu komponen = satu commit. Kerjakan berurutan dan tunjukkan hasilnya sebelum lanjut.

## Perintah
```bash
npm run dev      # pengembangan
npm run build    # wajib lolos sebelum selesai
```

## Definisi selesai
`npm run build` lolos, `checklist.md` terpenuhi, dan tampilan dibandingkan dengan `reference/` di lebar 360, 768, 1280, dan 1440px.
