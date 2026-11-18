"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils";
import type { ExperienceItem } from "@/types/portfolio";

interface ExperienceTimelineProps {
  items: ExperienceItem[];
}

const EXPAND_EASE = [0.22, 1, 0.36, 1] as const;

export function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    [items[0]?.id ?? ""]: true,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 35%"],
  });

  const lineScaleY = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    mass: 0.5,
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Vertical Timeline Track (Background) */}
      <div
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-3.5 w-px bg-border-subtle md:left-6"
      />

      {/* Animated Vertical Timeline Progress Line */}
      <motion.div
        aria-hidden="true"
        style={
          shouldReduceMotion
            ? { scaleY: 1 }
            : {
                scaleY: lineScaleY,
              }
        }
        className="absolute top-2 bottom-2 left-3.5 w-px origin-top bg-surface-dark md:left-6"
      />

      <ol className="space-y-8 md:space-y-10">
        {items.map((item, idx) => {
          const isExpanded = Boolean(expandedIds[item.id]);
          const panelId = `experience-details-${item.id}`;

          return (
            <li key={item.id} className="relative pl-11 md:pl-16">
              {/* Active Timeline Node Indicator */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-6 left-1.5 z-10 flex h-4 w-4 items-center justify-center rounded-full border transition-colors duration-300 md:left-4",
                  isExpanded
                    ? "border-surface-dark bg-surface-dark"
                    : "border-text-primary bg-bg-primary"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                    isExpanded ? "bg-surface-light" : "bg-surface-dark"
                  )}
                />
              </span>

              <Reveal delay={idx * 0.08} yOffset={16}>
                <article
                  className={cn(
                    "border transition-colors duration-200",
                    isExpanded
                      ? "border-text-primary bg-bg-primary"
                      : "border-border-subtle bg-bg-primary hover:border-text-primary/50"
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => toggleExpand(item.id)}
                    className="flex w-full flex-col gap-4 p-5 text-left transition-colors hover:bg-bg-secondary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary sm:p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="bg-surface-dark px-2 py-0.5 font-mono text-[11px] font-semibold tracking-widest text-surface-light tabular-nums">
                          {item.index}
                        </span>
                        <span className="font-mono text-[11px] tracking-wider text-text-secondary uppercase">
                          {item.contextType}
                        </span>
                      </div>

                      {item.period && (
                        <span className="font-mono text-[11px] tracking-widest text-text-secondary tabular-nums">
                          {item.period}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                          {item.title}
                        </h3>
                        <p className="mt-1 font-mono text-xs tracking-wide text-text-secondary uppercase">
                          {item.position} — {item.organization}
                        </p>
                        <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-text-secondary sm:text-base">
                          {item.summary}
                        </p>
                      </div>

                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-1 flex h-8 w-8 shrink-0 items-center justify-center border border-border-subtle transition-colors",
                          isExpanded
                            ? "bg-surface-dark text-surface-light"
                            : "bg-bg-secondary text-text-primary"
                        )}
                      >
                        <motion.span
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={
                            shouldReduceMotion
                              ? { duration: 0 }
                              : { duration: 0.25, ease: EXPAND_EASE }
                          }
                          className="flex items-center justify-center"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.span>
                      </span>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-label={`${item.title} details`}
                        initial={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : { height: 0, opacity: 0 }
                        }
                        animate={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : { height: "auto", opacity: 1 }
                        }
                        exit={
                          shouldReduceMotion
                            ? { opacity: 0 }
                            : { height: 0, opacity: 0 }
                        }
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { duration: 0.3, ease: EXPAND_EASE }
                        }
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border-subtle bg-bg-secondary/45 px-5 py-5 sm:px-6">
                          {item.sessionTitle && (
                            <div className="mb-4 border-l border-surface-dark pl-3.5">
                              <p className="text-sm font-medium text-text-primary">
                                {item.sessionTitle}
                              </p>
                              <p className="mt-0.5 font-mono text-[10px] tracking-widest text-text-secondary uppercase">
                                Seminar Session
                              </p>
                            </div>
                          )}

                          <p className="font-mono text-[11px] font-medium tracking-widest text-text-primary uppercase">
                            {item.detailsLabel}
                          </p>

                          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {item.details.map((detail) => (
                              <li
                                key={detail}
                                className="flex items-start gap-2.5 text-sm text-text-primary"
                              >
                                <span
                                  aria-hidden="true"
                                  className="mt-2 h-1.5 w-1.5 shrink-0 bg-surface-dark"
                                />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>

                          {item.image && (
                            <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden border border-border-subtle bg-bg-primary">
                              <Image
                                src={item.image}
                                alt={`${item.title} documentation`}
                                fill
                                sizes="(max-width: 768px) 100vw, 640px"
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
