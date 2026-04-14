import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { RevealSection } from "./ScrollReveal";

const HeroSection = () => {
  const handleScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen overflow-hidden section-padding">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.45) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute left-[12%] top-[18%] h-80 w-80 rounded-full bg-primary/12 blur-[140px]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center gap-12 text-center">
        <div>
          <RevealSection delay={100}>
            <div className="mb-6 inline-flex items-center gap-2 glass-card px-4 py-2 type-eyebrow">
              <Sparkles size={14} />
              <span>AI / ML / REINFORCEMENT LEARNING TEAM</span>
            </div>
          </RevealSection>

          <RevealSection delay={200}>
            <h1 className="mb-6 font-display text-4xl font-extrabold leading-[0.92] tracking-[-0.065em] sm:text-5xl md:text-7xl">
              Building the Future
              <br />
              <span className="text-gradient">with Intelligence</span>
            </h1>
          </RevealSection>

          <RevealSection delay={300}>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-[1.75] text-muted-foreground md:text-xl lg:mx-0">
              We are <span className="font-semibold text-foreground">Abhinavan</span>, a passionate AI innovation team
              dedicated to solving real-world problems through continuous research,
              experimentation, and hackathon participation.
            </p>
          </RevealSection>

          <RevealSection delay={400}>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => handleScroll("#projects")}
                className="group neural-button flex items-center gap-2 rounded-xl px-8 py-3.5 type-button"
              >
                <Zap size={18} />
                Explore Projects
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => handleScroll("#team")}
                className="flex items-center gap-2 rounded-xl glass-card px-8 py-3.5 text-foreground type-button transition-all duration-300 hover:border-secondary/50"
              >
                Meet the Team
              </button>
              <button
                onClick={() => handleScroll("#contact")}
                className="flex items-center gap-2 rounded-xl border border-border bg-card/30 px-8 py-3.5 text-muted-foreground type-button transition-all duration-300 hover:border-primary/50 hover:text-foreground"
              >
                Collaborate With Us
              </button>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
