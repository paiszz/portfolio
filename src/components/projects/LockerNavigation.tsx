"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { Reveal } from "@/components/animations/Reveal";
import {
  IndustrialLocker,
  type TransitionSiblingState,
} from "@/components/projects/IndustrialLocker";
import { SectorPreview } from "@/components/projects/SectorPreview";
import { SlotMachineHeading } from "@/components/projects/SlotMachineHeading";
import { useDoorTransition } from "@/context/DoorTransitionContext";
import { getSectorProjects } from "@/data/projects";
import { cn } from "@/lib/utils";
import type { ProjectItem, SectorCategory, SectorId } from "@/types/portfolio";

interface LockerNavigationProps {
  sectors: SectorCategory[];
  projects: ProjectItem[];
}

const CAMERA_EASE = [0.65, 0, 0.35, 1] as const;

export function LockerNavigation({ sectors }: LockerNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const {
    activeSector,
    exitingSector,
    transitionPhase,
    targetSectionId,
    beginEnterSector,
    showEnterLightVeil,
    completeEnterNavigation,
    notifyReturnStageReady,
    finishTransition,
  } = useDoorTransition();

  const isReturningToProjects =
    transitionPhase === "exiting" &&
    targetSectionId === "projects" &&
    exitingSector !== null;

  const [hoveredSectorId, setHoveredSectorId] = useState<SectorId | null>(null);
  const [focusedSectorId, setFocusedSectorId] = useState<SectorId | null>(null);
  const [tappedSectorId, setTappedSectorId] = useState<SectorId | null>(null);

  const [openDoorId, setOpenDoorId] = useState<SectorId | null>(() =>
    isReturningToProjects ? exitingSector : null
  );
  const [lockedDoorId, setLockedDoorId] = useState<SectorId | null>(() =>
    isReturningToProjects ? exitingSector : null
  );
  const [isDoorClosing, setIsDoorClosing] = useState(false);
  const [siblingStage, setSiblingStage] = useState<TransitionSiblingState>(() =>
    isReturningToProjects ? "hidden" : "normal"
  );

  const perspectiveRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lockerSlotRefs = useRef<Partial<Record<SectorId, HTMLDivElement | null>>>(
    {}
  );
  const timersRef = useRef<number[]>([]);
  const returnCompletedRef = useRef(false);

  const stageZ = useMotionValue(0);
  const stageX = useMotionValue(0);
  const stageY = useMotionValue(0);

  const clearLocalTimers = () => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
  };

  const measureDoorGeometry = (id: SectorId) => {
    const perspEl = perspectiveRef.current;
    const slotEl = lockerSlotRefs.current[id];
    const cavityEl = slotEl?.querySelector<HTMLElement>(
      `[data-sector-cavity="${id.toLowerCase()}"]`
    );
    const targetBox = cavityEl ?? slotEl;

    if (!perspEl || !targetBox) {
      return {
        perspOrigin: "50% 50%",
        targetZ: 820,
        targetX: 0,
        targetY: 0,
      };
    }

    const perspRect = perspEl.getBoundingClientRect();
    const boxRect = targetBox.getBoundingClientRect();

    // Target the exact center of the sector glow inside the open doorway cavity (65% 50%)
    const slitX = boxRect.left + boxRect.width * 0.65;
    const slitY = boxRect.top + boxRect.height * 0.5;

    const perspOriginX = slitX - perspRect.left;
    const perspOriginY = slitY - perspRect.top;

    const sectionEl = perspEl.parentElement;
    const sectionTop = sectionEl
      ? sectionEl.getBoundingClientRect().top
      : perspRect.top;
    const effectiveSlitY =
      slitY >= 0 && slitY <= window.innerHeight ? slitY : slitY - sectionTop;

    // Subtle centering drift + responsive 3D travel along Z (reduced on mobile)
    const targetX = (window.innerWidth / 2 - slitX) * 0.45;
    const targetY = (window.innerHeight / 2 - effectiveSlitY) * 0.35;
    const targetZ = window.innerWidth < 768 ? 560 : 820;

    return {
      perspOrigin: `${perspOriginX.toFixed(1)}px ${perspOriginY.toFixed(1)}px`,
      targetZ,
      targetX,
      targetY,
    };
  };

  // Prefetch all sector routes on mount
  useEffect(() => {
    sectors.forEach((sector) => {
      router.prefetch(`/projects/${sector.id.toLowerCase()}`);
    });
    return () => clearLocalTimers();
  }, [router, sectors]);

  // Keep local state clean when transition completes or resets via safety fallback
  useEffect(() => {
    if (
      transitionPhase === "idle" &&
      (openDoorId !== null || lockedDoorId !== null || siblingStage !== "normal")
    ) {
      const id = window.requestAnimationFrame(() => {
        setOpenDoorId(null);
        setLockedDoorId(null);
        setIsDoorClosing(false);
        setSiblingStage("normal");
        stageZ.jump(0);
        stageX.jump(0);
        stageY.jump(0);
        if (perspectiveRef.current) {
          perspectiveRef.current.style.perspectiveOrigin = "50% 50%";
        }
      });
      return () => window.cancelAnimationFrame(id);
    }
  }, [lockedDoorId, openDoorId, siblingStage, stageX, stageY, stageZ, transitionPhase]);

  // Reverse Return Sequence on /projects or /#projects:
  // Lock scroll -> jump stage to zoomed-in 3D dolly state (translateZ: targetZ) & open door (-75deg) ->
  // fade bright overlay out -> dolly camera backward (translateZ -> 0, 0.75s) overlapping door close (0.55s at 300ms) ->
  // reveal sibling doors -> idle
  useLayoutEffect(() => {
    if (!isReturningToProjects || !exitingSector) return;

    if (shouldReduceMotion) {
      finishTransition();
      return;
    }

    let cancelled = false;
    returnCompletedRef.current = false;
    let zAnim: ReturnType<typeof animate> | null = null;
    let xAnim: ReturnType<typeof animate> | null = null;
    let yAnim: ReturnType<typeof animate> | null = null;

    const html = document.documentElement;
    const prevScrollBehavior = html.style.scrollBehavior;
    const hadLenisStopped = html.classList.contains("lenis-stopped");
    html.style.scrollBehavior = "auto";
    if (hadLenisStopped) {
      html.classList.remove("lenis-stopped");
    }

    if (pathname === "/projects") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } else {
      const sectionEl = document.getElementById("projects");
      if (sectionEl) {
        const targetTop =
          sectionEl.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: targetTop, left: 0, behavior: "instant" });
      }
    }

    if (hadLenisStopped) {
      html.classList.add("lenis-stopped");
    }
    html.style.scrollBehavior = prevScrollBehavior;

    // Measure un-transformed coordinates before jumping to zoomed-in 3D position
    stageZ.jump(0);
    stageX.jump(0);
    stageY.jump(0);
    const { perspOrigin, targetZ, targetX, targetY } =
      measureDoorGeometry(exitingSector);
    if (perspectiveRef.current) {
      perspectiveRef.current.style.perspectiveOrigin = perspOrigin;
    }
    stageZ.jump(targetZ);
    stageX.jump(targetX);
    stageY.jump(targetY);

    const rafId = window.requestAnimationFrame(() => {
      if (cancelled) return;

      notifyReturnStageReady();

      // Reverse 3D camera dolly backward (translateZ: targetZ -> 0, 0.75s)
      zAnim = animate(stageZ, 0, { duration: 0.75, ease: CAMERA_EASE });
      xAnim = animate(stageX, 0, { duration: 0.75, ease: CAMERA_EASE });
      yAnim = animate(stageY, 0, { duration: 0.75, ease: CAMERA_EASE });

      // Sibling cards emerge to 0.35 as camera pulls back from the doorway
      const tSiblingDim = window.setTimeout(() => {
        if (cancelled) return;
        setSiblingStage("dimmed");
      }, 150);

      // Overlap door closing (-75deg -> 0deg, 0.55s) starting at 300ms
      const tClose = window.setTimeout(() => {
        if (cancelled) return;
        setIsDoorClosing(true);
        setOpenDoorId(null);
      }, 300);

      timersRef.current.push(tSiblingDim, tClose);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      zAnim?.stop();
      xAnim?.stop();
      yAnim?.stop();
      clearLocalTimers();
      stageZ.jump(0);
      stageX.jump(0);
      stageY.jump(0);
    };
  }, [
    exitingSector,
    finishTransition,
    isReturningToProjects,
    notifyReturnStageReady,
    pathname,
    shouldReduceMotion,
    stageX,
    stageY,
    stageZ,
  ]);

  const isLocked =
    transitionPhase !== "idle" || openDoorId !== null || lockedDoorId !== null;

  const desktopFocusId = !isLocked
    ? (hoveredSectorId ?? focusedSectorId)
    : null;
  const mobilePreviewId = tappedSectorId ?? "SEC-01";

  const desktopFocusSector = desktopFocusId
    ? sectors.find((item) => item.id === desktopFocusId) ?? null
    : null;
  const mobilePreviewSector =
    sectors.find((item) => item.id === mobilePreviewId) ?? sectors[0];

  const handleEnterSector = (id: SectorId) => {
    if (isLocked) return;

    const targetPath = `/projects/${id.toLowerCase()}`;
    router.prefetch(targetPath);

    setHoveredSectorId(null);
    setFocusedSectorId(null);
    setTappedSectorId(null);

    if (shouldReduceMotion) {
      beginEnterSector(id, pathname);
      return;
    }

    clearLocalTimers();
    stageZ.jump(0);
    stageX.jump(0);
    stageY.jump(0);
    const { perspOrigin, targetZ, targetX, targetY } = measureDoorGeometry(id);
    if (perspectiveRef.current) {
      perspectiveRef.current.style.perspectiveOrigin = perspOrigin;
    }

    // Step 1 (0–600 ms): Door swings open 0 -> -75deg, other cards stay visible dimmed at 0.35
    setLockedDoorId(id);
    setOpenDoorId(id);
    setSiblingStage("dimmed");
    beginEnterSector(id, pathname);

    // Step 2 (300–1300 ms): True 3D camera dolly forward (translateZ + centering shift) through the open doorway
    const tZoom = window.setTimeout(() => {
      animate(stageZ, targetZ, { duration: 1.0, ease: CAMERA_EASE });
      animate(stageX, targetX, { duration: 1.0, ease: CAMERA_EASE });
      animate(stageY, targetY, { duration: 1.0, ease: CAMERA_EASE });
    }, 300);

    // Step 3 (750–1000 ms): Bright bg-bg-primary overlay fades in smoothly before crossfade
    const tLight = window.setTimeout(() => {
      showEnterLightVeil();
    }, 750);

    // Final ~30% of camera advance (1000–1300 ms): sibling cards fade 0.35 -> 0 near viewport edges
    const tSiblingOut = window.setTimeout(() => {
      setSiblingStage("hidden");
    }, 1000);

    // Step 4 (~900 ms): Trigger navigation early so SectorPageShell mounts underneath before 1000 ms crossfade
    const tNav = window.setTimeout(() => {
      completeEnterNavigation(id);
    }, 900);

    timersRef.current.push(tZoom, tLight, tSiblingOut, tNav);
  };

  const handleLockerAction = (id: SectorId, pointerType: string) => {
    if (isLocked) return;

    if (pointerType === "touch" || pointerType === "pen") {
      setTappedSectorId(id);
      return;
    }

    handleEnterSector(id);
  };

  const handleCompleteReturnSequence = () => {
    if (returnCompletedRef.current) return;
    returnCompletedRef.current = true;
    setIsDoorClosing(false);
    setSiblingStage("normal");
    setLockedDoorId(null);
    finishTransition();
  };

  const desktopFocusProjects = desktopFocusSector
    ? getSectorProjects(desktopFocusSector.id)
    : [];
  const mobilePreviewProjects = getSectorProjects(mobilePreviewSector.id);
  const mobileVerifiedCount = mobilePreviewProjects.filter(
    (item) => item.verificationStatus === "verified"
  ).length;
  const mobileWipCount = mobilePreviewProjects.filter(
    (item) => item.verificationStatus === "work_in_progress"
  ).length;

  const firstSiblingId =
    sectors.find((item) => item.id !== exitingSector)?.id ?? null;

  return (
    <div
      ref={perspectiveRef}
      style={
        shouldReduceMotion
          ? undefined
          : {
              perspective: "1400px",
              perspectiveOrigin: "50% 50%",
            }
      }
      className={cn("relative", transitionPhase !== "idle" && "z-[70]")}
    >
      <motion.div
        ref={stageRef}
        style={
          shouldReduceMotion
            ? undefined
            : {
                z: stageZ,
                x: stageX,
                y: stageY,
                transformStyle: "preserve-3d",
              }
        }
        className="container-editorial relative will-change-transform"
      >
        <div className="mb-10 border-b border-border-subtle pb-8 md:mb-14">
          <SlotMachineHeading text="SELECT SECTOR" />
          <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-text-secondary sm:text-lg">
            Choose an industrial locker sector to inspect software engineering
            deployments, interface design systems, and visual media archives.
          </p>
        </div>

        <div className="relative [transform-style:preserve-3d]">
          {/* Three Horizontal Industrial Lockers — all sit at z-20 above the z-10 detail panel */}
          <div
            className={cn(
              "grid grid-cols-1 gap-5 [transform-style:preserve-3d] lg:grid-cols-3",
              isLocked && "pointer-events-none"
            )}
          >
            {sectors.map((sector, idx) => {
              const sectorProjects = getSectorProjects(sector.id);
              const isDoorOpen = openDoorId === sector.id;
              const isHighlighted =
                desktopFocusId === sector.id || tappedSectorId === sector.id;
              const isActiveTargetDoor =
                (lockedDoorId ?? activeSector ?? exitingSector) === sector.id;

              const siblingVisualState: TransitionSiblingState =
                transitionPhase !== "idle" && !isActiveTargetDoor
                  ? siblingStage
                  : desktopFocusId !== null && desktopFocusId !== sector.id
                    ? "dimmed"
                    : "normal";

              return (
                <div
                  key={sector.id}
                  data-sector-door={sector.id.toLowerCase()}
                  ref={(el) => {
                    lockerSlotRefs.current[sector.id] = el;
                  }}
                  className={cn(
                    "relative [transform-style:preserve-3d]",
                    isDoorOpen || isHighlighted ? "z-30" : "z-0"
                  )}
                >
                  <Reveal
                    delay={0.12 + idx * 0.07}
                    yOffset={16}
                    immediate={transitionPhase !== "idle"}
                    className="[transform-style:preserve-3d]"
                  >
                    <IndustrialLocker
                      sector={sector}
                      projectCount={sectorProjects.length}
                      isHighlighted={isHighlighted}
                      siblingVisualState={siblingVisualState}
                      isEntering={isDoorOpen}
                      isReturnClosing={
                        isDoorClosing && exitingSector === sector.id
                      }
                      isLocked={isLocked}
                      onHoverStart={(id) => {
                        if (!isLocked) {
                          setHoveredSectorId(id);
                          router.prefetch(`/projects/${id.toLowerCase()}`);
                        }
                      }}
                      onHoverEnd={() => {
                        setHoveredSectorId(null);
                      }}
                      onFocusLocker={(id) => {
                        if (!isLocked) {
                          setFocusedSectorId(id);
                          router.prefetch(`/projects/${id.toLowerCase()}`);
                        }
                      }}
                      onBlurLocker={() => {
                        setFocusedSectorId(null);
                      }}
                      onLockerAction={handleLockerAction}
                      onDoorCloseComplete={() => {
                        if (isDoorClosing && exitingSector === sector.id) {
                          setSiblingStage("normal");
                        }
                      }}
                      onSiblingRevealComplete={() => {
                        if (
                          isDoorClosing &&
                          siblingStage === "normal" &&
                          sector.id === firstSiblingId
                        ) {
                          handleCompleteReturnSequence();
                        }
                      }}
                    />
                  </Reveal>
                </div>
              );
            })}
          </div>

          {/* Desktop Adjacent Detail Panel — sits cleanly in adjacent single slot beside active door (z-20) without burying sibling cards */}
          <AnimatePresence mode="wait">
            {desktopFocusSector && !isLocked && (
              <motion.aside
                key={desktopFocusSector.id}
                aria-live="polite"
                initial={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }
                }
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.12, ease: [0.22, 1, 0.36, 1] },
                      }
                }
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        y: -4,
                        transition: { duration: 0.08, ease: [0.22, 1, 0.36, 1] },
                      }
                }
                className={cn(
                  "pointer-events-none absolute top-0 bottom-0 z-20 hidden flex-col justify-center border border-border-subtle bg-bg-primary/95 p-6 shadow-[0_20px_50px_-24px_rgba(17,17,17,0.16)] backdrop-blur-xs lg:flex xl:p-7",
                  desktopFocusSector.id === "SEC-01" &&
                    "left-[calc(33.333%+0.45rem)] right-[calc(33.333%+0.45rem)]",
                  desktopFocusSector.id === "SEC-02" &&
                    "right-0 left-[calc(66.666%+0.75rem)]",
                  desktopFocusSector.id === "SEC-03" &&
                    "left-[calc(33.333%+0.45rem)] right-[calc(33.333%+0.45rem)]"
                )}
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="bg-surface-dark px-2.5 py-1 font-mono text-xs font-semibold tracking-widest text-surface-light">
                    {desktopFocusSector.id}
                  </span>
                  <span className="border border-border-subtle bg-bg-secondary px-2.5 py-1 font-mono text-xs tracking-wider text-text-primary uppercase">
                    {desktopFocusProjects.length}{" "}
                    {desktopFocusProjects.length === 1 ? "Entry" : "Entries"}
                  </span>
                </div>

                <h3 className="mt-5 font-editorial-display text-3xl font-bold tracking-tight text-text-primary">
                  {desktopFocusSector.title}
                </h3>

                <p className="mt-2.5 max-w-[48ch] text-base text-text-secondary">
                  &ldquo;{desktopFocusSector.tagline}&rdquo;
                </p>

                <ul className="mt-6 space-y-2 border-t border-border-subtle pt-5">
                  {desktopFocusSector.capabilities.map((capability) => (
                    <li
                      key={capability}
                      className="flex items-center gap-2.5 text-sm text-text-primary"
                    >
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 shrink-0 bg-surface-dark"
                      />
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 font-mono text-[11px] tracking-widest text-text-secondary uppercase">
                  Click the open-ready door to enter {desktopFocusSector.id}
                </p>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile / Touch Fallback Preview & Explicit ENTER Control */}
        <div className="lg:hidden">
          <SectorPreview
            sector={mobilePreviewSector}
            isEntered={false}
            projectCount={mobilePreviewProjects.length}
            verifiedCount={mobileVerifiedCount}
            wipCount={mobileWipCount}
            onEnterSector={handleEnterSector}
          />
        </div>
      </motion.div>
    </div>
  );
}
