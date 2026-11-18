import { SKILL_CATEGORIES } from "@/data/skills";
import { Reveal } from "@/components/animations/Reveal";
import { SkillCard } from "@/components/sections/SkillCard";

export function SkillsSection() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative border-b border-border-subtle bg-bg-primary py-20 md:py-28"
    >
      <div className="container-editorial">
        <Reveal>
          <div className="border-b border-border-subtle pb-8">
            <h2
              id="skills-heading"
              className="font-editorial-display text-3xl font-bold tracking-tight text-text-primary sm:text-5xl"
            >
              Tech Stack &amp; Skills
            </h2>
            <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-text-secondary sm:text-lg">
              Structured technical and creative capabilities across software
              engineering, frontend architecture, collaborative tooling, and
              visual media production.
            </p>
          </div>
        </Reveal>

        <div className="divide-y divide-border-subtle">
          {SKILL_CATEGORIES.map((category, categoryIndex) => (
            <div
              key={category.key}
              className="grid grid-cols-1 gap-8 py-10 lg:grid-cols-12 lg:gap-12"
            >
              <Reveal
                delay={categoryIndex * 0.06}
                className="lg:col-span-4"
              >
                <div className="flex items-baseline justify-between gap-3 lg:flex-col lg:items-start">
                  <h3 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                    {category.title}
                  </h3>
                  <span className="border border-border-subtle bg-bg-secondary px-2 py-0.5 font-mono text-[11px] tracking-widest text-text-secondary uppercase">
                    {category.code}
                  </span>
                </div>
                <p className="mt-3 max-w-[50ch] text-sm leading-relaxed text-text-secondary">
                  {category.description}
                </p>
              </Reveal>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:col-span-8">
                {category.skills.map((skill, skillIndex) => (
                  <Reveal
                    key={skill.name}
                    delay={Math.min(skillIndex * 0.04, 0.16)}
                    yOffset={14}
                  >
                    <SkillCard skill={skill} index={skillIndex} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
