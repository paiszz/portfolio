"use client";

import { ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SectorCategory, SectorId } from "@/types/portfolio";

interface SectorPreviewProps {
  sector: SectorCategory;
  isEntered: boolean;
  projectCount: number;
  verifiedCount: number;
  wipCount?: number;
  onEnterSector: (id: SectorId) => void;
}

export function SectorPreview({
  sector,
  isEntered,
  projectCount,
  verifiedCount,
  wipCount = 0,
  onEnterSector,
}: SectorPreviewProps) {
  const pendingCount = Math.max(0, projectCount - verifiedCount - wipCount);
  const summaryParts: string[] = [];
  if (verifiedCount > 0) summaryParts.push(`${verifiedCount} Verified`);
  if (wipCount > 0) summaryParts.push(`${wipCount} Work in Progress`);
  if (pendingCount > 0) summaryParts.push(`${pendingCount} Pending Assets`);

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label={`${sector.id} ${sector.title} sector preview`}
      className="mt-6 border border-border-subtle bg-bg-secondary/65 p-5 sm:p-6"
    >
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left: Selected Category, Tagline, and Visual Identity Metadata */}
        <div className="lg:col-span-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              {sector.title}
            </h3>
            <span className="bg-surface-dark px-2 py-0.5 font-mono text-[11px] font-semibold tracking-widest text-surface-light">
              {sector.id}
            </span>
            {isEntered && (
              <span className="border border-text-primary px-2 py-0.5 font-mono text-[10px] tracking-widest text-text-primary uppercase">
                Viewing Showcase
              </span>
            )}
          </div>

          <p className="mt-2.5 text-sm font-medium text-text-primary sm:text-base">
            &ldquo;{sector.tagline}&rdquo;
          </p>

          <p className="mt-2 font-mono text-[11px] tracking-wider text-text-secondary uppercase">
            {sector.visualIdentityLabel}
          </p>
        </div>

        {/* Center: Core Capabilities */}
        <div className="lg:col-span-4">
          <p className="font-mono text-[11px] font-semibold tracking-widest text-text-primary uppercase">
            Core Capabilities
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {sector.capabilities.map((capability) => (
              <li
                key={capability}
                className="flex items-center gap-2 text-xs text-text-secondary sm:text-sm"
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 bg-surface-dark"
                />
                <span>{capability}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Explicit ENTER Button (Essential for Mobile Tap-to-Preview + Enter) */}
        <div className="flex flex-col justify-between gap-3 border-t border-border-subtle pt-4 lg:col-span-3 lg:items-end lg:border-t-0 lg:pt-0">
          <div className="lg:text-right">
            <p className="font-mono text-[11px] tracking-widest text-text-secondary uppercase">
              {projectCount} {projectCount === 1 ? "Entry" : "Entries"} in Sector
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-text-secondary">
              {summaryParts.length > 0
                ? summaryParts.join(" · ")
                : "Sector Ready"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onEnterSector(sector.id)}
            className={cn(
              "inline-flex min-h-[44px] w-full items-center justify-center gap-2 px-4 py-2.5 font-mono text-xs font-semibold tracking-widest uppercase transition-colors lg:w-auto",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
              "bg-surface-dark text-surface-light hover:bg-text-primary/85"
            )}
          >
            <span>ENTER {sector.id}</span>
            <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
