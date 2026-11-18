"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import {
  Briefcase,
  ChevronDown,
  Code,
  GraduationCap,
  House,
  Layers,
  Mail,
  UserRound,
  X,
} from "lucide-react";
import { NAV_ITEMS, SITE_CONFIG } from "@/lib/constants";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";
import type { NavItem, SectionId } from "@/types/portfolio";

const ICON_MAP: Record<NavItem["iconName"], typeof House> = {
  House,
  UserRound,
  Code,
  Briefcase,
  Layers,
  GraduationCap,
  Mail,
};

const PILL_SPRING = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
  mass: 0.8,
};

export function Navbar() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const { activeSection, setActiveSection } = useActiveSection("home");

  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusedWithin, setIsFocusedWithin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingNotice, setPendingNotice] = useState<string | null>(null);

  const mobileWrapperRef = useRef<HTMLDivElement>(null);
  const noticeTimerRef = useRef<number | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const nextScrolled = latest > 48;
    if (nextScrolled !== isScrolled) {
      setIsScrolled(nextScrolled);
    }
  });

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (
        mobileWrapperRef.current &&
        !mobileWrapperRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("touchstart", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("touchstart", handlePointerDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current !== null) {
        window.clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  const isExpandedDesktop = !isScrolled || isHovered || isFocusedWithin;
  const activeItem =
    NAV_ITEMS.find((item) => item.id === activeSection) ?? NAV_ITEMS[0];
  const ActiveIcon = ICON_MAP[activeItem.iconName];

  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem
  ) => {
    event.preventDefault();
    setMobileOpen(false);

    const target = document.getElementById(item.id);
    if (!target) {
      setPendingNotice(`${item.label} section is not yet available`);
      if (noticeTimerRef.current !== null) {
        window.clearTimeout(noticeTimerRef.current);
      }
      noticeTimerRef.current = window.setTimeout(() => {
        setPendingNotice(null);
      }, 2200);
      return;
    }

    setPendingNotice(null);
    setActiveSection(item.id as SectionId);
    target.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    });

    if (window.history?.replaceState) {
      window.history.replaceState(null, "", item.href);
    }
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center px-3 md:top-6 md:px-6">
      {/* Desktop & Tablet Floating Pill Navigation */}
      <motion.nav
        aria-label="Primary navigation"
        layout
        transition={shouldReduceMotion ? { duration: 0 } : PILL_SPRING}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocusCapture={() => setIsFocusedWithin(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setIsFocusedWithin(false);
          }
        }}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.005 }}
        className={cn(
          "pointer-events-auto hidden md:flex items-center rounded-full border border-border-subtle bg-bg-primary/90 text-text-primary backdrop-blur-md",
          "shadow-[0_10px_30px_-10px_rgba(17,17,17,0.12)] transition-colors",
          isExpandedDesktop
            ? "gap-1 px-2 py-1.5 lg:px-2.5"
            : "gap-1 px-2 py-1.5"
        )}
      >
        <a
          href="#home"
          onClick={(e) => handleNavigate(e, NAV_ITEMS[0])}
          aria-label={`${SITE_CONFIG.name} — Back to top`}
          className="flex h-9 shrink-0 items-center justify-center rounded-full bg-surface-dark px-3 font-mono text-xs font-semibold tracking-widest text-surface-light transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
        >
          {SITE_CONFIG.monogram}
        </a>

        <div aria-hidden="true" className="mx-1 h-4 w-px bg-border-subtle" />

        <ul className="flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.iconName];
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavigate(e, item)}
                  aria-label={item.label}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative flex h-9 items-center justify-center rounded-full text-xs font-medium transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
                    isExpandedDesktop ? "px-2.5 lg:px-3" : "px-2.5",
                    isActive
                      ? "text-surface-light"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeDesktopNavIndicator"
                      transition={
                        shouldReduceMotion ? { duration: 0 } : PILL_SPRING
                      }
                      className="absolute inset-0 rounded-full bg-surface-dark"
                      aria-hidden="true"
                    />
                  )}

                  <Icon
                    className="relative z-10 h-3.5 w-3.5 shrink-0"
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />

                  <AnimatePresence initial={false}>
                    {isExpandedDesktop && (
                      <motion.span
                        key={`${item.id}-label`}
                        initial={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : { opacity: 0, width: 0 }
                        }
                        animate={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : { opacity: 1, width: "auto" }
                        }
                        exit={
                          shouldReduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, width: 0 }
                        }
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
                        }
                        className="relative z-10 overflow-hidden whitespace-nowrap"
                      >
                        <span className="pl-1.5 lg:pl-2">{item.label}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </a>
              </li>
            );
          })}
        </ul>
      </motion.nav>

      {/* Mobile Compact Floating Pill + Tap Expansion */}
      <div
        ref={mobileWrapperRef}
        className="pointer-events-auto flex w-full max-w-[22rem] flex-col items-center md:hidden"
      >
        <motion.div
          layout
          transition={shouldReduceMotion ? { duration: 0 } : PILL_SPRING}
          className="flex w-full items-center justify-between gap-2 rounded-full border border-border-subtle bg-bg-primary/95 px-2 py-1.5 text-text-primary shadow-[0_10px_30px_-10px_rgba(17,17,17,0.14)] backdrop-blur-md"
        >
          <a
            href="#home"
            onClick={(e) => handleNavigate(e, NAV_ITEMS[0])}
            aria-label={`${SITE_CONFIG.name} — Back to top`}
            className="flex h-9 shrink-0 items-center justify-center rounded-full bg-surface-dark px-3 font-mono text-xs font-semibold tracking-widest text-surface-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
          >
            {SITE_CONFIG.monogram}
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="flex h-9 flex-1 items-center justify-between gap-2 rounded-full px-3 text-xs font-medium text-text-primary transition-colors hover:bg-bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
          >
            <span className="flex items-center gap-2">
              <ActiveIcon
                className="h-3.5 w-3.5 text-text-primary"
                strokeWidth={1.9}
                aria-hidden="true"
              />
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
                {activeItem.label}
              </span>
            </span>

            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border-subtle bg-bg-secondary text-text-primary">
              {mobileOpen ? (
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </span>
          </button>
        </motion.div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              id="mobile-nav-panel"
              aria-label="Mobile navigation"
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: -8, scale: 0.97 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -8, scale: 0.97 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
              }
              className="mt-2 w-full rounded-3xl border border-border-subtle bg-bg-primary/98 p-2 shadow-[0_18px_40px_-14px_rgba(17,17,17,0.18)] backdrop-blur-md"
            >
              <ul className="grid grid-cols-2 gap-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = ICON_MAP[item.iconName];
                  const isActive = activeSection === item.id;

                  return (
                    <li
                      key={item.id}
                      className={item.id === "contact" ? "col-span-2" : undefined}
                    >
                      <a
                        href={item.href}
                        onClick={(e) => handleNavigate(e, item)}
                        aria-current={isActive ? "location" : undefined}
                        className={cn(
                          "flex min-h-[44px] items-center gap-2 rounded-2xl px-3 py-2.5 text-xs font-medium transition-colors sm:text-sm",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
                          isActive
                            ? "bg-surface-dark text-surface-light"
                            : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                        )}
                      >
                        <Icon
                          className="h-4 w-4 shrink-0"
                          strokeWidth={1.9}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle feedback when clicking a section not yet mounted in DOM */}
      <AnimatePresence>
        {pendingNotice && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }
            }
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto mt-2 rounded-full border border-border-subtle bg-surface-dark px-3.5 py-1.5 font-mono text-[11px] tracking-wider text-surface-light shadow-sm"
          >
            {pendingNotice}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
