import { ANNOUNCEMENTS_HEADER, ANNOUNCEMENTS_LIST } from "@/lib/content";
import { Confetti } from "./Confetti";
import { LandingButton } from "./LandingButton";
import { Reveal } from "./Reveal";
import { SectionTitle } from "./SectionTitle";

export function Announcements() {
  const rows = ANNOUNCEMENTS_LIST.slice(0, 4);

  return (
    <section
      id="pengumuman"
      tabIndex={-1}
      className="relative scroll-mt-[88px] w-full overflow-hidden bg-surface-soft py-16 md:py-[88px] lg:py-[112px]"
    >
      <Confetti variant="white" preset="announcements" />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <Reveal>
          <SectionTitle
            title={ANNOUNCEMENTS_HEADER.title}
            subtitle={ANNOUNCEMENTS_HEADER.subtitle}
          />
        </Reveal>

        <div className="mx-auto mt-10 max-w-[960px] space-y-5 lg:space-y-7">
          {rows.map((item, idx) => (
            <Reveal key={item.slug} delayMs={idx * 85}>
              <article className="flex flex-col gap-4 rounded-[14px] bg-surface px-6 py-5 shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] motion-reduce:transition-none sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
                <h3 className="text-base font-semibold leading-snug text-ink lg:text-[18px]">
                  {item.title}
                </h3>

                <div className="flex w-full shrink-0 items-center gap-3 sm:w-auto">
                  <LandingButton
                    variant="primary-sm"
                    href={`/pengumuman/${item.slug}`}
                    ariaLabel={`Lihat: ${item.title}`}
                    className="flex-1 sm:flex-none"
                  >
                    Lihat
                  </LandingButton>
                  <LandingButton
                    variant="primary-sm"
                    href={`/api/pengumuman/${item.slug}`}
                    download
                    ariaLabel={`Unduh: ${item.title}`}
                    className="flex-1 sm:flex-none"
                  >
                    Unduh
                  </LandingButton>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
