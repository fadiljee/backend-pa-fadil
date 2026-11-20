import {
  BookOpen,
  HeartHandshake,
  MonitorSmartphone,
  School,
  Users,
} from "lucide-react";

const pillars = [
  {
    icon: School,
    title: "Lingkungan Tertib",
    subtitle: "Suasana belajar aman & kondusif",
  },
  {
    icon: BookOpen,
    title: "Intrakurikuler",
    subtitle: "Pembelajaran terarah tiap kelas",
  },
  {
    icon: Users,
    title: "Ekstrakurikuler",
    subtitle: "Pengembangan minat & bakat siswa",
  },
  {
    icon: HeartHandshake,
    title: "Karakter & Disiplin",
    subtitle: "Pembiasaan akhlak & gotong royong",
  },
  {
    icon: MonitorSmartphone,
    title: "Bahan Ajar Digital",
    subtitle: "Materi mudah diakses dari rumah",
  },
];

export function HighlightsBand() {
  return (
    <section
      aria-label="Pilar pendidikan sekolah"
      className="w-full bg-crimson py-10 text-white sm:py-12"
    >
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 md:px-10 lg:px-14">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0 lg:divide-x lg:divide-white/15">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center gap-3.5 lg:justify-center lg:px-5 lg:first:pl-0 lg:last:pr-0"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gold/60 bg-crimson-dark text-gold-light">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-sm font-extrabold leading-tight text-white">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-white/85">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
