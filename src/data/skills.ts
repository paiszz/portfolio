import type { SkillCategory } from "@/types/portfolio";

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    key: "programming",
    title: "Programming",
    code: "CAT-A",
    description:
      "Core programming languages used for algorithmic problem solving, object-oriented design, and strongly-typed application logic.",
    skills: [
      { name: "Java", category: "programming", domain: "Object-Oriented" },
      { name: "Python", category: "programming", domain: "Scripting & Logic" },
      { name: "C++", category: "programming", domain: "Systems & Algorithms" },
      { name: "Go", category: "programming", domain: "Backend & Concurrency" },
      {
        name: "TypeScript",
        category: "programming",
        domain: "Type-Safe Web",
      },
    ],
  },
  {
    key: "frontend",
    title: "Frontend Development",
    code: "CAT-B",
    description:
      "Web standards and modern component frameworks for building responsive, accessible, and interactive user interfaces.",
    skills: [
      { name: "HTML", category: "frontend", domain: "Semantic Markup" },
      { name: "CSS", category: "frontend", domain: "Layout & Styling" },
      { name: "JavaScript", category: "frontend", domain: "Client Runtime" },
      { name: "React", category: "frontend", domain: "UI Architecture" },
      { name: "Next.js", category: "frontend", domain: "Full-Stack React" },
    ],
  },
  {
    key: "tools",
    title: "Tools",
    code: "CAT-C",
    description:
      "Version control, collaborative repository workflows, and interface design environments.",
    skills: [
      { name: "Git", category: "tools", domain: "Version Control" },
      { name: "GitHub", category: "tools", domain: "Code Collaboration" },
      { name: "Figma", category: "tools", domain: "Interface Design" },
    ],
  },
  {
    key: "creative",
    title: "Creative",
    code: "CAT-D",
    description:
      "Visual communication, digital publication design, video editing, and motion graphics tools.",
    skills: [
      { name: "Canva", category: "creative", domain: "Visual Publication" },
      { name: "CapCut", category: "creative", domain: "Video Editing" },
      {
        name: "Adobe After Effects",
        category: "creative",
        domain: "Motion Graphics",
      },
    ],
  },
];
