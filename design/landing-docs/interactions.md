# interactions.md — Interaksi & Animasi

## Hero Carousel (coverflow)
- State `index`. Kartu relatif ke `index`: `0` = tengah (scale 1, opacity 1), `±1` = scale 0.82, opacity 0.7 + overlay gelap 35%, `±2` = scale 0.68, opacity 0.5. Transisi 500ms `ease-out`.
- Autoplay 5s; berhenti saat hover, fokus, atau tab tidak aktif. Dot pagination 5 buah, klik berpindah.
- Swipe (pointer events) di mobile; tombol keyboard ← → pada carousel yang difokus.
- `prefers-reduced-motion`: tanpa autoplay dan tanpa transisi.

## Scroll Reveal
`IntersectionObserver` (threshold 0.15), fade + naik 16px, 500ms, stagger 80ms pada kartu berita dan baris pengumuman. Sekali jalan.

## Count-up Statistik
Saat band terlihat: angka naik dari 0 ke target selama 1,4s (ease-out), mempertahankan sufiks `+` / `%`. Tanpa animasi bila reduced motion.

## Hover & Fokus
- Tombol: warna → `brand-dark`, naik 1px.
- Kartu berita: shadow menguat, foto zoom 1.04 (400ms).
- Mosaik: `scale-[1.03]`.
- Baris pengumuman: naik 2px.
- Link nav: warna `brand`, underline tipis.
- Fokus keyboard selalu terlihat (ring merah 30–45%).

## Confetti
Float lembut (`animate-float`) hanya pada 2–3 elemen per section, durasi berbeda-beda; sisanya statis.

## Navigasi
- Smooth scroll ke anchor, `scroll-margin-top: 88px`.
- Search: membuka input inline; Enter menuju `/materi?q=…`.
- Drawer mobile: kunci scroll body, tutup saat klik overlay/link/Esc.
