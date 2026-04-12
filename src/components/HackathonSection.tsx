import { Trophy, Calendar } from "lucide-react";
import { RevealSection } from "./ScrollReveal";

const hackathons = [
  {
    name: "META OpenENV Hackathon 2026",
    organizer: "Hugging Face × Scaler School of Technology",
    date: "2026",
    problem: "Open Environment RL Challenges — building adaptive AI agents for dynamic, real-world-inspired environments.",
    tech: ["Python", "PyTorch", "OpenAI Gym", "Hugging Face", "Reinforcement Learning"],
    achievement: "Built Adaptive RL Reliability — an autonomous SRE agent for live service management.",
  },
];

const HackathonSection = () => (
  <section id="hackathons" className="section-padding relative">
    <div className="container mx-auto max-w-6xl">
      <RevealSection>
        <p className="type-eyebrow mb-3">Our Journey</p>
        <h2 className="type-section-heading mb-6">
          Hackathon <span className="text-gradient">Timeline</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mb-14">
          Every hackathon is a crucible — forging ideas into deployable solutions under pressure.
        </p>
      </RevealSection>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-accent/40 to-transparent" />

        {hackathons.map((h, i) => (
          <RevealSection key={h.name} delay={i * 150}>
            <div className={`relative flex flex-col md:flex-row items-start gap-6 mb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
              {/* Dot */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary glow-blue z-10 mt-6" />

              <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                <div className="glass-card-hover p-6">
                  <div className="flex items-center gap-2 mb-3 text-primary">
                    <Trophy size={18} />
                    <Calendar size={14} />
                    <span className="type-tech-chip text-primary">{h.date}</span>
                  </div>
                  <h3 className="type-card-title text-xl mb-2 text-foreground">{h.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{h.organizer}</p>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{h.problem}</p>
                  <p className="text-sm font-medium text-primary mb-3">{h.achievement}</p>
                  <div className="flex flex-wrap gap-2">
                    {h.tech.map((t) => (
                      <span key={t} className="px-2 py-1 type-tech-chip bg-primary/10 text-primary rounded-md">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>
        ))}
      </div>
    </div>
  </section>
);

export default HackathonSection;
