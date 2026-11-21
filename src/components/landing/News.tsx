import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import type { LandingNewsItem } from "@/lib/content";
import { Confetti } from "./Confetti";
import { LandingButton } from "./LandingButton";
import { Reveal } from "./Reveal";
import { SectionTitle } from "./SectionTitle";

interface NewsProps {
  items: LandingNewsItem[];
}

export function News({ items }: NewsProps) {
  const displayItems = items.slice(0, 3);

  return (
    <section
      id="berita"
      tabIndex={-1}
      className="relative scroll-mt-[88px] w-full overflow-hidden bg-surface py-16 md:py-[88px] lg:py-[112px]"
    >
      <Confetti variant="white" preset="news" />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <Reveal>
          <SectionTitle title="Berita & Kegiatan" showTriangleIcon />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item, idx) => (
            <Reveal key={item.id} delayMs={idx * 100} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-[12px] bg-surface shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.12)] motion-reduce:transition-none">
                {/* Top 16:10 photo with rounded top & zoom hover */}
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
                      className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] motion-reduce:transition-none"
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

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="line-clamp-3 text-[16px] font-semibold leading-snug text-ink md:text-[17px] lg:text-[18px]">
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
                    >
                      {item.title}
                    </Link>
                  </h3>

                  <p className="mt-2.5 line-clamp-4 text-[13px] leading-[1.65] text-body">
                    {item.excerpt}
                  </p>

                  {/* Footer: date left + small red pill button Baca right */}
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
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <LandingButton variant="primary" href="/berita">
            Lihat Semua
          </LandingButton>
        </div>
      </div>
    </section>
  );
}
