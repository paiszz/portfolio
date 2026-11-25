"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { useDoorTransition } from "@/context/DoorTransitionContext";

interface SmoothScrollContextValue {
  scrollToTarget: (target: string | number, immediate?: boolean) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollToTarget: () => {},
});

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const { transitionPhase, targetSectionId } = useDoorTransition();
  const lenisRef = useRef<Lenis | null>(null);
  const prevPathnameRef = useRef<string | null>(null);
  const targetSectionRef = useRef(targetSectionId);

  useEffect(() => {
    targetSectionRef.current = targetSectionId;
  }, [targetSectionId]);

  useEffect(() => {
    if (shouldReduceMotion) {
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [shouldReduceMotion]);

  // Pause Lenis during active 3D door transitions so coordinates stay locked, then resume on idle
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    if (transitionPhase !== "idle") {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [transitionPhase]);

  // Sync Lenis ONLY when pathname actually changes (never when clicking a door on the same page!)
  useEffect(() => {
    if (prevPathnameRef.current === pathname) {
      return;
    }
    const isInitialMount = prevPathnameRef.current === null;
    prevPathnameRef.current = pathname;

    // On initial page load with no hash, let browser handle default top scroll
    if (isInitialMount && !window.location.hash) {
      return;
    }

    const lenis = lenisRef.current;

    const rafId = window.requestAnimationFrame(() => {
      const returnAttr = document.documentElement.dataset.returnSection;
      if (returnAttr) {
        delete document.documentElement.dataset.returnSection;
      }
      const storedTarget = window.sessionStorage.getItem(
        "portfolio_return_section"
      );
      const hashTarget = window.location.hash
        ? window.location.hash.slice(1)
        : null;

      if (pathname === "/") {
        const section =
          returnAttr ||
          storedTarget ||
          hashTarget ||
          targetSectionRef.current;

        if (section && section !== "home") {
          const el = document.getElementById(section);
          if (el) {
            if (lenis) {
              const wasStopped = lenis.isStopped;
              if (wasStopped) lenis.start();
              lenis.resize();
              lenis.scrollTo(el, { immediate: true, force: true });
              if (wasStopped) lenis.stop();
            } else {
              el.scrollIntoView({ behavior: "instant", block: "start" });
            }
            return;
          }
        }
      }

      if (lenis) {
        const wasStopped = lenis.isStopped;
        if (wasStopped) lenis.start();
        lenis.resize();
        lenis.scrollTo(0, { immediate: true, force: true });
        if (wasStopped) lenis.stop();
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [pathname]);

  const scrollToTarget = useCallback(
    (target: string | number, immediate = false) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, {
          immediate: immediate || Boolean(shouldReduceMotion),
          duration: immediate ? 0 : 1.15,
        });
        return;
      }

      if (typeof target === "number") {
        window.scrollTo({
          top: target,
          behavior: immediate || shouldReduceMotion ? "instant" : "smooth",
        });
      } else {
        const selector = target.startsWith("#") ? target.slice(1) : target;
        const el = document.getElementById(selector);
        el?.scrollIntoView({
          behavior: immediate || shouldReduceMotion ? "instant" : "smooth",
          block: "start",
        });
      }
    },
    [shouldReduceMotion]
  );

  return (
    <SmoothScrollContext.Provider value={{ scrollToTarget }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll(): SmoothScrollContextValue {
  return useContext(SmoothScrollContext);
}
