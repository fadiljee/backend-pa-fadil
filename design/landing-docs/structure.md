# structure.md — Struktur Proyek Next.js

```text
app/
  layout.tsx        # next/font Poppins, metadata, <html lang="id">
  page.tsx          # menyusun section (server)
  globals.css       # tailwind, smooth scroll, reduced-motion, scroll-margin
components/
  layout/  NavBar.tsx (client) · Footer.tsx (server)
  sections/
    HeroCarousel.tsx (client) · Welcome.tsx · Stats.tsx (client, count-up)
    Mosaic.tsx · News.tsx · CalendarBanner.tsx · Announcements.tsx
  ui/  Button.tsx · SectionTitle.tsx · Confetti.tsx · Reveal.tsx (client)
lib/
  content.ts        # data dari content.md (array berita, pengumuman, statistik, menu)
public/
  logo/ · icons/ · images/{hero,mosaic,news}/
```
- `page.tsx` hanya menyusun komponen; data dari `lib/content.ts` agar teks mudah diganti.
- Section ber-`id`: `home, materi, tentang, galeri, kontak`, `pengumuman`.
- Client component hanya: NavBar, HeroCarousel, Stats, Reveal.
- Path alias `@/*` → root.
