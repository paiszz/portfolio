"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useDoorTransition } from "@/context/DoorTransitionContext";

interface HashScrollGuardProps {
  children: ReactNode;
}

const RETURN_SECTION_KEY = "portfolio_return_section";

export function HashScrollGuard({ children }: HashScrollGuardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);
  const { transitionPhase, targetSectionId, notifyCrossPageReady } =
    useDoorTransition();

  // Run ONLY once on mount so clicking a door (transitionPhase -> "entering") never re-scrolls to a stale hash like #experience
  useLayoutEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const storedTarget = window.sessionStorage.getItem(RETURN_SECTION_KEY);
    const hashTarget = window.location.hash
      ? window.location.hash.slice(1)
      : null;

    const sectionId = storedTarget || hashTarget;
    if (sectionId) {
      document.documentElement.dataset.returnSection = sectionId;
      if (storedTarget) {
        window.sessionStorage.removeItem(RETURN_SECTION_KEY);
      }

      const html = document.documentElement;
      const prevScrollBehavior = html.style.scrollBehavior;
      const hadLenisStopped = html.classList.contains("lenis-stopped");
      html.style.scrollBehavior = "auto";
      if (hadLenisStopped) {
        html.classList.remove("lenis-stopped");
      }

      if (sectionId === "home") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      } else {
        const target = document.getElementById(sectionId);
        if (target) {
          const targetTop = target.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: targetTop, left: 0, behavior: "instant" });
        }
      }

      if (hadLenisStopped) {
        html.classList.add("lenis-stopped");
      }
      html.style.scrollBehavior = prevScrollBehavior;
    }

    if (transitionPhase === "exiting" && targetSectionId !== "projects") {
      const rafId = window.requestAnimationFrame(() => {
        notifyCrossPageReady();
      });
      return () => window.cancelAnimationFrame(rafId);
    }
  }, [notifyCrossPageReady, targetSectionId, transitionPhase]);

  return (
    <div ref={wrapperRef} className="flex flex-1 flex-col">
      {children}
    </div>
  );
}
