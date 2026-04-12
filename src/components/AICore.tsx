import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

const orbitTransition = {
  repeat: Infinity,
  ease: "linear" as const,
};

const ringLayers = [
  { inset: "6%", color: "rgba(56,189,248,0.26)", duration: 28, direction: 1, blur: true },
  { inset: "14%", color: "rgba(168,85,247,0.22)", duration: 18, direction: -1, blur: false },
  { inset: "22%", color: "rgba(125,211,252,0.18)", duration: 34, direction: 1, blur: false },
];

const particleOrbit = Array.from({ length: 8 }, (_, index) => ({
  radius: 88 + (index % 3) * 16,
  size: 4 + (index % 3) * 2,
  duration: 10 + index * 0.7,
  delay: index * 0.14,
  color: index % 2 === 0 ? "rgba(125,211,252,0.9)" : "rgba(168,85,247,0.82)",
}));

const haloArcs = [
  { rotate: 22, width: 138, y: -90, opacity: 0.26 },
  { rotate: -32, width: 142, y: 88, opacity: 0.18 },
  { rotate: 56, width: 96, y: 40, opacity: 0.22 },
];

const AICore = () => {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 70, damping: 16 });
  const springY = useSpring(pointerY, { stiffness: 70, damping: 16 });
  const tiltX = useTransform(springY, [-24, 24], [16, -16]);
  const tiltY = useTransform(springX, [-24, 24], [-16, 16]);

  useEffect(() => {
    if (reduceMotion || !containerRef.current) return;
    const element = containerRef.current;

    const handleMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
      pointerX.set(relativeX * 28);
      pointerY.set(relativeY * 18);
    };

    const handleLeave = () => {
      pointerX.set(0);
      pointerY.set(0);
    };

    element.addEventListener("mousemove", handleMove, { passive: true });
    element.addEventListener("mouseleave", handleLeave);

    return () => {
      element.removeEventListener("mousemove", handleMove);
      element.removeEventListener("mouseleave", handleLeave);
    };
  }, [pointerX, pointerY, reduceMotion]);

  const orbitParticles = useMemo(
    () =>
      particleOrbit.map((particle, index) => ({
        ...particle,
        pathRotation: index * 45,
      })),
    [],
  );

  return (
    <motion.div
      ref={containerRef}
      className="relative h-[360px] w-[360px] lg:h-[460px] lg:w-[460px]"
      style={{ rotateX: tiltX, rotateY: tiltY, perspective: 1200, transformStyle: "preserve-3d" }}
      animate={reduceMotion ? undefined : { scale: [1, 1.005, 1] }}
      transition={reduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(56,189,248,0.14),transparent_38%),radial-gradient(circle_at_70%_20%,rgba(168,85,247,0.12),transparent_34%)] blur-3xl" />
      <div className="absolute inset-0 rounded-full ring-1 ring-white/5" />

      {ringLayers.map((layer, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full border"
          style={{
            inset: layer.inset,
            borderColor: layer.color,
            boxShadow: layer.blur ? `0 0 66px ${layer.color}` : "0 0 24px rgba(255,255,255,0.05)",
          }}
          animate={reduceMotion ? undefined : { rotate: layer.direction * 360 }}
          transition={
            reduceMotion
              ? undefined
              : {
                  ...orbitTransition,
                  duration: layer.duration,
                }
          }
        />
      ))}

      <motion.span
        className="absolute left-1/2 top-1/2 rounded-full border border-cyan/20"
        style={{
          width: "56%",
          height: "56%",
          marginLeft: "-28%",
          marginTop: "-28%",
          boxShadow: "0 0 90px rgba(56,189,248,0.12)",
          borderColor: "rgba(125,211,252,0.18)",
        }}
        animate={reduceMotion ? undefined : { scale: [1, 1.07, 1], opacity: [0.26, 0.85, 0.26] }}
        transition={reduceMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative h-44 w-44 rounded-full border border-[rgba(255,255,255,0.08)] bg-[radial-gradient(circle_at_30%_30%,rgba(232,244,255,0.96),rgba(125,211,252,0.18),rgba(15,23,42,0.18))] shadow-[0_0_120px_rgba(56,189,248,0.24)] lg:h-56 lg:w-56"
          animate={reduceMotion ? undefined : { scale: [1, 1.02, 1], opacity: [0.95, 1, 0.95] }}
          transition={reduceMotion ? undefined : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-[14%] rounded-full border border-white/10" />
          <div className="absolute inset-[26%] rounded-full bg-[radial-gradient(circle_at_45%_45%,rgba(255,255,255,0.92),rgba(125,211,252,0.45),rgba(56,189,248,0))] blur-md" />
          <div className="absolute inset-[34%] rounded-full border border-cyan/10" />
          <div className="absolute inset-[44%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.65),rgba(168,85,247,0.25),transparent_70%)] blur-sm" />

          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className="absolute rounded-full bg-cyan/60"
              style={{
                width: `${4 + index}px`,
                height: `${4 + index}px`,
                top: `${12 + index * 11}%`,
                left: `${18 + (index % 2) * 25}%`,
                transform: `translate(-50%, -50%)`,
                filter: "blur(1px)",
                opacity: 0.9 - index * 0.12,
              }}
            />
          ))}
        </motion.div>
      </div>

      {orbitParticles.map(({ radius, size, duration, delay, color, pathRotation }, index) => (
        <motion.div
          key={index}
          className="absolute left-1/2 top-1/2"
          style={{ transform: "translate(-50%, -50%)" }}
          animate={reduceMotion ? undefined : { rotate: pathRotation + 360 }}
          transition={
            reduceMotion
              ? undefined
              : {
                  repeat: Infinity,
                  duration,
                  ease: "linear",
                  delay,
                }
          }
        >
          <span
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: radius,
              top: 0,
              background: color,
              boxShadow: `0 0 ${size * 3}px ${color}`,
              filter: "blur(0.6px)",
            }}
          />
        </motion.div>
      ))}

      {haloArcs.map((arc, index) => (
        <motion.span
          key={index}
          className="absolute h-[2px] rounded-full bg-gradient-to-r from-cyan/70 via-transparent to-violet/40"
          style={{
            width: `${arc.width}px`,
            left: "50%",
            top: "50%",
            marginLeft: `-${arc.width / 2}px`,
            transform: `translate(-50%, ${arc.y}px) rotate(${arc.rotate}deg)`,
            opacity: arc.opacity,
          }}
          animate={reduceMotion ? undefined : { opacity: [arc.opacity * 0.8, arc.opacity * 1.2, arc.opacity * 0.8] }}
          transition={reduceMotion ? undefined : { duration: 4 + index * 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {[160, 220].map((dimension, index) => (
        <motion.span
          key={dimension}
          className="absolute left-1/2 top-1/2 rounded-full border border-cyan/15"
          style={{
            width: `${dimension}px`,
            height: `${dimension}px`,
            marginLeft: `${-dimension / 2}px`,
            marginTop: `${-dimension / 2}px`,
          }}
          animate={reduceMotion ? undefined : { scale: [1, 1.1, 1], opacity: [0.16, 0.5, 0.16] }}
          transition={reduceMotion ? undefined : { duration: 4.8 + index * 1.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
        />
      ))}
    </motion.div>
  );
};

export default AICore;
