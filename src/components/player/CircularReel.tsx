import { useCallback, useEffect, useRef, useState } from "react";
import { ConstellationHalo } from "@/components/player/ConstellationHalo";
import { usePlayer } from "@/components/player/PlayerProvider";
import { constellationForTrack } from "@/lib/constellations";
import { formatTime, TAPE_SEEK_RATE } from "@/lib/format";

const SIZE = 200;
const CENTER = SIZE / 2;
const TRACK_R = 86;
const CIRC = 2 * Math.PI * TRACK_R;

function angleRatioFromPoint(clientX: number, clientY: number, rect: DOMRect) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = clientX - cx;
  const dy = clientY - cy;
  let angle = Math.atan2(dy, dx) + Math.PI / 2;
  if (angle < 0) angle += Math.PI * 2;
  return angle / (Math.PI * 2);
}

function isOnRing(clientX: number, clientY: number, rect: DOMRect) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = clientX - cx;
  const dy = clientY - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const radius = rect.width / 2;
  const inner = radius * 0.62;
  const outer = radius * 1.08;
  return dist >= inner && dist <= outer;
}

export function CircularReel() {
  const {
    current,
    playing,
    loading,
    error,
    currentTime,
    duration,
    isSeeking,
    seekDirection,
    beginHoldSeek,
    endHoldSeek,
    beginJog,
    endJog,
    jogToRatio,
    analyser,
  } = usePlayer();

  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const visRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<"idle" | "hold" | "jog">("idle");
  const holdTimerRef = useRef<number | null>(null);
  const originRef = useRef<{ x: number; y: number } | null>(null);
  const [hint, setHint] = useState<"idle" | "hold" | "jog">("idle");
  const [videoBroken, setVideoBroken] = useState(false);
  const sky = constellationForTrack(current.id);

  const ratio = current.live
    ? playing
      ? 0.34
      : 0.12
    : duration > 0
      ? Math.min(1, Math.max(0, currentTime / duration))
      : 0;
  const ratioRef = useRef(0);
  const dash = CIRC * ratio;
  const knobAngle = ratio * 360 - 90;

  useEffect(() => {
    setVideoBroken(false);
  }, [current.id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !current.video || videoBroken) return;
    if (playing && video.paused) {
      void video.play().catch(() => undefined);
    }
    if (!playing && !video.paused) video.pause();
  }, [playing, current.video, current.id, videoBroken]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !current.video) return;
    const vDur = video.duration;
    if (!Number.isFinite(vDur) || vDur <= 0) return;
    const synced = currentTime % vDur;
    if (Math.abs(video.currentTime - synced) > 0.35) {
      video.currentTime = synced;
    }
  }, [currentTime, current.video]);

  useEffect(() => {
    const canvas = visRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const bins = new Uint8Array(64);
    const live = Boolean(current.live);

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      if (analyser) analyser.getByteFrequencyData(bins);
      ctx.translate(width / 2, height / 2);
      if (live) {
        let energy = 0.12;
        if (analyser) {
          let sum = 0;
          for (let i = 0; i < 16; i++) sum += bins[i];
          energy = sum / (16 * 255);
        }
        const g = ctx.createRadialGradient(0, 0, width * 0.18, 0, 0, width * 0.5);
        g.addColorStop(0, "transparent");
        g.addColorStop(0.7, `rgba(255, 220, 180, ${0.04 + energy * 0.12})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, width * 0.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const bars = 36;
        for (let i = 0; i < bars; i++) {
          const value = analyser ? bins[i] / 255 : 0.12;
          const inner = width * 0.36;
          const len = inner * 0.08 + value * inner * 0.22;
          const a = (i / bars) * Math.PI * 2;
          ctx.strokeStyle = "color-mix(in oklab, var(--glow) 70%, white)";
          ctx.globalAlpha = 0.18 + value * 0.55;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
          ctx.lineTo(Math.cos(a) * (inner + len), Math.sin(a) * (inner + len));
          ctx.stroke();
        }
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [analyser, current.live]);

  const clearHoldTimer = () => {
    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const finishGesture = useCallback(() => {
    clearHoldTimer();
    if (modeRef.current === "hold") endHoldSeek();
    if (modeRef.current === "jog") endJog();
    modeRef.current = "idle";
    originRef.current = null;
    setHint("idle");
  }, [endHoldSeek, endJog]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if (current.live) return;
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (!isOnRing(event.clientX, event.clientY, rect)) return;
    event.preventDefault();
    rootRef.current?.setPointerCapture(event.pointerId);
    originRef.current = { x: event.clientX, y: event.clientY };
    const cx = rect.left + rect.width / 2;
    const direction = event.clientX >= cx ? 1 : -1;
    holdTimerRef.current = window.setTimeout(() => {
      if (modeRef.current !== "idle") return;
      modeRef.current = "hold";
      setHint("hold");
      beginHoldSeek(direction);
    }, 170);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!originRef.current) return;
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = event.clientX - originRef.current.x;
    const dy = event.clientY - originRef.current.y;
    const moved = Math.hypot(dx, dy);

    if (modeRef.current === "idle" && moved > 8) {
      clearHoldTimer();
      modeRef.current = "jog";
      setHint("jog");
      beginJog();
    }

    if (modeRef.current === "jog") {
      jogToRatio(angleRatioFromPoint(event.clientX, event.clientY, rect));
    }
  };

  useEffect(() => {
    ratioRef.current = ratio;
  }, [ratio]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    let wheelStop: number | null = null;
    const onWheel = (event: WheelEvent) => {
      if (duration <= 0 || current.live) return;
      event.preventDefault();
      if (modeRef.current === "idle") {
        modeRef.current = "jog";
        setHint("jog");
        beginJog();
      }
      if (modeRef.current === "jog") {
        const next = Math.min(1, Math.max(0, ratioRef.current + event.deltaY / 900));
        jogToRatio(next);
      }
      if (wheelStop) window.clearTimeout(wheelStop);
      wheelStop = window.setTimeout(() => {
        if (modeRef.current === "jog" && !originRef.current) {
          modeRef.current = "idle";
          setHint("idle");
          endJog();
        }
      }, 180);
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      node.removeEventListener("wheel", onWheel);
      if (wheelStop) window.clearTimeout(wheelStop);
    };
  }, [beginJog, current.live, duration, endJog, jogToRatio]);

  useEffect(() => {
    const onUp = () => finishGesture();
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [finishGesture]);

  const spinClass = isSeeking
    ? seekDirection < 0
      ? "reel-spin-back"
      : "reel-spin-fwd"
    : playing
      ? "reel-spin-play"
      : "";

  return (
    <div className="flex w-full flex-col items-center gap-5 px-6 md:px-10">
      <div
        ref={rootRef}
        className={`reel-frame relative select-none ${current.live ? "is-live" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        role={current.live ? undefined : "slider"}
        aria-label={current.live ? undefined : "Перемотка плёнки"}
        aria-valuemin={current.live ? undefined : 0}
        aria-valuemax={current.live ? undefined : Math.floor(duration)}
        aria-valuenow={current.live ? undefined : Math.floor(currentTime)}
        tabIndex={current.live ? undefined : 0}
      >
        <div className={`reel-glow ${isSeeking ? "reel-glow-seek" : ""}`} />
        {current.live && <div className="h-full w-full" aria-hidden />}
        <ConstellationHalo trackId={current.id} live={Boolean(current.live)} playing={playing} />
        {!current.live && (
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="reel-svg pointer-events-none">
            <defs>
              <linearGradient id="reel-progress" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--glow)" />
                <stop offset="100%" stopColor="var(--primary)" />
              </linearGradient>
            </defs>
            <circle
              cx={CENTER}
              cy={CENTER}
              r={96}
              fill="none"
              stroke="color-mix(in oklab, var(--foreground) 18%, transparent)"
              strokeWidth="4"
              strokeDasharray="3 9"
              className={spinClass}
              style={{ transformOrigin: "center" }}
            />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={TRACK_R}
              fill="none"
              stroke="var(--reel-track)"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={TRACK_R}
              fill="none"
              stroke="url(#reel-progress)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${CIRC}`}
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
              className="drop-shadow-[0_0_12px_color-mix(in_oklab,var(--glow)_70%,transparent)]"
            />
            <g transform={`rotate(${knobAngle} ${CENTER} ${CENTER})`}>
              <circle
                cx={CENTER + TRACK_R}
                cy={CENTER}
                r="7"
                fill="white"
                stroke="var(--glow)"
                strokeWidth="2"
              />
            </g>
          </svg>
        )}

        <div className="reel-media">
          {current.video && !videoBroken ? (
            <video
              ref={videoRef}
              key={current.id}
              src={current.video}
              poster={current.cover}
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
              onError={() => setVideoBroken(true)}
            />
          ) : (
            <img
              src={current.cover}
              alt=""
              className={`h-full w-full object-cover ${playing && !isSeeking ? "cover-drift" : ""}`}
            />
          )}
          <canvas ref={visRef} width={360} height={360} className="pointer-events-none absolute inset-0 h-full w-full" />
          {loading && (
            <span className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[10px] tracking-[0.2em] uppercase">
              Буфер
            </span>
          )}
        </div>
      </div>

      <div className="flex max-w-[22rem] flex-col items-center text-center">
        <p className="font-heading text-2xl leading-tight tracking-tight md:text-3xl">{current.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{current.artist}</p>
        <p className="constellation-caption">
          {sky.latin}
          <span> · </span>
          {sky.name}
        </p>
        {current.live && (
          <p className="mt-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--glow)]">
            В эфире
          </p>
        )}
        {current.video && !current.live && (
          <p className="mt-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Видеоклип
          </p>
        )}
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>

      <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
        {current.live ? (
          <span className="tracking-[0.2em] text-[var(--glow)]">LIVE</span>
        ) : (
          <>
            <span>{formatTime(currentTime)}</span>
            <span className="h-px w-10 bg-white/20" />
            <span>{formatTime(duration)}</span>
          </>
        )}
      </div>

      <p className="max-w-sm text-center text-[12px] leading-relaxed text-muted-foreground">
        {current.live
          ? "Живой эфир SomaFM. Созвездие вокруг альбома — как в атласе неба."
          : hint === "hold"
            ? `Плёнка ×${TAPE_SEEK_RATE}: две секунды удержания — пятнадцать секунд трека`
            : hint === "jog"
              ? "Кольцо как катушка: крутите, чтобы попасть в нужный момент"
              : "Покрутите кольцо или удерживайте его. 2 сек нажатия = 15 сек песни, со звуком плёнки."}
      </p>
    </div>
  );
}
