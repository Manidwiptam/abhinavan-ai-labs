import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const CursorWithThinTrail = () => {
  const reducesMotion = useReducedMotion();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const trailRef = useRef<Array<{x: number; y: number; age: number}>>([]);

  useEffect(() => {
    if (reducesMotion) return;

    const updateTrail = (clientX: number, clientY: number) => {
      trailRef.current.push({ x: clientX, y: clientY, age: 0 });
      if (trailRef.current.length > 10) trailRef.current.shift();
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
      updateTrail(e.clientX - 15, e.clientY - 15); // Offset behind
    };

    window.addEventListener("mousemove", handleMouseMove);
    const tick = () => {
      trailRef.current = trailRef.current.map(dot => ({ ...dot, age: dot.age + 1 }));
      trailRef.current = trailRef.current.filter(dot => dot.age < 20);
      requestAnimationFrame(tick);
    };
    tick();

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [reducesMotion]);

  if (window.innerWidth < 768) return null;

  return (
    <>
      {/* Thin trail */}
      {trailRef.current.map((dot, i) => (
        <motion.div
          key={i}
          className="fixed w-[2px] h-[2px] bg-gradient-to-r from-blue-400 to-purple-400 rounded-full pointer-events-none z-[98]"
          style={{
            left: dot.x,
            top: dot.y,
            opacity: Math.max(0, 1 - dot.age / 20),
            scale: Math.max(0.3, 1 - dot.age / 20),
          }}
          transition={{ duration: 0 }}
        />
      ))}
      {/* Ring */}
      <motion.div
        className="fixed w-10 h-10 border-2 border-blue-400/60 rounded-full pointer-events-none z-99 opacity-70"
        style={{ left: mouse.x - 20, top: mouse.y - 20 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 0.15 }}
      />
      {/* Center dot */}
      <motion.div
        className="fixed w-1.5 h-1.5 bg-blue-400 rounded-full pointer-events-none z-99 shadow-lg"
        style={{ left: mouse.x - 0.75, top: mouse.y - 0.75 }}
      />
    </>
  );
};

export default CursorWithThinTrail;

