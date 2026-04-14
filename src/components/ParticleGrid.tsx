import { useEffect, useRef } from "react";

type NodePoint = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  energy: number;
};

const ParticleGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
    const nodes: NodePoint[] = [];
    let raf = 0;

    const getConfig = () => {
      const mobile = window.innerWidth < 768;
      return {
        count: reducedMotion ? (mobile ? 28 : 42) : mobile ? 42 : 78,
        maxDist: mobile ? 110 : 135,
      };
    };

    const createNodes = () => {
      nodes.length = 0;
      const { count } = getConfig();
      const heroBias = canvas.height * 0.35;
      const statsBias = canvas.height * 0.78;

      for (let i = 0; i < count; i += 1) {
        const cluster = Math.random();
        const y =
          cluster < 0.45
            ? Math.random() * heroBias
            : cluster < 0.65
              ? statsBias + Math.random() * (canvas.height - statsBias)
              : Math.random() * canvas.height;

        nodes.push({
          x: Math.random() * canvas.width,
          y,
          vx: (Math.random() - 0.5) * (reducedMotion ? 0.08 : 0.18),
          vy: (Math.random() - 0.5) * (reducedMotion ? 0.08 : 0.18),
          size: Math.random() * 1.8 + 1,
          energy: Math.random() * 0.6 + 0.4,
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createNodes();
    };

    const handleMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    };

    const handleLeave = () => {
      mouse.active = false;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseout", handleLeave);

    const render = () => {
      const { maxDist } = getConfig();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const node of nodes) {
        const heroBoost = node.y < canvas.height * 0.36 ? 1.3 : node.y > canvas.height * 0.72 ? 1.15 : 0.9;

        if (!reducedMotion) {
          if (mouse.active) {
            const dx = mouse.x - node.x;
            const dy = mouse.y - node.y;
            const dist = Math.hypot(dx, dy);

            if (dist < 180) {
              const force = (1 - dist / 180) * 0.018;
              node.vx -= (dx / Math.max(dist, 1)) * force;
              node.vy -= (dy / Math.max(dist, 1)) * force;
            } else if (dist < 320) {
              const force = (1 - dist / 320) * 0.002;
              node.vx += (dx / Math.max(dist, 1)) * force;
              node.vy += (dy / Math.max(dist, 1)) * force;
            }
          }

          node.vx *= 0.994;
          node.vy *= 0.994;
        }

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < -20) node.x = canvas.width + 20;
        if (node.x > canvas.width + 20) node.x = -20;
        if (node.y < -20) node.y = canvas.height + 20;
        if (node.y > canvas.height + 20) node.y = -20;

        const alpha = 0.2 * heroBoost * node.energy;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * heroBoost, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = "rgba(139, 92, 246, 0.35)";
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);

          if (dist > maxDist) continue;

          const regionBoost = a.y < canvas.height * 0.36 || b.y < canvas.height * 0.36 || a.y > canvas.height * 0.72 || b.y > canvas.height * 0.72 ? 1.4 : 1;
          const opacity = (1 - dist / maxDist) * 0.16 * regionBoost;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          ctx.lineWidth = dist < 70 ? 1.1 : 0.7;
          ctx.stroke();
        }
      }

      if (!reducedMotion) {
        raf = requestAnimationFrame(render);
      }
    };

    render();
    if (reducedMotion) {
      const interval = window.setInterval(render, 2200);
      return () => {
        window.clearInterval(interval);
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseout", handleLeave);
      };
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseout", handleLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-95" />;
};

export default ParticleGrid;
