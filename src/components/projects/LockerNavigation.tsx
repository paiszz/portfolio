"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { Reveal } from "@/components/animations/Reveal";
import { IndustrialLocker } from "@/components/projects/IndustrialLocker";
import { SectorPreview } from "@/components/projects/SectorPreview";
import { ProjectCardStack } from "@/components/projects/ProjectCardStack";
import type { ProjectItem, SectorCategory, SectorId } from "@/types/portfolio";

interface LockerNavigationProps {
  sectors: SectorCategory[];
  projects: ProjectItem[];
}

export function LockerNavigation({
  sectors,
  projects,
}: LockerNavigationProps) {
  const shouldReduceMotion = useReducedMotion();

  const [hoveredSectorId, setHoveredSectorId] = useState<SectorId | null>(null);
  const [focusedSectorId, setFocusedSectorId] = useState<SectorId | null>(null);
  const [tappedSectorId, setTappedSectorId] = useState<SectorId | null>(null);
  const [previewSectorId, setPreviewSectorId] = useState<SectorId>("SEC-01");
  const [enteredSectorId, setEnteredSectorId] = useState<SectorId>("SEC-01");
  const [hasUserEntered, setHasUserEntered] = useState(false);

  const activeHighlightId =
    hoveredSectorId ?? focusedSectorId ?? tappedSectorId;
  const activePreviewId = activeHighlightId ?? previewSectorId;

  const previewSector =
    sectors.find((item) => item.id === activePreviewId) ?? sectors[0];
  const enteredSector =
    sectors.find((item) => item.id === enteredSectorId) ?? sectors[0];

  const scrollToStack = () => {
    const stackEl = document.getElementById("project-stack-anchor");
    if (!stackEl) return;
    stackEl.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const handleEnterSector = (id: SectorId) => {
    setPreviewSectorId(id);
    setEnteredSectorId(id);
    setHasUserEntered(true);
    setTappedSectorId(null);
    scrollToStack();
  };

  const handleLockerAction = (id: SectorId, pointerType: string) => {
    if (pointerType === "touch" || pointerType === "pen") {
      // Mobile / Touch: first tap previews the locker; separate ENTER button enters the showcase
      setTappedSectorId(id);
      setPreviewSectorId(id);
      return;
    }

    // Desktop / Keyboard: click or Enter/Space selects and enters the category immediately
    handleEnterSector(id);
  };

  const previewProjects = projects.filter(
    (item) => item.sectorId === previewSector.id
  );
  const previewVerifiedCount = previewProjects.filter(
    (item) => item.verificationStatus === "verified"
  ).length;

  const enteredProjects = projects.filter(
    (item) => item.sectorId === enteredSector.id
  );

  return (
    <div>
      {/* Three Horizontal Industrial Lockers */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {sectors.map((sector, idx) => {
          const count = projects.filter(
            (item) => item.sectorId === sector.id
          ).length;

          const hasActiveSelection = activeHighlightId !== null;
          const isHighlighted = activeHighlightId === sector.id;
          const isDimmed =
            hasActiveSelection && activeHighlightId !== sector.id;
          const isEntered = hasUserEntered && enteredSectorId === sector.id;

          return (
            <Reveal
              key={sector.id}
              delay={0.18 + idx * 0.08}
              yOffset={20}
            >
              <IndustrialLocker
                sector={sector}
                projectCount={count}
                isHighlighted={isHighlighted}
                isDimmed={isDimmed}
                isEntered={isEntered}
                onHoverStart={(id) => {
                  setHoveredSectorId(id);
                  setPreviewSectorId(id);
                }}
                onHoverEnd={() => {
                  setHoveredSectorId(null);
                }}
                onFocusLocker={(id) => {
                  setFocusedSectorId(id);
                  setPreviewSectorId(id);
                }}
                onBlurLocker={() => {
                  setFocusedSectorId(null);
                }}
                onLockerAction={handleLockerAction}
              />
            </Reveal>
          );
        })}
      </div>

      {/* Category Preview & Mobile ENTER Control */}
      <Reveal delay={0.32} yOffset={14}>
        <SectorPreview
          sector={previewSector}
          isEntered={hasUserEntered && enteredSectorId === previewSector.id}
          projectCount={previewProjects.length}
          verifiedCount={previewVerifiedCount}
          onEnterSector={handleEnterSector}
        />
      </Reveal>

      {/* Stacked Scroll Project Showcase */}
      <ProjectCardStack
        sector={enteredSector}
        allSectors={sectors}
        projects={enteredProjects}
        onSwitchSector={(id) => {
          setPreviewSectorId(id);
          setEnteredSectorId(id);
          setHasUserEntered(true);
          setTappedSectorId(null);
        }}
      />
    </div>
  );
}
