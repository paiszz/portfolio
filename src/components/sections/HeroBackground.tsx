"use client";

import { motion, useReducedMotion } from "motion/react";

export function HeroBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Subtle monochrome ambient lighting */}
      <motion.div
        initial={false}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                x: ["-4%", "4%", "-4%"],
                y: ["-3%", "3%", "-3%"],
              }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : {
                duration: 24,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
        className="absolute -top-1/3 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full opacity-75 will-change-transform md:h-[54rem] md:w-[54rem]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(17, 17, 17, 0.055) 0%, rgba(17, 17, 17, 0.02) 42%, transparent 72%)",
        }}
      />

      {/* Subtle architectural hairline grid */}
      <div
        className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(229, 229, 229, 0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(229, 229, 229, 0.45) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 45%, black 35%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 45%, black 35%, transparent 100%)",
        }}
      />

      {/* Fine film/industrial grain texture */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="hero-grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain-filter)" />
      </svg>
    </div>
  );
}
