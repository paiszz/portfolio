"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import type { SectorCategory, SectorId } from "@/types/portfolio";

export type TransitionSiblingState = "normal" | "dimmed" | "hidden";

export interface DoorTransitionSpec {
  initialRotateY: number;
  rotateY: number;
  duration: number;
  delay?: number;
  ease: readonly [number, number, number, number];
  onComplete?: () => void;
}

interface IndustrialLockerProps {
  sector: SectorCategory;
  projectCount: number;
  isHighlighted: boolean;
  siblingVisualState?: TransitionSiblingState;
  isEntering: boolean;
  isReturnClosing?: boolean;
  isLocked: boolean;
  isOverlay?: boolean;
  doorTransition?: DoorTransitionSpec;
  onHoverStart: (id: SectorId) => void;
  onHoverEnd: () => void;
  onLockerAction: (id: SectorId, pointerType: string) => void;
  onFocusLocker: (id: SectorId) => void;
  onBlurLocker: () => void;
  onDoorCloseComplete?: () => void;
  onSiblingRevealComplete?: () => void;
}

const LOCKER_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 26,
  mass: 0.7,
};

function getLockerTheme(id: SectorId) {
  switch (id) {
    case "SEC-01":
      return {
        doorSurface: "bg-[#181A1F] text-[#F5F5F5] border-[#2B303A]",
        highlightedBorder: "border-[#E5E5E5]",
        topLight: "from-[#10B981]/80 via-[#E5E5E5]/90 to-[#10B981]/80",
        frostedPlate:
          "border-white/15 bg-[#2B303A]/75 text-white backdrop-blur-xs",
        louverColor: "bg-[#0F1115] border-b border-white/10",
        handleBay: "border-white/15 bg-[#0F1115]",
        handleBar: "bg-[#E5E5E5]",
        badgeStyle: "border-[#10B981]/50 bg-[#10B981]/15 text-[#A7F3D0]",
        badgeLabel: "LED // SYS.ONLINE",
        interiorGlow:
          "radial-gradient(circle at 65% 50%, rgba(16, 185, 129, 0.24) 0%, rgba(16, 185, 129, 0.08) 42%, var(--bg-primary) 78%)",
      };
    case "SEC-02":
      return {
        doorSurface: "bg-[#334155] text-[#F8FAFC] border-[#475569]",
        highlightedBorder: "border-[#F8FAFC]",
        topLight: "from-[#93C5FD]/80 via-[#F8FAFC] to-[#93C5FD]/80",
        frostedPlate:
          "border-white/20 bg-[#F8FAFC]/15 text-[#F8FAFC] backdrop-blur-xs",
        louverColor: "bg-[#1E293B] border-b border-white/15",
        handleBay: "border-white/20 bg-[#1E293B]",
        handleBar: "bg-[#F8FAFC]",
        badgeStyle: "border-white/30 bg-white/10 text-[#F8FAFC]",
        badgeLabel: "GRID // WIREFRAME",
        interiorGlow:
          "radial-gradient(circle at 65% 50%, rgba(100, 116, 139, 0.24) 0%, rgba(147, 197, 253, 0.14) 42%, var(--bg-primary) 78%)",
      };
    case "SEC-03":
      return {
        doorSurface: "bg-[#1C1917] text-[#FAFAF9] border-[#991B1B]",
        highlightedBorder: "border-[#EA580C]",
        topLight: "from-[#EA580C] via-[#F97316] to-[#991B1B]",
        frostedPlate:
          "border-[#EA580C]/35 bg-[#991B1B]/30 text-white backdrop-blur-xs",
        louverColor: "bg-[#0C0A09] border-b border-[#EA580C]/20",
        handleBay: "border-[#EA580C]/30 bg-[#0C0A09]",
        handleBar: "bg-[#EA580C]",
        badgeStyle: "border-[#EA580C]/60 bg-[#EA580C]/20 text-[#FDBA74]",
        badgeLabel: "STENCIL // VISUAL",
        interiorGlow:
          "radial-gradient(circle at 65% 50%, rgba(220, 38, 38, 0.22) 0%, rgba(234, 88, 12, 0.10) 42%, var(--bg-primary) 78%)",
      };
  }
}

