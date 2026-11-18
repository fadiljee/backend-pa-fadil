import { getAdminSession } from "@/lib/auth/admin-session";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import { MateriRow } from "@/lib/supabase/types";
import { getGambarUrl } from "@/lib/storage";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Courses } from "@/components/landing/Courses";
import { About } from "@/components/landing/About";
import { Gallery } from "@/components/landing/Gallery";
import { Footer } from "@/components/landing/Footer";
import { FloatingBar } from "@/components/landing/FloatingBar";
import { Reveal } from "@/components/landing/Reveal";

export const dynamic = "force-dynamic";

interface LandingData {
  connected: boolean;
  siswaCount: number;
  materiCount: number;
  materiList: MateriRow[];
}

async function getLandingData(): Promise<LandingData> {
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
}

export default async function HomePage() {
  const [session, data] = await Promise.all([getAdminSession(), getLandingData()]);
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

      <Navbar isLoggedIn={isLoggedIn} />

      <main id="main-content" tabIndex={-1}>
        <Hero
          connected={data.connected}
          siswaCount={data.siswaCount}
          materiCount={data.materiCount}
          isLoggedIn={isLoggedIn}
        />

        <Reveal>
          <Courses
            materiList={courseItems}
            connected={data.connected}
            isLoggedIn={isLoggedIn}
          />
        </Reveal>

        <Reveal>
          <About siswaCount={data.siswaCount} connected={data.connected} />
        </Reveal>

        <Reveal>
          <Gallery items={galleryItems} />
        </Reveal>
      </main>

      <Footer isLoggedIn={isLoggedIn} />
      <FloatingBar isLoggedIn={isLoggedIn} />
    </div>
  );
}
