import { useEffect, useState } from "react";
import animatedLogo from "@/assets/animated-tech-logo-generation.mp4";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const duration = 2000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setExiting(true);
        setTimeout(onComplete, 500);
      }
    };
    requestAnimationFrame(tick);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center transition-opacity duration-500 ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        src={animatedLogo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Abhinavan animated logo"
        className="w-24 h-24 mb-8 object-contain"
      />
      <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-none"
          style={{
            width: `${progress * 100}%`,
            boxShadow: "0 0 10px hsl(var(--primary))",
          }}
        />
      </div>
      <p className="mt-4 font-mono text-xs tracking-[0.3em] text-primary uppercase">
        Initializing Abhinavan Lab
      </p>
    </div>
  );
};

export default LoadingScreen;
