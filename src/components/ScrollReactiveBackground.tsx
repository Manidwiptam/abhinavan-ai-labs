import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";

const ScrollReactiveBackground = () => {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 220 : 70,
    damping: reduceMotion ? 34 : 22,
    mass: 0.32,
  });

  const topColor = useTransform(
    progress,
    [0, 0.2, 0.45, 0.65, 0.85, 1],
    ["#080B14", "#080B14", "#0B1220", "#11294A", "#0B1220", "#080B14"],
  );
  const midColor = useTransform(
    progress,
    [0, 0.2, 0.45, 0.65, 0.85, 1],
    ["#080B14", "#0B1220", "#0F1E38", "#11294A", "#11294A", "#080B14"],
  );
  const bottomColor = useTransform(
    progress,
    [0, 0.2, 0.45, 0.65, 0.85, 1],
    ["#080B14", "#0F1E38", "#11294A", "#0E203B", "#0B1220", "#080B14"],
  );

  const driftY = useTransform(progress, [0, 1], ["14%", "86%"]);
  const hazeY = useTransform(progress, [0, 1], ["22%", "78%"]);
  const statsBloom = useTransform(
    progress,
    [0, 0.45, 0.65, 0.78, 0.9, 1],
    [0.04, 0.1, 0.18, 0.34, 0.12, 0.05],
  );
  const hazeStrength = useTransform(
    progress,
    [0, 0.2, 0.45, 0.65, 0.85, 1],
    [0.06, 0.08, 0.12, 0.16, 0.08, 0.04],
  );
  const vignetteStrength = useTransform(
    progress,
    [0, 0.5, 0.8, 1],
    [0.2, 0.24, 0.28, 0.22],
  );

  const baseBackground = useMotionTemplate`
    linear-gradient(
      180deg,
      ${topColor} 0%,
      ${midColor} 46%,
      ${bottomColor} 100%
    )
  `;

  const bloomBackground = useMotionTemplate`
    radial-gradient(
      circle at 50% ${driftY},
      rgba(25, 118, 210, ${statsBloom}) 0%,
      rgba(25, 118, 210, calc(${statsBloom} * 0.56)) 18%,
      rgba(15, 30, 56, calc(${statsBloom} * 0.32)) 36%,
      transparent 68%
    )
  `;

  const hazeBackground = useMotionTemplate`
    radial-gradient(
      110% 72% at 50% ${hazeY},
      rgba(66, 165, 245, ${hazeStrength}) 0%,
      rgba(17, 41, 74, calc(${hazeStrength} * 0.7)) 28%,
      transparent 72%
    )
  `;

  const vignetteBackground = useMotionTemplate`
    radial-gradient(
      140% 88% at 50% 50%,
      transparent 48%,
      rgba(8, 11, 20, ${vignetteStrength}) 100%
    )
  `;

  return (
    <div aria-hidden="true" className="scroll-reactive-bg">
      <motion.div className="scroll-reactive-bg__base" style={{ backgroundImage: baseBackground }} />
      <motion.div className="scroll-reactive-bg__haze" style={{ backgroundImage: hazeBackground }} />
      <motion.div className="scroll-reactive-bg__bloom" style={{ backgroundImage: bloomBackground }} />
      <motion.div className="scroll-reactive-bg__vignette" style={{ backgroundImage: vignetteBackground }} />
    </div>
  );
};

export default ScrollReactiveBackground;
