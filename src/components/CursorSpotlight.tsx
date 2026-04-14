import { motion, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const CursorSpotlight = () => {
  const reduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const x = useSpring(0, { stiffness: 120, damping: 24, mass: 0.8 });
  const y = useSpring(0, { stiffness: 120, damping: 24, mass: 0.8 });

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);

    const handleMove = (event: MouseEvent) => {
      x.set(event.clientX - 180);
      y.set(event.clientY - 180);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("mousemove", handleMove);
    };
  }, [x, y]);

  if (reduceMotion || !isDesktop) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-20 h-[360px] w-[360px] rounded-full opacity-60"
      style={{
        x,
        y,
        background:
          "radial-gradient(circle, rgba(34,211,238,0.18) 0%, rgba(139,92,246,0.14) 35%, rgba(59,130,246,0.09) 52%, rgba(8,11,20,0) 72%)",
        filter: "blur(22px)",
        mixBlendMode: "screen",
      }}
    />
  );
};

export default CursorSpotlight;
