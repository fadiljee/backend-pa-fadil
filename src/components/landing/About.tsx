import { BookOpen, GraduationCap, MapPin, Users } from "lucide-react";
import { BrushDoodle, ScissorsDoodle } from "./Doodles";

const highlightIcons = [Users, BookOpen, GraduationCap, MapPin];
const highlightOffsets = ["lg:ml-14", "lg:ml-2", "lg:ml-28", "lg:ml-16"];

interface AboutProps {
  siswaCount: number;
  connected: boolean;
  eyebrow: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  showStudentCount: boolean;
  highlights: string[];
}

export function About({
  siswaCount,
  connected,
  eyebrow,
  title,
  paragraph1,
  paragraph2,
  showStudentCount,
  highlights,
}: AboutProps) {
  return (
    <section
      id="tentang"
      tabIndex={-1}
      className="relative scroll-mt-20 mx-auto max-w-[960px] px-5 py-16 md:px-8 lg:px-12 lg:py-24"
    >
      <ScissorsDoodle className="absolute right-12 top-6 hidden h-12 w-12 lg:block" />
      <BrushDoodle className="absolute bottom-6 left-10 hidden h-12 w-12 lg:block" />

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.04em] text-primary md:text-[14px]">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-[20px] font-bold leading-snug text-heading md:text-[24px] lg:text-[26px]">
            {title}
          </h2>

          <div className="mt-5 max-w-[448px] space-y-4 text-[14px] leading-[1.8] text-body lg:text-[15px]">
            <p>{paragraph1}</p>
            <p>{paragraph2}</p>
            {showStudentCount && connected && (
              <p>
                Saat ini tercatat{" "}
                <strong className="font-bold text-primary">
                  {siswaCount.toLocaleString("id-ID")} siswa
                </strong>{" "}
                aktif yang terdaftar dalam sistem informasi pembelajaran sekolah.
              </p>
            )}
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[448px] flex-col gap-5 lg:mx-0 lg:max-w-none">
          {highlights.map((label, idx) => {
            const Icon = highlightIcons[idx % highlightIcons.length];
            const offset = highlightOffsets[idx % highlightOffsets.length];
            return (
              <div
                key={`${idx}-${label}`}
                className={`flex items-center lg:-rotate-6 ${offset}`}
              >
                <span className="relative z-10 flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border-4 border-white bg-primary text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="-ml-5 flex min-h-12 flex-1 items-center rounded-2xl bg-soft py-3 pl-9 pr-5 text-[11px] font-extrabold uppercase italic tracking-wide text-heading shadow-[0_6px_14px_rgba(0,0,0,0.06)] md:text-xs">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
