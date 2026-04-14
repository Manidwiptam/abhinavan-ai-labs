import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button",
  "[role='button']",
  "input:not([type='hidden'])",
  "textarea",
  "select",
  "label[for]",
  "[data-cursor='interactive']",
  ".glass-card-hover",
  ".glass-card",
  ".neural-button",
  ".type-tech-chip",
].join(", ");

const TRAIL_COUNT = 6;
const TRAIL_SPEED_THRESHOLD = 26;

type CursorMode = "default" | "button" | "card" | "timeline" | "network";

const CursorWithThinTrail = () => {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const bloomRef = useRef<HTMLDivElement | null>(null);
  const rippleRef = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (reduceMotion) return;

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mediaQuery.matches) return;

    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const bloom = bloomRef.current;
    const ripple = rippleRef.current;

    if (!root || !dot || !ring || !bloom || !ripple) return;

    const state = {
      pointerX: window.innerWidth / 2,
      pointerY: window.innerHeight / 2,
      ringX: window.innerWidth / 2,
      ringY: window.innerHeight / 2,
      lastX: window.innerWidth / 2,
      lastY: window.innerHeight / 2,
      lastMoveAt: 0,
      visible: false,
      mode: "network" as CursorMode,
      hovering: false,
      magneticX: 0,
      magneticY: 0,
    };

    const particles = Array.from({ length: TRAIL_COUNT }, () => ({
      x: state.pointerX,
      y: state.pointerY,
      life: 0,
      scale: 0.35,
    }));

    let frameId = 0;
    let rippleAnimation: Animation | null = null;
    let lastTimestamp = performance.now();

    const setMode = (mode: CursorMode) => {
      if (state.mode === mode) return;
      state.mode = mode;
      root.dataset.mode = mode;
    };

    const triggerPulse = () => {
      rippleAnimation?.cancel();
      rippleAnimation = ripple.animate(
        [
          { opacity: 0.38, scale: "0.72" },
          { opacity: 0, scale: "1.8" },
        ],
        {
          duration: 680,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        },
      );
    };

    const detectMode = (target: Element | null) => {
      if (!target) {
        setMode("network");
        state.hovering = false;
        state.magneticX = 0;
        state.magneticY = 0;
        return;
      }

      const interactive = target.closest(INTERACTIVE_SELECTOR);
      const nextHovering = Boolean(interactive);

      if (interactive && interactive instanceof HTMLElement) {
        const rect = interactive.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        state.magneticX = (centerX - state.pointerX) * 0.12;
        state.magneticY = (centerY - state.pointerY) * 0.12;

        if (
          interactive.closest("#hackathons") &&
          (interactive.classList.contains("glow-blue") || interactive.classList.contains("glass-card-hover"))
        ) {
          setMode("timeline");
        } else if (
          interactive.closest("#projects") ||
          interactive.closest("#stats")
        ) {
          setMode("card");
        } else if (
          interactive.closest("nav") ||
          interactive.classList.contains("neural-button") ||
          interactive.closest("#contact") ||
          interactive.closest("#hero")
        ) {
          setMode("button");
        } else {
          setMode("default");
        }
      } else {
        state.magneticX = 0;
        state.magneticY = 0;
        setMode("network");
      }

      if (nextHovering && !state.hovering) {
        triggerPulse();
      }

      state.hovering = nextHovering;
      root.dataset.hover = nextHovering ? "true" : "false";
    };

    const updateParticles = (speed: number) => {
      const shouldEmit = speed > TRAIL_SPEED_THRESHOLD;

      if (shouldEmit) {
        particles.unshift({
          x: state.pointerX,
          y: state.pointerY,
          life: 1,
          scale: Math.min(1, 0.45 + speed / 140),
        });
        particles.length = TRAIL_COUNT;
      }

      particles.forEach((particle, index) => {
        particle.life = Math.max(0, particle.life - 0.055);
        const node = trailRefs.current[index];
        if (!node) return;

        const opacity = particle.life * 0.55;
        const scale = particle.scale * particle.life;
        node.style.opacity = opacity.toFixed(3);
        node.style.transform = `translate3d(${particle.x}px, ${particle.y}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      });
    };

    const animateFrame = (timestamp: number) => {
      const delta = Math.min(32, timestamp - lastTimestamp);
      lastTimestamp = timestamp;

      const speed = Math.hypot(state.pointerX - state.lastX, state.pointerY - state.lastY);
      state.lastX = state.pointerX;
      state.lastY = state.pointerY;

      const targetRingX = state.pointerX + state.magneticX;
      const targetRingY = state.pointerY + state.magneticY;
      const spring = 1 - Math.pow(0.78, delta / 16.7);

      state.ringX += (targetRingX - state.ringX) * spring;
      state.ringY += (targetRingY - state.ringY) * spring;

      dot.style.transform = `translate3d(${state.pointerX}px, ${state.pointerY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${state.ringX}px, ${state.ringY}px, 0) translate(-50%, -50%)`;
      bloom.style.transform = `translate3d(${state.ringX}px, ${state.ringY}px, 0) translate(-50%, -50%)`;
      ripple.style.transform = `translate3d(${state.ringX}px, ${state.ringY}px, 0) translate(-50%, -50%)`;

      const recentlyMoved = timestamp - state.lastMoveAt < 180;
      root.dataset.idle = recentlyMoved ? "false" : "true";

      updateParticles(speed);
      frameId = window.requestAnimationFrame(animateFrame);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      state.pointerX = event.clientX;
      state.pointerY = event.clientY;
      state.lastMoveAt = performance.now();
      state.visible = true;
      root.dataset.visible = "true";

      detectMode(document.elementFromPoint(event.clientX, event.clientY));
    };

    const handlePointerLeave = () => {
      state.visible = false;
      state.hovering = false;
      root.dataset.visible = "false";
      root.dataset.hover = "false";
      setMode("network");
    };

    const handlePointerDown = () => {
      root.dataset.pressed = "true";
    };

    const handlePointerUp = () => {
      root.dataset.pressed = "false";
    };

    const handleWindowBlur = () => {
      handlePointerLeave();
    };

    root.dataset.visible = "false";
    root.dataset.hover = "false";
    root.dataset.pressed = "false";
    root.dataset.idle = "false";
    root.dataset.mode = "network";

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("blur", handleWindowBlur);

    frameId = window.requestAnimationFrame(animateFrame);

    return () => {
      window.cancelAnimationFrame(frameId);
      rippleAnimation?.cancel();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="neural-cursor"
    >
      {Array.from({ length: TRAIL_COUNT }).map((_, index) => (
        <div
          key={index}
          ref={(node) => {
            trailRefs.current[index] = node;
          }}
          className="neural-cursor__trail"
        />
      ))}
      <div ref={bloomRef} className="neural-cursor__bloom" />
      <div ref={ringRef} className="neural-cursor__ring" />
      <div ref={rippleRef} className="neural-cursor__ripple" />
      <div ref={dotRef} className="neural-cursor__dot" />
    </div>
  );
};

export default CursorWithThinTrail;

