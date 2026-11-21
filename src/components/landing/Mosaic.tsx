import { Image as ImageIcon } from "lucide-react";
import type { MosaicSlotData } from "@/lib/content";
import { Reveal } from "./Reveal";

interface MosaicProps {
  slots: MosaicSlotData[];
}

// Exact 12-column x 4-row irregular mosaic (8 tiles, zero gaps/overlaps)
const DESKTOP_SLOT_CLASSES = [
  "lg:col-start-1 lg:col-span-4 lg:row-start-1 lg:row-span-2 lg:h-[360px]",
  "lg:col-start-5 lg:col-span-5 lg:row-start-1 lg:row-span-2 lg:h-[360px]",
  "lg:col-start-10 lg:col-span-3 lg:row-start-1 lg:row-span-1 lg:h-[172px]",
  "lg:col-start-10 lg:col-span-3 lg:row-start-2 lg:row-span-1 lg:h-[172px]",
  "lg:col-start-1 lg:col-span-3 lg:row-start-3 lg:row-span-1 lg:h-[172px]",
  "lg:col-start-1 lg:col-span-3 lg:row-start-4 lg:row-span-1 lg:h-[172px]",
  "lg:col-start-4 lg:col-span-5 lg:row-start-3 lg:row-span-2 lg:h-[360px]",
  "lg:col-start-9 lg:col-span-4 lg:row-start-3 lg:row-span-2 lg:h-[360px]",
];

// Mixed aspect ratios for mobile/tablet masonry
const MOBILE_ASPECT_CLASSES = [
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-square",
  "aspect-[4/3]",
];

function MosaicTile({
  slot,
  className,
}: {
  slot: MosaicSlotData;
  className: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[14px] bg-gradient-to-br from-[#d9d9de] to-[#a9a9b3] ${className}`}
    >
      {slot.imageUrl ? (
        <img
          src={slot.imageUrl}
          alt={slot.alt}
          loading="lazy"
          width={900}
          height={600}
          className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none"
        />
      ) : (
        <div
          aria-label={slot.alt}
          role="img"
          className="flex h-full w-full items-center justify-center"
        >
          <ImageIcon
            className="h-10 w-10 text-white/75"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}

export function Mosaic({ slots }: MosaicProps) {
  const visibleSlots = slots.slice(0, 8);

  return (
    <section
      id="galeri"
      tabIndex={-1}
      aria-label="Galeri foto kegiatan sekolah"
      className="scroll-mt-[88px] w-full bg-surface py-16 md:py-[88px] lg:py-[112px]"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
          {/* Mobile (<640): 2-col masonry · Tablet (640-1023): 3-col masonry */}
          <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:hidden">
            {visibleSlots.map((slot, idx) => (
              <Reveal
                key={slot.id}
                variant="scale"
                delayMs={idx * 55}
                className="mb-3 break-inside-avoid sm:mb-4"
              >
                <MosaicTile
                  slot={slot}
                  className={`w-full ${MOBILE_ASPECT_CLASSES[idx % MOBILE_ASPECT_CLASSES.length]}`}
                />
              </Reveal>
            ))}
          </div>

          {/* Desktop (>=1024): Exact 12-column irregular grid with staggered scale-reveal */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4">
            {visibleSlots.map((slot, idx) => (
              <Reveal
                key={slot.id}
                variant="scale"
                delayMs={idx * 65}
                className={DESKTOP_SLOT_CLASSES[idx] ?? "lg:col-span-3 lg:h-[172px]"}
              >
                <MosaicTile slot={slot} className="h-full w-full" />
              </Reveal>
            ))}
          </div>
      </div>
    </section>
  );
}
