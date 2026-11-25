"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { cn } from "@/lib/utils";
import type { ProjectItem, SectorCategory } from "@/types/portfolio";

interface ProjectCardStackProps {
  sector: SectorCategory;
  allSectors: SectorCategory[];
  projects: ProjectItem[];
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
    offset: ["start 15%", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const targetScale = 1 - Math.min((total - 1 - index) * 0.03, 0.08);
  const smoothScale = useTransform(smoothProgress, [0, 1], [1, targetScale]);
  const smoothOpacity = useTransform(smoothProgress, [0, 0.85, 1], [1, 1, 0.92]);

  return (
    <div
      ref={cardRef}
      style={{
        top: `calc(96px + ${index * 24}px)`,
      }}
      className="relative md:sticky"
    >
      <motion.div
        style={
          shouldReduceMotion || index === total - 1
            ? undefined
            : {
                scale: smoothScale,
                opacity: smoothOpacity,
                transformOrigin: "top center",
              }
        }
        className="will-change-transform"
      >
        <ProjectCard project={project} index={index} totalInSector={total} />
      </motion.div>
    </div>
  );
}

export function ProjectCardStack({
  sector,
  allSectors,
  projects,
}: ProjectCardStackProps) {
  return (
    <div id="project-stack-anchor" className="mt-10 scroll-mt-24">
      {/* Quick Sector Switcher Bar */}
      <div className="flex flex-col justify-between gap-4 border-b border-border-subtle pb-5 sm:flex-row sm:items-center">
        <p className="font-mono text-xs tracking-wider text-text-secondary uppercase">
          {projects.length} {projects.length === 1 ? "Entry" : "Entries"} in{" "}
          {sector.id} · Scroll to Inspect
        </p>

        <nav
          aria-label="Switch active project sector"
          className="flex flex-wrap items-center gap-1.5"
        >
          {allSectors.map((item) => {
            const isActive = item.id === sector.id;
            return (
              <Link
                key={item.id}
                href={`/projects/${item.id.toLowerCase()}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-[36px] items-center rounded-full px-3.5 py-1.5 font-mono text-xs font-medium tracking-wider uppercase transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
                  isActive
                    ? "bg-surface-dark text-surface-light"
                    : "border border-border-subtle bg-bg-secondary text-text-secondary hover:text-text-primary"
                )}
              >
                {item.id}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sticky Stacking Cards on Desktop, Natural Vertical Scroll on Mobile */}
      <div className="mt-8 space-y-8 md:space-y-12">
        {projects.map((project, index) => (
          <StackedCardItem
            key={project.id}
            project={project}
            index={index}
            total={projects.length}
          />
        ))}
      </div>
    </div>
  );
}
