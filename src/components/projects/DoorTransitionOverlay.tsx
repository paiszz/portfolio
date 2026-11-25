"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { IndustrialLocker } from "@/components/projects/IndustrialLocker";
import { useDoorTransition } from "@/context/DoorTransitionContext";
import { getSectorProjects, SECTOR_CATEGORIES } from "@/data/projects";
import type { SectorId } from "@/types/portfolio";

const NOOP = () => {};
const DOOR_EASE = [0.65, 0, 0.35, 1] as const;
const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

function getSectorOverlayGlow(sectorId: SectorId | null): string {
  switch (sectorId) {
    case "SEC-01":
      return "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(16, 185, 129, 0.14) 0%, rgba(16, 185, 129, 0.04) 55%, var(--bg-primary) 85%)";
    case "SEC-02":
      return "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(100, 116, 139, 0.14) 0%, rgba(147, 197, 253, 0.05) 55%, var(--bg-primary) 85%)";
    case "SEC-03":
      return "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(220, 38, 38, 0.12) 0%, rgba(234, 88, 12, 0.04) 55%, var(--bg-primary) 85%)";
    default:
      return "none";
  }
}

export function DoorTransitionOverlay() {
  const { activeSector, exitingSector, overlayStep, finishTransition } =
    useDoorTransition();
  const [crossPageFadeOut, setCrossPageFadeOut] = useState(false);

  useEffect(() => {
    if (overlayStep === "idle") {
      const id = window.requestAnimationFrame(() => {
        setCrossPageFadeOut(false);
      });
      return () => window.cancelAnimationFrame(id);
    }
  }, [overlayStep]);

  if (overlayStep === "idle") {
    return null;
  }

  // Reduced-motion 200ms bright crossfade
  if (overlayStep === "reduced-in" || overlayStep === "reduced-out") {
    const isOut = overlayStep === "reduced-out";
    return (
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOut ? 0 : 1 }}
        transition={{ duration: 0.1, ease: "linear" }}
        onAnimationComplete={() => {
          if (isOut) {
            finishTransition();
          }
        }}
        className="pointer-events-none fixed inset-0 z-[999] bg-bg-primary will-change-[opacity]"
      />
    );
  }

  // Enter: Bright bg-bg-primary layer with wide soft ambient wash -> 1000-1800ms fade-out once SectorPageShell is mounted
  if (overlayStep === "enter-light-in" || overlayStep === "enter-reveal") {
    const isRevealing = overlayStep === "enter-reveal";
    const glowGradient = getSectorOverlayGlow(activeSector);

    return (
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: isRevealing ? 0 : 1 }}
        transition={
          isRevealing
            ? { duration: 0.8, ease: REVEAL_EASE }
            : { duration: 0.25, ease: DOOR_EASE }
        }
        onAnimationComplete={() => {
          if (isRevealing) {
            finishTransition();
          }
        }}
        className="pointer-events-none fixed inset-0 z-[999] overflow-hidden bg-bg-primary will-change-[opacity]"
      >
        {/* Subtle ambient glow breathes while waiting, then clears immediately at crossfade start so page appears in pure bg-bg-primary */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0.45 }}
          animate={
            isRevealing
              ? { scale: 1.35, opacity: 0 }
              : {
                  scale: [1.02, 1.24, 1.06],
                  opacity: [0.28, 0.14, 0.28],
                }
          }
          transition={
            isRevealing
              ? { duration: 0.1, ease: "easeOut" }
              : { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
          }
          style={{ backgroundImage: glowGradient }}
          className="absolute inset-0 will-change-transform"
        />
      </motion.div>
    );
  }

  // Exit to /projects or /#projects: Smooth bright bg-bg-primary veil -> fade-away into zoomed-in open door
  if (overlayStep === "exit-light-in" || overlayStep === "exit-fade-away") {
    const isFadingAway = overlayStep === "exit-fade-away";
    return (
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: isFadingAway ? 0 : 1 }}
        transition={
          isFadingAway
            ? { duration: 0.25, ease: "easeOut" }
            : { duration: 0.3, ease: DOOR_EASE }
        }
        className="pointer-events-none fixed inset-0 z-[999] bg-bg-primary will-change-[opacity]"
      />
    );
  }

  // Cross-page Navbar exit (navigating from /projects/[sector] to Experience, Skills, Home, etc.)
  const sectorId = exitingSector ?? activeSector ?? "SEC-01";
  const sectorCategory =
    SECTOR_CATEGORIES.find((item) => item.id === sectorId) ??
    SECTOR_CATEGORIES[0];
  const projectCount = getSectorProjects(sectorCategory.id).length;

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 1 }}
      animate={{ opacity: crossPageFadeOut ? 0 : 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onAnimationComplete={() => {
        if (crossPageFadeOut) {
          finishTransition();
        }
      }}
      style={{ perspective: "1400px" }}
      className="pointer-events-none fixed inset-0 z-[999] flex items-center justify-center overflow-hidden px-5 will-change-[opacity]"
    >
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute inset-0 bg-bg-primary"
      />

      <motion.div
        initial={{ z: 720 }}
        animate={{ z: 0 }}
        transition={{ duration: 0.65, ease: DOOR_EASE }}
        className="w-full max-w-[360px] will-change-transform [transform-style:preserve-3d]"
      >
        <IndustrialLocker
          sector={sectorCategory}
          projectCount={projectCount}
          isHighlighted={false}
          siblingVisualState="normal"
          isEntering={false}
          isLocked={true}
          isOverlay={true}
          doorTransition={{
            initialRotateY: -75,
            rotateY: 0,
            duration: 0.55,
            delay: 0.25,
            ease: DOOR_EASE,
            onComplete: () => setCrossPageFadeOut(true),
          }}
          onHoverStart={NOOP}
          onHoverEnd={NOOP}
          onLockerAction={NOOP}
          onFocusLocker={NOOP}
          onBlurLocker={NOOP}
        />
      </motion.div>
    </motion.div>
  );
}
