import { motion, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";

interface TrailDot {
  x: number;
  y: number;
  opacity: number;
}

const CursorRing = () => {
  const reduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const x = useSpring(0, { stiffness: 500, damping: 28 });
  const y = useSpring(0, { stiffness: 500, damping: 28 });
  const size = useSpring(60, { stiffness: 500, damping: 28 });
  const trailRef = useRef<TrailDot[]>([]);

  const updateTrail = useCallback(() => {
    trailRef.current.unshift({
      x: 0, // relative
      y: 0,
      opacity: 0.6,
    });
    if (trailRef.current.length > 4) trailRef.current.pop();
    trailRef.current.forEach((dot, i) => {
      dot.opacity *= 0.92;
    });
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);

    const handleMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      size.set(80);
      setTimeout(() => size.set(60), 200);
      updateTrail();
    };

    const rafRef = useRef(0);
    const animateTrail = () => {
      trailRef.current = trailRef.current.filter(dot => dot.opacity > 0.05);
      rafRef.current = requestAnimationFrame(animateTrail);
    };
    rafRef.current = requestAnimationFrame(animateTrail);

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [x, y, size, updateTrail]);

  if (reduceMotion || !isDesktop) return null;

  return (
    <>
      {/* Thin trail dots */}
      {trailRef.current.map((dot, i) => (
        <motion.div
          key={i}
          className="pointer-events-none fixed z-[49] h-1.5 w-1.5 rounded-full bg-primary/40"
          style={{
            left: `calc(${x.get()}px + ${dot.x}px)`,
            top: `calc(${y.get()}px + ${dot.y}px)`,
            opacity: dot.opacity,
          }}
          animate={{ scale: 0.5 }}
          transition={{ duration: 0.15 }}
        />
      ))}
      {/* Ring */}
      <motion.div
        className="pointer-events-none fixed z-50 h-16 w-16 border-2 border-primary/50 rounded-full opacity-60"
        style={{
          left: '-2rem',
          top: '-2rem',
          x,
          y,
          boxShadow: "0 0 24px rgba(34, 211, 238, 0.18), 0 0 42px rgba(139, 92, 246, 0.12)",
        }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 0.1 }}
      />
      {/* Dot */}
      <motion.div
        className="pointer-events-none fixed z-50 h-2 w-2 rounded-full bg-primary opacity-90"
        style={{
          left: '-0.25rem',
          top: '-0.25rem',
          x,
          y,
          boxShadow: "0 0 14px rgba(34, 211, 238, 0.45)",
        }}
      />
    </>
  );
};

export default CursorRing;

