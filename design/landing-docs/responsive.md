# responsive.md — Perilaku per Breakpoint

Mobile-first. Uji di **360, 390, 768, 1024, 1280, 1440px**. Tidak boleh ada scroll horizontal (body `overflow-x: hidden`; carousel hanya scroll di dalam track).

| Section | < 640 | 640–1023 | ≥ 1024 |
|---|---|---|---|
| Navbar | Logo + hamburger, drawer kanan (78%, maks 320px) | sama | Search · menu tengah · Log in |
| Hero carousel | 1 kartu 82% + peek 9%, tinggi 240px | kartu 60%, 2 peek | coverflow 5 kartu, tinggi 400–460px |
| Welcome | H2 26px, paragraf 14px, padding 20px | H2 32px | H2 40px, maks 880px |
| Statistik | 2×2, ikon 56px, angka 36px | 4 kolom, angka 44px | 4 kolom, angka 52px |
| Mosaik | 2 kolom masonry | 3 kolom masonry | grid 12 kolom tak beraturan |
| Berita | 1 kolom | 2 kolom | 3 kolom |
| Banner kalender | tumpuk, center, tombol full-width | 1 baris | 1 baris, teks kiri tombol kanan |
| Pengumuman | judul atas, 2 tombol 50/50 di bawah | baris, tombol kanan | baris, tombol kanan |
| Footer | 1 kolom | 2 kolom | 4 kolom |
| Confetti | tinggal 3–4 per section, ukuran 70% | 6 | 8–12 |

## Aturan umum
- Tipografi memakai skala di `design.md`; tidak ada teks < 12px.
- Target sentuh ≥ 44×44px.
- Gambar selalu `sizes` sesuai kolom (mis. berita `(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw`).
- Band merah dan footer selalu full-bleed; konten di container.
- Tombol di band merah (`white`) tetap kontras ≥ 4.5:1.
- Safe-area iOS: `pb-[env(safe-area-inset-bottom)]` pada footer.
