import { useEffect, useRef } from "react";

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const MurmurationCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const boidsRef = useRef<Boid[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const NUM = 100;
    boidsRef.current = Array.from({ length: NUM }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    }));

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    let raf: number;
    const maxSpeed = 3;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const boids = boidsRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const b of boids) {
        // Cohesion: move towards mouse
        const dx = mx - b.x;
        const dy = my - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 300) {
          b.vx += dx * 0.001;
          b.vy += dy * 0.001;
        }

        // Separation from other boids
        for (const o of boids) {
          if (o === b) continue;
          const sx = o.x - b.x;
          const sy = o.y - b.y;
          const sd = Math.sqrt(sx * sx + sy * sy);
          if (sd < 20) {
            b.vx -= sx * 0.01;
            b.vy -= sy * 0.01;
          }
        }

        // Clamp speed
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (speed > maxSpeed) {
          b.vx = (b.vx / speed) * maxSpeed;
          b.vy = (b.vy / speed) * maxSpeed;
        }

        b.x += b.vx;
        b.y += b.vy;

        // Wrap
        if (b.x < 0) b.x = canvas.width;
        if (b.x > canvas.width) b.x = 0;
        if (b.y < 0) b.y = canvas.height;
        if (b.y > canvas.height) b.y = 0;

        // Draw trail line
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x - b.vx * 5, b.y - b.vy * 5);
        ctx.strokeStyle = "rgba(59, 130, 246, 0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw dot
        ctx.beginPath();
        ctx.arc(b.x, b.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59, 130, 246, 0.8)";
        ctx.fill();
      }

      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ opacity: 0.6 }}
    />
  );
};

export default MurmurationCursor;
