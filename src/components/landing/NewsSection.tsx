"use client";

import { useCallback, useRef, useState } from "react";
import {
  ArrowRight,
  Calendar,
  CalendarDays,
  Compass,
  ExternalLink,
  Landmark,
  MapPin,
  Megaphone,
  Newspaper,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionButton } from "./SectionLink";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/SMPN+1+Merawang/@-2.0020068,106.1038266,1149m/data=!3m2!1e3!4b1!4m6!3m5!1s0x2e22eb9f20cfa045:0x3410ab429cfeea9d!8m2!3d-2.0020068!4d106.1064015!16s%2Fg%2F11c1p15kp5?entry=ttu&g_ep=EgoyMDI2MTExNy4wIKXMDSoASAFQAw%3D%3D";

export interface NewsCardItem {
  id: number;
  judul: string;
  ringkasan: string;
  konten: string;
  kategori: string;
  tanggal_kegiatan: string;
  gambarUrl: string | null;
}

function getDateParts(dateStr: string): { day: string; month: string; full: string } {
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return { day: "--", month: "---", full: dateStr };
  }
  const day = new Intl.DateTimeFormat("id-ID", { day: "2-digit" }).format(parsed);
  const month = new Intl.DateTimeFormat("id-ID", { month: "short" })
    .format(parsed)
    .toUpperCase();
  const full = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
  return { day, month, full };
}

