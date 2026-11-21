import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Download } from "lucide-react";
import { ANNOUNCEMENTS_LIST, SITE_INFO } from "@/lib/content";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { LandingButton } from "@/components/landing/LandingButton";

interface PengumumanPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PengumumanPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = ANNOUNCEMENTS_LIST.find((a) => a.slug === slug);
  if (!item) {
    return { title: `Pengumuman Tidak Ditemukan | ${SITE_INFO.schoolName}` };
  }
  return {
    title: `${item.title} | ${SITE_INFO.schoolName}`,
    description: item.summary,
  };
}

export default async function PengumumanDetailPage({ params }: PengumumanPageProps) {
  const { slug } = await params;
  const item = ANNOUNCEMENTS_LIST.find((a) => a.slug === slug);
  if (!item) {
    notFound();
  }

  return (
    <div className="flex min-h-dvh w-full flex-col bg-surface-soft text-body">
      <Navbar />

      <main className="mx-auto w-full max-w-[960px] flex-1 px-5 py-12 md:px-8 lg:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Kembali ke Beranda</span>
        </Link>

        <article className="mt-6 rounded-[14px] bg-surface p-6 shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-light px-3.5 py-1 text-xs font-semibold text-brand">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{item.date}</span>
          </div>

          <h1 className="mt-4 text-[24px] font-bold leading-snug text-ink md:text-[32px]">
            {item.title}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            {item.summary}
          </p>

          <hr className="my-6 border-line" />

          <div className="whitespace-pre-line text-sm leading-[1.85] text-body md:text-base">
            {item.content}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
            <LandingButton
              variant="primary"
              href={`/api/pengumuman/${item.slug}`}
              download
              ariaLabel={`Unduh: ${item.title}`}
              className="gap-2"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Unduh Dokumen</span>
            </LandingButton>

            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center rounded-full border border-line px-6 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
            >
              Kembali
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
