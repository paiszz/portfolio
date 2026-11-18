"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { GraduationCap } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import type { EducationItem } from "@/types/portfolio";

interface EducationTimelineProps {
  items: EducationItem[];
}

export function EducationTimeline({ items }: EducationTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 45%"],
  });

  const lineScaleY = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    mass: 0.5,
  });

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

      <ol className="space-y-8">
        {items.map((item, idx) => {
          const itemNumber = String(idx + 1).padStart(2, "0");

          return (
            <li key={item.id} className="relative pl-11 md:pl-16">
              {/* Active Timeline Node Indicator */}
              <span
                aria-hidden="true"
                className="absolute top-6 left-1.5 z-10 flex h-4 w-4 items-center justify-center rounded-full border border-surface-dark bg-surface-dark md:left-4"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-surface-light" />
              </span>

              <Reveal delay={idx * 0.08} yOffset={16}>
                <article className="border border-text-primary bg-bg-primary p-5 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="bg-surface-dark px-2 py-0.5 font-mono text-[11px] font-semibold tracking-widest text-surface-light tabular-nums">
                        {itemNumber}
                      </span>
                      <span className="font-mono text-[11px] tracking-wider text-text-secondary uppercase">
                        Undergraduate Program
                      </span>
                    </div>

                    <span className="border border-border-subtle bg-bg-secondary px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-widest text-text-primary tabular-nums">
                      {item.period}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                        {item.institution}
                      </h3>
                      <p className="mt-1 font-mono text-xs tracking-wider text-text-secondary uppercase sm:text-sm">
                        {item.degree}
                      </p>
                    </div>

                    <div
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center border border-border-subtle bg-bg-secondary text-text-primary"
                    >
                      <GraduationCap className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
