import { motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";

const TechChip = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  const reduceMotion = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (reduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    setOffset({
      x: (px - 0.5) * 8,
      y: (py - 0.5) * 8,
      rotateX: (0.5 - py) * 10,
      rotateY: (px - 0.5) * 12,
    });
  };

  const reset = () => setOffset({ x: 0, y: 0, rotateX: 0, rotateY: 0 });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ripple = {
      id: Date.now(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    setRipples((current) => [...current, ripple]);
    window.setTimeout(() => {
      setRipples((current) => current.filter((item) => item.id !== ripple.id));
    }, 500);
  };

  return (
    <motion.button
      type="button"
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={handleClick}
      whileHover={reduceMotion ? undefined : { scale: 1.05, y: -2 }}
      animate={
        reduceMotion
          ? undefined
          : {
              x: offset.x,
              y: offset.y,
              rotateX: offset.rotateX,
              rotateY: offset.rotateY,
            }
      }
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.6 }}
      className={`group relative overflow-hidden rounded-xl border border-primary/15 bg-card/45 px-3 py-2 text-left backdrop-blur-xl ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <span className="pointer-events-none absolute inset-0 rounded-xl border border-primary/0 transition-all duration-300 group-hover:border-secondary/60 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.16),0_0_34px_rgba(139,92,246,0.14),0_0_10px_rgba(25,118,210,0.14)]" />
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 animate-chip-ripple"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
      <span className="relative z-10 block">{children}</span>
    </motion.button>
  );
};

export default TechChip;
