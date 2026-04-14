import { Trophy, Calendar } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { RevealSection } from "./ScrollReveal";
import MotionCard from "./MotionCard";
import TechChip from "./TechChip";

const hackathons = [
  {
    name: "META OpenENV Hackathon 2026",
    organizer: "Hugging Face x Scaler School of Technology",
    date: "2026",
    problem:
      "Open Environment RL challenges focused on adaptive agents for dynamic, real-world-inspired environments.",
    tech: [
      "Python",
      "PyTorch",
      "OpenAI Gym",
      "Hugging Face",
      "Reinforcement Learning",
    ],
    achievement:
      "Built Adaptive RL Reliability, an autonomous SRE agent for live service management.",
  },
];

const HackathonSection = () => {
  const reduceMotion = useReducedMotion();

  // Shared timeline axis position
  const timelineAxis = "left-4 md:left-1/2";

  return (
    <section id="hackathons" className="section-padding relative">
      <div className="container mx-auto max-w-6xl">
        <RevealSection>
          <p className="type-eyebrow mb-3">Our Journey</p>
          <h2 className="type-section-heading mb-6">
            Hackathon <span className="text-gradient">Timeline</span>
          </h2>
          <p className="mb-14 max-w-2xl text-lg text-muted-foreground">
            Every hackathon is a crucible, forging ideas into deployable
            solutions under pressure.
          </p>
        </RevealSection>

        <div className="relative">
          {/* Timeline Beam */}
          <div
            className={`timeline-beam absolute top-0 bottom-0 ${timelineAxis} w-px -translate-x-1/2`}
          />

          {hackathons.map((h, i) => (
            <RevealSection key={h.name} delay={i * 150}>
              <div
                className={`relative mb-12 flex flex-col items-start gap-6 md:flex-row ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline Dot */}
                <motion.div
                  className={`absolute ${timelineAxis} top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary glow-blue`}
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          scale: [1, 1.28, 1],
                          boxShadow: [
                            "0 0 12px rgba(25,118,210,0.4)",
                            "0 0 28px rgba(66,165,245,0.6)",
                            "0 0 12px rgba(25,118,210,0.4)",
                          ],
                        }
                  }
                  transition={
                    reduceMotion
                      ? undefined
                      : {
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                />

                {/* Card */}
                <div
                  className={`ml-12 md:ml-0 md:w-1/2 ${
                    i % 2 === 0
                      ? "md:pr-12 md:text-right"
                      : "md:pl-12"
                  }`}
                >
                  <MotionCard className="p-6">
                    <div className="mb-3 flex items-center gap-2 text-primary">
                      <Trophy size={18} />
                      <Calendar size={14} />
                      <span className="type-tech-chip text-primary">
                        {h.date}
                      </span>
                    </div>

                    <h3 className="type-card-title mb-2 text-xl text-foreground">
                      {h.name}
                    </h3>

                    <p className="mb-1 text-sm text-muted-foreground">
                      {h.organizer}
                    </p>

                    <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                      {h.problem}
                    </p>

                    <p className="premium-text mb-3 text-sm font-medium">
                      {h.achievement}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {h.tech.map((t) => (
                        <TechChip
                          key={t}
                          className="px-2 py-1 text-primary type-tech-chip"
                        >
                          {t}
                        </TechChip>
                      ))}
                    </div>
                  </MotionCard>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HackathonSection;