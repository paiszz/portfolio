export type SectionId =
  | "home"
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "contact";

export interface NavItem {
  id: SectionId;
  label: string;
  href: `#${SectionId}`;
  iconName:
    | "House"
    | "UserRound"
    | "Code"
    | "Briefcase"
    | "Layers"
    | "GraduationCap"
    | "Mail";
}

export interface AboutParagraph {
  id: string;
  label: string;
  content: string;
}

export interface PortraitAsset {
  src: string;
  alt: string;
  caption: string;
  stateLabel: string;
  isPlaceholder: boolean;
}

export interface AboutData {
  heading: string;
  subheading: string;
  paragraphs: AboutParagraph[];
  portraits: {
    default: PortraitAsset;
    hover: PortraitAsset;
  };
}

export type SkillCategoryKey =
  | "programming"
  | "frontend"
  | "tools"
  | "creative";

export interface SkillItem {
  name: string;
  category: SkillCategoryKey;
  domain: string;
}

export interface SkillCategory {
  key: SkillCategoryKey;
  title: string;
  code: string;
  description: string;
  skills: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  index: string;
  title: string;
  organization: string;
  position: string;
  contextType: string;
  period?: string;
  sessionTitle?: string;
  summary: string;
  detailsLabel: string;
  details: string[];
  image?: string;
}

export type SectorId = "SEC-01" | "SEC-02" | "SEC-03";

export interface SectorCategory {
  id: SectorId;
  title: string;
  tagline: string;
  capabilities: string[];
}

export interface ProjectItem {
  id: string;
  sectorId: SectorId;
  title: string;
  description: string;
  tools: string[];
  role: string;
  coverImage?: string;
  caseStudyUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  highlights: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  credentialUrl?: string;
}

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}
