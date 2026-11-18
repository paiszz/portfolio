import { Navbar } from "@/components/navigation/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectShowcaseSection } from "@/components/sections/ProjectShowcaseSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1 bg-bg-primary text-text-primary">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectShowcaseSection />
      </main>
    </>
  );
}
