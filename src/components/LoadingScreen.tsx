import { useEffect, useState } from "react";
import abhinavanLogo from "@/assets/abhinavan-loader.png";

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
      <img
        src={abhinavanLogo}
        alt="Abhinavan"
        className="w-24 h-24 mb-8 animate-pulse object-contain"
      />
      <div className="h-1 w-48 overflow-hidden rounded-full bg-card">
        <div
          className="neural-gradient h-full rounded-full transition-none"
          style={{
            width: `${progress * 100}%`,
            boxShadow: "0 0 14px rgba(34,211,238,0.35), 0 0 26px rgba(139,92,246,0.18)",
          }}
        />
      </div>
      <p className="mt-4 type-eyebrow">
        Initializing Abhinavan Lab
      </p>
    </div>
  );
};

export default LoadingScreen;
