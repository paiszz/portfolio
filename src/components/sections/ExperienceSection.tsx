import { EXPERIENCE_ITEMS } from "@/data/experience";
import { Reveal } from "@/components/animations/Reveal";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";

export function ExperienceSection() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative border-b border-border-subtle bg-bg-primary py-20 md:py-28"
    >
      <div className="container-editorial">
        <Reveal>
          <div className="mb-12 border-b border-border-subtle pb-8 md:mb-16">
            <h2
              id="experience-heading"
              className="font-editorial-display text-3xl font-bold tracking-tight text-text-primary sm:text-5xl"
            >
              Experience &amp; Activities
            </h2>
            <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-text-secondary sm:text-lg">
              Organizational involvement, technology seminar committee roles,
              and structured virtual internship learning programs.
            </p>
          </div>
        </Reveal>

        <ExperienceTimeline items={EXPERIENCE_ITEMS} />
      </div>
    </section>
  );
}
