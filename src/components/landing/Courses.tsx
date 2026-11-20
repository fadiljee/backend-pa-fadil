"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  ChevronLeft,
  ChevronRight,
  PencilRuler,
  Presentation,
  Shapes,
  Sigma,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface CourseItem {
  id: number;
  judul: string;
  konten: string;
  gambarUrl: string | null;
}

const cardIcons = [Calculator, Shapes, Sigma, PencilRuler, BookOpen, Presentation];

export function Courses({
  materiList,
  connected,
  eyebrow,
  title,
}: {
  materiList: CourseItem[];
  connected: boolean;
  eyebrow: string;
  title: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedMateri, setSelectedMateri] = useState<CourseItem | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const lastAnnouncedRef = useRef(0);
  const hasInteractedRef = useRef(false);

  const openDetail = useCallback((item: CourseItem) => {
    setSelectedMateri(item);
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  const closeDetail = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog && dialog.open) {
      dialog.close();
    }
  }, []);

  const getNearestSlideIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return 0;

    const trackRect = track.getBoundingClientRect();
    let bestIdx = 0;
    let bestDist = Infinity;

    for (let i = 0; i < track.children.length; i++) {
      const child = track.children[i] as HTMLElement;
      const dist = Math.abs(child.getBoundingClientRect().left - trackRect.left);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }

    return bestIdx;
  }, []);

  const scrollToSlide = useCallback(
    (targetIdx: number) => {
      const track = trackRef.current;
      if (!track || materiList.length === 0) return;

      const wrapped =
        ((targetIdx % materiList.length) + materiList.length) % materiList.length;
      const slide = track.children[wrapped] as HTMLElement | undefined;
      if (!slide) return;

      hasInteractedRef.current = true;
      setActiveIndex(wrapped);

      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      track.scrollTo({
        left: slide.offsetLeft - track.offsetLeft,
        behavior: prefersReduced ? "instant" : "smooth",
      });
    },
    [materiList.length]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track || materiList.length === 0) return;

    let rafId = 0;
    let settleTimer: ReturnType<typeof setTimeout> | null = null;

    const onSettle = () => {
      const idx = getNearestSlideIndex();
      setActiveIndex(idx);
      if (hasInteractedRef.current && idx !== lastAnnouncedRef.current) {
        lastAnnouncedRef.current = idx;
        setStatusMessage(
          `Materi ${idx + 1} dari ${materiList.length}: ${materiList[idx]?.judul ?? ""}`
        );
      }
    };

    const onScroll = () => {
      hasInteractedRef.current = true;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          setActiveIndex(getNearestSlideIndex());
        });
      }

      if (!("onscrollend" in window)) {
        if (settleTimer) clearTimeout(settleTimer);
        settleTimer = setTimeout(onSettle, 140);
      }
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    if ("onscrollend" in window) {
      track.addEventListener("scrollend", onSettle);
    }

    return () => {
      track.removeEventListener("scroll", onScroll);
      if ("onscrollend" in window) {
        track.removeEventListener("scrollend", onSettle);
      }
      if (rafId) cancelAnimationFrame(rafId);
      if (settleTimer) clearTimeout(settleTimer);
    };
  }, [getNearestSlideIndex, materiList]);

  return (
    <section
      id="materi"
      tabIndex={-1}
      aria-roledescription="carousel"
      aria-label="Program dan materi pembelajaran"
      className="scroll-mt-20 w-full bg-ivory py-14 sm:py-20"
    >
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 md:px-10 lg:px-14">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-crimson">
            {eyebrow}
          </p>
          <h2 className="mt-1.5 text-[clamp(1.5rem,1.15rem+1.3vw,2.2rem)] font-bold leading-snug text-ink">
            {title}
          </h2>
        </div>

        {materiList.length === 0 ? (
          <Card className="mx-auto mt-10 max-w-2xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xs ring-0">
            <p className="text-sm font-semibold text-ink">
              {connected
                ? "Belum ada materi pembelajaran yang tersedia saat ini."
                : "Daftar materi belum dapat dimuat saat ini."}
            </p>
            <p className="mt-1.5 text-sm text-body">
              {connected
                ? "Materi pembelajaran akan tampil di sini setelah dipublikasikan oleh guru."
                : "Periksa koneksi layanan data atau coba muat ulang halaman beberapa saat lagi."}
            </p>
          </Card>
        ) : (
          <>
            <div className="relative mt-9 flex items-center gap-3 lg:gap-4">
              <button
                type="button"
                onClick={() => scrollToSlide(activeIndex - 1)}
                aria-label="Materi sebelumnya"
                className="hidden h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-slate-200 bg-white text-ink shadow-xs transition hover:border-crimson hover:text-crimson active:scale-95 sm:inline-flex"
              >
                <ChevronLeft className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>

              <div
                ref={trackRef}
                role="group"
                aria-label="Daftar kartu materi"
                className="carousel-track no-scrollbar flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto px-1 py-2 sm:gap-5"
              >
                {materiList.map((m, idx) => {
                  const isActive = idx === activeIndex;
                  const Icon = cardIcons[idx % cardIcons.length];

                  return (
                    <Card
                      key={m.id}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`${idx + 1} dari ${materiList.length}`}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onFocus={() => setActiveIndex(idx)}
                      className={`flex w-[82%] shrink-0 snap-start flex-col gap-0 overflow-hidden rounded-xl border bg-white py-0 ring-0 transition duration-200 sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] ${
                        isActive
                          ? "border-crimson/50 shadow-md"
                          : "border-slate-200/90 shadow-xs"
                      }`}
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-crimson-light">
                        {m.gambarUrl ? (
                          <img
                            src={m.gambarUrl}
                            alt={`Ilustrasi materi ${m.judul}`}
                            loading="lazy"
                            width={400}
                            height={250}
                            className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-crimson-light to-ivory text-crimson/35">
                            <Icon className="h-10 w-10" aria-hidden="true" />
                          </div>
                        )}
                        <span
                          aria-hidden="true"
                          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-crimson text-white shadow-sm"
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <h3 className="font-heading text-base font-bold leading-snug text-ink">
                            {m.judul}
                          </h3>
                          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-body">
                            {m.konten}
                          </p>
                        </div>

                        <div className="mt-4 border-t border-slate-100 pt-3">
                          <button
                            type="button"
                            onClick={() => openDetail(m)}
                            className="inline-flex min-h-10 items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-crimson hover:underline"
                          >
                            <span>Baca Detail</span>
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => scrollToSlide(activeIndex + 1)}
                aria-label="Materi berikutnya"
                className="hidden h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full bg-crimson text-white shadow-sm transition hover:bg-crimson-dark active:scale-95 sm:inline-flex"
              >
                <ChevronRight className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
            </div>

            {materiList.length > 1 && (
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSlide(activeIndex - 1)}
                  aria-label="Materi sebelumnya"
                  className="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-slate-200 bg-white text-ink transition hover:border-crimson hover:text-crimson active:scale-95 sm:hidden"
                >
                  <ChevronLeft className="h-[18px] w-[18px]" aria-hidden="true" />
                </button>

                <nav
                  aria-label="Pilih materi"
                  className="flex flex-wrap items-center justify-center gap-1"
                >
                  {materiList.map((m, idx) => {
                    const isCurrent = idx === activeIndex;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => scrollToSlide(idx)}
                        aria-label={`Pilih materi ${idx + 1}: ${m.judul}`}
                        aria-current={isCurrent ? "true" : undefined}
                        className="inline-flex min-h-11 min-w-8 touch-manipulation items-center justify-center px-1.5"
                      >
                        <span
                          aria-hidden="true"
                          className={`block h-2.5 rounded-full transition-all ${
                            isCurrent
                              ? "w-7 bg-crimson"
                              : "w-2.5 bg-slate-300 hover:bg-slate-400"
                          }`}
                        />
                      </button>
                    );
                  })}
                </nav>

                <button
                  type="button"
                  onClick={() => scrollToSlide(activeIndex + 1)}
                  aria-label="Materi berikutnya"
                  className="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full bg-crimson text-white shadow-sm transition hover:bg-crimson-dark active:scale-95 sm:hidden"
                >
                  <ChevronRight className="h-[18px] w-[18px]" aria-hidden="true" />
                </button>
              </div>
            )}

            <p className="sr-only" role="status" aria-live="polite">
              {statusMessage}
            </p>
          </>
        )}
      </div>

      {/* Modal detail materi berbasis native <dialog> */}
      <dialog
        ref={dialogRef}
        aria-labelledby="materi-detail-title"
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            closeDetail();
          }
        }}
        className="m-auto w-[min(92dvw,38rem)] rounded-2xl border border-slate-200 bg-white p-0 text-left text-body shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <h3 id="materi-detail-title" className="font-heading text-lg font-bold text-ink">
            {selectedMateri?.judul}
          </h3>
          <button
            type="button"
            onClick={closeDetail}
            aria-label="Tutup detail materi"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink transition hover:bg-crimson-light hover:text-crimson"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[65dvh] overflow-y-auto px-6 py-5">
          {selectedMateri?.gambarUrl && (
            <div className="mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl bg-ivory">
              <img
                src={selectedMateri.gambarUrl}
                alt={`Ilustrasi materi ${selectedMateri.judul}`}
                width={640}
                height={360}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="whitespace-pre-line text-sm leading-relaxed text-body">
            {selectedMateri?.konten}
          </div>
        </div>
        <div className="flex justify-end border-t border-slate-100 px-6 py-3.5">
          <Button
            type="button"
            onClick={closeDetail}
            className="min-h-11 rounded-md bg-crimson px-5 text-xs font-bold uppercase tracking-wide text-white hover:bg-crimson-dark"
          >
            Tutup
          </Button>
        </div>
      </dialog>
    </section>
  );
}
