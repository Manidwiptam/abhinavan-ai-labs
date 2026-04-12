import { useEffect, useRef, useState } from "react";
import { RevealSection } from "./ScrollReveal";

const stats = [
  { label: "Hackathons", value: 1, suffix: "+" },
  { label: "Projects Built", value: 1, suffix: "+" },
  { label: "Models Trained", value: 10, suffix: "+" },
  { label: "Team Hours", value: 500, suffix: "+" },
];

const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 2000;
          const step = (ts: number) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="font-display text-4xl md:text-5xl font-extrabold tracking-[-0.05em] text-gradient">
      {count}{suffix}
    </div>
  );
};

const StatsSection = () => (
  <section id="stats" className="section-padding relative">
    <div className="container mx-auto max-w-6xl">
      <RevealSection>
        <p className="type-eyebrow mb-3 text-center">Impact</p>
        <h2 className="type-section-heading mb-14 text-center">
          By the <span className="text-gradient">Numbers</span>
        </h2>
      </RevealSection>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <RevealSection key={stat.label} delay={i * 100}>
            <div className="glass-card-hover p-8 text-center">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="type-tech-chip text-muted-foreground mt-3 uppercase">{stat.label}</p>
            </div>
          </RevealSection>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
