import { getGambarUrl } from "@/lib/storage";
import { getLandingSettings } from "@/lib/services/landing-settings";
import { getPublishedBeritaList } from "@/lib/services/berita";
import {
  DEFAULT_STATS,
  FALLBACK_NEWS,
  HERO_SLIDES_CONTENT,
  MOSAIC_DEFAULT_ALTS,
  type HeroSlideData,
  type LandingNewsItem,
  type MosaicSlotData,
} from "@/lib/content";
import { Navbar } from "@/components/landing/Navbar";
import { HeroCarousel } from "@/components/landing/HeroCarousel";
import { Welcome } from "@/components/landing/Welcome";
import { Stats } from "@/components/landing/Stats";
import { Mosaic } from "@/components/landing/Mosaic";
import { News } from "@/components/landing/News";
import { CalendarBanner } from "@/components/landing/CalendarBanner";
import { Announcements } from "@/components/landing/Announcements";
import { Footer } from "@/components/landing/Footer";
import { SectionButton } from "@/components/landing/SectionLink";

export const revalidate = 60;

function formatIndoDate(dateStr: string): string {
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return dateStr;
  }
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export default async function HomePage() {
  const [{ settings }, beritaRes] = await Promise.all([
    getLandingSettings(),
    getPublishedBeritaList(3),
  ]);

  // Dedicated Gallery items (strictly separated from Berita)
  const uploadedGallery = settings.galleryItems
    .map((item) => ({
      id: item.id,
      alt: item.judul,
      imageUrl: getGambarUrl(item.gambar),
    }))
    .filter((item): item is MosaicSlotData => Boolean(item.imageUrl));

  // Build 8 mosaic slots (uploaded gallery photos first, then clean placeholders)
  const mosaicSlots: MosaicSlotData[] = Array.from({ length: 8 }, (_, idx) => {
    const uploaded = uploadedGallery[idx];
    if (uploaded) return uploaded;
    return {
      id: `mosaic-slot-${idx + 1}`,
      alt: MOSAIC_DEFAULT_ALTS[idx] ?? `Kegiatan SMPN 1 Merawang ${idx + 1}`,
      imageUrl: null,
    };
  });

  // Hero Coverflow Slides (5 school highlights)
  const aboutPhotoUrl = getGambarUrl(settings.aboutPhoto);
  const heroSlides: HeroSlideData[] = HERO_SLIDES_CONTENT.map((slide, idx) => {
    if (slide.imageUrl) return slide;
    if (idx === 0 && aboutPhotoUrl) {
      return { ...slide, imageUrl: aboutPhotoUrl };
    }
    const galleryCandidate = uploadedGallery[idx];
    if (galleryCandidate?.imageUrl) {
      return { ...slide, imageUrl: galleryCandidate.imageUrl };
    }
    return slide;
  });

  // News items (published berita linking to full-page /berita/[id], fallback to general school news)
  const newsItems: LandingNewsItem[] =
    beritaRes.items.length > 0
      ? beritaRes.items.map((b) => ({
          id: b.id,
          href: `/berita/${b.id}`,
          title: b.judul,
          excerpt: b.ringkasan,
          dateLabel: formatIndoDate(b.tanggal_kegiatan),
          dateIso: b.tanggal_kegiatan,
          imageUrl: getGambarUrl(b.gambar),
        }))
      : FALLBACK_NEWS;

  return (
    <div className="min-h-dvh w-full bg-surface text-body">
      <SectionButton
        targetId="main-content"
        className="sr-only focus:not-sr-only fixed left-3 top-3 z-50 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-md"
      >
        Lewati ke konten utama
      </SectionButton>

      {/* 1. Navbar */}
      <Navbar schoolName={settings.schoolName} />

      <main id="main-content" tabIndex={-1}>
        {/* 2. Hero Carousel Foto */}
        <HeroCarousel slides={heroSlides} />

        {/* 3. Welcome / Profil Umum Sekolah */}
        <Welcome />

        {/* 4. Statistik Sekolah */}
        <Stats items={DEFAULT_STATS} />

        {/* 5. Mosaik Galeri Foto Sekolah */}
        <div className="below-fold-section">
          <Mosaic slots={mosaicSlots} />
        </div>

        {/* 6. Berita & Kegiatan Sekolah */}
        <div className="below-fold-section">
          <News items={newsItems} />
        </div>

        {/* 7. Banner Kalender Akademik */}
        <CalendarBanner />

        {/* 8. Pengumuman Sekolah */}
        <div className="below-fold-section">
          <Announcements />
        </div>
      </main>

      {/* 9. Footer Sekolah */}
      <Footer
        schoolName={settings.schoolName}
        contactAddress={settings.contactAddress}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
      />
    </div>
  );
}
