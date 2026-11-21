import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, ChevronRight, Image as ImageIcon } from "lucide-react";
import { getPublishedBeritaById, getPublishedBeritaList } from "@/lib/services/berita";
import { getLandingSettings } from "@/lib/services/landing-settings";
import { getGambarUrl } from "@/lib/storage";
import { FALLBACK_NEWS, SITE_INFO } from "@/lib/content";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { LandingButton } from "@/components/landing/LandingButton";

export const revalidate = 60;

function formatFullDate(dateStr: string): string {
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

interface ResolvedArticle {
  id: string | number;
  judul: string;
  kategori: string;
  ringkasan: string;
  konten: string;
  tanggalIso: string;
  tanggalLabel: string;
  gambarUrl: string | null;
}

async function resolveArticle(rawId: string): Promise<ResolvedArticle | null> {
  const numericId = Number(rawId);
  if (Number.isInteger(numericId) && numericId > 0) {
    const row = await getPublishedBeritaById(numericId);
    if (!row) return null;
    return {
      id: row.id,
      judul: row.judul,
      kategori: row.kategori,
      ringkasan: row.ringkasan,
      konten: row.konten,
      tanggalIso: row.tanggal_kegiatan,
      tanggalLabel: formatFullDate(row.tanggal_kegiatan),
      gambarUrl: getGambarUrl(row.gambar),
    };
  }

  const fallback = FALLBACK_NEWS.find((item) => String(item.id) === rawId);
  if (!fallback) return null;
  return {
    id: fallback.id,
    judul: fallback.title,
    kategori: fallback.category ?? "Kegiatan",
    ringkasan: fallback.excerpt,
    konten: fallback.content ?? fallback.excerpt,
    tanggalIso: fallback.dateIso,
    tanggalLabel: fallback.dateLabel,
    gambarUrl: fallback.imageUrl,
  };
}

interface BeritaDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BeritaDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const [article, { settings }] = await Promise.all([
    resolveArticle(id),
    getLandingSettings(),
  ]);

  const schoolName = settings.schoolName || SITE_INFO.schoolName;
  if (!article) {
    return {
      title: `Berita Tidak Ditemukan | ${schoolName}`,
    };
  }

  return {
    title: `${article.judul} | ${schoolName}`,
    description: article.ringkasan,
  };
}

