import { unstable_cache } from "next/cache";
import { getAdminSession } from "@/lib/auth/admin-session";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import { MateriRow } from "@/lib/supabase/types";
import { getGambarUrl } from "@/lib/storage";
import { getLandingSettings } from "@/lib/services/landing-settings";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Courses } from "@/components/landing/Courses";
import { About } from "@/components/landing/About";
import { Gallery } from "@/components/landing/Gallery";
import { Footer } from "@/components/landing/Footer";
import { FloatingBar } from "@/components/landing/FloatingBar";

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
  const [session, data, { settings }] = await Promise.all([
    getAdminSession(),
    getLandingData(),
    getLandingSettings(),
  ]);
  const isLoggedIn = Boolean(session.isLoggedIn);

  const courseItems = data.materiList.map((m) => ({
    id: m.id,
    judul: m.judul,
    konten: m.konten,
  }));

  const galleryItems = data.materiList
    .map((m) => ({ id: m.id, judul: m.judul, url: getGambarUrl(m.gambar) }))
    .filter((item): item is { id: number; judul: string; url: string } => Boolean(item.url));

  return (
    <div className="min-h-screen bg-white text-body">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed left-3 top-3 z-50 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md"
      >
        Lewati ke konten utama
      </a>

      <Navbar
        isLoggedIn={isLoggedIn}
        schoolName={settings.schoolName}
        schoolSubtitle={settings.schoolSubtitle}
      />

      <main id="main-content" tabIndex={-1}>
        <Hero
          connected={data.connected}
          siswaCount={data.siswaCount}
          materiCount={data.materiCount}
          isLoggedIn={isLoggedIn}
          title={settings.heroTitle}
          description={settings.heroDescription}
          primaryCta={settings.heroPrimaryCta}
          secondaryCta={settings.heroSecondaryCta}
          showStats={settings.showStats}
        />

        <Courses
          materiList={courseItems}
          connected={data.connected}
          isLoggedIn={isLoggedIn}
          eyebrow={settings.coursesEyebrow}
          title={settings.coursesTitle}
        />

        <div className="below-fold-section">
          <About
            siswaCount={data.siswaCount}
            connected={data.connected}
            eyebrow={settings.aboutEyebrow}
            title={settings.aboutTitle}
            paragraph1={settings.aboutParagraph1}
            paragraph2={settings.aboutParagraph2}
            showStudentCount={settings.aboutShowStudentCount}
            highlights={settings.aboutHighlights}
          />
        </div>

        <div className="below-fold-section">
          <Gallery
            items={galleryItems}
            eyebrow={settings.galleryEyebrow}
            title={settings.galleryTitle}
            tagline={settings.galleryTagline}
          />
        </div>
      </main>

      <div className="below-fold-section">
        <Footer
          isLoggedIn={isLoggedIn}
          schoolName={settings.schoolName}
          schoolSubtitle={settings.schoolSubtitle}
          description={settings.footerDescription}
          contactAddress={settings.contactAddress}
          contactEmail={settings.contactEmail}
          contactPhone={settings.contactPhone}
          copyrightText={settings.copyrightText}
        />
      </div>
      <FloatingBar isLoggedIn={isLoggedIn} />
    </div>
  );
}
