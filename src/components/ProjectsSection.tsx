import { useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import { RevealSection } from "./ScrollReveal";
import MotionCard from "./MotionCard";
import TechChip from "./TechChip";

const filters = ["All", "RL", "ML", "Hackathons", "Research"];

const projects = [
  {
    title: "Adaptive RL Reliability",
    desc: "A production-inspired Reinforcement Learning environment where an RL agent acts as an auto-scaling SRE engineer, learning to make decisions for live services under fluctuating traffic, failure bursts, CPU saturation, and latency peaks.",
    tags: ["RL", "Research", "Hackathons"],
    tech: ["Python", "OpenAI Gym", "PyTorch", "Streamlit"],
    github: "https://github.com/Soumya03007/adaptive-RL-reliability.git",
    demo: "https://huggingface.co/spaces/Soumya007/Adaptive-RL-Environment",
    metrics: "Autonomous SRE · SLO-aware · Scale up/down/noop decisions",
  },
];

const ProjectsSection = () => {
  const [active, setActive] = useState("All");

  const filtered = active === "All"
    ? projects
    : projects.filter((p) => p.tags.includes(active));

  return (
    <section id="projects" className="section-padding relative">
      <div className="container mx-auto max-w-6xl">
        <RevealSection>
          <p className="type-eyebrow mb-3">Our Work</p>
          <h2 className="type-section-heading mb-6">
            Project <span className="text-gradient">Showcase</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mb-10">
            From research prototypes to deployed systems — every project is a step towards smarter AI.
          </p>
        </RevealSection>

        <RevealSection delay={100}>
          <div className="flex flex-wrap gap-2 mb-10">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-4 py-2 rounded-lg text-sm font-sans font-medium transition-all duration-300 ${
                  active === f
                    ? "bg-primary text-primary-foreground glow-blue"
                    : "glass-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </RevealSection>

        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((project, i) => (
            <RevealSection key={project.title} delay={i * 100}>
              <MotionCard className="p-6 group">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <TechChip key={tag} className="px-2.5 py-1 text-primary type-tech-chip">
                      {tag}
                    </TechChip>
                  ))}
                </div>
                <h3 className="type-card-title text-xl mb-3 text-foreground">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.desc}</p>
                <p className="type-tech-chip text-primary/70 mb-4">{project.metrics}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tech.map((t) => (
                    <TechChip key={t} className="px-2 py-1 text-muted-foreground type-tech-chip">
                      {t}
                    </TechChip>
                  ))}
                </div>
                <div className="flex gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm glass-card hover:border-primary/40 text-foreground transition-colors rounded-lg type-button"
                  >
                    <Github size={16} /> GitHub
                  </a>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity type-button"
                  >
                    <ExternalLink size={16} /> Live Demo
                  </a>
                </div>
              </MotionCard>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
