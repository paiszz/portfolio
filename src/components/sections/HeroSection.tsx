import { HeroBackground } from "@/components/sections/HeroBackground";
import { TextReveal } from "@/components/animations/TextReveal";
import { RollingText } from "@/components/animations/RollingText";

const PROFESSIONAL_TITLES = [
  "Frontend Developer",
  "Software Developer",
  "UI/UX Designer",
  "Graphic Designer",
] as const;

export function HeroSection() {
  return (
    <section
      id="home"
      aria-label="Hero"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden border-b border-border-subtle bg-bg-primary pt-24 pb-8 sm:pt-28 sm:pb-10 md:pt-36 md:pb-14"
    >
      <HeroBackground />

      <div className="container-editorial relative z-10 flex flex-1 flex-col justify-center">
        <div className="border-t border-b border-border-subtle py-8 sm:py-14 md:py-16">
          <TextReveal
            text="PORTFOLIO"
            as="h1"
            className="font-editorial-display text-[clamp(2.25rem,11.5vw,7.5rem)] font-bold tracking-tight text-text-primary"
            staggerDelay={0.045}
            initialDelay={0.08}
          />

          <div className="mt-6 sm:mt-8 md:mt-10">
            <RollingText
              items={PROFESSIONAL_TITLES}
              baseDelay={0.25}
              staggerDelay={0.18}
            />
          </div>
        </div>
      </div>

      {/* Minimal Industrial Editorial Baseline */}
      <div className="container-editorial relative z-10 flex items-center justify-between gap-4 pt-6 font-mono text-[10px] uppercase tracking-widest text-text-secondary sm:pt-8 sm:text-[11px]">
        <span className="truncate">Ridwan Faiz Herlambang</span>
        <span className="hidden sm:inline">Telkom University — S1 Informatika</span>
        <span className="shrink-0">Scroll</span>
      </div>
    </section>
  );
}
