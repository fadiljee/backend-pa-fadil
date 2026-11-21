import Link from "next/link";
import { ArrowLeft, Newspaper } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function BeritaNotFound() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-surface text-body">
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center px-5 py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-light text-brand">
          <Newspaper className="h-8 w-8" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-[26px] font-bold text-ink md:text-[32px]">
          Berita Tidak Ditemukan
        </h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-body md:text-base">
          Maaf, berita atau kegiatan yang Anda cari tidak tersedia atau sudah tidak dipublikasikan.
        </p>
        <Link
          href="/berita"
          className="mt-7 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Kembali ke Berita &amp; Kegiatan</span>
        </Link>
      </main>
      <Footer />
    </div>
  );
}
