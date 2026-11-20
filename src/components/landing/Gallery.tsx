import {
  BookOpen,
  Camera,
  HeartHandshake,
  Image as ImageIcon,
  Medal,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Reveal } from "./Reveal";

export interface GalleryItem {
  id: number;
  judul: string;
  url: string;
}

const activityIcons = [Camera, Medal, BookOpen, Users, HeartHandshake];

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
      className="scroll-mt-20 w-full bg-white py-14 sm:py-20"
    >
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 md:px-10 lg:px-14">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-crimson">
              {eyebrow}
            </p>
            <h2 className="mt-1.5 text-[clamp(1.5rem,1.15rem+1.3vw,2.2rem)] font-bold leading-snug text-ink">
              {title}
            </h2>
            {tagline && (
              <p className="mt-1.5 text-sm font-medium text-body">{tagline}</p>
            )}
          </div>

          {items.length === 0 ? (
            <Card className="mx-auto mt-10 flex max-w-2xl flex-col items-center justify-center rounded-xl border border-slate-200 bg-ivory px-6 py-12 text-center shadow-xs ring-0">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-crimson-light text-crimson">
                <ImageIcon className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-3 text-sm font-bold text-ink">
                Belum ada foto kegiatan yang ditampilkan.
              </p>
              <p className="mt-1 text-xs text-body">
                Foto kegiatan dan dokumentasi sekolah akan tampil di sini setelah diunggah.
              </p>
            </Card>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {items.map((item, idx) => {
                const Icon = activityIcons[idx % activityIcons.length];
                return (
                  <figure key={item.id} className="group flex flex-col">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200/80 bg-ivory shadow-xs">
                      <img
                        src={item.url}
                        alt={`Dokumentasi ${item.judul}`}
                        loading="lazy"
                        width={480}
                        height={360}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="relative z-10 -mt-4 flex items-center gap-2.5 px-2">
                      <span
                        aria-hidden="true"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white bg-crimson text-white shadow-sm"
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <figcaption className="truncate pt-4 text-xs font-bold text-ink sm:text-sm">
                        {item.judul}
                      </figcaption>
                    </div>
                  </figure>
                );
              })}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
