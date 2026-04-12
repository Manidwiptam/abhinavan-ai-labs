import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import HackathonSection from "@/components/HackathonSection";
import TeamSection from "@/components/TeamSection";
import SkillsSection from "@/components/SkillsSection";
import StatsSection from "@/components/StatsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ParticleGrid from "@/components/ParticleGrid";
import CursorSpotlight from "@/components/CursorSpotlight";
import ScrollProgress from "@/components/ScrollProgress";
import LoadingScreen from "@/components/LoadingScreen";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const handleLoaded = useCallback(() => setLoading(false), []);

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoaded} />}
      <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
        <ScrollProgress />
        <ParticleGrid />
        <CursorSpotlight />
        <Navbar />
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <HackathonSection />
        <TeamSection />
        <SkillsSection />
        <StatsSection />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
};

export default Index;
