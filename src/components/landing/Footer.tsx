import { Mail, MapPin, Phone, School } from "lucide-react";
import { SectionButton } from "./SectionLink";

interface FooterProps {
  schoolName: string;
  schoolSubtitle: string;
  description: string;
  contactAddress: string;
  contactEmail: string;
  contactPhone: string;
  copyrightText: string;
}

export function Footer({
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
    <footer id="kontak" tabIndex={-1} className="scroll-mt-20 w-full bg-crimson-dark text-white">
      <div className="mx-auto w-full max-w-[1360px] px-4 pb-24 pt-14 sm:px-6 sm:pb-12 md:px-10 lg:px-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-10">
          {/* Col 1: Crest & description */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-crimson text-gold-light">
                <School className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <div className="font-heading text-base font-extrabold uppercase tracking-tight text-white">
                  {schoolName}
                </div>
                <div className="text-xs text-gold-light">{schoolSubtitle}</div>
              </div>
            </div>
            <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-white/85">
              {description}
            </p>
          </div>

          {/* Col 2: Tautan Cepat */}
          <div className="md:col-span-2">
            <h2 className="font-heading text-xs font-bold uppercase tracking-[0.14em] text-gold-light">
              Tautan Cepat
            </h2>
            <ul className="mt-4 space-y-0.5 text-sm text-white/90">
              <li>
                <SectionButton
                  targetId="home"
                  className="inline-flex min-h-10 items-center hover:text-gold-light hover:underline"
                >
                  Beranda
                </SectionButton>
              </li>
              <li>
                <SectionButton
                  targetId="profil"
                  className="inline-flex min-h-10 items-center hover:text-gold-light hover:underline"
                >
                  Profil Sekolah
                </SectionButton>
              </li>
              <li>
                <SectionButton
                  targetId="visi-misi"
                  className="inline-flex min-h-10 items-center hover:text-gold-light hover:underline"
                >
                  Visi &amp; Misi
                </SectionButton>
              </li>
              <li>
                <SectionButton
                  targetId="galeri"
                  className="inline-flex min-h-10 items-center hover:text-gold-light hover:underline"
                >
                  Galeri Kegiatan
                </SectionButton>
              </li>
            </ul>
          </div>

          {/* Col 3: Akademik & Informasi */}
          <div className="md:col-span-2">
            <h2 className="font-heading text-xs font-bold uppercase tracking-[0.14em] text-gold-light">
              Informasi
            </h2>
            <ul className="mt-4 space-y-0.5 text-sm text-white/90">
              <li>
                <SectionButton
                  targetId="materi"
                  className="inline-flex min-h-10 items-center hover:text-gold-light hover:underline"
                >
                  Materi Ajar
                </SectionButton>
              </li>
              <li>
                <SectionButton
                  targetId="berita"
                  className="inline-flex min-h-10 items-center hover:text-gold-light hover:underline"
                >
                  Berita &amp; Agenda
                </SectionButton>
              </li>
              <li>
                <SectionButton
                  targetId="lokasi"
                  className="inline-flex min-h-10 items-center hover:text-gold-light hover:underline"
                >
                  Peta Lokasi
                </SectionButton>
              </li>
              <li>
                <SectionButton
                  targetId="hubungi"
                  className="inline-flex min-h-10 items-center hover:text-gold-light hover:underline"
                >
                  Formulir Pesan
                </SectionButton>
              </li>
            </ul>
          </div>

          {/* Col 4: Hubungi Kami */}
          <div className="md:col-span-4">
            <h2 className="font-heading text-xs font-bold uppercase tracking-[0.14em] text-gold-light">
              Hubungi Kami
            </h2>
            {hasContact ? (
              <ul className="mt-4 space-y-3 text-sm text-white/90">
                {contactAddress && (
                  <li className="flex items-start gap-2.5">
                    <MapPin
                      className="mt-1 h-4 w-4 shrink-0 text-gold-light"
                      aria-hidden="true"
                    />
                    <span className="break-words">{contactAddress}</span>
                  </li>
                )}
                {contactEmail && (
                  <li className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 shrink-0 text-gold-light" aria-hidden="true" />
                    <a
                      href={`mailto:${contactEmail}`}
                      className="inline-flex min-h-10 items-center break-all hover:text-gold-light hover:underline"
                    >
                      {contactEmail}
                    </a>
                  </li>
                )}
                {contactPhone && (
                  <li className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0 text-gold-light" aria-hidden="true" />
                    <a
                      href={`tel:${contactPhone}`}
                      className="inline-flex min-h-10 items-center hover:text-gold-light hover:underline"
                    >
                      {contactPhone}
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-white/80">
                Informasi kontak sekolah belum ditambahkan.
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6 text-center text-xs text-white/80">
          {copyrightText}
        </div>
      </div>
    </footer>
  );
}
