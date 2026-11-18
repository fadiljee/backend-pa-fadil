import type { Metadata } from "next";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth/admin-session";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/landing/SiteHeader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SMPN 1 Merawang | Media Pembelajaran Matematika Ayo Berhitung",
  description:
    "Informasi sekolah SMPN 1 Merawang dan statistik penggunaan aplikasi pembelajaran matematika Ayo Berhitung.",
};

interface LandingStats {
  connected: boolean;
  siswaCount: number;
  materiCount: number;
  kuisCount: number;
}

async function getLandingStats(): Promise<LandingStats> {
  if (!isSupabaseConfigured()) {
    return { connected: false, siswaCount: 0, materiCount: 0, kuisCount: 0 };
  }

  try {
    const supabase = getSupabaseAdmin();
    const [siswaRes, materiRes, kuisRes] = await Promise.all([
      supabase.from("data_siswa").select("*", { count: "exact", head: true }),
      supabase.from("materis").select("*", { count: "exact", head: true }),
      supabase.from("kuis").select("*", { count: "exact", head: true }),
    ]);

    return {
      connected: true,
      siswaCount: siswaRes.count ?? 0,
      materiCount: materiRes.count ?? 0,
      kuisCount: kuisRes.count ?? 0,
    };
  } catch {
    return { connected: false, siswaCount: 0, materiCount: 0, kuisCount: 0 };
  }
}

const learningSteps = [
  {
    number: "01",
    title: "Masuk dengan NISN 10 digit",
    description:
      "Siswa membuka aplikasi Ayo Berhitung dan masuk menggunakan Nomor Induk Siswa Nasional yang terdaftar di sekolah.",
  },
  {
    number: "02",
    title: "Pelajari materi secara bertahap",
    description:
      "Materi pertama langsung terbuka. Materi berikutnya terbuka otomatis setelah siswa mencapai skor minimum 70% pada kuis materi sebelumnya.",
  },
  {
    number: "03",
    title: "Kerjakan kuis dan baca pembahasan",
    description:
      "Setiap materi dilengkapi soal pilihan ganda A sampai D beserta pembahasan untuk membantu siswa memahami langkah penyelesaian.",
  },
  {
    number: "04",
    title: "Kumpulkan poin dan gelar belajar",
    description:
      "Skor dari kuis terakumulasi hingga batas 100 poin dan tercatat pada peringkat serta gelar pencapaian siswa.",
  },
];

export default async function HomePage() {
  const [session, stats] = await Promise.all([getAdminSession(), getLandingStats()]);
  const isLoggedIn = Boolean(session.isLoggedIn);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-900">
      <a
        href="#main-content"
        className="visually-hidden fixed left-3 top-3 z-50 rounded-lg bg-indigo-800 px-4 py-2 text-sm font-semibold text-white shadow-md"
      >
        Lewati ke konten utama
      </a>

      <SiteHeader isLoggedIn={isLoggedIn} />

      <main id="main-content" tabIndex={-1}>
        <section
          id="statistik"
          className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16"
        >
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <h1 className="text-[clamp(1.875rem,3.6vw,3rem)] font-bold leading-tight tracking-tight text-slate-900">
                Media Pembelajaran Matematika SMPN 1 Merawang
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Ayo Berhitung adalah aplikasi pembelajaran matematika untuk siswa SMPN 1 Merawang.
                Guru mengelola materi dan bank soal melalui panel admin, sementara siswa belajar
                secara bertahap melalui perangkat seluler.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href={isLoggedIn ? "/admin" : "/login"}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-900"
                >
                  {isLoggedIn ? "Buka Panel Admin" : "Masuk Panel Admin"}
                </Link>
                <a
                  href="#tentang-sekolah"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  Lihat Informasi Sekolah
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl border border-slate-200 border-t-4 border-t-amber-700 bg-white p-6 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                  Data Terdaftar di Sistem
                </div>
                <div className="mt-3">
                  {stats.connected ? (
                    <div className="text-4xl font-bold tabular-nums text-slate-900 sm:text-5xl">
                      {stats.siswaCount.toLocaleString("id-ID")}
                    </div>
                  ) : (
                    <div className="text-lg font-semibold text-slate-700">
                      [REAL DATA: Database belum terhubung]
                    </div>
                  )}
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    Siswa menggunakan aplikasi Ayo Berhitung
                  </p>
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-200 pt-5">
                  <div>
                    <dt className="text-xs font-medium text-slate-600">Materi Tersedia</dt>
                    <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
                      {stats.connected ? stats.materiCount.toLocaleString("id-ID") : "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-600">Bank Soal Kuis</dt>
                    <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
                      {stats.connected ? stats.kuisCount.toLocaleString("id-ID") : "-"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section
          id="tentang-sekolah"
          className="border-y border-slate-200 bg-white py-12 md:py-16"
        >
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Tentang SMPN 1 Merawang
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                SMPN 1 Merawang menyelenggarakan pembelajaran matematika berbasis aplikasi untuk
                membantu siswa berlatih secara mandiri di luar jam kelas dan memudahkan guru
                memantau perkembangan hasil kuis per siswa maupun per kelas.
              </p>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Seluruh akun siswa didaftarkan oleh pihak sekolah menggunakan NISN resmi agar data
                nilai, riwayat pengerjaan soal, dan peringkat kelas tetap akurat.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-xl border border-slate-200 bg-[#faf9f6] p-5 sm:p-6">
                <h3 className="text-base font-bold text-slate-900">Identitas Sekolah</h3>
                <dl className="mt-4 divide-y divide-slate-200 text-sm">
                  <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-slate-600">Nama Sekolah</dt>
                    <dd className="font-semibold text-slate-900 sm:col-span-2">SMPN 1 Merawang</dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-slate-600">Wilayah</dt>
                    <dd className="text-slate-900 sm:col-span-2">Kecamatan Merawang</dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-slate-600">Program</dt>
                    <dd className="text-slate-900 sm:col-span-2">
                      Media Pembelajaran Matematika (Ayo Berhitung)
                    </dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-slate-600">NPSN</dt>
                    <dd className="text-slate-700 sm:col-span-2">[REAL DATA: NPSN Sekolah]</dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-slate-600">Alamat</dt>
                    <dd className="text-slate-700 sm:col-span-2">
                      [REAL DATA: Alamat Lengkap Sekolah]
                    </dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-slate-600">Kontak Resmi</dt>
                    <dd className="text-slate-700 sm:col-span-2">
                      [REAL DATA: Email / Telepon Sekolah]
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section id="cara-belajar" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Alur Pembelajaran di Aplikasi
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Tahapan belajar yang dilalui siswa di aplikasi Ayo Berhitung.
            </p>
          </div>

          <ol className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {learningSteps.map((step) => (
              <li
                key={step.number}
                className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-800">
                  {step.number}
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:px-6">
          <div>
            <span className="font-semibold text-slate-900">SMPN 1 Merawang</span>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            <span>Media Pembelajaran Matematika Ayo Berhitung</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#tentang-sekolah" className="hover:text-slate-900 hover:underline">
              Tentang Sekolah
            </a>
            <a href="#statistik" className="hover:text-slate-900 hover:underline">
              Statistik
            </a>
            <Link href={isLoggedIn ? "/admin" : "/login"} className="font-medium text-indigo-800 hover:underline">
              {isLoggedIn ? "Panel Admin" : "Masuk Admin"}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
