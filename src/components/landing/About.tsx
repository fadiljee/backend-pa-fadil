import { BookOpen, Landmark, MapPin, Newspaper, School, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Reveal } from "./Reveal";
import { SectionButton } from "./SectionLink";

interface AboutProps {
  siswaCount: number;
  materiCount: number;
  beritaCount: number;
  connected: boolean;
  eyebrow: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  showStudentCount: boolean;
  featuredPhotoUrl?: string | null;
  schoolName: string;
}

export function About({
  siswaCount,
  materiCount,
  beritaCount,
  connected,
  eyebrow,
  title,
  paragraph1,
  paragraph2,
  showStudentCount,
  featuredPhotoUrl,
  schoolName,
}: AboutProps) {
  const facts = [
    ...(showStudentCount && connected
      ? [
          {
            icon: Users,
            value: siswaCount.toLocaleString("id-ID"),
            label: "Siswa Aktif Terdaftar",
          },
          {
            icon: BookOpen,
            value: materiCount.toLocaleString("id-ID"),
            label: "Materi Pembelajaran",
          },
        ]
      : [
          {
            icon: Users,
            value: "Aktif",
            label: "Pembinaan Peserta Didik",
          },
          {
            icon: BookOpen,
            value: "Daring",
            label: "Akses Bahan Ajar Sekolah",
          },
        ]),
    {
      icon: Newspaper,
      value: beritaCount > 0 ? beritaCount.toLocaleString("id-ID") : "Terbaru",
      label: "Berita & Kegiatan",
    },
    {
      icon: School,
      value: "SMPN",
      label: "Sekolah Menengah Pertama Negeri",
    },
    {
      icon: MapPin,
      value: "Merawang",
      label: "Kecamatan Merawang",
    },
    {
      icon: Landmark,
      value: "Bangka",
      label: "Kabupaten Bangka",
    },
  ];

  return (
    <section id="profil" tabIndex={-1} className="scroll-mt-20 w-full bg-white py-14 sm:py-20">
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 md:px-10 lg:px-14">
        <Reveal>
          {/* 3-Part Welcome Row matching reference: Photo | Welcome Copy | 2x3 Fact Grid Card */}
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
            {/* Left 3 cols: Framed school photo or authentic school emblem panel */}
            <div className="lg:col-span-3">
              {featuredPhotoUrl ? (
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-ivory shadow-sm">
                  <img
                    src={featuredPhotoUrl}
                    alt={`Dokumentasi ${schoolName}`}
                    loading="lazy"
                    width={480}
                    height={360}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <Card className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-xl border border-crimson/20 bg-gradient-to-br from-ivory to-crimson-light/60 p-6 text-center shadow-xs ring-0">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold bg-crimson text-gold-light shadow-sm">
                    <School className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-extrabold uppercase tracking-wide text-crimson">
                      {schoolName}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-body">
                      Kecamatan Merawang, Bangka
                    </p>
                  </div>
                </Card>
              )}
            </div>

            {/* Middle 4 cols: Welcome text + outlined button */}
            <div className="lg:col-span-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-crimson">
                {eyebrow}
              </p>
              <h2 className="mt-1.5 text-[clamp(1.375rem,1.1rem+1vw,1.85rem)] font-bold leading-snug text-ink">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-[1.75] text-body">{paragraph1}</p>
              <p className="mt-2.5 text-sm leading-[1.75] text-body">{paragraph2}</p>
              <div className="mt-5">
                <SectionButton
                  targetId="visi-misi"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border-[1.5px] border-crimson bg-white px-5 text-xs font-bold uppercase tracking-wider text-crimson transition hover:bg-crimson hover:text-white"
                >
                  Baca Visi &amp; Misi
                </SectionButton>
              </div>
            </div>

            {/* Right 5 cols: White Bordered 2x3 School Fact & Real-Stats Card */}
            <div className="lg:col-span-5">
              <Card className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs ring-0 sm:p-6">
                <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                  {facts.map((fact) => {
                    const Icon = fact.icon;
                    return (
                      <div key={fact.label} className="flex items-start gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-crimson-light text-crimson">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="font-heading text-base font-extrabold leading-tight text-ink">
                            {fact.value}
                          </p>
                          <p className="mt-0.5 text-[11px] leading-snug text-body">
                            {fact.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
