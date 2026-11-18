import { PROJECT_ITEMS, SECTOR_CATEGORIES } from "@/data/projects";
import { SlotMachineHeading } from "@/components/projects/SlotMachineHeading";
import { LockerNavigation } from "@/components/projects/LockerNavigation";

export function ProjectShowcaseSection() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative border-b border-border-subtle bg-bg-primary py-20 md:py-28"
    >
      <div className="container-editorial">
        <div className="mb-10 border-b border-border-subtle pb-8 md:mb-14">
          <SlotMachineHeading text="SELECT SECTOR" />
          <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-text-secondary sm:text-lg">
            Choose an industrial locker sector to inspect software engineering
            deployments, interface design systems, and visual media archives.
          </p>
        </div>

        <LockerNavigation
          sectors={SECTOR_CATEGORIES}
          projects={PROJECT_ITEMS}
        />
      </div>
    </section>
  );
}
