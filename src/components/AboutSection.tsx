import { Brain, Cpu, Rocket, Target } from "lucide-react";
import { RevealSection } from "./ScrollReveal";

const cards = [
  {
    icon: Brain,
    title: "AI & ML Research",
    desc: "Deep expertise in machine learning, neural networks, and data-driven solutions for complex problems.",
  },
  {
    icon: Cpu,
    title: "Reinforcement Learning",
    desc: "Custom environment creation and RL modeling for production-grade autonomous decision-making systems.",
  },
  {
    icon: Rocket,
    title: "Hackathon Warriors",
    desc: "Relentless builders who turn 48-hour sprints into deployable, real-world AI solutions.",
  },
  {
    icon: Target,
    title: "Research → Deployment",
    desc: "End-to-end pipeline from research prototyping to deployed AI systems with interactive demos.",
  },
];

const AboutSection = () => (
  <section id="about" className="section-padding relative">
    <div className="container mx-auto max-w-6xl">
      <RevealSection>
        <p className="text-primary font-mono text-sm mb-3 tracking-widest uppercase">Who We Are</p>
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          An <span className="text-gradient">Always Building</span> Culture
        </h2>
        <p className="text-muted-foreground text-lg max-w-3xl mb-16 leading-relaxed">
          Abhinavan is driven by an insatiable curiosity for artificial intelligence.
          We don't just study AI — we build, break, iterate, and deploy.
          From custom RL environments to hackathon-winning prototypes,
          our journey is one of continuous innovation and relentless problem-solving.
        </p>
      </RevealSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <RevealSection key={card.title} delay={i * 100}>
            <div className="glass-card-hover p-6 h-full group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <card.icon size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
            </div>
          </RevealSection>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
