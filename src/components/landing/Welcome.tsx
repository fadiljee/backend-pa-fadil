import { WELCOME_CONTENT } from "@/lib/content";
import { Confetti } from "./Confetti";
import { LandingButton } from "./LandingButton";
import { Reveal } from "./Reveal";
import { SectionTitle } from "./SectionTitle";

export function Welcome() {
  return (
    <section
      id="tentang"
      tabIndex={-1}
      className="relative scroll-mt-[88px] w-full overflow-hidden bg-surface py-14 md:py-20 lg:py-24"
    >
      <Confetti variant="white" preset="welcome" />

      <div className="relative z-10 mx-auto w-full max-w-[880px] px-5 text-center md:px-8">
        <Reveal>
          <SectionTitle as="h1" title={WELCOME_CONTENT.title} />
          <p className="mt-5 text-sm leading-[1.7] text-body md:text-[15px] lg:text-base lg:leading-[1.75]">
            {WELCOME_CONTENT.paragraph}
          </p>
          <div className="mt-7 flex justify-center">
            <LandingButton
              variant="primary"
              targetId={WELCOME_CONTENT.ctaTargetId}
            >
              {WELCOME_CONTENT.ctaLabel}
            </LandingButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
