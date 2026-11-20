import { unstable_cache } from "next/cache";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import { MateriRow } from "@/lib/supabase/types";
import { getGambarUrl } from "@/lib/storage";
import { getLandingSettings } from "@/lib/services/landing-settings";
import { getPublishedBeritaList } from "@/lib/services/berita";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { Courses } from "@/components/landing/Courses";
import { HighlightsBand } from "@/components/landing/HighlightsBand";
import { Gallery } from "@/components/landing/Gallery";
import { NewsSection } from "@/components/landing/NewsSection";
import { LocationMap } from "@/components/landing/LocationMap";
import { Footer } from "@/components/landing/Footer";
import { FloatingBar } from "@/components/landing/FloatingBar";
import { SectionButton } from "@/components/landing/SectionLink";

export const dynamic = "force-dynamic";

interface LandingData {
  connected: boolean;
  siswaCount: number;
  materiCount: number;
  materiList: MateriRow[];
}

const getLandingData = unstable_cache(
  async (): Promise<LandingData> => {
    if (!isSupabaseConfigured()) {
      return {
        connected: false,
        siswaCount: 0,
        materiCount: 0,
        materiList: [],
      };
    }

    try {
      const supabase = getSupabaseAdmin();
      const [siswaRes, materiRes, materiListRes] = await Promise.all([
        supabase.from("data_siswa").select("*", { count: "exact", head: true }),
        supabase.from("materis").select("*", { count: "exact", head: true }),
        supabase.from("materis").select("*").order("id", { ascending: true }).limit(9),
      ]);

      return {
        connected: true,
        siswaCount: siswaRes.count ?? 0,
        materiCount: materiRes.count ?? 0,
        materiList: (materiListRes.data ?? []) as MateriRow[],
      };
    } catch {
      return {
        connected: false,
        siswaCount: 0,
        materiCount: 0,
        materiList: [],
      };
    }
  },
  ["landing-data"],
  { revalidate: 60, tags: ["landing-data"] }
);

export default async function HomePage() {
  const [data, { settings }, beritaRes] = await Promise.all([
    getLandingData(),
    getLandingSettings(),
    getPublishedBeritaList(4),
  ]);

  const newsItems = beritaRes.items.map((b) => ({
    id: b.id,
    judul: b.judul,
    ringkasan: b.ringkasan,
    konten: b.konten,
    kategori: b.kategori,
    tanggal_kegiatan: b.tanggal_kegiatan,
    gambarUrl: getGambarUrl(b.gambar),
  }));

  const courseItems = data.materiList.map((m) => ({
    id: m.id,
    judul: m.judul,
    konten: m.konten,
    gambarUrl: getGambarUrl(m.gambar),
  }));

  const newsGalleryItems = newsItems
    .filter((item): item is typeof item & { gambarUrl: string } => Boolean(item.gambarUrl))
    .map((item) => ({
      id: 100000 + item.id,
      judul: item.judul,
      url: item.gambarUrl,
    }));

  const materiGalleryItems = courseItems
    .filter((item): item is typeof item & { gambarUrl: string } => Boolean(item.gambarUrl))
    .map((item) => ({
      id: item.id,
      judul: item.judul,
      url: item.gambarUrl,
    }));

  const galleryItems = [...newsGalleryItems, ...materiGalleryItems].slice(0, 8);
  const featuredPhotoUrl = galleryItems[0]?.url ?? null;

  return (
    <div className="min-h-dvh w-full bg-white text-body">
      <SectionButton
        targetId="main-content"
        className="sr-only focus:not-sr-only fixed left-3 top-3 z-50 rounded-md bg-crimson px-4 py-2 text-sm font-semibold text-white shadow-md"
      >
        Lewati ke konten utama
      </SectionButton>

      <Navbar
        schoolName={settings.schoolName}
        schoolSubtitle={settings.schoolSubtitle}
        contactAddress={settings.contactAddress}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
      />

      <main id="main-content" tabIndex={-1}>
        <Hero
          schoolName={settings.schoolName}
          title={settings.heroTitle}
          description={settings.heroDescription}
          primaryCta={settings.heroPrimaryCta}
          secondaryCta={settings.heroSecondaryCta}
          highlights={settings.aboutHighlights}
          heroPhotoUrl={featuredPhotoUrl}
        />

        <div className="below-fold-section">
          <About
            siswaCount={data.siswaCount}
            materiCount={data.materiCount}
            beritaCount={newsItems.length}
            connected={data.connected}
            eyebrow={settings.aboutEyebrow}
            title={settings.aboutTitle}
            paragraph1={settings.aboutParagraph1}
            paragraph2={settings.aboutParagraph2}
            showStudentCount={settings.aboutShowStudentCount}
            featuredPhotoUrl={featuredPhotoUrl}
            schoolName={settings.schoolName}
          />
        </div>

        <div className="below-fold-section">
          <Courses
            materiList={courseItems}
            connected={data.connected}
            eyebrow={settings.coursesEyebrow}
            title={settings.coursesTitle}
          />
        </div>

        <div className="below-fold-section">
          <HighlightsBand />
        </div>

        <div className="below-fold-section">
          <Gallery
            items={galleryItems}
            eyebrow={settings.galleryEyebrow}
            title={settings.galleryTitle}
            tagline={settings.galleryTagline}
          />
        </div>

        <div className="below-fold-section">
          <NewsSection
            items={newsItems}
            schoolName={settings.schoolName}
            contactAddress={settings.contactAddress}
            schoolVision={settings.schoolVision}
            schoolMissions={settings.schoolMissions}
          />
        </div>

        <div className="below-fold-section">
          <LocationMap
            schoolName={settings.schoolName}
            contactAddress={settings.contactAddress}
          />
        </div>
      </main>

      <div className="below-fold-section">
        <Footer
          schoolName={settings.schoolName}
          schoolSubtitle={settings.schoolSubtitle}
          description={settings.footerDescription}
          contactAddress={settings.contactAddress}
          contactEmail={settings.contactEmail}
          contactPhone={settings.contactPhone}
          copyrightText={settings.copyrightText}
        />
      </div>
      <FloatingBar />
    </div>
  );
}
