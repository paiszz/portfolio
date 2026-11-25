"use client";

import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft } from "lucide-react";
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
    returnHref,
    notifySectorPageMounted,
    exitProjectTo,
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
    <>
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
        className="container-editorial pb-16 will-change-transform"
      >
        {children}
      </motion.div>

      {/* Fixed Bottom-Left Floating Pill Back Button (z-40) */}
      <button
        type="button"
        onClick={() => exitProjectTo(returnHref)}
        onMouseEnter={() => router.prefetch(returnHref)}
        disabled={isExiting}
        className="fixed bottom-6 left-6 z-40 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border-subtle bg-bg-primary px-5 py-2.5 font-mono text-xs font-semibold tracking-wider text-text-primary shadow-[0_12px_30px_-10px_rgba(17,17,17,0.22)] transition-colors hover:border-text-primary hover:bg-surface-dark hover:text-surface-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary disabled:opacity-60"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Back to sectors</span>
      </button>
    </>
  );
}
