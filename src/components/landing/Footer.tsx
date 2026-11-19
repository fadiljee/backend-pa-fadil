import Link from "next/link";
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";

interface FooterProps {
  isLoggedIn: boolean;
  schoolName: string;
  schoolSubtitle: string;
  description: string;
  contactAddress: string;
  contactEmail: string;
  contactPhone: string;
  copyrightText: string;
}

export function Footer({
  isLoggedIn,
  schoolName,
  schoolSubtitle,
  description,
  contactAddress,
  contactEmail,
  contactPhone,
  copyrightText,
}: FooterProps) {
  const hasContact = Boolean(contactAddress || contactEmail || contactPhone);

  return (
    <footer id="kontak" tabIndex={-1} className="scroll-mt-20 mt-12 bg-primary-dark text-white">
      <div className="mx-auto max-w-[1080px] px-5 py-12 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white text-primary">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <div className="text-xs text-sky-100">{schoolName}</div>
                <div className="text-sm font-extrabold">{schoolSubtitle}</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-200">{description}</p>
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
            {hasContact ? (
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                {contactAddress && (
                  <li className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-200" aria-hidden="true" />
                    <span>{contactAddress}</span>
                  </li>
                )}
                {contactEmail && (
                  <li className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 shrink-0 text-sky-200" aria-hidden="true" />
                    <a href={`mailto:${contactEmail}`} className="hover:text-white hover:underline">
                      {contactEmail}
                    </a>
                  </li>
                )}
                {contactPhone && (
                  <li className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0 text-sky-200" aria-hidden="true" />
                    <a href={`tel:${contactPhone}`} className="hover:text-white hover:underline">
                      {contactPhone}
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-300">
                Informasi kontak sekolah belum ditambahkan.
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-300">
          {copyrightText}
        </div>
      </div>
    </footer>
  );
}
