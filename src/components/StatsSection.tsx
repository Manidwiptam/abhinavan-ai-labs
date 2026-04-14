import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { RevealSection } from "./ScrollReveal";
import MotionCard from "./MotionCard";

const stats = [
  { label: "Hackathons", value: 1, suffix: "+" },
  { label: "Projects Built", value: 1, suffix: "+" },
  { label: "Models Trained", value: 10, suffix: "+" },
  { label: "Team Hours", value: 500, suffix: "+" },
];

const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const controls = animate(0, target, {
      duration: reduceMotion ? 0.35 : 2.1,
      ease: reduceMotion ? "linear" : [0.22, 1, 0.36, 1],
      onUpdate: (value) => {
        setCount(Math.round(value));
      },
      onComplete: () => {
        if (!reduceMotion) {
          animate(target + 0.8, target, {
            type: "spring",
            stiffness: 220,
            damping: 14,
            mass: 0.5,
            onUpdate: (value) => {
              setCount(Math.round(value));
            },
          });
        }
      },
    });

    return () => controls.stop();
  }, [inView, reduceMotion, target]);

  return (
    <motion.div ref={ref} className="premium-text font-display text-4xl font-extrabold tracking-[-0.05em] md:text-5xl">
      {count}{suffix}
    </motion.div>
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

      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <RevealSection key={stat.label} delay={i * 100}>
            <MotionCard className="p-8 text-center">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="type-tech-chip mt-3 uppercase text-muted-foreground">{stat.label}</p>
            </MotionCard>
          </RevealSection>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
