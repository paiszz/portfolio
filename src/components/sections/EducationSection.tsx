import { EDUCATION_ITEMS } from "@/data/education";
import { Reveal } from "@/components/animations/Reveal";
import { EducationTimeline } from "@/components/sections/EducationTimeline";

export function EducationSection() {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="relative border-b border-border-subtle bg-bg-primary py-20 md:py-28"
    >
      <div className="container-editorial">
        <Reveal>
          <div className="mb-12 border-b border-border-subtle pb-8 md:mb-16">
            <h2
              id="education-heading"
              className="font-editorial-display text-3xl font-bold tracking-tight text-text-primary sm:text-5xl"
            >
              Education &amp; Learning Journey
            </h2>
            <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-text-secondary sm:text-lg">
              Academic background and ongoing undergraduate studies in
              Informatics.
            </p>
          </div>
        </Reveal>

        <EducationTimeline items={EDUCATION_ITEMS} />
      </div>
    </section>
  );
}
