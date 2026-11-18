"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import type { SectorCategory, SectorId } from "@/types/portfolio";

interface IndustrialLockerProps {
  sector: SectorCategory;
  projectCount: number;
  isHighlighted: boolean;
  isDimmed: boolean;
  isEntered: boolean;
  onHoverStart: (id: SectorId) => void;
  onHoverEnd: () => void;
  onLockerAction: (id: SectorId, pointerType: string) => void;
  onFocusLocker: (id: SectorId) => void;
  onBlurLocker: () => void;
}

const LOCKER_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 24,
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
      };
  }
}

export function IndustrialLocker({
  sector,
  projectCount,
  isHighlighted,
  isDimmed,
  isEntered,
  onHoverStart,
  onHoverEnd,
  onLockerAction,
  onFocusLocker,
  onBlurLocker,
}: IndustrialLockerProps) {
  const shouldReduceMotion = useReducedMotion();
  const theme = getLockerTheme(sector.id);
  const lastPointerTypeRef = useRef("mouse");

  return (
    <div className="perspective-[1200px]">
      <motion.button
        type="button"
        aria-pressed={isEntered}
        aria-label={`${sector.id} ${sector.title} locker (${projectCount} entries). ${sector.tagline}`}
        onPointerDown={(event) => {
          lastPointerTypeRef.current = event.pointerType || "mouse";
        }}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") {
            onHoverStart(sector.id);
          }
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") {
            onHoverEnd();
          }
        }}
        onFocus={() => onFocusLocker(sector.id)}
        onBlur={onBlurLocker}
        onClick={(event) => {
          const interactionType =
            event.detail === 0 ? "keyboard" : lastPointerTypeRef.current;
          lastPointerTypeRef.current = "mouse";
          onLockerAction(sector.id, interactionType);
        }}
        animate={
          shouldReduceMotion
            ? {
                opacity: isDimmed ? 0.42 : 1,
              }
            : {
                rotateY: isHighlighted ? -6 : 0,
                scale: isHighlighted ? 1.015 : isDimmed ? 0.985 : 1,
                opacity: isDimmed ? 0.38 : 1,
                y: isHighlighted ? -4 : 0,
              }
        }
        transition={shouldReduceMotion ? { duration: 0.15 } : LOCKER_SPRING}
        style={
          shouldReduceMotion
            ? undefined
            : {
                transformStyle: "preserve-3d",
                transformOrigin: "left center",
              }
        }
        className={cn(
          "group relative flex min-h-[390px] w-full flex-col justify-between overflow-hidden border p-5 text-left transition-shadow duration-300 sm:min-h-[430px] sm:p-6",
          "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text-primary",
          isDimmed
            ? "border-dashed border-border-subtle bg-bg-secondary/50 text-text-secondary shadow-none"
            : cn(
                theme.doorSurface,
                isHighlighted
                  ? cn(
                      theme.highlightedBorder,
                      "shadow-[0_24px_48px_-16px_rgba(17,17,17,0.38)]"
                    )
                  : "shadow-[0_10px_24px_-12px_rgba(17,17,17,0.2)]"
              )
        )}
      >
        {/* Top Specular Lighting Accent Bar */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 top-0 h-1 bg-gradient-to-r transition-opacity duration-300",
            theme.topLight,
            isHighlighted && !isDimmed ? "opacity-100" : "opacity-25"
          )}
        />

        {/* SEC-02 Subtle Technical Wireframe Grid Overlay */}
        {sector.id === "SEC-02" && !isDimmed && (
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

        {/* Corner Industrial Rivets / Bolts */}
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

            {!isDimmed ? (
              <span
                className={cn(
                  "border px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase",
                  theme.badgeStyle
                )}
              >
                {theme.badgeLabel}
              </span>
            ) : (
              <span className="font-mono text-[10px] tracking-widest uppercase">
                STANDBY
              </span>
            )}
          </div>

          {/* Upper Stamped Steel Ventilation Louvers */}
          <div
            aria-hidden="true"
            className="mt-4 space-y-1.5"
          >
            {[0, 1, 2, 3].map((slot) => (
              <div
                key={slot}
                className={cn(
                  "h-1.5 w-full rounded-[1px] transition-opacity",
                  isDimmed
                    ? "bg-border-subtle"
                    : theme.louverColor
                )}
              />
            ))}
          </div>
        </div>

        {/* Center Section: Frosted-Glass Category Label & Mechanical Handle */}
        <div className="relative z-10 my-6 flex items-center justify-between gap-4">
          <div
            className={cn(
              "min-w-0 flex-1 border p-4 transition-colors duration-300",
              isDimmed
                ? "border-border-subtle bg-bg-primary/60 text-text-secondary"
                : theme.frostedPlate
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
                sector.id === "SEC-03" && "tracking-widest font-mono"
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
              isDimmed
                ? "border-border-subtle bg-bg-primary"
                : theme.handleBay
            )}
          >
            <span className="h-1.5 w-3 bg-current opacity-30" />
            <motion.span
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: isHighlighted ? 6 : 0,
                    }
              }
              transition={{ duration: 0.2 }}
              className={cn(
                "h-12 w-2.5 rounded-[1px]",
                isDimmed ? "bg-text-secondary/40" : theme.handleBar
              )}
            />
            <span className="h-1.5 w-3 bg-current opacity-30" />
          </div>
        </div>

        {/* Bottom Section: Lower Louvers + CLICK TO ENTER / Active Status */}
        <div className="relative z-10 w-full pr-6">
          {/* Lower Stamped Steel Ventilation Louvers */}
          <div aria-hidden="true" className="mb-4 space-y-1.5">
            {[0, 1, 2].map((slot) => (
              <div
                key={slot}
                className={cn(
                  "h-1.5 w-3/4 rounded-[1px]",
                  isDimmed ? "bg-border-subtle" : theme.louverColor
                )}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-current/15 pt-3">
            <span className="font-mono text-[10px] tracking-widest uppercase opacity-85">
              {isEntered ? "SECTOR OPEN" : "DOOR CLOSED"}
            </span>

            <span
              className={cn(
                "px-2.5 py-1 font-mono text-[10px] font-semibold tracking-widest uppercase transition-all",
                isHighlighted && !isDimmed
                  ? "bg-surface-light text-surface-dark"
                  : isEntered && !isDimmed
                    ? "border border-current/40 bg-current/10"
                    : "opacity-75"
              )}
            >
              {isHighlighted
                ? "CLICK TO ENTER"
                : isEntered
                  ? "ACTIVE SECTOR"
                  : "SELECT"}
            </span>
          </div>
        </div>
      </motion.button>
    </div>
  );
}
