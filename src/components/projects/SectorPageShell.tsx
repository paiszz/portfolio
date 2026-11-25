"use client";

import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useDoorTransition } from "@/context/DoorTransitionContext";

interface SectorPageShellProps {
  children: ReactNode;
}

export function SectorPageShell({ children }: SectorPageShellProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const {
    transitionPhase,
    overlayStep,
    notifySectorPageMounted,
  } = useDoorTransition();

  const isEntering = transitionPhase === "entering";
  const isExiting = transitionPhase === "exiting";
  const isRevealReady = !isEntering || overlayStep === "enter-reveal";

  // Force immediate scroll to top before paint and signal DoorTransitionContext that SectorPageShell is mounted
  useLayoutEffect(() => {
    const html = document.documentElement;
    const prevScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    html.style.scrollBehavior = prevScrollBehavior;
    notifySectorPageMounted();
  }, [notifySectorPageMounted]);

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/projects");
    router.prefetch("/#projects");
  }, [router]);

  return (
    <motion.div
      initial={
        isEntering && !shouldReduceMotion
          ? { opacity: 0, scale: 1.04 }
          : false
      }
      animate={
        shouldReduceMotion
          ? { opacity: 1, scale: 1 }
          : isExiting
            ? { opacity: 0, scale: 0.97 }
            : isRevealReady
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 1.04 }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0.1 }
          : isExiting
            ? { duration: 0.3, ease: [0.65, 0, 0.35, 1] }
            : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
      }
      className="container-editorial pb-6 will-change-transform"
    >
      {children}
    </motion.div>
  );
}
