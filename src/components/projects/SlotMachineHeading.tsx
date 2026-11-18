"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface SlotMachineHeadingProps {
  text?: string;
  className?: string;
}

const REEL_GLYPHS = ["0", "X", "/", "#", "1", "="] as const;
const SLOT_EASE = [0.16, 1, 0.3, 1] as const;

function buildCharReel(targetChar: string, charIndex: number): string[] {
  const steps = 6;
  const sequence: string[] = [];

  for (let i = 0; i < steps; i++) {
    const glyph = REEL_GLYPHS[(charIndex + i) % REEL_GLYPHS.length];
    sequence.push(glyph);
  }
  sequence.push(targetChar);
  return sequence;
}

export function SlotMachineHeading({
  text = "SELECT SECTOR",
  className,
}: SlotMachineHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, amount: "some" });
  const shouldReduceMotion = useReducedMotion();
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (isInView || hasTriggered || shouldReduceMotion) return;

    const checkPosition = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.96) {
        setHasTriggered(true);
      }
    };

    const rafId = window.requestAnimationFrame(checkPosition);
    window.addEventListener("scroll", checkPosition, { passive: true });
    window.addEventListener("resize", checkPosition, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", checkPosition);
      window.removeEventListener("resize", checkPosition);
    };
  }, [isInView, hasTriggered, shouldReduceMotion]);

  const active = isInView || hasTriggered;
  const words = text.split(" ");

  if (shouldReduceMotion) {
    return (
      <h2
        ref={ref}
        id="projects-heading"
        className={cn(
          "font-editorial-display text-3xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl",
          className
        )}
      >
        {text}
      </h2>
    );
  }

  let globalCharIndex = 0;

  return (
    <h2
      ref={ref}
      id="projects-heading"
      className={cn(
        "font-editorial-display text-3xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl",
        className
      )}
    >
      <span className="sr-only">{text}</span>
      <span
        aria-hidden="true"
        className="inline-flex flex-wrap items-baseline gap-x-[0.28em] gap-y-1"
      >
        {words.map((word, wordIdx) => {
          const chars = Array.from(word);

          return (
            <span
              key={`${word}-${wordIdx}`}
              className="inline-flex whitespace-nowrap"
            >
              {chars.map((char, idx) => {
                const currentIndex = globalCharIndex++;
                const sequence = buildCharReel(char, currentIndex);
                const finalPercent =
                  -((sequence.length - 1) / sequence.length) * 100;

                return (
                  <span
                    key={`${char}-${idx}`}
                    className="relative inline-block h-[1.08em] overflow-hidden align-bottom leading-[1.08]"
                  >
                    <motion.span
                      initial={{ y: "0%" }}
                      animate={{
                        y: active ? `${finalPercent}%` : "0%",
                      }}
                      transition={{
                        duration: 0.65 + currentIndex * 0.045,
                        delay: active ? currentIndex * 0.035 : 0,
                        ease: SLOT_EASE,
                      }}
                      className="flex flex-col will-change-transform"
                    >
                      {sequence.map((glyph, stepIdx) => (
                        <span
                          key={`${glyph}-${stepIdx}`}
                          className="flex h-[1.08em] shrink-0 items-center justify-center leading-[1.08]"
                        >
                          {glyph}
                        </span>
                      ))}
                    </motion.span>
                  </span>
                );
              })}
            </span>
          );
        })}
      </span>
    </h2>
  );
}
