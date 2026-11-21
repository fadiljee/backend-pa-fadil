import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, Search } from "lucide-react";
import { getPublishedBeritaList } from "@/lib/services/berita";
import { getGambarUrl } from "@/lib/storage";
import { FALLBACK_NEWS, FOOTER_CONTENT, SITE_INFO } from "@/lib/content";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { LandingButton } from "@/components/landing/LandingButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Berita & Kegiatan | ${SITE_INFO.schoolName}`,
  description: `Kumpulan berita, dokumentasi kegiatan, dan pengumuman terbaru ${SITE_INFO.schoolName}.`,
};

function formatIndoDate(dateStr: string): string {
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

interface BeritaListPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function BeritaListPage({ searchParams }: BeritaListPageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();

  const beritaRes = await getPublishedBeritaList(24);
  const allItems =
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

  const filtered = query
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.excerpt.toLowerCase().includes(query)
      )
    : allItems;

  return (
    <div className="flex min-h-dvh w-full flex-col bg-surface text-body">
      <Navbar />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-12 md:px-8 lg:px-12 lg:py-16">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Kembali ke Beranda</span>
            </Link>
            <h1 className="mt-3 text-[26px] font-bold leading-tight text-ink md:text-[32px] lg:text-[40px]">
              Berita &amp; Kegiatan
            </h1>
            <p className="mt-1 text-sm text-muted md:text-[15px]">
              Informasi kegiatan dan perkembangan belajar di {SITE_INFO.schoolName}.
            </p>
          </div>

          <form action="/berita" method="get" className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Cari berita atau kegiatan…"
              aria-label="Cari berita atau kegiatan"
              className="h-11 w-full rounded-full border border-line bg-surface-soft pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
            />
          </form>
        </div>

        {query && (
          <p className="mt-6 text-sm text-muted">
            Menampilkan {filtered.length} hasil untuk &ldquo;
            <span className="font-semibold text-ink">{q}</span>&rdquo;.{" "}
            <Link href="/berita" className="font-medium text-brand hover:underline">
              Tampilkan semua
            </Link>
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-[14px] border border-line bg-surface-soft px-6 py-14 text-center">
            <p className="text-base font-semibold text-ink">
              Tidak ada berita yang cocok dengan pencarian Anda.
            </p>
            <div className="mt-5">
              <LandingButton variant="primary" href="/berita">
                Lihat Semua Berita
              </LandingButton>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-[12px] bg-surface shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition duration-300 hover:shadow-[0_14px_32px_rgba(0,0,0,0.12)]"
              >
                <Link
                  href={item.href}
                  className="block aspect-[16/10] w-full overflow-hidden rounded-t-[12px] bg-gradient-to-br from-[#d9d9de] to-[#a9a9b3]"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      loading="lazy"
                      width={800}
                      height={500}
                      className="h-full w-full object-cover transition duration-400 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-white/75" aria-hidden="true" />
                    </div>
                  )}
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  <h2 className="line-clamp-3 text-[16px] font-semibold leading-snug text-ink md:text-[17px] lg:text-[18px]">
                    <Link href={item.href} className="transition-colors hover:text-brand">
                      {item.title}
                    </Link>
                  </h2>
                  <p className="mt-2.5 line-clamp-4 text-[13px] leading-[1.65] text-body">
                    {item.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <time dateTime={item.dateIso} className="text-xs text-muted lg:text-[13px]">
                      {item.dateLabel}
                    </time>
                    <LandingButton
                      variant="primary-sm"
                      href={item.href}
                      ariaLabel={`Baca: ${item.title}`}
                    >
                      Baca
                    </LandingButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer copyrightText={FOOTER_CONTENT.copyright} />
    </div>
  );
}
