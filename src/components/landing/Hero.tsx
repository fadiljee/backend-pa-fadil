import Link from "next/link";
import { GlobeDoodle, SpiralPaperDoodle } from "./Doodles";

interface HeroProps {
  connected: boolean;
  siswaCount: number;
  materiCount: number;
  isLoggedIn: boolean;
}

function HeroBooksIllustration() {
  return (
    <svg
      viewBox="0 0 460 380"
      className="mx-auto h-auto w-[78%] max-w-[300px] lg:ml-auto lg:mr-0 lg:w-full lg:max-w-[460px]"
      role="img"
      aria-label="Ilustrasi tumpukan empat buku matematika dan topi toga akademik"
    >
      <ellipse cx="235" cy="342" rx="165" ry="22" fill="#D9E2EC" />

      {/* Buku merah (bawah) */}
      <polygon points="94,274 260,214 368,260 202,322" fill="#C53030" />
      <polygon points="94,274 202,322 202,342 94,294" fill="#9B2C2C" />
      <polygon points="202,322 368,260 368,280 202,342" fill="#F8FAFC" />

      {/* Buku biru */}
      <polygon points="112,232 270,174 362,216 204,276" fill="#054E85" />
      <polygon points="112,232 204,276 204,296 112,252" fill="#043B66" />
      <polygon points="204,276 362,216 362,236 204,296" fill="#F1F5F9" />

      {/* Buku hijau tua */}
      <polygon points="128,192 274,136 352,174 206,230" fill="#276749" />
      <polygon points="128,192 206,230 206,248 128,210" fill="#22543D" />
      <polygon points="206,230 352,174 352,192 206,248" fill="#F8FAFC" />

      {/* Buku oranye */}
      <polygon points="142,152 278,98 344,134 208,188" fill="#DD6B20" />
      <polygon points="142,152 208,188 208,204 142,168" fill="#C05621" />
      <polygon points="208,188 344,134 344,150 208,204" fill="#FEF3C7" />

      {/* Topi toga hitam bertali kuning */}
      <path d="M186,102 L186,134 C186,144 276,144 276,134 L276,102 Z" fill="#1B2433" />
      <polygon points="126,82 231,38 336,82 231,124" fill="#2D3748" />
      <circle cx="231" cy="82" r="5" fill="#F6D45B" />
      <path d="M231,82 L306,112 L306,156" stroke="#F6D45B" strokeWidth="4.5" fill="none" />
      <circle cx="306" cy="160" r="6" fill="#F6D45B" />
    </svg>
  );
}

export function Hero({ connected, siswaCount, materiCount, isLoggedIn }: HeroProps) {
  return (
    <section
      id="home"
      tabIndex={-1}
      className="relative overflow-hidden bg-gradient-to-b from-hero-from to-hero-to pb-28 pt-10 md:pb-36 lg:min-h-[580px] lg:pb-44 lg:pt-14"
    >
      <div className="relative z-10 mx-auto grid max-w-[960px] grid-cols-1 items-center gap-10 px-5 md:px-8 lg:grid-cols-2 lg:px-12">
        <div className="text-center lg:text-left">
          <h1 className="text-[28px] font-bold leading-[1.25] text-heading md:text-[36px] lg:text-[40px]">
            Selamat Datang di SMPN 1 Merawang.
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-[14px] leading-[1.7] text-body lg:mx-0 lg:text-[15px]">
            Portal informasi sekolah, data siswa aktif, serta akses materi pembelajaran bagi
            seluruh warga SMPN 1 Merawang.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href="#materi"
              className="inline-flex min-h-11 items-center justify-center rounded-[10px] bg-primary px-7 py-3 text-[13px] font-semibold text-white shadow-(--shadow-btn) transition duration-180 hover:bg-primary-dark"
            >
              Lihat Materi
            </a>
            <Link
              href={isLoggedIn ? "/admin" : "#tentang"}
              className="inline-flex min-h-11 items-center justify-center rounded-[10px] border-[1.5px] border-primary bg-white px-6 py-3 text-[13px] font-semibold text-primary transition duration-180 hover:bg-primary-light"
            >
              {isLoggedIn ? "Buka Panel Admin" : "Tentang Sekolah"}
            </Link>
          </div>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-2xl border border-cardborder/60 bg-white/90 px-4 py-2.5 text-xs text-body shadow-(--shadow-card) lg:justify-start">
            <span>
              <strong className="font-bold text-primary">
                {connected ? siswaCount.toLocaleString("id-ID") : "[REAL DATA]"}
              </strong>{" "}
              Siswa Aktif
            </span>
            <span className="text-muted" aria-hidden="true">
              ·
            </span>
            <span>
              <strong className="font-bold text-heading">
                {connected ? materiCount.toLocaleString("id-ID") : "-"}
              </strong>{" "}
              Materi Aktif
            </span>
          </div>

          <GlobeDoodle className="mt-5 hidden h-12 w-12 lg:block" />
        </div>

        <div className="relative">
          <HeroBooksIllustration />
          <SpiralPaperDoodle className="absolute -bottom-8 left-8 hidden h-12 w-12 lg:block" />
        </div>
      </div>

      {/* Dua lapis SVG gelombang putih di dasar hero */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden leading-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
          className="h-[90px] w-full md:h-[120px] lg:h-[150px]"
        >
          <path
            d="M0,64 C320,136 1080,0 1440,76 L1440,150 L0,150 Z"
            fill="#FFFFFF"
            fillOpacity="0.55"
          />
          <path
            d="M0,92 C420,154 1020,24 1440,96 L1440,150 L0,150 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </section>
  );
}
