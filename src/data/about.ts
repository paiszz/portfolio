import type { AboutData } from "@/types/portfolio";

export const ABOUT_DATA: AboutData = {
  heading: "About Me",
  subheading:
    "Informatics student at Telkom University building interactive digital interfaces and visual communication systems.",
  paragraphs: [
    {
      id: "introduction",
      label: "Personal Introduction",
      content:
        "I am Ridwan Faiz Herlambang, an undergraduate student with a strong focus on crafting modern, interactive web applications and thoughtful visual experiences. My work bridges structured engineering with minimalist editorial aesthetics.",
    },
    {
      id: "academic",
      label: "Academic Background",
      content:
        "Currently pursuing a Bachelor's degree in Informatics (S1 Informatika) at Telkom University, where I study software engineering, algorithms, data structures, and modern computing architecture.",
    },
    {
      id: "interests",
      label: "Professional Interests",
      content:
        "My core interests span Software Development, Frontend Development, UI/UX Design, and Graphic Design—allowing me to approach digital products from initial interface concept and visual identity through to responsive frontend implementation.",
    },
    {
      id: "development",
      label: "Personal Development",
      content:
        "Alongside academic studies, I actively develop practical experience through student organization media management at CCI Telkom University, technology seminar committee collaboration, and structured virtual internship programs.",
    },
  ],
  portraits: {
    default: {
      src: "/images/profile/portrait-shirt.svg",
      alt: "Ridwan Faiz Herlambang wearing a shirt (default portrait placeholder)",
      caption: "Casual Shirt Portrait",
      stateLabel: "STATE 01 — SHIRT",
      isPlaceholder: true,
    },
    hover: {
      src: "/images/profile/portrait-almamater.svg",
      alt: "Ridwan Faiz Herlambang wearing Telkom University almamater jacket (hover portrait placeholder)",
      caption: "Telkom University Almamater",
      stateLabel: "STATE 02 — ALMAMATER",
      isPlaceholder: true,
    },
  },
};
