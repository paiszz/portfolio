import type { ProjectItem, SectorCategory } from "@/types/portfolio";

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
    id: "roomify-software",
    index: "02",
    sectorId: "SEC-01",
    title: "Roomify",
    subtitle: "Software Development Candidate — Data Pending Confirmation",
    verificationStatus: "pending_confirmation",
    statusLabel: "Pending Confirmation",
    description:
      "Listed in the PRD as a candidate project for Software Development. Specific feature scope, technology stack, repository link, and completion status require owner confirmation before publishing as completed work.",
    tools: ["Pending Stack Confirmation"],
    role: "Software Development Candidate (Awaiting verified contribution details)",
    caseStudySummary:
      "Placeholder entry reserved for Roomify. To publish this card as a verified project, please provide the actual application description, confirmed tech stack, personal contribution, screenshots, and repository or live URL.",
    coverImage: "/images/projects/candidate-placeholder.svg",
    coverAlt: "Roomify candidate project placeholder awaiting asset confirmation",
  },
  {
    id: "yukjalan-software",
    index: "03",
    sectorId: "SEC-01",
    title: "YukJalan!",
    subtitle: "Software Development Candidate — Data Pending Confirmation",
    verificationStatus: "pending_confirmation",
    statusLabel: "Pending Confirmation",
    description:
      "Listed in the PRD as a candidate project for Software Development. Project status, verified feature set, technology stack, and preview assets are awaiting confirmation.",
    tools: ["Pending Stack Confirmation"],
    role: "Software Development Candidate (Awaiting verified contribution details)",
    caseStudySummary:
      "Placeholder entry reserved for YukJalan!. No unverified claims, completion status, or URLs have been added. Replace with confirmed project data and screenshots when ready.",
    coverImage: "/images/projects/candidate-placeholder.svg",
    coverAlt:
      "YukJalan! candidate project placeholder awaiting asset confirmation",
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
  {
    id: "roomify-yukjalan-uiux",
    index: "02",
    sectorId: "SEC-02",
    title: "Roomify UI/UX & YukJalan! UI/UX",
    subtitle: "UI/UX Candidate Case Studies — Data Pending Confirmation",
    verificationStatus: "pending_confirmation",
    statusLabel: "Pending Confirmation",
    description:
      "Candidate UI/UX design projects listed in the PRD (Roomify UI/UX and YukJalan! UI/UX). Wireframes, user flows, Figma prototypes, and specific role descriptions are awaiting confirmation.",
    tools: ["Figma (Pending Confirmation)", "Wireframing & Prototyping"],
    role: "UI/UX Designer Candidate (Awaiting verified case study artifacts)",
    caseStudySummary:
      "Reserved for Roomify UI/UX and YukJalan! UI/UX case studies. Provide verified screen exports, problem statements, and Figma prototype links to convert these candidates into full case study cards.",
    coverImage: "/images/projects/candidate-placeholder.svg",
    coverAlt: "UI/UX candidate projects placeholder awaiting confirmation",
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
