import { useEffect, useRef } from "react";
import { usePlayer } from "@/components/player/PlayerProvider";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  spin: number;
  kind: number;
  phase: number;
  hue: number;
};

export function CosmicSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { season, dayPart, analyser } = usePlayer();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let raf = 0;
    const bins = new Uint8Array(128);

    const stars: Particle[] = [];
    const motes: Particle[] = [];

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
      const starCount = Math.floor((width * height) / 9000);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
          size: Math.random() * 1.6 + 0.3,
          alpha: Math.random() * 0.8 + 0.1,
          spin: Math.random() * Math.PI * 2,
          kind: Math.random() > 0.92 ? 1 : 0,
          phase: Math.random() * Math.PI * 2,
          hue: Math.random(),
        });
      }

      motes.length = 0;
      const moteCount = reduced ? 6 : 34;
      for (let i = 0; i < moteCount; i++) {
        motes.push(seedMote(width, height, season));
      }
    };

    const seedMote = (w: number, h: number, s: string): Particle => {
      const kind = Math.floor(Math.random() * 3);
      const winter = s === "winter";
      const autumn = s === "autumn";
      const summer = s === "summer";
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * (winter ? 0.42 : summer ? 0.7 : 0.55),
        vy: winter
          ? 0.28 + Math.random() * 0.55
          : autumn
            ? 0.22 + Math.random() * 0.5
            : summer
              ? (Math.random() - 0.45) * 0.32
              : 0.18 + Math.random() * 0.38,
        size: autumn
          ? 11 + Math.random() * 10
          : s === "spring"
            ? kind === 0
              ? 8 + Math.random() * 6
              : 6 + Math.random() * 5
            : winter
              ? 7 + Math.random() * 8
              : 2.6 + Math.random() * 2.8,
        alpha: 0.55 + Math.random() * 0.4,
        spin: Math.random() * Math.PI * 2,
        kind,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random(),
      };
    };

    const starOpacity =
      dayPart === "night" ? 1 : dayPart === "evening" ? 0.72 : dayPart === "morning" ? 0.38 : 0.22;

    const drawSpring = (p: Particle) => {
      if (p.kind === 0) {
        ctx.fillStyle = "#f4c2d4";
        for (let i = 0; i < 5; i++) {
          ctx.save();
          ctx.rotate((i / 5) * Math.PI * 2);
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.12);
          ctx.bezierCurveTo(p.size * 0.42, -p.size * 0.18, p.size * 0.38, -p.size * 0.72, 0, -p.size);
          ctx.bezierCurveTo(-p.size * 0.38, -p.size * 0.72, -p.size * 0.42, -p.size * 0.18, 0, -p.size * 0.12);
          ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = "#f0d35e";
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * p.size * 0.55, Math.sin(a) * p.size * 0.55);
          ctx.stroke();
        }
        return;
      }

      ctx.fillStyle = p.kind === 1 ? "#ffd6e4" : "#f7e4ea";
      ctx.beginPath();
      ctx.moveTo(0, p.size * 0.9);
      ctx.bezierCurveTo(p.size * 0.85, p.size * 0.15, p.size * 0.45, -p.size * 0.45, 0, -p.size);
      ctx.bezierCurveTo(-p.size * 0.45, -p.size * 0.45, -p.size * 0.85, p.size * 0.15, 0, p.size * 0.9);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(0, p.size * 0.7);
      ctx.quadraticCurveTo(p.size * 0.1, 0, 0, -p.size * 0.7);
      ctx.stroke();
    };

    const drawSummer = (p: Particle) => {
      const pulse = 0.72 + Math.sin(p.phase) * 0.28;
      const heading = Math.atan2(p.vy, p.vx);
      ctx.save();
      ctx.rotate(heading);
      const glow = ctx.createRadialGradient(p.size * 0.6, 0, 0, p.size * 0.6, 0, p.size * 7);
      glow.addColorStop(0, "color-mix(in oklab, var(--glow) 88%, white)");
      glow.addColorStop(0.22, "color-mix(in oklab, var(--glow) 45%, transparent)");
      glow.addColorStop(1, "transparent");
      ctx.globalAlpha = p.alpha * pulse;
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.size * 0.6, 0, p.size * 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = p.alpha * 0.28;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.ellipse(-p.size * i * 1.15, 0, p.size * (1.1 - i * 0.15), p.size * 0.28, 0, 0, Math.PI * 2);
        ctx.fillStyle = "var(--glow)";
        ctx.fill();
      }

      ctx.globalAlpha = p.alpha * 0.35;
      ctx.fillStyle = "color-mix(in oklab, white 60%, var(--glow))";
      ctx.beginPath();
      ctx.ellipse(0, -p.size * 0.55, p.size * 1.05, p.size * 0.32, -0.4, 0, Math.PI * 2);
      ctx.ellipse(0, p.size * 0.55, p.size * 1.05, p.size * 0.32, 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = "color-mix(in oklab, #1a140c 55%, var(--particle))";
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 1.15, p.size * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "color-mix(in oklab, var(--glow) 80%, white)";
      ctx.beginPath();
      ctx.ellipse(p.size * 0.55, 0, p.size * 0.55, p.size * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawAutumn = (p: Particle) => {
      const s = p.size;
      ctx.fillStyle = ["#e39b55", "#d9b45c", "#d36a3a"][p.kind];
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s * 0.22, -s * 0.42);
      ctx.lineTo(s * 0.72, -s * 0.58);
      ctx.lineTo(s * 0.48, -s * 0.12);
      ctx.lineTo(s * 0.92, s * 0.18);
      ctx.lineTo(s * 0.32, s * 0.22);
      ctx.lineTo(s * 0.18, s * 0.62);
      ctx.lineTo(0, s * 0.38);
      ctx.lineTo(-s * 0.18, s * 0.62);
      ctx.lineTo(-s * 0.32, s * 0.22);
      ctx.lineTo(-s * 0.92, s * 0.18);
      ctx.lineTo(-s * 0.48, -s * 0.12);
      ctx.lineTo(-s * 0.72, -s * 0.58);
      ctx.lineTo(-s * 0.22, -s * 0.42);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 236, 205, 0.9)";
      ctx.lineWidth = Math.max(0.9, s * 0.08);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.82);
      ctx.lineTo(0, s * 0.36);
      ctx.moveTo(0, -s * 0.28);
      ctx.lineTo(s * 0.58, -s * 0.42);
      ctx.moveTo(0, -s * 0.28);
      ctx.lineTo(-s * 0.58, -s * 0.42);
      ctx.moveTo(0, s * 0.02);
      ctx.lineTo(s * 0.7, s * 0.14);
      ctx.moveTo(0, s * 0.02);
      ctx.lineTo(-s * 0.7, s * 0.14);
      ctx.moveTo(0, s * 0.16);
      ctx.lineTo(s * 0.16, s * 0.5);
      ctx.moveTo(0, s * 0.16);
      ctx.lineTo(-s * 0.16, s * 0.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, s * 0.34);
      ctx.quadraticCurveTo(s * 0.12, s * 0.7, s * 0.05, s * 0.95);
      ctx.stroke();
    };

    const drawWinter = (p: Particle) => {
      const s = p.size;
      ctx.strokeStyle = "rgba(245, 250, 255, 0.95)";
      ctx.fillStyle = "rgba(210, 230, 255, 0.55)";
      ctx.lineWidth = 1.05;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let arm = 0; arm < 6; arm++) {
        ctx.save();
        ctx.rotate((Math.PI / 3) * arm);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -s);
        ctx.moveTo(0, -s * 0.38);
        ctx.lineTo(-s * 0.28, -s * 0.58);
        ctx.moveTo(0, -s * 0.38);
        ctx.lineTo(s * 0.28, -s * 0.58);
        ctx.moveTo(0, -s * 0.68);
        ctx.lineTo(-s * 0.2, -s * 0.86);
        ctx.moveTo(0, -s * 0.68);
        ctx.lineTo(s * 0.2, -s * 0.86);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(-s * 0.12, -s * 0.8);
        ctx.lineTo(0, -s * 0.7);
        ctx.lineTo(s * 0.12, -s * 0.8);
        ctx.closePath();
        ctx.globalAlpha = p.alpha * 0.55;
        ctx.fill();
        ctx.globalAlpha = p.alpha;
        ctx.stroke();
        ctx.restore();
      }
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const r = s * 0.22;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    };

    const drawMote = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin);
      ctx.globalAlpha = p.alpha;
      if (season === "spring") drawSpring(p);
      else if (season === "summer") drawSummer(p);
      else if (season === "autumn") drawAutumn(p);
      else drawWinter(p);
      ctx.restore();
    };

    const tick = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);

      let pulse = 0.15;
      if (analyser) {
        analyser.getByteFrequencyData(bins);
        let sum = 0;
        for (let i = 0; i < 24; i++) sum += bins[i];
        pulse = sum / (24 * 255);
      }

      for (const star of stars) {
        const twinkle = 0.55 + 0.45 * Math.sin(frame * 0.02 + star.spin);
        ctx.globalAlpha = star.alpha * starOpacity * twinkle;
        ctx.fillStyle = "var(--star)";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size + pulse * 0.6, 0, Math.PI * 2);
        ctx.fill();
        if (star.kind === 1) {
          ctx.globalAlpha *= 0.45;
          ctx.beginPath();
          ctx.moveTo(star.x - star.size * 5, star.y);
          ctx.lineTo(star.x + star.size * 5, star.y);
          ctx.moveTo(star.x, star.y - star.size * 5);
          ctx.lineTo(star.x, star.y + star.size * 5);
          ctx.strokeStyle = "var(--star)";
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      if (!reduced) {
        for (const mote of motes) {
          mote.x += mote.vx + Math.sin(frame * 0.01 + mote.spin) * (season === "winter" ? 0.22 : 0.12);
          mote.y += mote.vy;
          mote.spin += season === "autumn" ? 0.018 : season === "spring" ? 0.012 : season === "winter" ? 0.01 : 0.004;
          mote.phase += 0.06 + pulse * 0.08;
          if (mote.y > height + 18) {
            mote.y = -16;
            mote.x = Math.random() * width;
          }
          if (mote.y < -18) mote.y = height + 12;
          if (mote.x < -16) mote.x = width + 12;
          if (mote.x > width + 16) mote.x = -12;
          mote.alpha = Math.min(0.85, mote.alpha * 0.996 + pulse * 0.18);
          drawMote(mote);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [analyser, dayPart, season]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="nebula nebula-a" />
      <div className="nebula nebula-b" />
      <div className="nebula nebula-c" />
      <div className="planet-haze" />
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="grain" />
    </div>
  );
}
