import { motion, useReducedMotion } from "framer-motion";

const ringLayers = [
  { inset: "8%", color: "rgba(56,189,248,0.22)", duration: 28, direction: 1, blur: true },
  { inset: "16%", color: "rgba(168,85,247,0.2)", duration: 18, direction: -1, blur: false },
  { inset: "24%", color: "rgba(125,211,252,0.16)", duration: 34, direction: 1, blur: false },
];

const orbitParticles = Array.from({ length: 7 }, (_, index) => ({
  radius: 68 + (index % 3) * 14,
  size: 4 + (index % 3) * 2,
  duration: 9 + index * 0.8,
  delay: index * 0.12,
  color: index % 2 === 0 ? "rgba(125,211,252,0.88)" : "rgba(168,85,247,0.78)",
}));

const pedestalLines = [
  { left: "12%", height: "72px", opacity: 0.26 },
  { left: "26%", height: "94px", opacity: 0.18 },
  { left: "72%", height: "82px", opacity: 0.22 },
  { left: "86%", height: "68px", opacity: 0.16 },
];

const AICore = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative h-[360px] w-[360px] lg:h-[520px] lg:w-[520px]">
      <div className="absolute inset-x-0 bottom-0 h-[220px]">
        <div className="absolute left-1/2 bottom-0 h-24 w-[280px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.24),transparent_75%)] blur-3xl opacity-90" />
        <div className="absolute left-1/2 bottom-5 h-6 w-[220px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan/30 via-blue/10 to-violet/30 opacity-70 blur-sm" />
        <motion.div
          className="absolute left-1/2 bottom-16 h-3 w-[240px] -translate-x-1/2 rounded-full border border-cyan/20 bg-cyan/10 opacity-80"
          animate={reduceMotion ? undefined : { scale: [1, 1.04, 1], opacity: [0.4, 0.75, 0.4] }}
          transition={reduceMotion ? undefined : { duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute left-1/2 bottom-[90px] h-[260px] w-px -translate-x-1/2 bg-[linear-gradient(rgba(56,189,248,0.28),rgba(79,210,255,0.08),transparent)] blur-xl" />
        {pedestalLines.map((line, index) => (
          <div
            key={index}
            className="absolute bottom-16 rounded-full bg-cyan/20"
            style={{ left: line.left, width: "1px", height: line.height, opacity: line.opacity }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative h-44 w-44 rounded-[2.5rem] border border-[rgba(255,255,255,0.08)] bg-[radial-gradient(circle_at_30%_30%,rgba(232,244,255,0.96),rgba(56,189,248,0.24),rgba(15,23,42,0.14))] shadow-[0_0_120px_rgba(56,189,248,0.18)] lg:h-64 lg:w-64"
          animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [0, 3, 0, -3, 0] }}
          transition={reduceMotion ? undefined : { duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-[18%] rounded-[1.75rem] border border-cyan/20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.78),rgba(125,211,252,0.32),transparent_70%)] blur-sm" />
          <div className="absolute inset-[28%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.88),rgba(168,85,247,0.3),transparent_70%)]" />
          <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-[1.5rem] border border-cyan/30 bg-[radial-gradient(circle,rgba(255,255,255,0.96),rgba(96,165,250,0.65),transparent_90%)] shadow-[0_0_30px_rgba(56,189,248,0.32)]" />

          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className="absolute rounded-full bg-cyan/60"
              style={{
                width: `${6 + (index % 2) * 2}px`,
                height: `${6 + (index % 2) * 2}px`,
                left: `${40 + (index * 14)}%`,
                top: `${18 + ((index + 1) % 3) * 14}%`,
                transform: "translate(-50%, -50%)",
                opacity: 0.8,
              }}
            />
          ))}
        </motion.div>
      </div>

      {ringLayers.map((layer, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full border"
          style={{
            inset: layer.inset,
            borderColor: layer.color,
            boxShadow: layer.blur ? `0 0 60px ${layer.color}` : "0 0 18px rgba(255,255,255,0.05)",
          }}
          animate={reduceMotion ? undefined : { rotate: layer.direction * 360 }}
          transition={
            reduceMotion
              ? undefined
              : {
                  repeat: Infinity,
                  duration: layer.duration,
                  ease: "linear",
                }
          }
        />
      ))}

      {orbitParticles.map(({ radius, size, duration, delay, color }, index) => (
        <motion.div
          key={index}
          className="absolute left-1/2 top-1/2"
          style={{ transform: "translate(-50%, -50%)" }}
          animate={reduceMotion ? undefined : { rotate: 360 }}
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
              filter: "blur(0.8px)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default AICore;
