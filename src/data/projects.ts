import type { ProjectItem, SectorCategory, SectorId } from "@/types/portfolio";

export const SECTOR_CATEGORIES: SectorCategory[] = [
  {
    id: "SEC-01",
    codeNumber: "01",
    title: "Software Developer",
    shortLabel: "SOFTWARE DEVELOPER",
    tagline: "Turning ideas into functional digital experiences.",
    visualIdentityLabel: "Gunmetal · Dark Charcoal · Minimal LED Indicators",
    capabilities: [
      "Software & Application Development",
      "Frontend Development",
      "Programming & Problem Solving",
    ],
  },
  {
    id: "SEC-02",
    codeNumber: "02",
    title: "UI/UX Designer",
    shortLabel: "UI/UX DESIGNER",
    tagline: "Designing meaningful experiences through thoughtful interfaces.",
    visualIdentityLabel: "Slate Blue · Off-White · Technical Wireframe Grid",
    capabilities: [
      "User Interface Design",
      "User Experience Design",
      "Wireframing & Prototyping",
    ],
  },
  {
    id: "SEC-03",
    codeNumber: "03",
    title: "Graphic Design",
    shortLabel: "GRAPHIC DESIGN",
    tagline: "Communicating ideas through visual storytelling.",
    visualIdentityLabel:
      "Signal Orange · Deep Crimson · Industrial Stencil Typography",
    capabilities: [
      "Graphic Design & Visual Communication",
      "Poster & Digital Design",
      "Video Editing & Motion Graphics",
    ],
  },
];

