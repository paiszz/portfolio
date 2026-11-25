"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface RollingTextProps {
  items: readonly string[];
  baseDelay?: number;
  staggerDelay?: number;
  className?: string;
}

const REEL_EASE = [0.16, 1, 0.3, 1] as const;
const ITEM_HEIGHT_PX = 32;
const REEL_CYCLES = 2;

function buildReelSequence(
  items: readonly string[],
  targetIndex: number
): string[] {
  const sequence: string[] = [];
  const total = items.length;

  for (let i = 0; i < REEL_CYCLES * total; i++) {
    sequence.push(items[(targetIndex + i + 1) % total]);
  }
  sequence.push(items[targetIndex]);
  return sequence;
}

interface ReelSlotProps {
  index: number;
  items: readonly string[];
  delay: number;
  cycleTick: number;
}

function ReelSlot({ index, items, delay, cycleTick }: ReelSlotProps) {
  const shouldReduceMotion = useReducedMotion();
  const [manualRollCount, setManualRollCount] = useState(0);
  const isAnimatingRef = useRef(false);

  const sequence = buildReelSequence(items, index);
  const finalOffsetPx = -((sequence.length - 1) * ITEM_HEIGHT_PX);
  const slotNumber = String(index + 1).padStart(2, "0");
  const title = items[index];

  const animationKey = `${cycleTick}-${manualRollCount}`;
  const isInitialOrCycle = manualRollCount === 0;
  const activeDelay = isInitialOrCycle ? delay : 0;
  const duration = 0.78 + index * 0.16;

  const triggerManualRoll = () => {
    if (shouldReduceMotion || isAnimatingRef.current) return;
    setManualRollCount((prev) => prev + 1);
  };

  return (
    <button
      type="button"
      onClick={triggerManualRoll}
      aria-label={`${title} — replay rolling text`}
      className={cn(
        "group relative flex w-full items-center justify-between gap-3 border border-border-subtle bg-bg-primary/85 px-3.5 py-2.5 text-left transition-colors sm:px-4",
        "hover:border-text-primary/40 hover:bg-bg-secondary/70",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
      )}
    >
      <span className="font-mono text-[11px] tracking-widest text-text-secondary tabular-nums">
        {slotNumber}
      </span>

      <span className="relative h-8 flex-1 overflow-hidden">
        {shouldReduceMotion ? (
          <span className="flex h-8 items-center truncate text-sm font-medium leading-8 tracking-tight text-text-primary sm:text-base">
            {title}
          </span>
        ) : (
          <motion.span
            key={animationKey}
            initial={{ y: 0 }}
            animate={{ y: finalOffsetPx }}
            transition={{
              duration,
              delay: activeDelay,
              ease: REEL_EASE,
            }}
            onAnimationStart={() => {
              isAnimatingRef.current = true;
            }}
            onAnimationComplete={() => {
              isAnimatingRef.current = false;
            }}
            className="flex flex-col will-change-transform"
          >
            {sequence.map((entry, stepIdx) => (
              <span
                key={`${entry}-${stepIdx}`}
                className="flex h-8 shrink-0 items-center truncate text-sm font-medium leading-8 tracking-tight text-text-primary sm:text-base"
              >
                {entry}
              </span>
            ))}
          </motion.span>
        )}
      </span>

      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-border-subtle transition-colors group-hover:bg-text-primary"
      />
    </button>
  );
}

export function RollingText({
  items,
  baseDelay = 0.2,
  staggerDelay = 0.14,
  className,
}: RollingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.4 });
  const shouldReduceMotion = useReducedMotion();
  const [cycleTick, setCycleTick] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion || !isInView) return;

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setCycleTick((prev) => prev + 1);
      }
    }, 7000);

    return () => window.clearInterval(interval);
  }, [isInView, shouldReduceMotion]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
      role="region"
      aria-label="Professional disciplines"
    >
      {items.map((item, index) => (
        <ReelSlot
          key={item}
          index={index}
          items={items}
          delay={baseDelay + index * staggerDelay}
          cycleTick={cycleTick}
        />
      ))}
    </div>
  );
}
