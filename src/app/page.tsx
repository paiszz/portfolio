import { Navbar } from "@/components/navigation/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1 bg-bg-primary text-text-primary">
        <HeroSection />
      </main>
    </>
  );
}
