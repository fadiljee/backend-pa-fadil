import { Image as ImageIcon } from "lucide-react";
import { TestTubeDoodle } from "./Doodles";

export interface GalleryItem {
  id: number;
  judul: string;
  url: string;
}

const masonryHeights = [
  "aspect-[4/3]",
  "aspect-[4/2.6]",
  "aspect-[3.4/5]",
  "aspect-[4/3]",
];

export function Gallery({ items }: { items: GalleryItem[] }) {
  return (
    <section
      id="galeri"
      className="scroll-mt-20 mx-auto max-w-[1080px] px-3 py-8 sm:px-5 md:px-8 lg:px-12 lg:py-12"
    >
      <div className="relative overflow-hidden rounded-[24px] bg-primary px-4 py-10 text-white sm:px-8 md:rounded-[32px] md:p-12">
        <TestTubeDoodle className="absolute right-8 top-6 hidden h-14 w-14 lg:block" />

        <div className="relative z-10 text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.04em] text-sky-100 md:text-[14px]">
            Galeri
          </p>
          <h2 className="mt-2 text-[20px] font-bold md:text-[24px] lg:text-[26px]">
            Kegiatan dan Materi Sekolah.
          </h2>
          <p className="mt-2 text-sm font-bold tracking-wide text-white">
            Belajar | Berkarya | Berprestasi
          </p>
        </div>

        {items.length === 0 ? (
          <div className="mt-8 columns-2 gap-3 md:gap-4 lg:columns-4">
            {masonryHeights.map((aspect, idx) => (
              <div
                key={idx}
                className={`mb-3 break-inside-avoid overflow-hidden rounded-xl bg-gradient-to-br from-white/15 to-white/5 p-4 md:mb-4 ${aspect} flex flex-col items-center justify-center text-center`}
              >
                <ImageIcon className="h-7 w-7 text-sky-100/80" aria-hidden="true" />
                <span className="mt-2 text-xs text-sky-100">
                  [REAL DATA: Foto kegiatan atau materi]
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 columns-2 gap-3 md:gap-4 lg:columns-4">
            {items.map((item, idx) => (
              <figure
                key={item.id}
                className="mb-3 break-inside-avoid overflow-hidden rounded-xl bg-white/10 md:mb-4"
              >
                <img
                  src={item.url}
                  alt={`Ilustrasi materi ${item.judul}`}
                  loading="lazy"
                  width={400}
                  height={300}
                  className={`w-full object-cover transition duration-300 hover:scale-[1.03] ${
                    masonryHeights[idx % masonryHeights.length]
                  }`}
                />
                <figcaption className="truncate px-3 py-2 text-xs font-medium text-sky-50">
                  {item.judul}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
