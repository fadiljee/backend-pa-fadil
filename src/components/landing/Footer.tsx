import Link from "next/link";
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";

export function Footer({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <footer id="kontak" className="scroll-mt-20 mt-12 bg-primary-dark text-white">
      <div className="mx-auto max-w-[1080px] px-5 py-12 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white text-primary">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <div className="text-xs text-sky-100">SMPN 1 Merawang</div>
                <div className="text-sm font-extrabold">Portal Sekolah</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-200">
              Portal informasi resmi, data siswa aktif, dan materi pembelajaran SMPN 1 Merawang.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Tautan Cepat
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>
                <a href="#home" className="inline-flex min-h-11 items-center hover:text-white hover:underline">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#materi" className="inline-flex min-h-11 items-center hover:text-white hover:underline">
                  Materi Pembelajaran
                </a>
              </li>
              <li>
                <a href="#tentang" className="inline-flex min-h-11 items-center hover:text-white hover:underline">
                  Tentang Sekolah
                </a>
              </li>
              <li>
                <Link
                  href={isLoggedIn ? "/admin" : "/login"}
                  className="inline-flex min-h-11 items-center font-semibold text-white hover:underline"
                >
                  {isLoggedIn ? "Panel Admin" : "Masuk Admin"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Kontak</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-200" aria-hidden="true" />
                <span>Kecamatan Merawang [REAL DATA: Alamat Lengkap]</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-sky-200" aria-hidden="true" />
                <span>[REAL DATA: Email Sekolah]</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-sky-200" aria-hidden="true" />
                <span>[REAL DATA: Telepon Sekolah]</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-300">
          © 2026 SMPN 1 Merawang. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
