import { HashScrollGuard } from "@/components/navigation/HashScrollGuard";
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
    <HashScrollGuard>
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
    </HashScrollGuard>
  );
}
