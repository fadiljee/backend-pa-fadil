"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Pause, Play } from "lucide-react";
import type { HeroSlideData } from "@/lib/content";

interface HeroCarouselProps {
  slides: HeroSlideData[];
}

function getCircularOffset(slideIdx: number, activeIdx: number, total: number): number {
  let diff = slideIdx - activeIdx;
  const half = Math.floor(total / 2);
  if (diff > half) diff -= total;
  if (diff < -half) diff += total;
  return diff;
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const total = slides.length;
  // Default to middle slide (index 2 = Lapangan with school photo) when 5 slides
  const defaultIndex = total >= 3 ? Math.min(2, total - 1) : 0;
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [isHoveredOrFocused, setIsHoveredOrFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const pointerStartX = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const goToSlide = useCallback(
    (nextIdx: number, announce = true) => {
      if (total === 0) return;
      const wrapped = ((nextIdx % total) + total) % total;
      setActiveIndex(wrapped);
      if (announce) {
        setAnnouncement(
          `Slide ${wrapped + 1} dari ${total}: ${slides[wrapped]?.title ?? ""}`
        );
      }
    },
    [slides, total]
  );

  // Autoplay every 5s; pauses on hover, focus, hidden tab, manual pause, or reduced motion
  useEffect(() => {
    if (reducedMotion || isPaused || isHoveredOrFocused || total <= 1) return;

    const timer = setInterval(() => {
      if (document.hidden) return;
      setActiveIndex((prev) => (prev + 1) % total);
    }, 5000);

    return () => clearInterval(timer);
  }, [reducedMotion, isPaused, isHoveredOrFocused, total]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToSlide(activeIndex - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goToSlide(activeIndex + 1);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    const delta = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(delta) >= 40) {
      if (delta < 0) {
        goToSlide(activeIndex + 1);
      } else {
        goToSlide(activeIndex - 1);
      }
    }
  };

  return (
    <section
      id="home"
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Sorotan lingkungan belajar SMPN 1 Merawang"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHoveredOrFocused(true)}
      onMouseLeave={() => setIsHoveredOrFocused(false)}
      onFocus={() => setIsHoveredOrFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsHoveredOrFocused(false);
        }
      }}
      className="scroll-mt-[88px] w-full overflow-hidden bg-surface pb-4 pt-6 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-brand/30 sm:pb-6 sm:pt-8"
    >
      {/* Coverflow Stage (clipped at viewport edges, zero horizontal page scroll) */}
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerStartX.current = null;
        }}
        className="relative mx-auto flex h-[240px] w-full max-w-[1440px] items-center justify-center select-none sm:h-[320px] lg:h-[400px]"
        style={{ touchAction: "pan-y" }}
      >
        {slides.map((slide, idx) => {
          const offset = getCircularOffset(idx, activeIndex, total);
          const absOffset = Math.abs(offset);
          const isCenter = offset === 0;
          const isImmediateSide = absOffset === 1;
          const isOuterSide = absOffset === 2;
          const isVisible = absOffset <= 2;

          let positionClass = "opacity-0 pointer-events-none scale-50 z-0";
          if (isCenter) {
            positionClass =
              "translate-x-0 scale-100 opacity-100 z-30 shadow-[0_16px_40px_rgba(0,0,0,0.25)]";
          } else if (offset === -1) {
            positionClass =
              "-translate-x-[94%] sm:-translate-x-[86%] lg:-translate-x-[82%] scale-[0.86] lg:scale-[0.82] opacity-85 lg:opacity-70 z-20 cursor-pointer shadow-lg";
          } else if (offset === 1) {
            positionClass =
              "translate-x-[94%] sm:translate-x-[86%] lg:translate-x-[82%] scale-[0.86] lg:scale-[0.82] opacity-85 lg:opacity-70 z-20 cursor-pointer shadow-lg";
          } else if (offset === -2) {
            positionClass =
              "hidden lg:block lg:-translate-x-[154%] lg:scale-[0.68] lg:opacity-50 z-10 cursor-pointer shadow-md";
          } else if (offset === 2) {
            positionClass =
              "hidden lg:block lg:translate-x-[154%] lg:scale-[0.68] lg:opacity-50 z-10 cursor-pointer shadow-md";
          }

          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} dari ${total}`}
              aria-hidden={!isVisible || undefined}
              onClick={() => {
                if (!isCenter && isVisible) {
                  goToSlide(idx);
                }
              }}
              className={`absolute h-[210px] w-[82%] overflow-hidden rounded-[18px] transition-[transform,opacity] duration-500 ease-out will-change-transform motion-reduce:transition-none sm:h-[270px] sm:w-[60%] lg:h-[310px] lg:w-[460px] ${positionClass}`}
            >
              {slide.imageUrl ? (
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  width={1200}
                  height={760}
                  fetchPriority={isCenter ? "high" : "low"}
                  loading={isCenter ? undefined : "lazy"}
                  draggable={false}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#d9d9de] to-[#a9a9b3]">
                  <ImageIcon
                    className="h-12 w-12 text-white/75"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
              )}

              {/* Dark overlay 35% on side cards per sections.md / interactions.md */}
              {(isImmediateSide || isOuterSide) && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-black/35"
                />
              )}

              {/* Readable gradient + title & description at bottom-left matching reference */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent px-5 pb-4 pt-14 text-left text-white sm:px-6 sm:pb-5">
                <p className="text-lg font-semibold leading-tight sm:text-xl lg:text-2xl">
                  {slide.title}
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/90">
                  {slide.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Region for Screen Readers */}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      {/* Pagination Dots + Pause/Play Toggle */}
      <div className="mt-3 flex items-center justify-center gap-2 sm:mt-4">
        <nav
          aria-label="Pilih slide sorotan"
          className="flex items-center justify-center gap-1"
        >
          {slides.map((slide, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Slide ${idx + 1} dari ${total}: ${slide.title}`}
                aria-current={isCurrent ? "true" : undefined}
                className="inline-flex h-11 min-w-[28px] items-center justify-center rounded-full px-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
                style={{ touchAction: "manipulation" }}
              >
                <span
                  aria-hidden="true"
                  className={`block h-2.5 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${
                    isCurrent
                      ? "w-6 bg-brand"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setIsPaused((p) => !p)}
          aria-label={isPaused ? "Lanjutkan putar otomatis" : "Jeda putar otomatis"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
        >
          {isPaused ? (
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Pause className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </div>
    </section>
  );
}
