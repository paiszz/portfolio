export interface ContactChannel {
  id: "instagram" | "linkedin" | "github" | "cv";
  label: string;
  value: string;
  href?: string;
  isConfigured: boolean;
}

export const CONTACT_DATA = {
  heading: "Have a project in mind? Let's build something meaningful.",
  description:
    "Open for software development collaborations, frontend engineering roles, UI/UX design discussions, and creative visual projects.",
  channels: [
    {
      id: "instagram",
      label: "Instagram",
      value: "instagram.com/rdw4nfz13",
      href: "https://www.instagram.com/rdw4nfz13/",
      isConfigured: true,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: "linkedin.com/in/ridwanfaizher",
      href: "https://www.linkedin.com/in/ridwanfaizher",
      isConfigured: true,
    },
    {
      id: "github",
      label: "GitHub",
      value: "github.com/paiszz",
      href: "https://github.com/paiszz",
      isConfigured: true,
    },
    {
      id: "cv",
      label: "Curriculum Vitae",
      value: "CV_Ridwan Faiz Herlambang.pdf",
      href: "/cv/CV_Ridwan%20Faiz%20Herlambang.pdf",
      isConfigured: true,
    },
  ] as ContactChannel[],
} as const;
