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

interface GalleryProps {
  items: GalleryItem[];
  eyebrow: string;
  title: string;
  tagline: string;
}

export function Gallery({ items, eyebrow, title, tagline }: GalleryProps) {
  return (
    <section
      id="galeri"
      tabIndex={-1}
      className="scroll-mt-20 mx-auto max-w-[1080px] px-3 py-8 sm:px-5 md:px-8 lg:px-12 lg:py-12"
    >
      <div className="relative overflow-hidden rounded-[24px] bg-primary px-4 py-10 text-white sm:px-8 md:rounded-[32px] md:p-12">
        <TestTubeDoodle className="absolute right-8 top-6 hidden h-14 w-14 lg:block" />

        <div className="relative z-10 text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.04em] text-sky-100 md:text-[14px]">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-[20px] font-bold md:text-[24px] lg:text-[26px]">
            {title}
          </h2>
          {tagline && (
            <p className="mt-2 text-sm font-bold tracking-wide text-white">
              {tagline}
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 py-10 text-center">
            <ImageIcon className="h-8 w-8 text-sky-100" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold text-white">
              Belum ada foto materi yang ditampilkan.
            </p>
            <p className="mt-1 text-xs text-sky-100">
              Unggah gambar pada menu Materi di Panel Admin agar tampil di galeri ini.
            </p>
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
