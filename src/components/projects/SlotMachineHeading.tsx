"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface SlotMachineHeadingProps {
  text?: string;
  className?: string;
}

export function SlotMachineHeading({
  text = "SELECT SECTOR",
  className,
}: SlotMachineHeadingProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.h2
      id="projects-heading"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: "some" }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
      }
      className={cn(
        "font-editorial-display text-3xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl",
        className
      )}
    >
      {text}
    </motion.h2>
  );
}
