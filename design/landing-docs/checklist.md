# checklist.md — Kriteria "Sudah Mirip"

Bandingkan dengan `reference/` per section di 1440px dan 360px.

## Global
- [ ] Hanya merah `#C1121F` sebagai warna aksi; teal/gold hanya confetti
- [ ] Font Poppins, skala sesuai `design.md`
- [ ] Tidak ada scroll horizontal di 360px
- [ ] `npm run build` lolos tanpa error

## Per Section
- [ ] **Navbar:** search kiri, menu tengah, Log in kanan; sticky; drawer mobile berfungsi
- [ ] **Hero:** kartu tengah besar+terang, samping kecil+gelap, judul di kartu, dot di bawah, autoplay
- [ ] **Welcome:** H2 tebal center, paragraf center, tombol pill merah, confetti di sisi
- [ ] **Statistik:** band merah full-bleed, ikon topi toga di atas, 4 item dengan ikon putih besar, count-up
- [ ] **Mosaik:** grid tak beraturan, sudut membulat, tidak ada celah/tumpang tindih
- [ ] **Berita:** 3 kartu foto-atas, tanggal kiri + tombol Baca kanan, tombol Lihat Semua
- [ ] **Banner kalender:** merah full-bleed, tombol putih kanan
- [ ] **Pengumuman:** baris kartu putih bershadow, tombol Lihat + Unduh merah di kanan
- [ ] **Footer:** merah, 4 blok, ikon kontak, copyright center

## Kualitas
- [ ] Semua teks berasal dari `content.md`
- [ ] Semua gambar memuat atau memakai placeholder (tidak ada broken image)
- [ ] Confetti tidak menimpa teks/tombol
- [ ] Reduced-motion menonaktifkan animasi
- [ ] Lighthouse: Perf ≥ 90, A11y ≥ 95
