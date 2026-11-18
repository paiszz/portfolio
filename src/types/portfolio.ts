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

export type SkillCategoryKey =
  | "programming"
  | "frontend"
  | "tools"
  | "creative";

export interface SkillItem {
  name: string;
  category: SkillCategoryKey;
  iconPath?: string;
}

export interface SkillCategory {
  key: SkillCategoryKey;
  title: string;
  code: string;
  skills: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  index: string;
  title: string;
  organization: string;
  position: string;
  period: string;
  summary: string;
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
