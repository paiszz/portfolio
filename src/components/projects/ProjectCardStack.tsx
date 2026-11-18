"use client";

import { useRef } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { cn } from "@/lib/utils";
import type { ProjectItem, SectorCategory, SectorId } from "@/types/portfolio";

interface ProjectCardStackProps {
  sector: SectorCategory;
  allSectors: SectorCategory[];
  projects: ProjectItem[];
  onSwitchSector: (id: SectorId) => void;
}

interface StackedCardItemProps {
  project: ProjectItem;
  index: number;
  total: number;
}

function StackedCardItem({ project, index, total }: StackedCardItemProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 18%", "end start"],
  });

  const targetScale = 1 - Math.min((total - 1 - index) * 0.025, 0.07);
  const rawScale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const smoothScale = useSpring(rawScale, {
    stiffness: 200,
    damping: 28,
    mass: 0.6,
  });

  const stickyTopRem = 5.75 + index * 1.25;

  return (
    <div
      ref={cardRef}
      style={{
        top: `${stickyTopRem}rem`,
      }}
      className="relative md:sticky"
    >
      <motion.div
        style={
          shouldReduceMotion || index === total - 1
            ? undefined
            : {
                scale: smoothScale,
                transformOrigin: "top center",
              }
        }
        className="will-change-transform"
      >
        <ProjectCard project={project} totalInSector={total} />
      </motion.div>
    </div>
  );
}

export function ProjectCardStack({
  sector,
  allSectors,
  projects,
  onSwitchSector,
}: ProjectCardStackProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div id="project-stack-anchor" className="mt-14 scroll-mt-24 md:mt-20">
      {/* Stack Header & Quick Sector Switcher */}
      <div className="flex flex-col justify-between gap-4 border-t border-b border-border-subtle py-5 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
            {sector.id} — {sector.title} Showcase
          </h3>
          <p className="mt-1 font-mono text-xs tracking-wider text-text-secondary uppercase">
            {projects.length} {projects.length === 1 ? "Project" : "Projects"}{" "}
            in Stack · Scroll to Inspect
          </p>
        </div>

        <div
          role="group"
          aria-label="Switch active project sector"
          className="flex flex-wrap items-center gap-1.5"
        >
          {allSectors.map((item) => {
            const isActive = item.id === sector.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => onSwitchSector(item.id)}
                className={cn(
                  "min-h-[36px] px-3 py-1.5 font-mono text-xs font-medium tracking-wider uppercase transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
                  isActive
                    ? "bg-surface-dark text-surface-light"
                    : "bg-bg-secondary text-text-secondary hover:text-text-primary"
                )}
              >
                {item.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stacked Cards Container (Sticky Stack on Desktop, Natural Vertical Scroll on Mobile) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sector.id}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
          }
          className="mt-8 space-y-6 md:space-y-10"
        >
          {projects.map((project, index) => (
            <StackedCardItem
              key={project.id}
              project={project}
              index={index}
              total={projects.length}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* End of Stack Marker */}
      <div className="mt-8 flex items-center justify-between border-t border-border-subtle pt-4 font-mono text-[11px] tracking-widest text-text-secondary uppercase">
        <span>END OF {sector.id} STACK</span>
        <span>CONTINUE SCROLLING</span>
      </div>
    </div>
  );
}
