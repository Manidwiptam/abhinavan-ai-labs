import { Github, Linkedin } from "lucide-react";
import { RevealSection } from "./ScrollReveal";
import manidwiptamImg from "@/assets/manidwiptam.png";
import rohanImg from "@/assets/rohan.png";
import soumyadeepImg from "@/assets/soumyadeep.webp";
import MotionCard from "./MotionCard";
import TechChip from "./TechChip";

const members = [
  {
    name: "Manidwiptam Halder",
    role: "AI Engineer & Full Stack AI Developer",
    strengths: "System architecture, full-stack AI integration, and rapid prototyping",
    expertise: ["Computer Vision", "NLP", "Full Stack AI"],
    github: "https://github.com/Manidwiptam",
    linkedin: "https://www.linkedin.com/in/manidwiptam/",
    image: manidwiptamImg,
  },
  {
    name: "Rohan Banerjee",
    role: "RL Researcher & AI Engineer",
    strengths: "Reinforcement learning modeling, environment design, and algorithm optimization",
    expertise: ["Reinforcement Learning", "Model Optimization", "Python"],
    github: "https://github.com/rohanbanerjee1234567-cell",
    linkedin: "https://www.linkedin.com/in/rohan-banerjee-667283356",
    image: rohanImg,
  },
  {
    name: "Soumyadeep Paul",
    role: "ML Engineer & Deployment Specialist",
    strengths: "Model training, deployment pipelines, and interactive AI demo systems",
    expertise: ["Deep Learning", "Cloud AI", "Reliability Engineering"],
    github: "https://github.com/Soumya03007",
    linkedin: "https://www.linkedin.com/in/soumyadeeppaul7/",
    image: soumyadeepImg,
  },
];

const TeamSection = () => (
  <section id="team" className="section-padding relative">
    <div className="container mx-auto max-w-6xl">
      <RevealSection>
        <p className="type-eyebrow mb-3">The Builders</p>
        <h2 className="type-section-heading mb-6">
          Meet <span className="text-gradient">Team Abhinavan</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mb-14">
          Three minds, one mission, pushing the boundaries of AI innovation.
        </p>
      </RevealSection>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m, i) => (
          <RevealSection key={m.name} delay={i * 150}>
            <MotionCard className="group relative overflow-hidden">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={m.image}
                  alt={m.name}
                  className="h-full w-full scale-110 object-cover grayscale transition-all duration-700 group-hover:scale-100 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent opacity-85" />
                <div className="absolute bottom-4 left-0 right-0 flex translate-y-4 justify-center gap-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <a
                    href={m.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-card/70 p-2.5 backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-card/70 p-2.5 backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Linkedin size={18} />
                  </a>
                </div>
              </div>

              <div className="p-6">
                <h3 className="type-card-title text-xl mb-1 text-foreground">{m.name}</h3>
                <p className="type-tech-chip mb-4 uppercase premium-text">{m.role}</p>
                <div className="flex flex-wrap gap-2">
                  {m.expertise.map((e) => (
                    <TechChip key={e} className="rounded-full px-2.5 py-1 text-muted-foreground type-tech-chip">
                      {e}
                    </TechChip>
                  ))}
                </div>
              </div>
            </MotionCard>
          </RevealSection>
        ))}
      </div>
    </div>
  </section>
);

export default TeamSection;
