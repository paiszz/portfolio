"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  animate,
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
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
import { useSmoothScroll } from "@/components/animations/SmoothScrollProvider";
import { useDoorTransition } from "@/context/DoorTransitionContext";
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

const SLIDING_PILL_TRANSITION = {
  type: "tween" as const,
  duration: 0.44,
  ease: [0.22, 1, 0.36, 1] as const,
};

const LABEL_TRANSITION = {
  width: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  opacity: { duration: 0.28, ease: "easeOut" as const },
};

function subscribeScroll(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  window.addEventListener("resize", onStoreChange, { passive: true });
  return () => {
    window.removeEventListener("scroll", onStoreChange);
    window.removeEventListener("resize", onStoreChange);
  };
}

function getScrolledSnapshot() {
  return window.scrollY > 48;
}

function getServerScrolledSnapshot() {
  return false;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const { scrollToTarget } = useSmoothScroll();
  const { exitProjectTo, transitionPhase, targetSectionId } =
    useDoorTransition();
  const { activeSection: observedSection, lockSection } = useActiveSection(
    "home",
    pathname
  );

  const isProjectRoute = pathname.startsWith("/projects");
  const isInsideSectorDetail = /^\/projects\/sec-0[1-3]/i.test(pathname);
  const activeSection: SectionId = isProjectRoute
    ? "projects"
    : transitionPhase === "exiting" && targetSectionId
      ? targetSectionId
      : observedSection;

  const isScrolled = useSyncExternalStore(
    subscribeScroll,
    getScrolledSnapshot,
    getServerScrolledSnapshot
  );
  const [readyToAnimate, setReadyToAnimate] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusedWithin, setIsFocusedWithin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingNotice, setPendingNotice] = useState<string | null>(null);

  const mobileWrapperRef = useRef<HTMLDivElement>(null);
  const noticeTimerRef = useRef<number | null>(null);
  const desktopListRef = useRef<HTMLUListElement>(null);
  const desktopItemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const hasMeasuredPillRef = useRef(false);
  const hasRevealedPillRef = useRef(false);
  const activeSectionRef = useRef<SectionId>(activeSection);
  const prevActiveSectionRef = useRef<SectionId>(activeSection);
  const prevPathnameRef = useRef(pathname);
  const routeSettlingUntilRef = useRef(0);
  const pillAnimRef = useRef<{
    x?: { stop: () => void };
    w?: { stop: () => void };
  }>({});
  const isAnimatingSectionRef = useRef(false);

  const pillX = useMotionValue(0);
  const pillWidth = useMotionValue(0);
  const pillOpacity = useMotionValue(0);

  useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;

    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        const el = desktopItemRefs.current[activeSectionRef.current];
        if (el && el.offsetWidth > 0) {
          pillX.jump(el.offsetLeft);
          pillWidth.jump(el.offsetWidth);
          hasMeasuredPillRef.current = true;
        }
        hasRevealedPillRef.current = true;
        animate(pillOpacity, 1, {
          duration: shouldReduceMotion ? 0 : 0.15,
          ease: "easeOut",
        });
      });
    });

    const readyTimer = window.setTimeout(() => {
      setReadyToAnimate(true);
    }, 120);

    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      window.clearTimeout(readyTimer);
    };
  }, [pillX, pillWidth, pillOpacity, shouldReduceMotion]);

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
    router.prefetch("/");
    router.prefetch("/projects");
  }, [router]);

  const isExpandedDesktop = !isScrolled || isHovered || isFocusedWithin;

  useLayoutEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      routeSettlingUntilRef.current = performance.now() + 450;
    }

    activeSectionRef.current = activeSection;

    const activeEl = desktopItemRefs.current[activeSection];
    if (!activeEl) return;

    const targetX = activeEl.offsetLeft;
    const targetW = activeEl.offsetWidth;
    if (targetW === 0) return;

    const sectionChanged = prevActiveSectionRef.current !== activeSection;
    prevActiveSectionRef.current = activeSection;

    pillAnimRef.current.x?.stop();
    pillAnimRef.current.w?.stop();
    isAnimatingSectionRef.current = false;

    const isRouteSettling = performance.now() < routeSettlingUntilRef.current;

    if (
      !hasMeasuredPillRef.current ||
      !readyToAnimate ||
      isRouteSettling ||
      shouldReduceMotion
    ) {
      hasMeasuredPillRef.current = true;
      pillX.jump(targetX);
      pillWidth.jump(targetW);
      if (hasRevealedPillRef.current) {
        pillOpacity.jump(1);
      }
      return;
    }

    if (sectionChanged) {
      isAnimatingSectionRef.current = true;
      const xAnim = animate(pillX, targetX, {
        ...SLIDING_PILL_TRANSITION,
        onComplete: () => {
          isAnimatingSectionRef.current = false;
          const el = desktopItemRefs.current[activeSectionRef.current];
          if (el && el.offsetWidth > 0) {
            if (Math.abs(el.offsetLeft - pillX.get()) > 0.5) {
              animate(pillX, el.offsetLeft, {
                duration: 0.24,
                ease: [0.22, 1, 0.36, 1],
              });
            }
            if (Math.abs(el.offsetWidth - pillWidth.get()) > 0.5) {
              animate(pillWidth, el.offsetWidth, {
                duration: 0.24,
                ease: [0.22, 1, 0.36, 1],
              });
            }
          }
        },
      });
      const wAnim = animate(pillWidth, targetW, SLIDING_PILL_TRANSITION);
      pillAnimRef.current = { x: xAnim, w: wAnim };
      if (hasRevealedPillRef.current) {
        pillOpacity.set(1);
      }
      return () => {
        xAnim.stop();
        wAnim.stop();
        isAnimatingSectionRef.current = false;
      };
    }

    pillX.jump(targetX);
    pillWidth.jump(targetW);
    if (hasRevealedPillRef.current) {
      pillOpacity.jump(1);
    }
  }, [
    activeSection,
    pathname,
    readyToAnimate,
    shouldReduceMotion,
    pillX,
    pillWidth,
    pillOpacity,
  ]);

  useEffect(() => {
    const listEl = desktopListRef.current;
    if (!listEl) return;

    const snapPillToActive = (force = false) => {
      const isRouteSettling = performance.now() < routeSettlingUntilRef.current;
      if (!force && !isRouteSettling && isAnimatingSectionRef.current) return;
      const activeEl = desktopItemRefs.current[activeSectionRef.current];
      if (!activeEl || activeEl.offsetWidth === 0) return;

      if (force || isRouteSettling) {
        pillAnimRef.current.x?.stop();
        pillAnimRef.current.w?.stop();
        isAnimatingSectionRef.current = false;
      }

      pillX.jump(activeEl.offsetLeft);
      pillWidth.jump(activeEl.offsetWidth);
      hasMeasuredPillRef.current = true;
      if (hasRevealedPillRef.current) {
        pillOpacity.jump(1);
      }
    };

    // Track label expand/collapse (400ms) and route/transition settle frame-by-frame
    const startTime = performance.now();
    let rafId = 0;
    const trackDuringTransition = () => {
      snapPillToActive(false);
      if (performance.now() - startTime < 520) {
        rafId = window.requestAnimationFrame(trackDuringTransition);
      }
    };
    rafId = window.requestAnimationFrame(trackDuringTransition);

    const observer = new ResizeObserver(() => snapPillToActive(false));
    observer.observe(listEl);
    for (const item of NAV_ITEMS) {
      const el = desktopItemRefs.current[item.id];
      if (el) observer.observe(el);
    }

    const handleResize = () => snapPillToActive(true);
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [
    isExpandedDesktop,
    pathname,
    transitionPhase,
    pillX,
    pillWidth,
    pillOpacity,
  ]);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current !== null) {
        window.clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  const activeItem =
    NAV_ITEMS.find((item) => item.id === activeSection) ?? NAV_ITEMS[0];
  const ActiveIcon = ICON_MAP[activeItem.iconName];

  const resolveNavHref = (item: NavItem): string => {
    if (item.id === "home") return "/";
    if (isInsideSectorDetail) return `/${item.href}`;
    if (isProjectRoute) {
      return item.id === "projects" ? "#projects" : `/${item.href}`;
    }
    return item.href;
  };

  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem
  ) => {
    event.preventDefault();
    setMobileOpen(false);

    if (transitionPhase !== "idle") {
      return;
    }

    if (isInsideSectorDetail) {
      const targetHref = item.id === "home" ? "/" : `/${item.href}`;
      lockSection(item.id, 1400);
      exitProjectTo(targetHref);
      return;
    }

    if (isProjectRoute && item.id !== "projects") {
      const targetHref = item.id === "home" ? "/" : `/${item.href}`;
      lockSection(item.id, 1100);
      window.sessionStorage.setItem("portfolio_return_section", item.id);
      router.push(targetHref, { scroll: false });
      return;
    }

    if (!isProjectRoute && item.id === "home") {
      setPendingNotice(null);
      lockSection("home", 950);
      scrollToTarget(0, Boolean(shouldReduceMotion));

      if (window.history?.replaceState) {
        window.history.replaceState(null, "", "/");
      }
      return;
    }

    const target = document.getElementById(item.id);
    if (!target) {
      if (pathname !== "/") {
        const targetHref = item.id === "home" ? "/" : `/${item.href}`;
        lockSection(item.id, 1100);
        window.sessionStorage.setItem("portfolio_return_section", item.id);
        router.push(targetHref, { scroll: false });
        return;
      }

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
    lockSection(item.id, 950);
    scrollToTarget(`#${item.id}`, Boolean(shouldReduceMotion));

    if (window.history?.replaceState) {
      window.history.replaceState(null, "", item.href);
    }
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-[80] isolate flex flex-col items-center px-3 md:top-6 md:px-6">
      {/* Desktop & Tablet Floating Liquid-Glass Pill Navigation */}
      <motion.nav
        aria-label="Primary navigation"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocusCapture={() => setIsFocusedWithin(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setIsFocusedWithin(false);
          }
        }}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.005 }}
        transition={shouldReduceMotion ? { duration: 0 } : PILL_SPRING}
        className={cn(
          "pointer-events-auto relative isolate hidden md:flex items-center rounded-full border border-surface-light/80 ring-1 ring-black/[0.08]",
          "bg-bg-primary/85 text-text-primary backdrop-blur-xl backdrop-saturate-150",
          "shadow-[0_14px_34px_-12px_rgba(17,17,17,0.2),0_2px_8px_-2px_rgba(17,17,17,0.06),inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(17,17,17,0.05)]",
          "transition-colors",
          isExpandedDesktop
            ? "gap-1 px-2 py-1.5 lg:px-2.5"
            : "gap-1 px-2 py-1.5"
        )}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/60 via-white/15 to-black/[0.02]"
        />

        <Link
          href="/"
          onClick={(e) => handleNavigate(e, NAV_ITEMS[0])}
          aria-label={`${SITE_CONFIG.name} — Back to top`}
          className="relative z-10 flex h-9 shrink-0 items-center justify-center rounded-full bg-surface-dark px-3 font-mono text-xs font-semibold tracking-widest text-surface-light shadow-[0_2px_8px_-1px_rgba(17,17,17,0.28),inset_0_1px_0_rgba(255,255,255,0.16)] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
        >
          {SITE_CONFIG.monogram}
        </Link>

        <div
          aria-hidden="true"
          className="relative z-10 mx-1 h-4 w-px bg-black/10"
        />

        <ul
          ref={desktopListRef}
          className="relative z-10 flex items-center gap-0.5"
        >
          <motion.span
            aria-hidden="true"
            style={{
              x: pillX,
              width: pillWidth,
              opacity: pillOpacity,
            }}
            className="pointer-events-none absolute top-0 left-0 z-0 h-9 rounded-full bg-surface-dark shadow-[0_4px_14px_-2px_rgba(17,17,17,0.34),inset_0_1px_0_rgba(255,255,255,0.18)]"
          />

          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.iconName];
            const isActive = activeSection === item.id;

            return (
              <li
                key={item.id}
                ref={(el) => {
                  desktopItemRefs.current[item.id] = el;
                }}
                className="relative z-10"
              >
                <a
                  href={resolveNavHref(item)}
                  onClick={(e) => handleNavigate(e, item)}
                  aria-label={item.label}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative flex h-9 items-center justify-center rounded-full px-[11px] text-xs font-medium transition-colors duration-250",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
                    isActive
                      ? "text-surface-light"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
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
                          shouldReduceMotion ||
                          !readyToAnimate ||
                          transitionPhase !== "idle"
                            ? { duration: 0 }
                            : LABEL_TRANSITION
                        }
                        className="relative z-10 overflow-hidden whitespace-nowrap"
                      >
                        <span className="pl-1.5 pr-0.5 lg:pl-2 lg:pr-1">
                          {item.label}
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </a>
              </li>
            );
          })}
        </ul>
      </motion.nav>

      {/* Mobile Compact Floating Liquid-Glass Pill + Tap Expansion */}
      <div
        ref={mobileWrapperRef}
        className="pointer-events-auto flex w-full max-w-[22rem] flex-col items-center md:hidden"
      >
        <motion.div
          layout
          transition={shouldReduceMotion ? { duration: 0 } : PILL_SPRING}
          className="relative flex w-full items-center justify-between gap-2 rounded-full border border-surface-light/80 ring-1 ring-black/[0.08] bg-bg-primary/85 px-2 py-1.5 text-text-primary shadow-[0_14px_34px_-12px_rgba(17,17,17,0.2),0_2px_8px_-2px_rgba(17,17,17,0.06),inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(17,17,17,0.05)] backdrop-blur-xl backdrop-saturate-150"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/60 via-white/15 to-black/[0.02]"
          />

          <Link
            href="/"
            onClick={(e) => handleNavigate(e, NAV_ITEMS[0])}
            aria-label={`${SITE_CONFIG.name} — Back to top`}
            className="relative z-10 flex h-9 shrink-0 items-center justify-center rounded-full bg-surface-dark px-3 font-mono text-xs font-semibold tracking-widest text-surface-light shadow-[0_2px_8px_-1px_rgba(17,17,17,0.28),inset_0_1px_0_rgba(255,255,255,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
          >
            {SITE_CONFIG.monogram}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="relative z-10 flex h-9 flex-1 items-center justify-between gap-2 rounded-full px-3 text-xs font-medium text-text-primary transition-colors hover:bg-black/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
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

            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-black/[0.08] bg-bg-primary/75 text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
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
              className="relative mt-2 w-full rounded-3xl border border-surface-light/80 ring-1 ring-black/[0.08] bg-bg-primary/90 p-2 shadow-[0_20px_44px_-14px_rgba(17,17,17,0.22),inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(17,17,17,0.05)] backdrop-blur-2xl backdrop-saturate-150"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/55 via-white/10 to-black/[0.02]"
              />

              <LayoutGroup id="mobile-navbar-pill">
                <ul className="relative z-10 grid grid-cols-2 gap-1">
                  {NAV_ITEMS.map((item) => {
                    const Icon = ICON_MAP[item.iconName];
                    const isActive = activeSection === item.id;

                    return (
                      <li
                        key={item.id}
                        className={
                          item.id === "contact" ? "col-span-2" : undefined
                        }
                      >
                        <a
                          href={resolveNavHref(item)}
                          onClick={(e) => handleNavigate(e, item)}
                          aria-current={isActive ? "location" : undefined}
                          className={cn(
                            "relative flex min-h-[44px] items-center gap-2 rounded-2xl px-3 py-2.5 text-xs font-medium transition-colors sm:text-sm",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
                            isActive
                              ? "text-surface-light"
                              : "text-text-secondary hover:bg-black/[0.04] hover:text-text-primary"
                          )}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="activeMobileNavIndicator"
                              transition={
                                shouldReduceMotion
                                  ? { duration: 0 }
                                  : SLIDING_PILL_TRANSITION
                              }
                              aria-hidden="true"
                              className="absolute inset-0 z-0 rounded-2xl bg-surface-dark shadow-[0_4px_12px_-2px_rgba(17,17,17,0.28),inset_0_1px_0_rgba(255,255,255,0.16)]"
                            />
                          )}

                          <Icon
                            className="relative z-10 h-4 w-4 shrink-0"
                            strokeWidth={1.9}
                            aria-hidden="true"
                          />
                          <span className="relative z-10 truncate">
                            {item.label}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </LayoutGroup>
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
