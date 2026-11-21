# seo-a11y.md — SEO, Aksesibilitas, Performa

## SEO
- `metadata`: title "Belajar Matematika | SMPN 1 Merawang", description 150–160 karakter, `themeColor: #C1121F`, OpenGraph + Twitter (pakai `og-image.jpg`), `lang="id"`.
- Satu `<h1>` (di Welcome atau hero), heading berurutan. Landmark `header/nav/main/footer`.
- `sitemap.ts` dan `robots.ts`.

## Aksesibilitas (target WCAG AA)
- Putih di atas `#C1121F` ≈ 6,3:1 (lolos AA); teks kecil di band merah gunakan putih penuh, bukan 70%.
- Fokus terlihat; target sentuh ≥ 44px.
- Carousel: `role="region"` + `aria-roledescription="carousel"`, tiap slide `aria-label="n dari total"`, tombol dot punya label, autoplay berhenti saat fokus/hover dan bisa dijeda.
- Hamburger: `aria-label`, `aria-expanded`, drawer `role="dialog"`, tutup dengan Esc, fokus kembali ke tombol.
- Gambar bermakna ber-`alt` (lihat `content.md`); confetti/ikon dekor `aria-hidden`.
- Tombol "Lihat"/"Unduh" memakai `aria-label` lengkap, mis. "Unduh: Kisi-kisi Penilaian Tengah Semester".
- Hormati `prefers-reduced-motion`.

## Performa
- Font via `next/font` (tanpa layout shift). Hero kartu tengah `priority`, lainnya lazy.
- `next/image` dengan `sizes` benar, WebP.
- Target Lighthouse: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95.
- Tidak ada library animasi berat; confetti memakai SVG inline.
