"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FluidCursorMaskReveal } from "@/components/animations/FluidCursorMaskReveal";
import { Parallax } from "@/components/animations/Parallax";
import { cn } from "@/lib/utils";
import type { AboutData } from "@/types/portfolio";

interface InteractivePortraitProps {
  portraits: AboutData["portraits"];
}

export function InteractivePortrait({ portraits }: InteractivePortraitProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isToggled, setIsToggled] = useState(false);

  const activePortrait = isToggled ? portraits.hover : portraits.default;

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      {/* Floating Decorative Elements (Industrial Editorial Coordinates) */}
      <motion.div
        aria-hidden="true"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                y: [-4, 4, -4],
              }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
        className="pointer-events-none absolute -top-3 -left-3 z-20 hidden border border-border-subtle bg-bg-primary px-2.5 py-1 font-mono text-[10px] tracking-widest text-text-secondary shadow-xs sm:block"
      >
        FIG.02 // DUAL PORTRAIT
      </motion.div>

      <motion.div
        aria-hidden="true"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                y: [4, -4, 4],
              }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : {
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
        className="pointer-events-none absolute -right-3 -bottom-3 z-20 hidden border border-border-subtle bg-surface-dark px-2.5 py-1 font-mono text-[10px] tracking-widest text-surface-light sm:block"
      >
        {activePortrait.stateLabel}
      </motion.div>

      <Parallax offset={18}>
        <div className="border border-border-subtle bg-bg-secondary p-3 sm:p-4">
          {/* Interactive Fluid Cursor Mask Portrait Viewport */}
          <div
            role="button"
            tabIndex={0}
            aria-pressed={isToggled}
            aria-label={`Interactive portrait: currently showing ${activePortrait.caption}. Move cursor to reveal Telkom University Almamater fluidly, or click to toggle full view.`}
            onClick={() => setIsToggled((prev) => !prev)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setIsToggled((prev) => !prev);
              }
            }}
            className="group relative aspect-[4/5] w-full cursor-pointer overflow-hidden bg-bg-primary select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
          >
            <FluidCursorMaskReveal
              baseSrc={portraits.default.src}
              revealSrc={portraits.hover.src}
              baseAlt={portraits.default.alt}
              revealAlt={portraits.hover.alt}
              maskRadius={92}
              trailLength={16}
              smoothness={0.2}
              isRevealed={isToggled}
            />

            {/* Top Overlay Status Pill */}
            <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-center justify-between gap-2">
              <span
                className={cn(
                  "border px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase transition-colors duration-300",
                  isToggled
                    ? "border-surface-light/25 bg-surface-dark/85 text-surface-light"
                    : "border-border-subtle bg-bg-primary/90 text-text-primary"
                )}
              >
                {activePortrait.stateLabel}
              </span>

              <span
                className={cn(
                  "px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase transition-colors duration-300",
                  isToggled
                    ? "bg-surface-light text-surface-dark"
                    : "bg-surface-dark text-surface-light"
                )}
              >
                <span className="hidden md:inline">Hover / Click</span>
                <span className="md:hidden">Tap / Drag</span>
              </span>
            </div>
          </div>

          {/* Explicit Accessible State Switcher Bar (Touch & Keyboard Friendly) */}
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border-subtle pt-3">
            <div className="min-w-0">
              <p className="truncate font-mono text-[11px] font-medium tracking-wider text-text-primary uppercase">
                {activePortrait.caption}
              </p>
              <p className="truncate font-mono text-[10px] text-text-secondary">
                {isToggled
                  ? "Telkom University — S1 Informatika"
                  : "Default Professional Attire"}
              </p>
            </div>

            <div
              role="group"
              aria-label="Portrait attire state selector"
              className="flex shrink-0 items-center border border-border-subtle bg-bg-primary p-0.5"
            >
              <button
                type="button"
                onClick={() => setIsToggled(false)}
                aria-pressed={!isToggled}
                className={cn(
                  "min-h-[32px] px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
                  !isToggled
                    ? "bg-surface-dark text-surface-light"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                01 Shirt
              </button>
              <button
                type="button"
                onClick={() => setIsToggled(true)}
                aria-pressed={isToggled}
                className={cn(
                  "min-h-[32px] px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
                  isToggled
                    ? "bg-surface-dark text-surface-light"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                02 Almamater
              </button>
            </div>
          </div>
        </div>
      </Parallax>
    </div>
  );
}