export const PROJECT_ITEMS: ProjectItem[] = [
  // SEC-01 — SOFTWARE DEVELOPER
  {
    id: "noctis-software",
    index: "01",
    sectorId: "SEC-01",
    title: "Noctis — Your Personal Productivity Space",
    subtitle: "Personal Productivity Web Application",
    verificationStatus: "verified",
    statusLabel: "Verified Deployment",
    description:
      "A personal productivity application designed to centralize daily academic and personal workflows—integrating schedule management, tasks, notes, calendar views, agenda tracking, user authentication, and web push notifications.",
    features: [
      "Schedule & Calendar Management",
      "Tasks & Agenda Tracking",
      "Personal Notes Workspace",
      "User Authentication",
      "Web Push Notifications",
    ],
    tools: ["Next.js", "Supabase", "Web Push"],
    role: "Software Developer — Full-stack application development, authentication integration, and production deployment.",
    caseStudySummary:
      "Noctis consolidates fragmented productivity tools into a single workspace at noctis.ridwanfaiz.web.id. Built with Next.js and Supabase, it provides authenticated persistence for schedules, tasks, notes, and calendars alongside real-time web push reminders.",
    coverImage: "/images/projects/noctis.svg",
    coverAlt: "Noctis — Your Personal Productivity Space application preview",
    liveUrl: "https://noctis.ridwanfaiz.web.id/",
  },
  {
    id: "malora-software",
    index: "02",
    sectorId: "SEC-01",
    title: "MALORA — Master Prompt Studio",
    subtitle: "AI PROMPT BUILDER & STUDIO WEB APPLICATION",
    verificationStatus: "work_in_progress",
    statusLabel: "Work in Progress",
    description:
      "A structured AI prompt engineering studio designed to standardize complex visual generation workflows—integrating modular parameter controls, strict text-based reference role separation, bilingual natural-language prompt compilation (ID/EN), JSON schema configuration, local autosave, and Supabase cloud project synchronization.",
    features: [
      "Bilingual Prompt Engine: Compiles structured JSON configurations into idiomatic Indonesian or English prompts with strict reference-boundary rules.",
      "Modular Visual Controls: Dedicated modules for Reference Roles, Subject Identity Preservation, Pose & Camera Control, Art Direction, Scene Reconstruction, and Negative Constraints.",
      "Dual Storage Architecture: Offline-first localStorage persistence with autosave alongside optional Supabase cloud sync, user authentication, and optimistic concurrency conflict handling.",
      "Multi-View Studio Workspace: Includes Dashboard, Prompt Builder, Modules Catalog, JSON Config Editor, and Docs with route-based lazy loading.",
    ],
    tools: ["React", "TypeScript", "Tailwind CSS", "Supabase", "Vite"],
    role: "Software Developer — Full-stack application development, modular prompt engine architecture, dual local/cloud state management, and Supabase authentication and database integration.",
    caseStudySummary:
      "Writing complex prompts for AI image generators often leads to inconsistent results and identity drift when multiple references (identity, pose, outfit, background) are mixed. MALORA solves this by enforcing a structured JSON schema (UAPMF) that separates reference roles and visual parameters before compiling them into a clean, ready-to-use natural-language prompt.",
    coverImage: "/images/projects/malora.svg",
    coverAlt: "MALORA — Master Prompt Studio application preview",
  },

  // SEC-02 — UI/UX DESIGNER
  {
    id: "noctis-uiux",
    index: "01",
    sectorId: "SEC-02",
    title: "Noctis UI/UX — Productivity Interface System",
    subtitle: "Interface Design for Noctis Productivity Workspace",
    verificationStatus: "verified",
    statusLabel: "Live Interface · Case Study Assets Pending",
    description:
      "Interface layout and user workflow design for Noctis—structuring schedule views, task lists, notes, calendar navigation, and agenda panels into a cohesive personal productivity environment.",
    features: [
      "Unified Dashboard & Navigation Hierarchy",
      "Schedule, Calendar & Agenda Views",
      "Task & Note Interaction Flows",
    ],
    tools: ["UI/UX Design", "Next.js Interface Implementation"],
    role: "UI/UX & Frontend Designer — Interface layout, information hierarchy, and interactive component states.",
    caseStudySummary:
      "The live interface is deployed at noctis.ridwanfaiz.web.id. Dedicated wireframe boards or Figma prototype links can be attached once confirmed by the portfolio owner.",
    coverImage: "/images/projects/noctis.svg",
    coverAlt: "Noctis UI/UX — Productivity workspace interface preview",
    liveUrl: "https://noctis.ridwanfaiz.web.id/",
  },

  // SEC-03 — GRAPHIC DESIGN
  {
    id: "visual-publication-archive",
    index: "01",
    sectorId: "SEC-03",
    title: "Posters, Infographics & Publication Materials",
    subtitle: "Graphic Design & Visual Communication — Asset Upload Pending",
    verificationStatus: "pending_confirmation",
    statusLabel: "Awaiting Verified Assets",
    description:
      "Visual communication works encompassing graphic design posters, infographics, and social media publication materials aligned with organizational media activities.",
    tools: ["Canva", "Graphic Design & Visual Communication"],
    role: "Graphic Designer & Media Management — Visual composition and publication layout (awaiting specific artwork files).",
    caseStudySummary:
      "This slot is structured for verified posters, infographics, and social media publication designs. Place exported artwork in public/images/creative/ and confirm titles/descriptions to display the completed visual gallery.",
    coverImage: "/images/creative/creative-placeholder.svg",
    coverAlt:
      "Graphic design posters and publication materials placeholder awaiting asset upload",
  },
  {
    id: "motion-bumper-documentation",
    index: "02",
    sectorId: "SEC-03",
    title: "Event Documentation & Video Bumpers",
    subtitle: "Video Editing & Motion Graphics — Asset Upload Pending",
    verificationStatus: "pending_confirmation",
    statusLabel: "Awaiting Verified Assets",
    description:
      "Event documentation media and bumper video production created for student organization and seminar activities (including UKM CCI Telkom University and TechSight 2026 PDD scope).",
    tools: ["CapCut", "Adobe After Effects"],
    role: "Media Documentation & Motion Editor — Bumper video sequences and event documentation (awaiting media files).",
    caseStudySummary:
      "Reserved for verified event documentation stills and bumper video previews. Upload confirmed visual assets to public/images/creative/ to activate full media previews.",
    coverImage: "/images/creative/creative-placeholder.svg",
    coverAlt:
      "Event documentation and video bumper placeholder awaiting asset upload",
  },
];

export function getSectorProjects(sectorId: SectorId): ProjectItem[] {
  return PROJECT_ITEMS.filter((item) => item.sectorId === sectorId);
}

