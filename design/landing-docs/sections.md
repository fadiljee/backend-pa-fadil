# sections.md — Spesifikasi Section (urut dari atas ke bawah)

Setiap section menunjuk gambar referensi di `reference/`. Lebar acuan desktop = 1440px.

---
## 1. Navbar — `reference/01-navbar-hero.png`
- Tinggi 72px, latar putih, `sticky top-0 z-50`, garis bawah `line` (shadow tipis setelah scroll).
- **Kiri:** ikon search + teks "Search" (14px, muted). Klik membuka kolom pencarian materi.
- **Tengah:** menu `Beranda · Materi · Kuis · Gelar · Tentang · Kontak`, gap 40px, 14px/500, hover/aktif `brand`.
- **Kanan:** tombol/teks **Log in** (rata kanan). Di desktop besar logo sekolah berada di tengah-kiri sebelum menu bila ada.
- Mobile (<1024): logo kiri, hamburger kanan; drawer dari kanan berisi search, menu vertikal, tombol Log in.

## 2. Hero Carousel Foto — `reference/02-hero-carousel.png`
- Tinggi 380–460px (desktop), latar putih.
- **Carousel "coverflow":** 1 kartu tengah **besar dan terang**, 2 kartu di tiap sisi **lebih kecil, lebih gelap (overlay hitam 35%)**, terpotong di tepi layar.
- Kartu tengah: lebar ±440px, tinggi ±280px, radius 18px, shadow `hero`, **judul foto di atas kiri** (putih, 24px/600) + 1–2 baris deskripsi (12px). Contoh judul: `Ruang Kelas`, `Perpustakaan`, `Lapangan`, `Kegiatan Belajar`.
- Di bawah carousel: **4–5 dot** pagination (aktif = `brand`, lainnya abu).
- Autoplay 5s, berhenti saat hover/fokus. Bisa swipe di mobile.
- Mobile: 1 kartu tengah penuh (lebar 82%) dengan **peek** kartu samping 9% di kiri-kanan.

## 3. Welcome — `reference/03-welcome.png`
- Center, maks 880px. H2 **"Selamat Datang di Belajar Matematika SMPN 1 Merawang"** (bold, 40px desktop).
- Paragraf 15–16px, center, 4–5 baris, warna `body`.
- Tombol pill merah **Mulai Belajar** (menggantikan "Apply Now") di bawah paragraf, jarak 28px.
- Confetti di kiri-kanan paragraf (segitiga teal, lingkaran merah outline, garis bergelombang).

## 4. Statistik (Band Merah) — `reference/04-stats.png`
- Full-bleed `bg-brand`, padding vertikal 72–96px, confetti putih di sudut.
- Atas: ikon topi toga putih 56px (center) → H2 putih **"Statistik Belajar Sekilas!"** → subjudul "Platform belajar Matematika SMPN 1 Merawang".
- **4 item** sejajar (`grid-cols-4`), center: ikon putih 72px (piala, guru/orang, siswa, topi toga) → angka besar → label.
- Contoh: `Piala` 22+ (…), `Guru` 250+ … → gunakan data di `content.md`.
- Mobile: grid 2×2, ikon 56px, angka 36px. Angka beranimasi count-up saat terlihat.

## 5. Mosaik Foto — `reference/05-mosaic.png`
- Full-width di dalam container (atau sedikit melebar), grid tidak beraturan, gap 12–16px, radius 14px.
- Desktop: grid 12 kolom × 2 baris; satu foto lebar 5 kolom, satu foto tinggi, satu foto lebar 4 kolom, sisanya kecil. Total 8–9 foto.
- Foto aktivitas siswa (belajar, olahraga, diskusi). `object-cover`, hover `scale-[1.03]`.
- Mobile: 2 kolom masonry (CSS columns), rasio campuran.

## 6. News & Events — `reference/06-news.png`
- Judul H2 "Berita & Kegiatan" center dengan ikon segitiga outline kecil di kiri, confetti di sisi.
- **3 kartu** (`grid-cols-3`, gap 28px): foto atas (rasio 16:10), judul (2–3 baris, 600), excerpt 3–4 baris (13px, muted/body), baris bawah: tanggal kiri (12px muted) + tombol pill **Baca** kanan (merah, kecil).
- Di bawah kartu: tombol pill merah **Lihat Semua** center.
- Mobile: 1 kolom; tablet: 2 kolom (kartu ketiga turun) atau scroll horizontal snap.

## 7. Banner Kalender Akademik — `reference/07-calendar-cta.png`
- Full-bleed `bg-brand`, tinggi 80–96px, konten: teks kiri putih **"Mencari Kalender Akademik?"** (24–28px/600), tombol putih berteks merah **Unduh Sekarang** (pill) di kanan.
- Mobile: tumpuk vertikal, center.

## 8. Pengumuman — `reference/08-announcements.png`
- H2 **"Pengumuman"** center, subjudul "Untuk tahun ajaran berjalan (Juli 2026 – Juni 2027)" (13px, muted).
- Daftar baris (maks 4), lebar ±960px, tiap baris: kartu putih, radius 14px, shadow `row`, padding 24px 28px.
  - Kiri: judul (16–18px/600, ink).
  - Kanan: dua tombol pill merah **Lihat** dan **Unduh** (gap 12px).
- Jarak antar baris 20–28px.
- Mobile: judul di atas, kedua tombol di bawahnya sejajar (flex-wrap), full-width tombol 50/50.

## 9. Footer — `reference/09-footer.png`
- Full-bleed `bg-brand`, teks putih, padding 56px atas / 24px bawah.
- **3 kolom + brand:** (1) nama sekolah (bold 20px) + deskripsi 2–4 baris + ikon sosial bulat; (2) **Hubungi Kami** (alamat, email, telepon dengan ikon); (3) **Tentang** (daftar tautan); (4) **Kehidupan Sekolah** (daftar tautan).
- Baris bawah: garis `white/20` + `© 2026 SMPN 1 Merawang. Hak cipta dilindungi.` center, 13px.
- Mobile: 1 kolom, jarak 32px antar blok.
