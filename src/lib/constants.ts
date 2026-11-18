import type { NavItem } from "@/types/portfolio";

export const SITE_CONFIG = {
  name: "Ridwan Faiz Herlambang",
  monogram: "RF",
  title: "Ridwan Faiz Herlambang | Frontend Developer & Creative Portfolio",
  description:
    "Explore the personal portfolio of Ridwan Faiz Herlambang, showcasing software development, frontend engineering, UI/UX design, graphic design, and interactive digital projects.",
  url: "https://ridwanfaiz.web.id",
} as const;

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", href: "#home", iconName: "House" },
  { id: "about", label: "About", href: "#about", iconName: "UserRound" },
  { id: "skills", label: "Skills", href: "#skills", iconName: "Code" },
  {
    id: "experience",
    label: "Experience",
    href: "#experience",
    iconName: "Briefcase",
  },
  { id: "projects", label: "Projects", href: "#projects", iconName: "Layers" },
  {
    id: "education",
    label: "Education",
    href: "#education",
    iconName: "GraduationCap",
  },
  { id: "contact", label: "Contact", href: "#contact", iconName: "Mail" },
];
