"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CourseItem {
  id: number;
  judul: string;
  konten: string;
}

export function Courses({
  materiList,
  connected,
  isLoggedIn,
  eyebrow,
  title,
}: {
  materiList: CourseItem[];
  connected: boolean;
  isLoggedIn: boolean;
  eyebrow: string;
  title: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function scrollTrack(direction: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <section
      id="materi"
      tabIndex={-1}
      className="scroll-mt-20 mx-auto max-w-[1080px] px-5 py-16 md:px-8 lg:px-12 lg:py-24"
    >
      <div className="text-center">
        <p className="text-[13px] font-bold uppercase tracking-[0.04em] text-primary md:text-[14px]">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-[20px] font-bold text-heading md:text-[24px] lg:text-[26px]">
          {title}
        </h2>
      </div>

      {materiList.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-cardborder bg-soft p-8 text-center">
          <p className="text-sm text-body">
            {connected
              ? "Belum ada materi yang ditambahkan oleh guru. Tambahkan materi melalui Panel Admin."
              : "Daftar materi belum dapat dimuat saat ini."}
          </p>
        </div>
      ) : (
        <div className="relative mt-10 flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollTrack(-1)}
            aria-label="Geser materi ke kiri"
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E5E8EC] text-heading transition hover:bg-slate-300 sm:inline-flex"
          >
            <ChevronLeft className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>

          <div
            ref={trackRef}
            className="no-scrollbar flex flex-1 snap-x snap-mandatory gap-6 overflow-x-auto py-3"
          >
            {materiList.map((m, idx) => {
              const isActive = idx === activeIndex;

              return (
                <article
                  key={m.id}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onFocus={() => setActiveIndex(idx)}
                  className={`relative flex min-h-[240px] w-[68%] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl p-6 text-center transition duration-200 sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] ${
                    isActive
                      ? "-translate-y-1 bg-primary text-white shadow-(--shadow-card-active)"
                      : "border border-cardborder bg-white text-heading shadow-(--shadow-card)"
                  }`}
                >
                  <div>
                    <h3
                      className={`text-[20px] font-extrabold uppercase leading-tight ${
                        isActive ? "text-white" : "text-primary"
                      }`}
                    >
                      {m.judul}
                    </h3>
                    <p
                      className={`mx-auto mt-3 line-clamp-3 max-w-[190px] text-[12px] leading-relaxed ${
                        isActive ? "text-sky-50" : "text-body"
                      }`}
                    >
                      {m.konten}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col items-center gap-1.5">
                    <Link
                      href={isLoggedIn ? `/admin/materi/${m.id}/edit` : "/login"}
                      className={`inline-flex min-h-11 items-center text-xs font-semibold hover:underline ${
                        isActive ? "text-white" : "text-primary"
                      }`}
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollTrack(1)}
            aria-label="Geser materi ke kanan"
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-(--shadow-btn) transition hover:bg-primary-dark sm:inline-flex"
          >
            <ChevronRight className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href={isLoggedIn ? "/admin/materi" : "/login"}
          className="inline-flex min-h-11 items-center justify-center rounded-[10px] bg-primary px-7 py-3 text-[13px] font-semibold text-white shadow-(--shadow-btn) transition hover:bg-primary-dark"
        >
          {isLoggedIn ? "Materi Lainnya" : "Masuk untuk Kelola Materi"}
        </Link>
      </div>
    </section>
  );
}
