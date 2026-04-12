import { useEffect, useRef } from "react";

type NodePoint = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  energy: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

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

    const getHeroEnergy = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--hero-energy");
      const energy = parseFloat(raw.trim());
      return Number.isNaN(energy) ? 1 : clamp(energy, 0, 1);
    };

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

    const drawGrid = (energy: number, time: number) => {
      const spacing = 110;
      const xOffset = (time * 0.018) % spacing;
      const yOffset = (time * 0.013) % spacing;
      const brightness = 0.08 + energy * 0.28;

      ctx.lineWidth = 1;
      for (let x = -spacing + xOffset; x < canvas.width + spacing; x += spacing) {
        const dx = Math.abs(mouse.x - x);
        const alpha = clamp(0.03 + brightness * (1 - dx / 420), 0.03, 0.28);
        ctx.strokeStyle = `rgba(86, 173, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x * 0.96 + canvas.width * 0.04, canvas.height);
        ctx.stroke();
      }

      for (let y = -spacing + yOffset; y < canvas.height + spacing; y += spacing) {
        const dy = Math.abs(mouse.y - y);
        const alpha = clamp(0.03 + brightness * (1 - dy / 340), 0.03, 0.24);
        ctx.strokeStyle = `rgba(75, 129, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y * 0.96 + canvas.height * 0.04);
        ctx.stroke();
      }

      const scanAlpha = 0.16 + energy * 0.24;
      ctx.strokeStyle = `rgba(180, 160, 255, ${scanAlpha})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, (canvas.height * 0.3 + yOffset * 0.24) % canvas.height);
      ctx.lineTo(canvas.width, (canvas.height * 0.3 + yOffset * 0.24) % canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo((canvas.width * 0.16 + xOffset * 0.42) % canvas.width, 0);
      ctx.lineTo((canvas.width * 0.16 + xOffset * 0.42) % canvas.width, canvas.height);
      ctx.stroke();
    };

    const drawNodeNetwork = (energy: number) => {
      const { maxDist } = getConfig();

      for (const node of nodes) {
        const heroBoost = node.y < canvas.height * 0.36 ? 1.3 : node.y > canvas.height * 0.72 ? 1.15 : 0.92;
        const alpha = (0.12 + energy * 0.22) * heroBoost * node.energy;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * heroBoost, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${alpha})`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = `rgba(56, 189, 248, ${0.32 + energy * 0.23})`;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      ctx.lineWidth = 0.72;

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > maxDist) continue;
          const opacity = (1 - dist / maxDist) * (0.12 + energy * 0.16);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(116, 196, 255, ${opacity})`;
          ctx.stroke();
        }
      }
    };

    const drawStreams = (energy: number) => {
      if (energy < 0.12) return;
      const streamCount = reducedMotion ? 1 : 3;
      const heroX = canvas.width * 0.34;
      const heroY = canvas.height * 0.32;

      for (let i = 0; i < streamCount; i += 1) {
        const startX = canvas.width * 0.06 + Math.random() * canvas.width * 0.26;
        const startY = canvas.height * (0.14 + i * 0.11);
        const endX = canvas.width * 0.86 - Math.random() * canvas.width * 0.18;
        const endY = canvas.height * (0.35 + i * 0.11);
        const path = [
          { x: startX, y: startY },
          { x: heroX * 0.9 + Math.random() * 80, y: heroY + Math.random() * 32 },
          { x: canvas.width * 0.68 + Math.random() * 90, y: canvas.height * 0.38 + Math.random() * 72 },
          { x: endX, y: endY },
        ];
        const progress = (performance.now() * 0.00025 + i * 0.18) % 1;

        for (let tail = 0; tail < 5; tail += 1) {
          const t = clamp(progress - tail * 0.08, 0, 1);
          if (t <= 0) continue;
          const x = path[0].x * (1 - t) ** 3 + 3 * path[1].x * t * (1 - t) ** 2 + 3 * path[2].x * t * t * (1 - t) + path[3].x * t * t * t;
          const y = path[0].y * (1 - t) ** 3 + 3 * path[1].y * t * (1 - t) ** 2 + 3 * path[2].y * t * t * (1 - t) + path[3].y * t * t * t;
          const opacity = (1 - tail / 5) * (0.24 + energy * 0.18);
          ctx.beginPath();
          ctx.arc(x, y, 1.8 + tail * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(116, 196, 255, ${opacity})`;
          ctx.shadowBlur = 14;
          ctx.shadowColor = `rgba(116, 196, 255, ${opacity * 0.95})`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    };

    const drawRadars = (energy: number) => {
      const count = reducedMotion ? 1 : 2;
      const centerX = canvas.width * 0.34;
      const centerY = canvas.height * 0.32;

      for (let i = 0; i < count; i += 1) {
        const progress = (performance.now() * 0.00015 + i * 0.3) % 1;
        const radius = progress * 420;
        const opacity = (0.12 + energy * 0.2) * (1 - progress);

        ctx.beginPath();
        ctx.arc(centerX + (i - 0.5) * 44, centerY + (i - 0.5) * 36, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(135, 167, 255, ${opacity})`;
        ctx.lineWidth = 1.3;
        ctx.setLineDash([8, 16]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    };

    const render = () => {
      const energy = getHeroEnergy();
      const time = performance.now() * 0.001;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(4, 10, 21, 0.97)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawGrid(energy, time);
      drawNodeNetwork(energy);
      drawStreams(energy);
      drawRadars(energy);

      if (!reducedMotion) {
        raf = requestAnimationFrame(render);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseout", handleLeave);

    if (!reducedMotion) {
      raf = requestAnimationFrame(render);
    } else {
      render();
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
