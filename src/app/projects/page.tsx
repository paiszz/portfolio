import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { ProjectShowcaseSection } from "@/components/sections/ProjectShowcaseSection";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Projects | ${SITE_CONFIG.name}`,
  description:
    "Explore interactive project sectors across Software Development, UI/UX Design, and Graphic Design.",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 bg-bg-primary text-text-primary focus:outline-none"
      >
        <ProjectShowcaseSection />
      </main>
      <Footer />
    </>
  );
}
