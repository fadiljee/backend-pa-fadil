import { CALENDAR_BANNER } from "@/lib/content";
import { LandingButton } from "./LandingButton";
import { Reveal } from "./Reveal";

export function CalendarBanner() {
  return (
    <section
      aria-label={CALENDAR_BANNER.title}
      className="w-full bg-brand py-6 text-white sm:py-7"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <Reveal>
          <div className="flex min-h-[48px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <h2 className="text-xl font-semibold leading-tight text-white md:text-2xl lg:text-[28px]">
              {CALENDAR_BANNER.title}
            </h2>

            <LandingButton
              variant="white"
              href={CALENDAR_BANNER.downloadHref}
              download
              ariaLabel="Unduh Kalender Akademik SMPN 1 Merawang"
              className="w-full shrink-0 sm:w-auto"
            >
              {CALENDAR_BANNER.buttonLabel}
            </LandingButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
