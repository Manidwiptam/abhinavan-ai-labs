import { motion } from "framer-motion";
import { useEffect, useRef, useCallback } from "react";

interface TrailDot {
  x: number;
  y: number;
  opacity: number;
  progress: number;
}

const CursorTrail = () => {
  const trailRef = useRef<TrailDot[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const tickingRef = useRef(false);

  const updateTrail = useCallback(() => {
    trailRef.current.unshift({
      x: mouseRef.current.x,
      y: mouseRef.current.y,
      opacity: 1,
      progress: 0,
    });

    if (trailRef.current.length > 8) {
      trailRef.current.pop();
    }

    trailRef.current.forEach((dot, i) => {
      dot.progress += 0.07;
      dot.opacity = 1 - dot.progress;
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          tickingRef.current = false;
          updateTrail();
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    const raf = requestAnimationFrame(() => {});

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(raf);
    };
  }, [updateTrail]);

  return (
    <>
      {trailRef.current.map((dot, i) => (
        <motion.div
          key={i}
          className="pointer-events-none fixed z-50 h-3 w-3 rounded-full bg-primary/60 blur-sm"
          style={{
            left: `${dot.x}px`,
            top: `${dot.y}px`,
            opacity: dot.opacity,
          }}
          animate={{ scale: 1 - dot.progress }}
          transition={{ duration: 0.1 }}
        />
      ))}
    </>
  );
};

export default CursorTrail;

