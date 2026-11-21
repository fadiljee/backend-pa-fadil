# assets.md — Daftar Aset

Semua aset di `public/`. Format foto: **WebP**, ≤ 220KB. Beri nama persis seperti tabel.

## Logo & Ikon
| File | Ukuran | Keterangan |
|---|---|---|
| `logo/logo-red.svg` | tinggi 40px | Logo untuk latar putih |
| `logo/logo-white.svg` | tinggi 40px | Logo untuk footer/band merah |
| `favicon.ico`, `icon-512.png` | 32/512 | Favicon |
| `og-image.jpg` | 1200×630 | Gambar share |
| `icons/trophy.svg`, `users.svg`, `students.svg`, `cap.svg` | 72px | Ikon statistik putih (stroke 2, outline) |

## Hero Carousel
| File | Ukuran | Isi |
|---|---|---|
| `images/hero/1.webp` … `5.webp` | 1200×760 | Ruang kelas, perpustakaan, lapangan, kegiatan belajar, lab |

## Mosaik (8 foto)
| File | Ukuran | Peran di grid |
|---|---|---|
| `images/mosaic/1.webp` | 1200×800 | Lebar besar kiri atas |
| `2.webp` | 900×600 | Lebar sedang tengah atas |
| `3.webp` | 600×900 | Tinggi kanan atas |
| `4.webp` | 600×600 | Kecil |
| `5.webp` | 900×600 | Bawah kiri |
| `6.webp` | 1200×800 | Lebar besar bawah tengah |
| `7.webp` | 900×600 | Bawah kanan |
| `8.webp` | 600×600 | Kecil |

## Berita
| File | Ukuran |
|---|---|
| `images/news/1.webp`, `2.webp`, `3.webp` | 800×500 |

## Dekorasi (SVG inline di `components/Confetti.tsx`)
Lingkaran outline, titik, segitiga (teal), kotak outline, plus, squiggle. Tidak perlu file terpisah.

## Placeholder
Jika foto belum ada: gradien abu hangat `from-[#d9d9de] to-[#a9a9b3]` + ikon gambar, rasio sama dengan slot, **tanpa** teks. Tidak boleh ada gambar rusak.

## Sumber foto
Gunakan foto sekolah sendiri. Hindari foto stok bermerek/berwajah terkenal. Pastikan izin publikasi foto siswa.
