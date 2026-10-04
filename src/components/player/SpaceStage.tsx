import { useEffect, useRef } from "react";

export function SpaceStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let raf = 0;
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      s: Math.random() * 1.8 + 0.3,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const tick = () => {
      frame += 1;
      const t = frame * 0.004;
      ctx.fillStyle = "#07060d";
      ctx.fillRect(0, 0, width, height);

      const clouds = [
        { x: 0.28 + Math.sin(t * 0.6) * 0.08, y: 0.32, r: 0.55, c: "rgba(70, 40, 140, 0.42)" },
        { x: 0.72 + Math.cos(t * 0.45) * 0.07, y: 0.58, r: 0.62, c: "rgba(20, 80, 160, 0.38)" },
        { x: 0.5 + Math.sin(t * 0.3) * 0.1, y: 0.7, r: 0.48, c: "rgba(180, 60, 90, 0.22)" },
        { x: 0.18 + Math.cos(t * 0.5) * 0.06, y: 0.78, r: 0.4, c: "rgba(30, 140, 160, 0.2)" },
      ];
      for (const cloud of clouds) {
        const g = ctx.createRadialGradient(
          cloud.x * width,
          cloud.y * height,
          0,
          cloud.x * width,
          cloud.y * height,
          cloud.r * Math.max(width, height),
        );
        g.addColorStop(0, cloud.c);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      }

      for (const star of stars) {
        const drift = ((star.x + t * (0.015 + star.z * 0.02)) % 1 + 1) % 1;
        const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(frame * 0.03 + star.z * 8));
        ctx.globalAlpha = twinkle;
        ctx.fillStyle = "#fff7e8";
        ctx.beginPath();
        ctx.arc(drift * width, star.y * height, star.s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 h-full w-full rounded-[2rem]" />;
}
