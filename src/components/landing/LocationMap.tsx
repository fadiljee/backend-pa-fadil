import { ExternalLink, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Reveal } from "./Reveal";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/SMPN+1+Merawang/@-2.0020068,106.1038266,1149m/data=!3m2!1e3!4b1!4m6!3m5!1s0x2e22eb9f20cfa045:0x3410ab429cfeea9d!8m2!3d-2.0020068!4d106.1064015!16s%2Fg%2F11c1p15kp5?entry=ttu&g_ep=EgoyMDI2MTExNy4wIKXMDSoASAFQAw%3D%3D";

const GOOGLE_MAPS_EMBED_URL =
  "https://maps.google.com/maps?q=-2.0020068,106.1064015+(SMPN+1+Merawang)&hl=id&z=16&output=embed";

interface LocationMapProps {
  schoolName: string;
  contactAddress: string;
}

export function LocationMap({ schoolName, contactAddress }: LocationMapProps) {
  return (
    <section
      id="lokasi"
      tabIndex={-1}
      className="scroll-mt-20 w-full bg-white py-14 sm:py-20"
    >
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 md:px-10 lg:px-14">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-crimson">
                Peta Lokasi
              </p>
              <h2 className="mt-1.5 text-[clamp(1.5rem,1.15rem+1.3vw,2.2rem)] font-bold leading-snug text-ink">
                Temukan {schoolName}
              </h2>
              {contactAddress && (
                <p className="mt-1.5 inline-flex items-center gap-2 text-sm text-body">
                  <MapPin className="h-4 w-4 shrink-0 text-crimson" aria-hidden="true" />
                  <span>{contactAddress}</span>
                </p>
              )}
            </div>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-md border-[1.5px] border-crimson bg-white px-5 text-xs font-bold uppercase tracking-wider text-crimson transition hover:bg-crimson hover:text-white sm:self-auto"
            >
              <span>Petunjuk Arah</span>
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          </div>

          <Card className="mt-6 gap-0 overflow-hidden rounded-xl border border-slate-200 bg-ivory py-0 shadow-xs ring-0">
            <div className="aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
              <iframe
                title={`Peta lokasi ${schoolName} di Google Maps`}
                src={GOOGLE_MAPS_EMBED_URL}
                width={1200}
                height={500}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
