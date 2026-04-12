import { motion, useReducedMotion } from "framer-motion";

const orbitTransition = {
  duration: 14,
  repeat: Infinity,
  ease: "linear" as const,
};

const AICore = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative h-[360px] w-[360px] lg:h-[460px] lg:w-[460px]">
      <motion.div
        className="absolute inset-[14%] rounded-full border border-primary/20"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={reduceMotion ? undefined : orbitTransition}
      />
      <motion.div
        className="absolute inset-[24%] rounded-full border border-accent/25"
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={reduceMotion ? undefined : { ...orbitTransition, duration: 18 }}
      />
      <motion.div
        className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.1),rgba(59,130,246,0.06),transparent_70%)] blur-2xl"
        animate={reduceMotion ? undefined : { scale: [0.96, 1.04, 0.96], opacity: [0.55, 0.8, 0.55] }}
        transition={reduceMotion ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative h-44 w-44 rounded-full border border-primary/30 bg-[radial-gradient(circle_at_35%_30%,rgba(125,211,252,0.95),rgba(59,130,246,0.5)_30%,rgba(15,23,42,0.2)_62%,rgba(2,6,23,0)_80%)] shadow-[0_0_80px_rgba(59,130,246,0.28)] lg:h-56 lg:w-56"
          animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [0, 6, 0, -6, 0] }}
          transition={reduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-[18%] rounded-full border border-white/10" />
          <div className="absolute inset-[32%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9),rgba(125,211,252,0.6),rgba(56,189,248,0))] blur-md" />
        </motion.div>
      </div>

      {Array.from({ length: 10 }).map((_, index) => {
        const size = 6 + (index % 3) * 3;
        const radius = 28 + index * 10;

        return (
          <motion.span
            key={index}
            className="absolute left-1/2 top-1/2 rounded-full bg-primary/70"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              marginLeft: `${-size / 2}px`,
              marginTop: `${-size / 2}px`,
              boxShadow: "0 0 18px rgba(56, 189, 248, 0.45)",
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    rotate: 360,
                    x: [radius, radius - 10, radius],
                    y: [0, 10, 0],
                    opacity: [0.35, 0.9, 0.35],
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 6 + index * 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.18,
                  }
            }
          />
        );
      })}
    </div>
  );
};

export default AICore;
