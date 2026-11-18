"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  once?: boolean;
}

const EDITORIAL_EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.48,
  yOffset = 16,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: "some" });
  const shouldReduceMotion = useReducedMotion();
  const [hasRevealed, setHasRevealed] = useState(false);

  // Ensure elements already in or above the viewport (e.g. after anchor jumps or fast scrolling) never stay hidden
  useEffect(() => {
    if (isInView || hasRevealed || shouldReduceMotion) return;

    const checkPosition = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.96) {
        setHasRevealed(true);
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
  }, [isInView, hasRevealed, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const visible = once ? hasRevealed || isInView : isInView;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: yOffset }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      transition={{
        duration,
        delay: visible ? delay : 0,
        ease: EDITORIAL_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