export function IndustrialLocker({
  sector,
  projectCount,
  isHighlighted,
  siblingVisualState = "normal",
  isEntering,
  isReturnClosing = false,
  isLocked,
  isOverlay = false,
  doorTransition,
  onHoverStart,
  onHoverEnd,
  onLockerAction,
  onFocusLocker,
  onBlurLocker,
  onDoorCloseComplete,
  onSiblingRevealComplete,
}: IndustrialLockerProps) {
  const shouldReduceMotion = useReducedMotion();
  const theme = getLockerTheme(sector.id);
  const lastPointerTypeRef = useRef("mouse");

  const isDimmed = siblingVisualState === "dimmed";
  const isHidden = siblingVisualState === "hidden";
  const targetOpacity = isHidden ? 0 : isDimmed ? 0.35 : 1;

  // Only enable 3D cavity and preserve-3d when door is actively swinging open/closed
  const isDoorMoving3D = isEntering || isReturnClosing || isOverlay;

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: targetOpacity,
      }}
      transition={
        isHidden
          ? { duration: 0.3, delay: 0, ease: [0.65, 0, 0.35, 1] }
          : isDimmed
            ? { duration: 0.22, delay: 0, ease: [0.22, 1, 0.36, 1] }
            : { duration: 0.24, delay: 0.04, ease: [0.22, 1, 0.36, 1] }
      }
      onAnimationComplete={() => {
        if (siblingVisualState === "normal") {
          onSiblingRevealComplete?.();
        }
      }}
      className={cn(
        "relative perspective-[1200px]",
        isOverlay && "h-full w-full",
        (isDimmed || isHidden) && "pointer-events-none",
        (isDimmed || isHidden) &&
          "transition-[filter] duration-300 md:blur-[1.5px]"
      )}
    >
      {/* Bright Framed Interior Doorway — exact card size, hidden cleanly when closed/hovered */}
      <div
        data-sector-cavity={sector.id.toLowerCase()}
        aria-hidden="true"
        style={{ backgroundImage: theme.interiorGlow }}
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden border border-border-subtle bg-bg-primary shadow-[inset_0_0_24px_rgba(17,17,17,0.08),inset_8px_0_18px_rgba(17,17,17,0.12)] transition-opacity duration-150",
          isDoorMoving3D ? "visible opacity-100" : "invisible opacity-0"
        )}
      />

      <motion.button
        type="button"
        tabIndex={isOverlay ? -1 : undefined}
        initial={
          doorTransition && !shouldReduceMotion
            ? { rotateY: doorTransition.initialRotateY }
            : isEntering && !shouldReduceMotion
              ? { rotateY: -75 }
              : false
        }
        disabled={isLocked}
        aria-label={`${sector.id} ${sector.title} locker (${projectCount} ${projectCount === 1 ? "entry" : "entries"}). ${sector.tagline}`}
        onPointerDown={(event) => {
          lastPointerTypeRef.current = event.pointerType || "mouse";
        }}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse" && !isLocked) {
            onHoverStart(sector.id);
          }
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse" && !isLocked) {
            onHoverEnd();
          }
        }}
        onFocus={() => {
          if (!isLocked) onFocusLocker(sector.id);
        }}
        onBlur={onBlurLocker}
        onClick={(event) => {
          if (isLocked) return;
          const interactionType =
            event.detail === 0 ? "keyboard" : lastPointerTypeRef.current;
          lastPointerTypeRef.current = "mouse";
          onLockerAction(sector.id, interactionType);
        }}
        animate={
          shouldReduceMotion
            ? { opacity: 1 }
            : doorTransition
              ? {
                  rotateY: doorTransition.rotateY,
                  scale: 1,
                  y: 0,
                }
              : isEntering
                ? {
                    rotateY: -75,
                    scale: 1,
                    y: 0,
                  }
                : {
                    rotateY: 0,
                    scale: isHighlighted ? 1.015 : 1,
                    y: isHighlighted ? -4 : 0,
                  }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0.15 }
            : doorTransition
              ? {
                  duration: doorTransition.duration,
                  delay: doorTransition.delay ?? 0,
                  ease: doorTransition.ease,
                }
              : isEntering
                ? { duration: 0.6, ease: [0.65, 0, 0.35, 1] }
                : isReturnClosing
                  ? { duration: 0.55, ease: [0.65, 0, 0.35, 1] }
                  : LOCKER_SPRING
        }
        onAnimationComplete={() => {
          doorTransition?.onComplete?.();
          if (isReturnClosing && !isEntering) {
            onDoorCloseComplete?.();
          }
        }}
        style={
          shouldReduceMotion
            ? undefined
            : {
                transformStyle: isDoorMoving3D ? "preserve-3d" : "flat",
                transformOrigin: "left center",
              }
        }
        className={cn(
          "group relative flex min-h-[390px] w-full text-left transition-shadow duration-300 will-change-transform sm:min-h-[430px]",
          isOverlay && "h-full min-h-0",
          theme.doorSurface,
          isHighlighted
            ? cn(
                theme.highlightedBorder,
                "shadow-[0_24px_48px_-16px_rgba(17,17,17,0.38)]"
              )
            : "shadow-[0_10px_24px_-12px_rgba(17,17,17,0.2)]"
        )}
      >
        {/* Front Face of the 3D Door Leaf */}
        <div
          style={
            shouldReduceMotion
              ? undefined
              : {
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }
          }
          className="relative flex flex-1 flex-col justify-between self-stretch overflow-hidden p-5 sm:p-6"
        >
          {/* Hinge Shadow & Edge Thickness Bevel */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/35 via-black/15 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-1 bg-gradient-to-l from-white/15 to-transparent"
          />
          {/* Top Specular Lighting Accent Bar */}
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-x-0 top-0 h-1 bg-gradient-to-r transition-opacity duration-300",
              theme.topLight,
              isHighlighted ? "opacity-100" : "opacity-30"
            )}
          />

          {/* SEC-02 Subtle Technical Wireframe Grid Overlay */}
          {sector.id === "SEC-02" && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(248,250,252,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(248,250,252,0.28) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
          )}

          {/* Corner Industrial Rivets */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-2.5 left-2.5 h-1.5 w-1.5 rounded-full bg-current opacity-35"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-current opacity-35"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2.5 left-2.5 h-1.5 w-1.5 rounded-full bg-current opacity-35"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-2.5 bottom-2.5 h-1.5 w-1.5 rounded-full bg-current opacity-35"
          />

          {/* Top Section: Sector Identification + Upper Ventilation Louvers */}
          <div className="relative z-10 w-full pr-6">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase">
                {sector.id}
              </span>
              <span
                className={cn(
                  "border px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase",
                  theme.badgeStyle
                )}
              >
                {theme.badgeLabel}
              </span>
            </div>

            <div aria-hidden="true" className="mt-4 space-y-1.5">
              {[0, 1, 2, 3].map((slot) => (
                <div
                  key={slot}
                  className={cn("h-1.5 w-full rounded-[1px]", theme.louverColor)}
                />
              ))}
            </div>
          </div>

          {/* Center Section: Frosted-Glass Category Label & Mechanical Handle */}
          <div className="relative z-10 my-6 flex items-center justify-between gap-4">
            <div
              className={cn(
                "min-w-0 flex-1 border p-4 transition-colors duration-300",
                theme.frostedPlate
              )}
            >
              <div className="flex items-center justify-between gap-2 border-b border-current/15 pb-2">
                <span className="font-mono text-[10px] tracking-widest uppercase opacity-80">
                  SECTOR {sector.codeNumber}
                </span>
                <span className="font-mono text-[10px] tracking-wider uppercase opacity-80">
                  {projectCount} {projectCount === 1 ? "ENTRY" : "ENTRIES"}
                </span>
              </div>

              <p
                className={cn(
                  "mt-3 text-lg font-bold tracking-tight uppercase sm:text-xl",
                  sector.id === "SEC-03" && "font-mono tracking-widest"
                )}
              >
                {sector.shortLabel}
              </p>

              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed opacity-85">
                {sector.tagline}
              </p>
            </div>

            {/* Mechanical Handle Assembly */}
            <div
              aria-hidden="true"
              className={cn(
                "flex h-28 w-7 shrink-0 flex-col items-center justify-between border p-1 transition-colors",
                theme.handleBay
              )}
            >
              <span className="h-1.5 w-3 bg-current opacity-30" />
              <motion.span
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: isHighlighted || isEntering ? 6 : 0,
                      }
                }
                transition={{ duration: 0.2 }}
                className={cn("h-12 w-2.5 rounded-[1px]", theme.handleBar)}
              />
              <span className="h-1.5 w-3 bg-current opacity-30" />
            </div>
          </div>

          {/* Bottom Section: Lower Louvers + Click to enter badge */}
          <div className="relative z-10 w-full pr-6">
            <div aria-hidden="true" className="mb-4 space-y-1.5">
              {[0, 1, 2].map((slot) => (
                <div
                  key={slot}
                  className={cn("h-1.5 w-3/4 rounded-[1px]", theme.louverColor)}
                />
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-current/15 pt-3">
              <span className="font-mono text-[10px] tracking-widest uppercase opacity-85">
                {isEntering ? "OPENING DOOR" : "DOOR CLOSED"}
              </span>

              <span
                className={cn(
                  "px-2.5 py-1 font-mono text-[10px] font-semibold tracking-widest uppercase transition-all",
                  isHighlighted
                    ? "bg-surface-light text-surface-dark"
                    : "opacity-75"
                )}
              >
                {isHighlighted ? "Click to enter" : "Select"}
              </span>
            </div>
          </div>
        </div>

        {/* Clean Light-Neutral Back Face of the 3D Door Leaf (only active during 3D door motion) */}
        {!shouldReduceMotion && isDoorMoving3D && (
          <div
            aria-hidden="true"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
            className="pointer-events-none absolute inset-0 border border-border-subtle bg-bg-secondary shadow-[inset_6px_0_18px_rgba(17,17,17,0.08)]"
          />
        )}
      </motion.button>
    </motion.div>
  );
}
