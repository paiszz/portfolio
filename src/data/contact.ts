export interface ContactChannel {
  id: "email" | "linkedin" | "github";
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
      id: "email",
      label: "Personal Email",
      value: "rfaizherlambang@gmail.com",
      href: "mailto:rfaizherlambang@gmail.com",
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
  ] as ContactChannel[],
} as const;
