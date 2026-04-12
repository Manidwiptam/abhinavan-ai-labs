import { useEffect, useRef } from "react";

type NodePoint = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  energy: number;
};

type StarPoint = {
  x: number;
  y: number;
  r: number;
  alpha: number;
  driftX: number;
  driftY: number;
  blinkOffset: number;
};

type StreamPath = {
  points: { x: number; y: number }[];
  progress: number;
  speed: number;
  width: number;
  hue: number;
};

type RadarSweep = {
  x: number;
  y: number;
  radius: number;
  progress: number;
  speed: number;
  active: boolean;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

const cubicBezier = (a: number, b: number, c: number, d: number, t: number) =>
  a * (1 - t) ** 3 + 3 * b * t * (1 - t) ** 2 + 3 * c * t ** 2 * (1 - t) + d * t ** 3;

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
    const stars: StarPoint[] = [];
    const streams: StreamPath[] = [];
    const radars: RadarSweep[] = [];
    let raf = 0;
    let resizeTimer = 0;

    const getConfig = () => {
      const mobile = window.innerWidth < 768;
      return {
        count: reducedMotion ? (mobile ? 22 : 36) : mobile ? 46 : 72,
        maxDist: mobile ? 95 : 120,
        starCount: reducedMotion ? 14 : mobile ? 22 : 34,
        streamCount: reducedMotion ? 1 : mobile ? 2 : 4,
        radarCount: reducedMotion ? 1 : 2,
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
          vx: (Math.random() - 0.5) * (reducedMotion ? 0.04 : 0.16),
          vy: (Math.random() - 0.5) * (reducedMotion ? 0.04 : 0.16),
          size: Math.random() * 1.8 + 1,
          energy: Math.random() * 0.68 + 0.32,
        });
      }
    };

    const createStars = () => {
      stars.length = 0;
      const { starCount } = getConfig();

      for (let i = 0; i < starCount; i += 1) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.7,
          alpha: Math.random() * 0.4 + 0.24,
          driftX: (Math.random() - 0.5) * 0.04,
          driftY: (Math.random() - 0.5) * 0.02,
          blinkOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    const createStreams = () => {
      streams.length = 0;
      const { streamCount } = getConfig();
      const heroX = canvas.width * 0.34;
      const heroY = canvas.height * 0.3;

      for (let i = 0; i < streamCount; i += 1) {
        const startX = canvas.width * 0.08 + Math.random() * canvas.width * 0.28;
        const startY = canvas.height * (0.18 + i * 0.1);
        const endX = canvas.width * 0.86 - Math.random() * canvas.width * 0.24;
        const endY = canvas.height * (0.3 + i * 0.12);
        streams.push({
          points: [
            { x: startX, y: startY },
            { x: heroX * 0.9 + Math.random() * 60, y: heroY + Math.random() * 50 },
            { x: canvas.width * 0.65 + Math.random() * 80, y: canvas.height * 0.34 + Math.random() * 80 },
            { x: endX, y: endY },
          ],
          progress: Math.random(),
          speed: 0.0009 + Math.random() * 0.0012,
          width: reducedMotion ? 1.2 : 1.4 + Math.random() * 0.9,
          hue: 190 + Math.random() * 70,
        });
      }
    };

    const createRadars = () => {
      radars.length = 0;
      const centerX = canvas.width * 0.34;
      const centerY = canvas.height * 0.32;
      const { radarCount } = getConfig();

      for (let i = 0; i < radarCount; i += 1) {
        radars.push({
          x: centerX + (Math.random() - 0.5) * 80,
          y: centerY + (Math.random() - 0.5) * 60,
          radius: 0,
          progress: Math.random(),
          speed: 0.00065 + Math.random() * 0.0008,
          active: true,
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createNodes();
      createStars();
      createStreams();
      createRadars();
    };

    const handleMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    };

    const handleLeave = () => {
      mouse.active = false;
    };

    const drawGrid = (time: number) => {
      const spacing = 110;
      const xOffset = (time * 0.018) % spacing;
      const yOffset = (time * 0.013) % spacing;
      const brightness = mouse.active ? 0.28 : 0.16;

      ctx.lineWidth = 1;
      for (let x = -spacing + xOffset; x < canvas.width + spacing; x += spacing) {
        const dx = Math.abs(mouse.x - x);
        const alpha = clamp(0.05 + brightness * (1 - dx / 380), 0.05, 0.28);
        ctx.strokeStyle = `rgba(86, 173, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x * 0.96 + canvas.width * 0.04, canvas.height);
        ctx.stroke();
      }

      for (let y = -spacing + yOffset; y < canvas.height + spacing; y += spacing) {
        const dy = Math.abs(mouse.y - y);
        const alpha = clamp(0.04 + brightness * (1 - dy / 320), 0.04, 0.22);
        ctx.strokeStyle = `rgba(75, 129, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y * 0.96 + canvas.height * 0.04);
        ctx.stroke();
      }

      const sweepPower = 0.18;
      ctx.strokeStyle = `rgba(180, 160, 255, ${sweepPower})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, (canvas.height * 0.3 + yOffset * 0.24) % canvas.height);
      ctx.lineTo(canvas.width, (canvas.height * 0.3 + yOffset * 0.24) % canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo((canvas.width * 0.16 + xOffset * 0.42) % canvas.width, 0);
      ctx.lineTo((canvas.width * 0.16 + xOffset * 0.42) % canvas.width, canvas.height);
      ctx.stroke();
    };

    const drawAurora = () => {
      const aurora = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      aurora.addColorStop(0, "rgba(37, 91, 167, 0.08)");
      aurora.addColorStop(0.4, "rgba(80, 65, 166, 0.06)");
      aurora.addColorStop(0.7, "rgba(26, 153, 189, 0.09)");
      aurora.addColorStop(1, "rgba(20, 39, 72, 0.04)");
      ctx.fillStyle = aurora;
      ctx.globalAlpha = 0.45;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    };

    const drawStars = (time: number) => {
      for (const star of stars) {
        star.x += star.driftX;
        star.y += star.driftY;
        if (star.x < -10) star.x = canvas.width + 10;
        if (star.x > canvas.width + 10) star.x = -10;
        if (star.y < -10) star.y = canvas.height + 10;
        if (star.y > canvas.height + 10) star.y = -10;

        const pulse = 0.4 + Math.sin(time * 0.004 + star.blinkOffset) * 0.2;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 241, 255, ${clamp(star.alpha * pulse, 0.12, 0.42)})`;
        ctx.fill();
      }
    };

    const drawStreams = () => {
      streams.forEach((stream) => {
        stream.progress += stream.speed;
        if (stream.progress > 1.3) {
          stream.progress = 0;
        }

        for (let tail = 0; tail < 5; tail += 1) {
          const progress = stream.progress - tail * 0.06;
          if (progress <= 0) continue;
          const t = clamp(progress, 0, 1);
          const x = cubicBezier(stream.points[0].x, stream.points[1].x, stream.points[2].x, stream.points[3].x, t);
          const y = cubicBezier(stream.points[0].y, stream.points[1].y, stream.points[2].y, stream.points[3].y, t);
          const opacity = (1 - tail / 5) * 0.35;
          ctx.beginPath();
          ctx.arc(x, y, stream.width * (0.95 - tail * 0.12), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(116, 196, 255, ${opacity})`;
          ctx.shadowBlur = 14;
          ctx.shadowColor = `rgba(116, 196, 255, ${opacity * 0.85})`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
    };

    const drawNodeNetwork = () => {
      const { maxDist } = getConfig();
      for (const node of nodes) {
        const regionBoost = node.y < canvas.height * 0.36 ? 1.4 : node.y > canvas.height * 0.72 ? 1.18 : 0.9;
        const alpha = 0.2 * regionBoost * node.energy;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * regionBoost, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(56, 189, 248, 0.35)";
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      ctx.lineWidth = 0.7;

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > maxDist) continue;
          const opacity = (1 - dist / maxDist) * 0.14;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(116, 196, 255, ${opacity})`;
          ctx.stroke();
        }
      }
    };

    const drawRadars = () => {
      radars.forEach((radar) => {
        radar.progress += radar.speed;
        if (radar.progress > 1) {
          radar.progress = 0;
          radar.radius = 0;
        }
        radar.radius += radar.speed * 900;
        const opacity = 0.18 * (1 - radar.progress);
        ctx.beginPath();
        ctx.arc(radar.x, radar.y, radar.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(135, 167, 255, ${opacity})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 16]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(radar.x, radar.y, radar.radius * 0.45, 0, Math.PI * 1.5);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.12})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      });
    };

    const render = (timestamp: number) => {
      const time = timestamp * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(4, 10, 21, 0.98)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawAurora();
      drawGrid(time);
      drawStars(time);
      drawStreams();
      drawNodeNetwork();
      drawRadars();

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
      render(0);
      const interval = window.setInterval(() => render(performance.now()), 2400);
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
      window.clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0 blur-3xl opacity-95" style={{
        background: "radial-gradient(circle at 15% 20%, rgba(56,189,248,0.18), transparent 24%), radial-gradient(circle at 88% 12%, rgba(168,85,247,0.12), transparent 24%), radial-gradient(circle at 50% 85%, rgba(45,214,246,0.09), transparent 32%)",
        animation: "aurora-drift 32s ease-in-out infinite",
      }} />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
};

export default ParticleGrid;
