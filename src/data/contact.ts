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
      value: "Pending confirmation",
      isConfigured: false,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: "Pending confirmation",
      isConfigured: false,
    },
    {
      id: "github",
      label: "GitHub",
      value: "Pending confirmation",
      isConfigured: false,
    },
  ] as ContactChannel[],
} as const;
