import { useEffect, useRef } from "react";
import { usePlayer } from "@/components/player/PlayerProvider";

type Star = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  spin: number;
  kind: number;
};

function gauss() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function CosmicSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { dayPart, analyser } = usePlayer();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let raf = 0;
    const bins = new Uint8Array(128);
    const stars: Star[] = [];

    const placeStar = (band: boolean): Star => {
      if (band) {
        const along = gauss() * 0.38;
        const across = gauss() * 0.09;
        const tilt = 0.22;
        return {
          x: width * (0.5 + along + across * tilt),
          y: height * (0.5 + across - along * 0.12),
          size: Math.random() * 1.5 + 0.25,
          alpha: Math.random() * 0.75 + 0.2,
          spin: Math.random() * Math.PI * 2,
          kind: Math.random() > 0.96 ? 1 : 0,
        };
      }
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.1 + 0.2,
        alpha: Math.random() * 0.45 + 0.08,
        spin: Math.random() * Math.PI * 2,
        kind: 0,
      };
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars.length = 0;
      const field = Math.floor((width * height) / 7000);
      const milky = Math.floor((width * height) / 1100);
      for (let i = 0; i < field; i++) stars.push(placeStar(false));
      for (let i = 0; i < milky; i++) stars.push(placeStar(true));
    };

    const starOpacity =
      dayPart === "night" ? 1 : dayPart === "evening" ? 0.92 : dayPart === "morning" ? 0.72 : 0.62;

    const tick = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);
      let pulse = 0.12;
      if (analyser) {
        analyser.getByteFrequencyData(bins);
        let sum = 0;
        for (let i = 0; i < 24; i++) sum += bins[i];
        pulse = sum / (24 * 255);
      }

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const gx = width * 0.5;
      const gy = height * 0.5;
      const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(width, height) * 0.42);
      glow.addColorStop(0, "rgba(255, 255, 255, 0.14)");
      glow.addColorStop(0.45, "rgba(255, 255, 255, 0.04)");
      glow.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = glow;
      ctx.globalAlpha = 0.35 * starOpacity;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      for (const star of stars) {
        const twinkle = 0.42 + 0.58 * Math.sin(frame * 0.018 + star.spin);
        ctx.globalAlpha = star.alpha * starOpacity * twinkle;
        ctx.fillStyle = "var(--star)";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size + pulse * 0.35, 0, Math.PI * 2);
        ctx.fill();
        if (star.kind === 1) {
          ctx.globalAlpha *= 0.4;
          ctx.beginPath();
          ctx.moveTo(star.x - star.size * 4.5, star.y);
          ctx.lineTo(star.x + star.size * 4.5, star.y);
          ctx.moveTo(star.x, star.y - star.size * 4.5);
          ctx.lineTo(star.x, star.y + star.size * 4.5);
          ctx.strokeStyle = "var(--star)";
          ctx.lineWidth = 0.55;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [analyser, dayPart]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="nebula nebula-a" />
      <div className="nebula nebula-b" />
      <div className="nebula nebula-c" />
      <div className="planet-haze" />
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="grain" />
    </div>
  );
}
