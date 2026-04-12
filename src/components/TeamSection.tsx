import { Github, Linkedin } from "lucide-react";
import { RevealSection } from "./ScrollReveal";
import manidwiptamImg from "@/assets/manidwiptam.png";
import rohanImg from "@/assets/rohan.png";
import soumyadeepImg from "@/assets/soumyadeep.webp";

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
          Three minds, one mission — pushing the boundaries of AI innovation.
        </p>
      </RevealSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((m, i) => (
          <RevealSection key={m.name} delay={i * 150}>
            <div className="glass-card-hover group relative overflow-hidden">
              {/* Photo */}
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                {/* Social links overlay */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  <a
                    href={m.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-foreground/10 backdrop-blur-sm hover:bg-primary transition-colors"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-foreground/10 backdrop-blur-sm hover:bg-primary transition-colors"
                  >
                    <Linkedin size={18} />
                  </a>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="type-card-title text-xl mb-1 text-foreground">{m.name}</h3>
                <p className="type-tech-chip text-primary mb-4 uppercase">{m.role}</p>
                <div className="flex flex-wrap gap-2">
                  {m.expertise.map((e) => (
                    <span
                      key={e}
                      className="type-tech-chip px-2.5 py-1 rounded-full border border-border text-muted-foreground"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </RevealSection>
        ))}
      </div>
    </div>
  </section>
);

export default TeamSection;
