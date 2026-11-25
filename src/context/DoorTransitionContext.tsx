"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReducedMotion } from "motion/react";
import type { SectionId, SectorId } from "@/types/portfolio";

export type TransitionPhase = "idle" | "entering" | "exiting";

export type OverlayStep =
  | "idle"
  | "enter-light-in"
  | "enter-reveal"
  | "exit-light-in"
  | "exit-fade-away"
  | "exit-cross-page"
  | "reduced-in"
  | "reduced-out";

interface DoorTransitionContextValue {
  activeSector: SectorId | null;
  exitingSector: SectorId | null;
  transitionPhase: TransitionPhase;
  overlayStep: OverlayStep;
  targetSectionId: SectionId | null;
  returnHref: string;
  beginEnterSector: (sectorId: SectorId, originPathname?: string) => void;
  showEnterLightVeil: () => void;
  completeEnterNavigation: (sectorId: SectorId) => void;
  notifySectorPageMounted: () => void;
  exitProjectTo: (targetHref: string, currentSectorId?: SectorId) => void;
  notifyReturnStageReady: () => void;
  notifyCrossPageReady: () => void;
  finishTransition: () => void;
}

const DoorTransitionContext = createContext<DoorTransitionContextValue | null>(
  null
);

function parseSectorFromPath(pathname: string): SectorId | null {
  const match = pathname.match(/^\/projects\/(sec-0[1-3])/i);
  if (!match) return null;
  return match[1].toUpperCase() as SectorId;
}

function parseTargetSection(href: string): SectionId {
  if (href === "/projects") return "projects";
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return "home";
  const hash = href.slice(hashIndex + 1) as SectionId;
  return hash || "home";
}

