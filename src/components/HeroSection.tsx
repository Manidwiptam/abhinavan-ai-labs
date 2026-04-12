import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { RevealSection } from "./ScrollReveal";
import abhinavanLogo from "@/assets/abhinavan-mark.png";

const HeroSection = () => {
  const handleScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden section-padding pt-32">
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <RevealSection>
          <div className="flex justify-center mb-8">
            <img
              src={abhinavanLogo}
              alt="Abhinavan Logo"
              className="h-24 w-24 md:h-32 md:w-32 object-contain animate-float drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]"
            />
          </div>
        </RevealSection>

        <RevealSection delay={100}>
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card text-xs font-mono text-primary mb-6">
            <Sparkles size={14} />
            <span>AI / ML / REINFORCEMENT LEARNING TEAM</span>
          </div>
        </RevealSection>

        <RevealSection delay={200}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] mb-6 tracking-tight">
            Building the Future
            <br />
            <span className="text-gradient">with Intelligence</span>
          </h1>
        </RevealSection>

        <RevealSection delay={300}>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            We are <span className="text-foreground font-semibold">Abhinavan</span> — a passionate AI innovation team
            dedicated to solving real-world problems through continuous research,
            experimentation, and hackathon participation.
          </p>
        </RevealSection>

        <RevealSection delay={400}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleScroll("#projects")}
              className="group flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl transition-all duration-300 hover:opacity-90 glow-blue"
            >
              <Zap size={18} />
              Explore Projects
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => handleScroll("#team")}
              className="flex items-center gap-2 px-8 py-3.5 glass-card font-semibold text-foreground rounded-xl transition-all duration-300 hover:border-primary/40"
            >
              Meet the Team
            </button>
            <button
              onClick={() => handleScroll("#contact")}
              className="flex items-center gap-2 px-8 py-3.5 border border-border font-semibold text-muted-foreground rounded-xl transition-all duration-300 hover:text-foreground hover:border-primary/40"
            >
              Collaborate With Us
            </button>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

export default HeroSection;
