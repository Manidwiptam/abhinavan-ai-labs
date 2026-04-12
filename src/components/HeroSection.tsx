import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { RevealSection } from "./ScrollReveal";
import AICore from "./AICore";

const HeroSection = () => {
  const handleScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen overflow-hidden section-padding pt-32">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute left-[12%] top-[18%] h-80 w-80 rounded-full bg-primary/10 blur-[140px]" />
      <div className="absolute bottom-[12%] right-[10%] h-72 w-72 rounded-full bg-accent/10 blur-[120px]" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <div className="text-center lg:text-left">
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
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <button
                onClick={() => handleScroll("#projects")}
                className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-primary-foreground type-button transition-all duration-300 hover:opacity-90 glow-blue"
              >
                <Zap size={18} />
                Explore Projects
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => handleScroll("#team")}
                className="flex items-center gap-2 rounded-xl glass-card px-8 py-3.5 text-foreground type-button transition-all duration-300 hover:border-primary/40"
              >
                Meet the Team
              </button>
              <button
                onClick={() => handleScroll("#contact")}
                className="flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 text-muted-foreground type-button transition-all duration-300 hover:border-primary/40 hover:text-foreground"
              >
                Collaborate With Us
              </button>
            </div>
          </RevealSection>
        </div>

        <RevealSection delay={260} className="relative hidden items-center justify-center lg:flex" y={24}>
          <div className="relative mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 via-transparent to-accent/20 blur-3xl" />
            <AICore />
          </div>
        </RevealSection>

        <RevealSection delay={260} className="relative mx-auto flex items-center justify-center lg:hidden" y={24}>
          <div className="h-48 w-48 rounded-full border border-primary/20 bg-[radial-gradient(circle_at_40%_40%,rgba(96,165,250,0.45),rgba(129,140,248,0.18)_42%,rgba(2,6,23,0)_74%)] shadow-[0_0_60px_rgba(59,130,246,0.18)]" />
        </RevealSection>
      </div>
    </section>
  );
};

export default HeroSection;
