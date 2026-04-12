import { RevealSection } from "./ScrollReveal";
import TechChip from "./TechChip";

const skills = [
  "Python", "PyTorch", "TensorFlow", "OpenAI Gym", "Hugging Face",
  "RLlib", "FastAPI", "React", "Docker", "GitHub Actions",
  "Streamlit", "Gradio", "NumPy", "Pandas", "Scikit-learn",
  "Stable Baselines3", "Weights & Biases", "Jupyter", "Linux", "Git",
];

const SkillsSection = () => (
  <section id="skills" className="section-padding relative">
    <div className="container mx-auto max-w-6xl">
      <RevealSection>
        <p className="type-eyebrow mb-3">Our Arsenal</p>
        <h2 className="type-section-heading mb-6">
          Tech <span className="text-gradient">Stack</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mb-14">
          The tools and frameworks powering our AI innovations.
        </p>
      </RevealSection>

      <RevealSection delay={100}>
        <div className="flex flex-wrap justify-center gap-3">
          {skills.map((skill) => (
            <TechChip
              key={skill}
              className="px-5 py-3 text-foreground type-tech-chip"
            >
              {skill}
            </TechChip>
          ))}
        </div>
      </RevealSection>
    </div>
  </section>
);

export default SkillsSection;