export default async function BeritaDetailPage({ params }: BeritaDetailPageProps) {
  const { id } = await params;

  const [article, { settings }, recentBeritaRes] = await Promise.all([
    resolveArticle(id),
    getLandingSettings(),
    getPublishedBeritaList(4),
  ]);

  if (!article) {
    notFound();
  }

  const otherBerita =
    recentBeritaRes.items.length > 0
      ? recentBeritaRes.items
          .filter((item) => String(item.id) !== String(article.id))
          .slice(0, 3)
          .map((item) => ({
            id: item.id,
            href: `/berita/${item.id}`,
            title: item.judul,
            excerpt: item.ringkasan,
            dateIso: item.tanggal_kegiatan,
            dateLabel: formatFullDate(item.tanggal_kegiatan),
            imageUrl: getGambarUrl(item.gambar),
          }))
      : FALLBACK_NEWS.filter((item) => String(item.id) !== String(article.id)).slice(
          0,
          3
        );

  return (
    <div className="flex min-h-dvh w-full flex-col bg-surface text-body">
      {/* Consistent Site Navbar */}
      <Navbar schoolName={settings.schoolName} />

      {/* Full-Page Article */}
      <main id="main-content" tabIndex={-1} className="w-full flex-1">
        <article className="w-full">
          {/* Full-Bleed Article Header Band */}
          <header className="w-full border-b border-line bg-surface-soft py-10 sm:py-14 lg:py-16">
            <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
              {/* Breadcrumb */}
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-muted sm:text-[13px]"
              >
                <Link href="/" className="transition-colors hover:text-brand hover:underline">
                  Beranda
                </Link>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted/70" aria-hidden="true" />
                <Link
                  href="/berita"
                  className="transition-colors hover:text-brand hover:underline"
                >
                  Berita &amp; Kegiatan
                </Link>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted/70" aria-hidden="true" />
                <span className="line-clamp-1 font-medium text-ink">{article.judul}</span>
              </nav>

              {/* Category + Date */}
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium sm:text-sm">
                <span className="inline-flex items-center rounded-full bg-brand px-3.5 py-1 text-xs font-semibold text-white">
                  {article.kategori}
                </span>
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <Calendar className="h-4 w-4 text-brand" aria-hidden="true" />
                  <time dateTime={article.tanggalIso}>{article.tanggalLabel}</time>
                </span>
              </div>

              {/* Full-Width Headline */}
              <h1 className="mt-4 max-w-4xl text-[26px] font-bold leading-[1.2] tracking-tight text-ink sm:text-[34px] lg:text-[44px] lg:leading-[1.15]">
                {article.judul}
              </h1>

              {/* Lead Summary */}
              {article.ringkasan && (
                <p className="mt-4 max-w-3xl text-base leading-[1.75] text-body sm:text-lg">
                  {article.ringkasan}
                </p>
              )}
            </div>
          </header>

          {/* Full-Bleed Featured Photo */}
          {article.gambarUrl && (
            <div className="w-full bg-surface">
              <div className="mx-auto w-full max-w-[1200px] px-5 pt-8 md:px-8 lg:px-12 lg:pt-10">
                <figure className="overflow-hidden rounded-[14px] bg-gradient-to-br from-[#d9d9de] to-[#a9a9b3] shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
                  <div className="aspect-[16/9] max-h-[560px] w-full overflow-hidden">
                    <img
                      src={article.gambarUrl}
                      alt={`Dokumentasi ${article.judul}`}
                      fetchPriority="high"
                      width={1200}
                      height={675}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </figure>
              </div>
            </div>
          )}

          {/* Full-Page Unboxed Editorial Body */}
          <div className="w-full bg-surface py-10 sm:py-14 lg:py-16">
            <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
              <div className="max-w-[78ch] whitespace-pre-line text-[15px] leading-[1.9] text-body sm:text-base lg:text-[17px]">
                {article.konten}
              </div>

              {/* Bottom Navigation */}
              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
                <LandingButton variant="primary" href="/berita" className="gap-2">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Semua Berita &amp; Kegiatan</span>
                </LandingButton>

                <Link
                  href="/"
                  className="inline-flex min-h-[44px] items-center text-sm font-semibold text-brand hover:underline"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Full-Width Related News Band */}
        {otherBerita.length > 0 && (
          <section
            aria-labelledby="berita-lainnya-heading"
            className="w-full border-t border-line bg-surface-soft py-14 sm:py-16 lg:py-20"
          >
            <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2
                  id="berita-lainnya-heading"
                  className="text-[22px] font-bold text-ink sm:text-[26px] lg:text-[32px]"
                >
                  Berita &amp; Kegiatan Lainnya
                </h2>
                <Link
                  href="/berita"
                  className="text-sm font-semibold text-brand hover:underline"
                >
                  Lihat Semua
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {otherBerita.map((item) => (
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
                          <ImageIcon
                            className="h-10 w-10 text-white/75"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </Link>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="line-clamp-3 text-[16px] font-semibold leading-snug text-ink md:text-[17px]">
                        <Link
                          href={item.href}
                          className="transition-colors hover:text-brand"
                        >
                          {item.title}
                        </Link>
                      </h3>
                      <p className="mt-2 line-clamp-3 text-[13px] leading-[1.65] text-body">
                        {item.excerpt}
                      </p>
                      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                        <time
                          dateTime={item.dateIso}
                          className="text-xs text-muted lg:text-[13px]"
                        >
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
            </div>
          </section>
        )}
      </main>

      {/* Consistent Site Footer */}
      <Footer
        schoolName={settings.schoolName}
        contactAddress={settings.contactAddress}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
      />
    </div>
  );
}
