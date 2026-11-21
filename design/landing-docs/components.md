# components.md — Komponen Berulang

## Button (`components/ui/Button.tsx`)
| Varian | Kelas inti |
|---|---|
| `primary` | `rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark` |
| `primary-sm` | sama, `px-5 py-2 text-[13px]` (Baca, Lihat, Unduh) |
| `white` | `bg-white text-brand hover:bg-brand-light` (di band merah) |
- Tinggi minimal 44px di mobile. Fokus: `focus-visible:ring-4 ring-brand/30`.
- Bisa sebagai `<a>` atau `<button>` (prop `href`).

## SectionTitle
Props: `title`, `subtitle?`, `tone: "dark" | "light"`, `align: "center"`. `dark` = ink, `light` = putih (band merah). Ikon dekor opsional di kiri judul.

## Confetti (`components/Confetti.tsx`)
Props: `variant: "white" | "red"`, `density`. Mengembalikan kumpulan SVG absolut, `aria-hidden`, `pointer-events-none`. Posisi tetap per section agar konsisten.

## NavBar
Search (kiri) · menu (tengah) · Log in (kanan); mobile drawer. Item aktif mengikuti section yang terlihat (IntersectionObserver). Shadow tipis saat scroll.

## HeroSlide / Carousel
Kartu dengan judul dan deskripsi di atas gambar (gradient gelap atas 0→50% agar teks terbaca). State: `center`, `side`. Lihat `interactions.md`.

## StatItem
Ikon putih → angka (count-up) → label. `grid-cols-2 lg:grid-cols-4`, gap 32.

## NewsCard
`rounded-card bg-white shadow-card overflow-hidden`, foto rasio 16:10 (hover zoom 1.04), isi padding 20, footer `flex justify-between` tanggal + tombol `primary-sm`.

## AnnouncementRow
`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-tile bg-white shadow-row px-6 py-5 sm:px-7 sm:py-6`. Judul kiri, grup tombol kanan.

## MosaicTile
`next/image fill`, `object-cover`, `rounded-tile`, hover `scale-[1.03]`, fallback placeholder jika gagal.

## ContactItem / FooterLinkList
Ikon 16px + teks 14px putih/90%; tautan hover underline.
