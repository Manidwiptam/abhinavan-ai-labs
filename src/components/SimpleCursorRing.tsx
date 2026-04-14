import { motion, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface TrailDot {
  x: number;
  y: number;
  opacity: number;
}

const SimpleCursorRing = () => {
  const reduceMotion = useReducedMotion();
  const trail = useRef<TrailDot[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      // Add trail
      // Small thin trail behind - fixed offset
      const prevX = trail.current[0]?.x || 0;
      const prevY = trail.current[0]?.y || 0;
      trail.current.unshift({ x: prevX * 0.3, y: prevY * 0.3, opacity: 0.5 });
      if (trail.current.length > 5) trail.current.pop();
      // Fade trail
      trail.current.forEach(dot => dot.opacity *= 0.93);
      trail.current = trail.current.filter(dot => dot.opacity > 0.08);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkDesktop);
    };
  }, []);

  if (reduceMotion || !isDesktop) return null;

  return (
    <>
      {trail.current.map((dot, i) => (
        <div
          key={i}
          className="fixed z-[49] h-1 w-1 rounded-full bg-primary pointer-events-none"
          style={{
            left: mousePos.x + dot.x - 0.25,
            top: mousePos.y + dot.y - 0.25,
            opacity: dot.opacity,
          }}
        />
      ))}
      <motion.div
        className="fixed z-50 h-12 w-12 rounded-full border border-primary/50 pointer-events-none opacity-60"
        style={{
          left: mousePos.x - 24,
          top: mousePos.y - 24,
        }}
        animate={{ scale: 1.2 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="fixed z-50 h-2 w-2 rounded-full bg-primary pointer-events-none opacity-90"
        style={{
          left: mousePos.x - 1,
          top: mousePos.y - 1,
        }}
      />
    </>
  );
};

export default SimpleCursorRing;

