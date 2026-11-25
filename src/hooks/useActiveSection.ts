"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { NAV_ITEMS } from "@/lib/constants";
import type { SectionId } from "@/types/portfolio";

export function useActiveSection(
  defaultSection: SectionId = "home",
  pathname = "/"
) {
  const [activeSection, setActiveSection] = useState<SectionId>(defaultSection);
  const lockUntilRef = useRef<number>(0);

  const lockSection = useCallback((section: SectionId, durationMs = 950) => {
    lockUntilRef.current = performance.now() + durationMs;
    setActiveSection(section);
  }, []);

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) {
      return;
    }

    const computeActiveSection = () => {
      if (performance.now() < lockUntilRef.current) return;

      if (window.scrollY < 80) {
        setActiveSection("home");
        return;
      }

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 24;
      if (atBottom && document.getElementById("contact")) {
        setActiveSection("contact");
        return;
      }

      const probeY = window.innerHeight * 0.32;
      let current: SectionId = elements[0].id as SectionId;

      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY) {
          current = el.id as SectionId;
        } else {
          break;
        }
      }

      setActiveSection(current);
    };

    let rafId = 0;
    const scheduleUpdate = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        computeActiveSection();
      });
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [pathname]);

  return { activeSection, setActiveSection, lockSection };
}
