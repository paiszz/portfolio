import { Navbar } from "@/components/navigation/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectShowcaseSection } from "@/components/sections/ProjectShowcaseSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-surface-dark focus:px-4 focus:py-2.5 focus:font-mono focus:text-xs focus:font-semibold focus:tracking-widest focus:text-surface-light focus:uppercase focus:outline-2 focus:outline-offset-2 focus:outline-text-primary"
      >
        Skip to main content
      </a>
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 bg-bg-primary text-text-primary focus:outline-none"
      >
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectShowcaseSection />
        <EducationSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
