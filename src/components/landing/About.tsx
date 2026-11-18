import { BookOpen, GraduationCap, MapPin, Users } from "lucide-react";
import { BrushDoodle, ScissorsDoodle } from "./Doodles";

const features = [
  { label: "Lingkungan Belajar Aktif", icon: Users, offset: "lg:ml-14" },
  { label: "Materi Pembelajaran Terbuka", icon: BookOpen, offset: "lg:ml-2" },
  { label: "Pendampingan Guru Sekolah", icon: GraduationCap, offset: "lg:ml-28" },
  { label: "SMPN 1 Merawang, Bangka", icon: MapPin, offset: "lg:ml-16" },
];

export function About({ siswaCount, connected }: { siswaCount: number; connected: boolean }) {
  return (
    <section
      id="tentang"
      className="relative scroll-mt-20 mx-auto max-w-[960px] px-5 py-16 md:px-8 lg:px-12 lg:py-24"
    >
      <ScissorsDoodle className="absolute right-12 top-6 hidden h-12 w-12 lg:block" />
      <BrushDoodle className="absolute bottom-6 left-10 hidden h-12 w-12 lg:block" />

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.04em] text-primary md:text-[14px]">
            Tentang Sekolah
          </p>
          <h2 className="mt-2 text-[20px] font-bold leading-snug text-heading md:text-[24px] lg:text-[26px]">
            Mengenal SMPN 1 Merawang.
          </h2>

          <div className="mt-5 max-w-[448px] space-y-4 text-[14px] leading-[1.8] text-body lg:text-[15px]">
            <p>
              SMPN 1 Merawang merupakan sekolah menengah pertama di Kecamatan Merawang yang
              berkomitmen menghadirkan pembelajaran yang tertib, terarah, dan mudah diakses oleh
              seluruh siswa.
            </p>
            <p>
              Melalui portal ini, guru dan pengelola sekolah dapat mengelola data siswa serta
              menyusun materi pembelajaran agar siswa tetap terhubung dengan bahan ajar sekolah.
            </p>
            <p>
              Saat ini tercatat{" "}
              <strong className="font-bold text-primary">
                {connected ? `${siswaCount.toLocaleString("id-ID")} siswa` : "[REAL DATA] siswa"}
              </strong>{" "}
              aktif yang terdaftar dalam sistem informasi pembelajaran SMPN 1 Merawang.
            </p>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[448px] flex-col gap-5 lg:mx-0 lg:max-w-none">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex items-center lg:-rotate-6 ${item.offset}`}
              >
                <span className="relative z-10 flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border-4 border-white bg-primary text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="-ml-5 flex min-h-12 flex-1 items-center rounded-2xl bg-soft py-3 pl-9 pr-5 text-[11px] font-extrabold uppercase italic tracking-wide text-heading shadow-[0_6px_14px_rgba(0,0,0,0.06)] md:text-xs">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
