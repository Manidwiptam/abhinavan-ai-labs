import { motion, useReducedMotion } from "framer-motion";
import { useState, type HTMLAttributes, type ReactNode } from "react";

type MotionCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  glow?: boolean;
};

const MotionCard = ({ children, className = "", glow = true, ...props }: MotionCardProps) => {
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, x: 0, y: 0 });

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    setTilt({
      rotateX: (0.5 - py) * 10,
      rotateY: (px - 0.5) * 12,
      x: (px - 0.5) * 10,
      y: (py - 0.5) * 10,
    });
  };

  const resetTilt = () => {
    setTilt({ rotateX: 0, rotateY: 0, x: 0, y: 0 });
  };

  return (
    <motion.div
      {...props}
      className={`glass-card-hover glass-shine ${glow ? "card-spotlight" : ""} ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
      animate={
        reduceMotion
          ? undefined
          : {
              rotateX: tilt.rotateX,
              rotateY: tilt.rotateY,
              x: tilt.x,
              y: tilt.y,
            }
      }
      transition={{ type: "spring", stiffness: 180, damping: 18, mass: 0.7 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
};

export default MotionCard;