export function DoorTransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const [activeSector, setActiveSector] = useState<SectorId | null>(null);
  const [exitingSector, setExitingSector] = useState<SectorId | null>(null);
  const [transitionPhase, setTransitionPhase] =
    useState<TransitionPhase>("idle");
  const [overlayStep, setOverlayStep] = useState<OverlayStep>("idle");
  const [targetSectionId, setTargetSectionId] = useState<SectionId | null>(
    null
  );
  const [returnHref, setReturnHref] = useState<string>("/#projects");

  const timersRef = useRef<number[]>([]);
  const enterNavTriggeredRef = useRef(false);
  const enterMinReadyRef = useRef(false);
  const sectorPageMountedRef = useRef(false);
  const exitLightDoneRef = useRef(false);
  const exitDestinationReadyRef = useRef(false);

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  const finishTransition = useCallback(() => {
    clearTimers();
    enterNavTriggeredRef.current = false;
    enterMinReadyRef.current = false;
    sectorPageMountedRef.current = false;
    exitLightDoneRef.current = false;
    exitDestinationReadyRef.current = false;
    setTransitionPhase("idle");
    setOverlayStep("idle");
    setActiveSector(null);
    setExitingSector(null);
    setTargetSectionId(null);
  }, [clearTimers]);

  const tryBeginEnterReveal = useCallback(() => {
    if (!enterMinReadyRef.current || !sectorPageMountedRef.current) return;
    setOverlayStep(shouldReduceMotion ? "reduced-out" : "enter-reveal");
  }, [shouldReduceMotion]);

  // Belt-and-suspenders: also detect route arrival via pathname in case mount signal is delayed
  useEffect(() => {
    if (
      transitionPhase === "entering" &&
      activeSector &&
      pathname.toLowerCase() === `/projects/${activeSector.toLowerCase()}`
    ) {
      sectorPageMountedRef.current = true;
      const rafId = window.requestAnimationFrame(() => {
        tryBeginEnterReveal();
      });
      return () => window.cancelAnimationFrame(rafId);
    }
  }, [activeSector, pathname, transitionPhase, tryBeginEnterReveal]);

  // Hide sections below #projects during active door transitions
  useEffect(() => {
    if (transitionPhase !== "idle") {
      document.documentElement.dataset.doorTransition = "active";
    } else {
      delete document.documentElement.dataset.doorTransition;
    }
    return () => {
      delete document.documentElement.dataset.doorTransition;
    };
  }, [transitionPhase]);

  // Safety cleanup on bfcache restore, browser Back/Forward (popstate), and unmount
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        finishTransition();
      }
    };
    const handlePopState = () => {
      finishTransition();
    };
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("popstate", handlePopState);
      clearTimers();
    };
  }, [clearTimers, finishTransition]);

  const beginEnterSector = useCallback(
    (sectorId: SectorId, originPathname?: string) => {
      if (transitionPhase !== "idle") return;

      clearTimers();
      enterNavTriggeredRef.current = false;
      enterMinReadyRef.current = false;
      sectorPageMountedRef.current = false;

      setActiveSector(sectorId);
      setExitingSector(null);
      setTargetSectionId(null);
      setReturnHref(originPathname === "/projects" ? "/projects" : "/#projects");
      setTransitionPhase("entering");

      if (shouldReduceMotion) {
        // 200ms bright crossfade for prefers-reduced-motion
        setOverlayStep("reduced-in");
        schedule(() => {
          enterNavTriggeredRef.current = true;
          router.push(`/projects/${sectorId.toLowerCase()}`);
          enterMinReadyRef.current = true;
          tryBeginEnterReveal();
        }, 100);
        schedule(() => {
          finishTransition();
        }, 800);
        return;
      }

      setOverlayStep("idle");

      // Hold overlay until zoom push-in + bright veil reach full coverage (1000ms)
      schedule(() => {
        enterMinReadyRef.current = true;
        tryBeginEnterReveal();
      }, 1000);

      // Emergency fallback so overlay & Lenis never stay locked
      schedule(() => {
        finishTransition();
      }, 3200);
    },
    [
      clearTimers,
      finishTransition,
      router,
      schedule,
      shouldReduceMotion,
      transitionPhase,
      tryBeginEnterReveal,
    ]
  );

  const showEnterLightVeil = useCallback(() => {
    setOverlayStep("enter-light-in");
  }, []);

  const completeEnterNavigation = useCallback(
    (sectorId: SectorId) => {
      if (enterNavTriggeredRef.current) return;
      enterNavTriggeredRef.current = true;
      router.push(`/projects/${sectorId.toLowerCase()}`);
    },
    [router]
  );

  const notifySectorPageMounted = useCallback(() => {
    if (transitionPhase === "entering") {
      sectorPageMountedRef.current = true;
      tryBeginEnterReveal();
    }
  }, [transitionPhase, tryBeginEnterReveal]);

  const tryBeginReturnMotion = useCallback(() => {
    if (!exitLightDoneRef.current || !exitDestinationReadyRef.current) return;
    if (targetSectionId === "projects") {
      setOverlayStep("exit-fade-away");
    } else {
      setOverlayStep("exit-cross-page");
    }
  }, [targetSectionId]);

  const exitProjectTo = useCallback(
    (targetHref: string, currentSectorId?: SectorId) => {
      if (transitionPhase !== "idle") return;

      const resolvedSector =
        currentSectorId ?? parseSectorFromPath(pathname) ?? "SEC-01";
      const nextTarget = parseTargetSection(targetHref);

      if (shouldReduceMotion) {
        clearTimers();
        setActiveSector(resolvedSector);
        setExitingSector(resolvedSector);
        setTargetSectionId(nextTarget);
        setTransitionPhase("exiting");
        setOverlayStep("reduced-in");

        schedule(() => {
          if (targetHref !== "/projects") {
            window.sessionStorage.setItem("portfolio_return_section", nextTarget);
          } else {
            window.sessionStorage.removeItem("portfolio_return_section");
          }
          router.push(targetHref, { scroll: false });
          setOverlayStep("reduced-out");
        }, 100);

        schedule(() => {
          finishTransition();
        }, 300);
        return;
      }

      clearTimers();
      exitLightDoneRef.current = false;
      exitDestinationReadyRef.current = false;

      setActiveSector(resolvedSector);
      setExitingSector(resolvedSector);
      setTargetSectionId(nextTarget);
      setTransitionPhase("exiting");
      setOverlayStep("exit-light-in");

      // Fade sector page cleanly to bg-bg-primary (0.3s) then navigate behind it
      schedule(() => {
        exitLightDoneRef.current = true;
        if (targetHref !== "/projects") {
          window.sessionStorage.setItem("portfolio_return_section", nextTarget);
        } else {
          window.sessionStorage.removeItem("portfolio_return_section");
        }
        router.push(targetHref, { scroll: false });
        tryBeginReturnMotion();
      }, 300);

      // Emergency fallback so bright overlay never gets stuck
      schedule(() => {
        finishTransition();
      }, 3400);
    },
    [
      clearTimers,
      finishTransition,
      pathname,
      router,
      schedule,
      shouldReduceMotion,
      transitionPhase,
      tryBeginReturnMotion,
    ]
  );

  const notifyReturnStageReady = useCallback(() => {
    if (transitionPhase === "exiting" && targetSectionId === "projects") {
      exitDestinationReadyRef.current = true;
      tryBeginReturnMotion();
    }
  }, [targetSectionId, transitionPhase, tryBeginReturnMotion]);

  const notifyCrossPageReady = useCallback(() => {
    if (transitionPhase === "exiting" && targetSectionId !== "projects") {
      exitDestinationReadyRef.current = true;
      tryBeginReturnMotion();
    }
  }, [targetSectionId, transitionPhase, tryBeginReturnMotion]);

  return (
    <DoorTransitionContext.Provider
      value={{
        activeSector,
        exitingSector,
        transitionPhase,
        overlayStep,
        targetSectionId,
        returnHref,
        beginEnterSector,
        showEnterLightVeil,
        completeEnterNavigation,
        notifySectorPageMounted,
        exitProjectTo,
        notifyReturnStageReady,
        notifyCrossPageReady,
        finishTransition,
      }}
    >
      {children}
    </DoorTransitionContext.Provider>
  );
}

export function useDoorTransition(): DoorTransitionContextValue {
  const ctx = useContext(DoorTransitionContext);
  if (!ctx) {
    throw new Error(
      "useDoorTransition must be used within a DoorTransitionProvider"
    );
  }
  return ctx;
}
