"use client";

import { useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";
import type { SkillItem } from "@/types/portfolio";

interface SkillCardProps {
  skill: SkillItem;
  index: number;
}

function SkillIcon({ name }: { name: string }) {
  switch (name) {
    case "Java":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M7 17c2.5 1.2 7.5 1.2 10 0M6 20c3.2 1.2 8.8 1.2 12 0M11 4c1.5 1.6-1.5 3.2 0 4.8M14.5 5.5c1.2 1.3-1.2 2.5 0 3.8M7.5 12.5c0 2.2 2 3.5 4.5 3.5s4.5-1.3 4.5-3.5H7.5Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.5 12.5h1.2a1.8 1.8 0 0 1 0 3.6h-1.2"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );
    case "Python":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M12 3c-3.5 0-4 1.5-4 3.5V9h4.5v1H6.5C4.5 10 3 11.5 3 14.5S4.5 19 6.5 19H8v-2.5c0-1.5 1-2.5 2.5-2.5h4c1.2 0 2-.8 2-2V6.5C16.5 4.5 15.5 3 12 3Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M12 21c3.5 0 4-1.5 4-3.5V15h-4.5v-1h6c2 0 3.5-1.5 3.5-4.5S19.5 5 17.5 5H16v2.5c0 1.5-1 2.5-2.5 2.5h-4c-1.2 0-2 .8-2 2v5.5C7.5 19.5 8.5 21 12 21Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="6" r="0.9" fill="currentColor" />
          <circle cx="14" cy="18" r="0.9" fill="currentColor" />
        </svg>
      );
    case "C++":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M11 8.2A4.5 4.5 0 1 0 11 15.8"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <path
            d="M14.5 10v4M12.5 12h4M19.5 10v4M17.5 12h4"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );
    case "Go":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M2.5 10h4M1.5 13h3.5M3 16h2.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M12.5 9.8A3.8 3.8 0 1 0 13 15.5v-2.2h-2.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="18.5"
            cy="12.5"
            r="3.3"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      );
    case "TypeScript":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M8 11h5M10.5 11v6.5M15 16.8c.5.5 1.3.7 2.2.7 1.1 0 1.8-.5 1.8-1.3 0-.7-.5-1.1-1.6-1.4-1.1-.3-1.7-.7-1.7-1.5 0-.8.7-1.3 1.8-1.3.8 0 1.4.2 1.9.6"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "HTML":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M4 3h16l-1.5 15L12 21l-6.5-3L4 3Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M16 7.5H8l.4 4.2h7.2l-.4 4.1L12 16.8l-3.2-1-.2-2"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "CSS":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M4 3h16l-1.5 15L12 21l-6.5-3L4 3Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M8 7.5h8l-.4 4H9l.3 3.3 2.7.9 2.7-.9.3-3.3"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "JavaScript":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M11 11v5a1.8 1.8 0 0 1-3.2 1.1M14.8 16.8c.5.5 1.3.7 2.2.7 1.1 0 1.8-.5 1.8-1.3 0-.7-.5-1.1-1.6-1.4-1.1-.3-1.7-.7-1.7-1.5 0-.8.7-1.3 1.8-1.3.8 0 1.4.2 1.9.6"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "React":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <circle cx="12" cy="12" r="1.8" fill="currentColor" />
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.6"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.6"
            transform="rotate(60 12 12)"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.6"
            transform="rotate(120 12 12)"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "Next.js":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M9 16V8l8.5 10.8M15 8v5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "Git":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <circle cx="7" cy="6" r="2" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="17" cy="12" r="2" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M7 8v8M7 8c0 3 2.5 4 8 4"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );
    case "GitHub":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "Figma":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M9 3h3v6H9a3 3 0 1 1 0-6ZM12 3h3a3 3 0 1 1 0 6h-3V3ZM9 9h3v6H9a3 3 0 1 1 0-6ZM9 15h3v3a3 3 0 1 1-3-3Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <circle cx="15" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "Canva":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M14.8 9.2a3.8 3.8 0 1 0 0 5.6"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </svg>
      );
    case "CapCut":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M6.5 9.5 17.5 14.5M6.5 14.5 17.5 9.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );
    case "Adobe After Effects":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M6.8 16.5 9.4 8l2.6 8.5M7.5 14.2h3.8M14.2 13.5h4c0-1.6-1-2.6-2-2.6a2.3 2.3 0 0 0-2.2 2.6c0 1.7 1 2.8 2.4 2.8.8 0 1.4-.2 1.8-.5"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export function SkillCard({ skill, index }: SkillCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isActive, setIsActive] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), {
    stiffness: 260,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 260,
    damping: 22,
  });

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const xPct = (event.clientX - rect.left) / rect.width - 0.5;
    const yPct = (event.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsActive(false);
  };

  const itemNumber = String(index + 1).padStart(2, "0");

  return (
    <div className="perspective-[900px]">
      <motion.button
        type="button"
        aria-pressed={isActive}
        onPointerMove={handlePointerMove}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") {
            setIsActive(true);
          }
        }}
        onPointerLeave={handlePointerLeave}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        onClick={() => setIsActive((prev) => !prev)}
        style={
          shouldReduceMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }
        }
        className={cn(
          "group relative flex min-h-[112px] w-full flex-col justify-between overflow-hidden border border-border-subtle bg-bg-primary p-4 text-left transition-colors",
          "hover:border-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
          isActive && "border-text-primary bg-bg-secondary/60"
        )}
      >
        {/* Top Row: Icon + Animated Status Indicator */}
        <div className="flex w-full items-center justify-between gap-3">
          <motion.span
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    scale: isActive ? 1.12 : 1,
                    y: isActive ? -1.5 : 0,
                  }
            }
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "flex h-9 w-9 items-center justify-center transition-colors duration-200",
              isActive
                ? "bg-surface-dark text-surface-light"
                : "bg-bg-secondary text-text-primary group-hover:bg-surface-dark group-hover:text-surface-light"
            )}
          >
            <SkillIcon name={skill.name} />
          </motion.span>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-widest text-text-secondary tabular-nums">
              {itemNumber}
            </span>
            <motion.span
              aria-hidden="true"
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: isActive ? 1.25 : 1,
                    }
              }
              className={cn(
                "h-2 w-2 rounded-full transition-colors duration-200",
                isActive
                  ? "bg-surface-dark"
                  : "bg-border-subtle group-hover:bg-surface-dark"
              )}
            />
          </div>
        </div>

        {/* Bottom Row: Skill Name + Domain Metadata */}
        <div className="mt-5">
          <p className="text-sm font-semibold tracking-tight text-text-primary sm:text-base">
            {skill.name}
          </p>
          <p className="mt-0.5 font-mono text-[10px] tracking-wider text-text-secondary uppercase">
            {skill.domain}
          </p>
        </div>

        {/* Animated Monochrome Bottom Indicator Bar */}
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={{
            scaleX: isActive ? 1 : 0,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.26, ease: [0.22, 1, 0.36, 1] }
          }
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-surface-dark"
        />
      </motion.button>
    </div>
  );
}
