import { PROJECT_ITEMS, SECTOR_CATEGORIES } from "@/data/projects";
import { LockerNavigation } from "@/components/projects/LockerNavigation";

export function ProjectShowcaseSection() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative border-b border-border-subtle bg-bg-primary pt-24 pb-20 md:pt-28 md:pb-28"
    >
      <LockerNavigation
        sectors={SECTOR_CATEGORIES}
        projects={PROJECT_ITEMS}
      />
    </section>
  );
}