export function NewsSection({
  items,
  schoolName,
  contactAddress,
  schoolVision,
  schoolMissions,
}: {
  items: NewsCardItem[];
  schoolName: string;
  contactAddress: string;
  schoolVision: string;
  schoolMissions: string[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedNews, setSelectedNews] = useState<NewsCardItem | null>(null);

  const openArticle = useCallback((item: NewsCardItem) => {
    setSelectedNews(item);
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  const closeArticle = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog && dialog.open) {
      dialog.close();
    }
  }, []);

  return (
    <section
      id="berita"
      tabIndex={-1}
      className="scroll-mt-20 w-full bg-ivory py-14 sm:py-20"
    >
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 md:px-10 lg:px-14">
        {/* 3-Card Bottom Row matching reference: Visi & Misi | Berita & Pengumuman | Kunjungi Sekolah */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* Card 1 (Left, 4 cols): Visi & Misi Sekolah */}
          <Card
            id="visi-misi"
            className="scroll-mt-24 flex flex-col justify-between gap-0 rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs ring-0 lg:col-span-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h2 className="font-heading text-sm font-extrabold uppercase tracking-wider text-crimson">
                  Visi &amp; Misi Sekolah
                </h2>
                <Compass className="h-5 w-5 text-crimson/70" aria-hidden="true" />
              </div>

              <div className="mt-4 rounded-lg border-l-4 border-crimson bg-ivory p-3.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-crimson">
                  Visi
                </p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-ink">
                  {schoolVision}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Misi Utama
                </p>
                <ol className="mt-2.5 space-y-2.5">
                  {schoolMissions.map((mission, idx) => (
                    <li
                      key={`${idx}-${mission.slice(0, 14)}`}
                      className="flex items-start gap-2.5 text-xs leading-relaxed text-body"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-crimson-light text-[11px] font-bold text-crimson">
                        {idx + 1}
                      </span>
                      <span>{mission}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Card>

          {/* Card 2 (Center, 5 cols): Berita & Pengumuman Terbaru (matches LATEST ANNOUNCEMENTS) */}
          <Card className="relative flex flex-col justify-between gap-0 overflow-hidden rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs ring-0 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h2 className="font-heading text-sm font-extrabold uppercase tracking-wider text-crimson">
                  Berita &amp; Kegiatan Terbaru
                </h2>
                <Megaphone className="h-5 w-5 text-crimson/70" aria-hidden="true" />
              </div>

              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-crimson-light text-crimson">
                    <Newspaper className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-3 text-sm font-bold text-ink">
                    Belum ada berita kegiatan yang dipublikasikan.
                  </p>
                  <p className="mt-1 max-w-xs text-xs leading-relaxed text-body">
                    Pengumuman dan dokumentasi kegiatan sekolah akan tampil di sini setelah
                    diterbitkan.
                  </p>
                </div>
              ) : (
                <ul className="mt-4 divide-y divide-slate-100">
                  {items.map((item) => {
                    const date = getDateParts(item.tanggal_kegiatan);
                    return (
                      <li
                        key={item.id}
                        className="flex items-start gap-3.5 py-3.5 first:pt-0 last:pb-0"
                      >
                        {/* Calendar Date Badge matching reference MAY 20 */}
                        <div className="flex w-13 shrink-0 flex-col overflow-hidden rounded-md border border-slate-200 text-center">
                          <span className="bg-crimson py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                            {date.month}
                          </span>
                          <span className="bg-white py-1 font-heading text-base font-extrabold leading-none text-ink">
                            {date.day}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="h-5 rounded bg-crimson-light px-1.5 text-[10px] font-bold uppercase text-crimson"
                            >
                              {item.kategori}
                            </Badge>
                          </div>
                          <h3 className="mt-1 line-clamp-2 font-heading text-sm font-bold leading-snug text-ink">
                            {item.judul}
                          </h3>
                          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-body">
                            {item.ringkasan}
                          </p>
                          <button
                            type="button"
                            onClick={() => openArticle(item)}
                            className="mt-1 inline-flex min-h-9 items-center gap-1 text-xs font-bold text-crimson hover:underline"
                          >
                            <span>Baca Selengkapnya</span>
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>

                        {item.gambarUrl && (
                          <img
                            src={item.gambarUrl}
                            alt={`Dokumentasi ${item.judul}`}
                            loading="lazy"
                            width={80}
                            height={64}
                            className="hidden h-16 w-20 shrink-0 rounded-lg border border-slate-200 object-cover sm:block"
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </Card>

          {/* Card 3 (Right, 3 cols): Solid Crimson Kunjungi Sekolah (matches SCHEDULE A CAMPUS TOUR) */}
          <Card className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-xl border-0 bg-crimson p-6 text-white shadow-md ring-0 lg:col-span-3">
            <Landmark
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-5 -right-5 h-36 w-36 text-white/10"
            />

            <div className="relative z-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-light">
                Kunjungan Sekolah
              </p>
              <h2 className="mt-1.5 font-heading text-xl font-extrabold uppercase leading-snug text-white">
                Kunjungi {schoolName}
              </h2>
              <p className="mt-2.5 text-xs leading-relaxed text-white/90">
                Kenali langsung lingkungan belajar dan suasana akademik di {schoolName}.
              </p>

              {contactAddress && (
                <p className="mt-4 flex items-start gap-2 rounded-lg bg-crimson-dark/60 p-3 text-xs leading-relaxed text-white/95">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" aria-hidden="true" />
                  <span className="break-words">{contactAddress}</span>
                </p>
              )}
            </div>

            <div className="relative z-10 flex flex-col gap-2.5">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-white px-4 text-xs font-bold uppercase tracking-wider text-crimson shadow-xs transition hover:bg-gold-light"
              >
                <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Buka Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </a>
              <SectionButton
                targetId="lokasi"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-white/40 bg-transparent px-4 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/10"
              >
                Lihat Peta di Bawah
              </SectionButton>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal baca berita lengkap berbasis native <dialog> */}
      <dialog
        ref={dialogRef}
        aria-labelledby="news-detail-title"
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            closeArticle();
          }
        }}
        className="m-auto w-[min(92dvw,44rem)] rounded-2xl border border-slate-200 bg-white p-0 text-left text-body shadow-2xl"
      >
        {selectedNews && (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
                  <Badge
                    variant="secondary"
                    className="rounded bg-crimson-light px-2 py-0.5 font-bold text-crimson"
                  >
                    {selectedNews.kategori}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-muted">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    <time dateTime={selectedNews.tanggal_kegiatan}>
                      {getDateParts(selectedNews.tanggal_kegiatan).full}
                    </time>
                  </span>
                </div>
                <h3
                  id="news-detail-title"
                  className="mt-2 font-heading text-lg font-bold leading-snug text-ink sm:text-xl"
                >
                  {selectedNews.judul}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeArticle}
                aria-label="Tutup berita"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink transition hover:bg-crimson-light hover:text-crimson"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="max-h-[68dvh] overflow-y-auto px-6 py-5">
              {selectedNews.gambarUrl && (
                <div className="mb-5 aspect-[16/9] w-full overflow-hidden rounded-xl bg-ivory">
                  <img
                    src={selectedNews.gambarUrl}
                    alt={`Dokumentasi ${selectedNews.judul}`}
                    width={800}
                    height={450}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="whitespace-pre-line text-[15px] leading-[1.8] text-body">
                {selectedNews.konten}
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 px-6 py-3.5">
              <Button
                type="button"
                onClick={closeArticle}
                className="min-h-11 rounded-md bg-crimson px-5 text-xs font-bold uppercase tracking-wide text-white hover:bg-crimson-dark"
              >
                Tutup
              </Button>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
