"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ChevronDown, FileText, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectItem } from "@/types/portfolio";

interface ProjectCardProps {
  project: ProjectItem;
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

export function ProjectCard({ project, totalInSector }: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);

  const isVerified = project.verificationStatus === "verified";
  const isWorkInProgress = project.verificationStatus === "work_in_progress";
  const hasSafeLiveUrl = isSafeHttpsUrl(project.liveUrl);
  const hasSafeGithubUrl = isSafeHttpsUrl(project.githubUrl);
  const caseStudyPanelId = `case-study-${project.id}`;

  return (
    <article
      className={cn(
        "overflow-hidden border bg-bg-primary transition-shadow duration-300",
        isVerified || isWorkInProgress
          ? "border-text-primary shadow-[0_18px_40px_-18px_rgba(17,17,17,0.16)]"
          : "border-border-subtle shadow-[0_12px_30px_-18px_rgba(17,17,17,0.1)]"
      )}
    >
      {/* Top Industrial Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle bg-bg-secondary px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="bg-surface-dark px-2 py-0.5 font-mono text-[11px] font-semibold tracking-widest text-surface-light tabular-nums">
            {project.sectorId} / {project.index} OF{" "}
            {String(totalInSector).padStart(2, "0")}
          </span>
          <span
            className={cn(
              "px-2 py-0.5 font-mono text-[10px] font-medium tracking-widest uppercase",
              isVerified || isWorkInProgress
                ? "bg-surface-dark text-surface-light"
                : "bg-bg-primary text-text-secondary"
            )}
          >
            {project.statusLabel}
          </span>
        </div>

        <span className="font-mono text-[10px] tracking-widest text-text-secondary uppercase">
          {isVerified
            ? project.statusLabel.toLowerCase().includes("pending")
              ? "LIVE INTERFACE"
              : "VERIFIED DEPLOYMENT"
            : isWorkInProgress
              ? "WORK IN PROGRESS"
              : "DATA CONFIRMATION REQUIRED"}
        </span>
      </div>

      {/* Main Split Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Project Cover / Schematic Preview (strict 16:9 without cropping) */}
        <div className="flex items-center border-b border-border-subtle bg-bg-secondary lg:col-span-7 lg:border-r lg:border-b-0">
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={project.coverImage}
              alt={project.coverAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 660px"
              className="object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Right: Project Details, Tools, Role & Actions */}
        <div className="flex flex-col justify-between p-5 lg:col-span-5">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              {project.title}
            </h3>
            <p className="mt-1 font-mono text-xs tracking-wide text-text-secondary uppercase">
              {project.subtitle}
            </p>

            <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-text-primary">
              {project.description}
            </p>

            {/* Personal Role & Contribution */}
            <div className="mt-3.5 border-t border-border-subtle pt-3">
              <p className="text-xs leading-relaxed text-text-secondary">
                <strong className="font-mono text-[11px] font-semibold tracking-wider text-text-primary uppercase">
                  Role &amp; Contribution:{" "}
                </strong>
                {project.role}
              </p>
            </div>

            {/* Technology Stack / Design Tools */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="bg-bg-secondary px-2.5 py-1 font-mono text-[11px] tracking-wider text-text-primary uppercase"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons: View Case Study + Live Demo / GitHub */}
          <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-border-subtle pt-4">
            <button
              type="button"
              aria-expanded={caseStudyOpen}
              aria-controls={caseStudyPanelId}
              onClick={() => setCaseStudyOpen((prev) => !prev)}
              className={cn(
                "inline-flex min-h-[42px] items-center gap-2 px-4 py-2 font-mono text-xs font-medium tracking-wider uppercase transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
                caseStudyOpen
                  ? "bg-surface-dark text-surface-light"
                  : "bg-bg-secondary text-text-primary hover:bg-surface-dark hover:text-surface-light"
              )}
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              <span>View Case Study</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  caseStudyOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>

            {hasSafeLiveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] items-center gap-2 bg-surface-dark px-4 py-2 font-mono text-xs font-semibold tracking-wider text-surface-light uppercase transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
              >
                <span>Live Demo</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}

            {hasSafeGithubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] items-center gap-2 bg-bg-secondary px-4 py-2 font-mono text-xs font-medium tracking-wider text-text-primary uppercase transition-colors hover:bg-surface-dark hover:text-surface-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
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
            <div className="border-t border-border-subtle bg-bg-secondary/60 px-5 py-5 sm:px-7">
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
                      Verified Capabilities &amp; Features
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {project.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-xs text-text-primary sm:text-sm"
                        >
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 shrink-0 bg-surface-dark"
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
