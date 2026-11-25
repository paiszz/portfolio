"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ChevronDown, FileText, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectItem } from "@/types/portfolio";

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  totalInSector: number;
}

const CASE_STUDY_EASE = [0.22, 1, 0.36, 1] as const;

function isSafeHttpsUrl(url?: string): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function ProjectCard({
  project,
  index,
  totalInSector,
}: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);

  const isEvenCard = index % 2 === 1;
  const isVerified = project.verificationStatus === "verified";
  const isWorkInProgress = project.verificationStatus === "work_in_progress";
  const hasSafeLiveUrl = isSafeHttpsUrl(project.liveUrl);
  const hasSafeGithubUrl = isSafeHttpsUrl(project.githubUrl);
  const caseStudyPanelId = `case-study-${project.id}`;

  return (
    <article
      className={cn(
        "overflow-hidden rounded-3xl border bg-bg-primary transition-shadow duration-300",
        isVerified || isWorkInProgress
          ? "border-border-subtle shadow-[0_24px_60px_-28px_rgba(17,17,17,0.22)]"
          : "border-border-subtle shadow-[0_18px_40px_-24px_rgba(17,17,17,0.14)]"
      )}
    >
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle bg-bg-secondary/70 px-6 py-3.5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="rounded-full bg-surface-dark px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-widest text-surface-light tabular-nums">
            {project.sectorId} · {project.index} /{" "}
            {String(totalInSector).padStart(2, "0")}
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-widest uppercase",
              isVerified || isWorkInProgress
                ? "bg-surface-dark text-surface-light"
                : "bg-bg-primary text-text-secondary"
            )}
          >
            {project.statusLabel}
          </span>
        </div>

        <span className="font-mono text-[10px] tracking-widest text-text-secondary uppercase">
          {project.subtitle}
        </span>
      </div>

      {/* Alternating 2-Column Content (Odd: Text Left / Preview Right; Even: Preview Left / Text Right) */}
      <div className="grid grid-cols-1 items-center gap-0 lg:grid-cols-12">
        {/* Preview Column */}
        <div
          className={cn(
            "border-b border-border-subtle bg-bg-secondary/40 p-4 sm:p-6 lg:col-span-7 lg:border-b-0",
            isEvenCard
              ? "lg:order-1 lg:border-r"
              : "lg:order-2 lg:border-l"
          )}
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border-subtle bg-bg-primary">
            <Image
              src={project.coverImage}
              alt={project.coverAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 660px"
              className="object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Text & Actions Column */}
        <div
          className={cn(
            "flex flex-col justify-between p-6 sm:p-8 lg:col-span-5",
            isEvenCard ? "lg:order-2" : "lg:order-1"
          )}
        >
          <div>
            <h3 className="font-editorial-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              {project.title}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              {project.description}
            </p>

            {/* Personal Role */}
            <p className="mt-4 border-t border-border-subtle pt-3.5 text-xs leading-relaxed text-text-secondary">
              <strong className="font-mono text-[11px] font-semibold tracking-wider text-text-primary uppercase">
                Role:{" "}
              </strong>
              {project.role}
            </p>

            {/* Tech / Role Pill Tags */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-border-subtle bg-bg-secondary px-3 py-1 font-mono text-[11px] tracking-wider text-text-primary uppercase"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-border-subtle pt-5">
            {hasSafeLiveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-surface-dark px-5 py-2 font-mono text-xs font-semibold tracking-wider text-surface-light uppercase transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
              >
                <span>Visit live site</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}

            <button
              type="button"
              aria-expanded={caseStudyOpen}
              aria-controls={caseStudyPanelId}
              onClick={() => setCaseStudyOpen((prev) => !prev)}
              className={cn(
                "inline-flex min-h-[42px] items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs font-medium tracking-wider uppercase transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
                caseStudyOpen
                  ? "border-surface-dark bg-surface-dark text-surface-light"
                  : "border-border-subtle bg-bg-secondary text-text-primary hover:border-text-primary"
              )}
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{hasSafeLiveUrl ? "Case Study" : "View project"}</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  caseStudyOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>

            {hasSafeGithubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-border-subtle bg-bg-secondary px-4 py-2 font-mono text-xs font-medium tracking-wider text-text-primary uppercase transition-colors hover:border-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
              >
                <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
                <span>GitHub</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Case Study & Feature Specification Drawer */}
      <AnimatePresence initial={false}>
        {caseStudyOpen && (
          <motion.div
            id={caseStudyPanelId}
            role="region"
            aria-label={`${project.title} case study overview`}
            initial={
              shouldReduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { height: "auto", opacity: 1 }
            }
            exit={
              shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.28, ease: CASE_STUDY_EASE }
            }
            className="overflow-hidden"
          >
            <div className="border-t border-border-subtle bg-bg-secondary/60 px-6 py-6 sm:px-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div
                  className={
                    project.features && project.features.length > 0
                      ? "lg:col-span-7"
                      : "lg:col-span-12"
                  }
                >
                  <p className="font-mono text-[11px] font-semibold tracking-widest text-text-primary uppercase">
                    Case Study &amp; Architecture Notes
                  </p>
                  <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-text-secondary">
                    {project.caseStudySummary}
                  </p>
                </div>

                {project.features && project.features.length > 0 && (
                  <div className="lg:col-span-5">
                    <p className="font-mono text-[11px] font-semibold tracking-widest text-text-primary uppercase">
                      Key Capabilities &amp; Features
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {project.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-xs text-text-primary sm:text-sm"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-surface-dark"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
