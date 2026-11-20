import { Award, BookOpen, ShieldCheck, Users } from "lucide-react";
import { EnquiryForm } from "./EnquiryForm";
import { SectionButton } from "./SectionLink";

interface HeroProps {
  schoolName: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  highlights: string[];
  heroPhotoUrl?: string | null;
}

const highlightIcons = [BookOpen, Users, Award, ShieldCheck];

function splitTwoToneTitle(rawTitle: string): { lead: string; accent: string } {
  const clean = rawTitle.trim();
  const commaIdx = clean.indexOf(",");
  if (commaIdx > 0 && commaIdx < clean.length - 4) {
    return {
      lead: clean.slice(0, commaIdx + 1),
      accent: clean.slice(commaIdx + 1).trim(),
    };
  }
  const words = clean.split(/\s+/);
  if (words.length <= 2) {
    return { lead: words[0] ?? clean, accent: words.slice(1).join(" ") };
  }
  const splitAt = Math.ceil(words.length / 2);
  return {
    lead: words.slice(0, splitAt).join(" "),
    accent: words.slice(splitAt).join(" "),
  };
}

export function Hero({
  schoolName,
  title,
  description,
  primaryCta,
  secondaryCta,
  highlights,
  heroPhotoUrl,
}: HeroProps) {
  const { lead, accent } = splitTwoToneTitle(title);

  return (
    <section
      id="home"
      tabIndex={-1}
      className="relative w-full overflow-hidden border-b border-slate-200/80 bg-[#F7F3EE]"
    >
      {/* Optional real school backdrop photo with guaranteed high-contrast scrim on left */}
      {heroPhotoUrl && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <img
            src={heroPhotoUrl}
            alt=""
            width={1440}
            height={680}
            fetchPriority="high"
            className="h-full w-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F3] via-[#FAF7F3]/92 to-[#FAF7F3]/65" />
        </div>
      )}

      {!heroPhotoUrl && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FAF7F3] via-white to-[#F2E7E2]"
        />
      )}

      <div className="relative z-10 mx-auto w-full max-w-[1360px] px-4 py-10 sm:px-6 sm:py-14 md:px-10 lg:px-14 lg:py-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Left 7 cols: Eyebrow, Two-Tone H1, Subtitle, 2 CTAs, Bottom Icon Strip */}
          <div className="lg:col-span-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/80">
              {schoolName}
            </p>
            <h1 className="mt-2.5 text-[clamp(2rem,1.4rem+2.5vw,3.4rem)] font-extrabold leading-[1.12] tracking-tight text-ink">
              <span>{lead}</span>
              {accent && (
                <>
                  {" "}
                  <span className="text-crimson">{accent}</span>
                </>
              )}
            </h1>
            <p className="mt-4 max-w-[50ch] text-[15px] leading-[1.75] text-body sm:text-base">
              {description}
            </p>

            <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <SectionButton
                targetId="profil"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-crimson px-7 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-crimson-dark active:scale-[0.98]"
              >
                {primaryCta}
              </SectionButton>
              <SectionButton
                targetId="lokasi"
                className="inline-flex min-h-12 items-center justify-center rounded-md border-[1.5px] border-ink/30 bg-white px-7 text-xs font-bold uppercase tracking-wider text-ink transition hover:border-crimson hover:bg-crimson-light hover:text-crimson active:scale-[0.98]"
              >
                {secondaryCta}
              </SectionButton>
            </div>

            {/* Bottom 4-icon horizontal strip matching reference */}
            <div className="mt-9 grid grid-cols-2 gap-4 rounded-xl border border-slate-200/80 bg-white/85 p-4 sm:grid-cols-4 sm:p-5">
              {highlights.slice(0, 4).map((label, idx) => {
                const Icon = highlightIcons[idx % highlightIcons.length];
                return (
                  <div
                    key={`${idx}-${label}`}
                    className="flex flex-col items-center gap-2 text-center"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-crimson/20 bg-crimson-light text-crimson">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-semibold leading-snug text-ink">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 5 cols: Floating Crimson-Header Enquiry Form (matches reference ENQUIRE NOW card) */}
          <div className="lg:col-span-5">
            <EnquiryForm className="mx-auto max-w-md lg:ml-auto lg:mr-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
