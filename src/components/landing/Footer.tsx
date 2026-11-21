import Link from "next/link";
import { Globe, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { FOOTER_CONTENT } from "@/lib/content";
import { SectionButton } from "./SectionLink";

interface FooterProps {
  schoolName?: string;
  description?: string;
  contactAddress?: string;
  contactEmail?: string;
  contactPhone?: string;
  copyrightText?: string;
}

export function Footer({
  schoolName = FOOTER_CONTENT.schoolName,
  description = FOOTER_CONTENT.description,
  contactAddress,
  contactEmail,
  contactPhone,
  copyrightText = FOOTER_CONTENT.copyright,
}: FooterProps) {
  const address = contactAddress?.trim() || FOOTER_CONTENT.contact.address;
  const email = contactEmail?.trim() || FOOTER_CONTENT.contact.email;
  const phone = contactPhone?.trim() || FOOTER_CONTENT.contact.phone;

  return (
    <footer
      id="kontak"
      tabIndex={-1}
      className="scroll-mt-[88px] w-full bg-brand pt-14 text-white pb-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        {/* 4 Blocks: Brand + Hubungi Kami + Tentang + Kehidupan Sekolah */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Block 1: Brand + Description + Circular Social Icons */}
          <div className="lg:col-span-4">
            <h2 className="text-xl font-bold tracking-tight text-white">
              {schoolName}
            </h2>
            <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-white/90">
              {description}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <SectionButton
                targetId="home"
                ariaLabel="Situs resmi SMPN 1 Merawang"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white hover:text-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              >
                <Globe className="h-4 w-4" aria-hidden="true" />
              </SectionButton>
              <SectionButton
                targetId="berita"
                ariaLabel="Dokumentasi Instagram SMPN 1 Merawang"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white hover:text-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </SectionButton>
              <SectionButton
                targetId="galeri"
                ariaLabel="Kanal kegiatan SMPN 1 Merawang"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white hover:text-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              >
                <Youtube className="h-4 w-4" aria-hidden="true" />
              </SectionButton>
            </div>
          </div>

          {/* Block 2: Hubungi Kami */}
          <div className="lg:col-span-3">
            <h3 className="text-base font-semibold text-white">Hubungi Kami</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/95">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                <a href={`mailto:${email}`} className="break-all hover:underline">
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                <a href={`tel:${phone}`} className="hover:underline">
                  {phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Block 3: Tentang */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-semibold text-white">Tentang</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/95">
              {FOOTER_CONTENT.aboutLinks.map((link) => (
                <li key={link.label}>
                  {"targetId" in link && link.targetId ? (
                    <SectionButton
                      targetId={link.targetId}
                      className="inline-flex min-h-[32px] items-center hover:underline"
                    >
                      {link.label}
                    </SectionButton>
                  ) : (
                    <Link
                      href={link.href ?? "/"}
                      className="inline-flex min-h-[32px] items-center hover:underline"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Block 4: Kehidupan Sekolah */}
          <div className="lg:col-span-3">
            <h3 className="text-base font-semibold text-white">Kehidupan Sekolah</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/95">
              {FOOTER_CONTENT.campusLinks.map((link) => (
                <li key={link.label}>
                  {"targetId" in link && link.targetId ? (
                    <SectionButton
                      targetId={link.targetId}
                      className="inline-flex min-h-[32px] items-center hover:underline"
                    >
                      {link.label}
                    </SectionButton>
                  ) : link.href?.startsWith("/api/") ? (
                    <a
                      href={link.href}
                      download
                      className="inline-flex min-h-[32px] items-center hover:underline"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href ?? "/"}
                      className="inline-flex min-h-[32px] items-center hover:underline"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="mt-12 border-t border-white/20 pt-6 text-center text-[13px] text-white/95">
          {copyrightText}
        </div>
      </div>
    </footer>
  );
}
