# Paket Dokumen Desain — Landing Page

Berikan **seluruh folder ini** ke AI agent (Claude Code, Cursor, dsb.) di root proyek Next.js. Agent otomatis membaca `CLAUDE.md`, yang menunjuk file lainnya.

| File | Fungsi |
|---|---|
| `CLAUDE.md` | Aturan proyek + urutan membaca |
| `design.md` | Token warna, font, radius, shadow, confetti, config Tailwind |
| `sections.md` | Spesifikasi 9 section |
| `components.md` | Komponen berulang |
| `content.md` | Semua teks final (contoh, ganti dengan data asli) |
| `assets.md` | Daftar gambar/ikon + ukuran + nama file |
| `responsive.md` | Perilaku mobile/tablet/desktop |
| `interactions.md` | Carousel, animasi, hover |
| `structure.md` | Struktur folder + komponen client/server |
| `seo-a11y.md` | SEO, aksesibilitas, performa |
| `checklist.md` | Kriteria selesai |
| `reference/` | Screenshot acuan per section (isi sendiri) |
| `archive/` | Versi lama (tema biru "The Planner") |

Cara pakai yang disarankan: minta agent mengerjakan **satu section per giliran** sesuai urutan di `sections.md`, lalu bandingkan hasilnya dengan gambar di `reference/`.
