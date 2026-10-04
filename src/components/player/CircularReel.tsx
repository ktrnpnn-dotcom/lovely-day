import { PlanetGlobe } from "@/components/player/PlanetGlobe";
import { usePlayer } from "@/components/player/PlayerProvider";
import { RADIO } from "@/lib/catalog";
import { formatTime } from "@/lib/format";

export function CircularReel() {
  const { catalog, current, playing, loading, error, currentTime, duration } = usePlayer();
  const index = Math.max(0, catalog.findIndex((track) => track.id === current.id));
  const freq = current.live ? 89.0 : Number((88.1 + index * 1.4).toFixed(1));
  const signal = current.live ? "1.354" : (1.12 + (index % 9) * 0.031).toFixed(3);

  return (
    <div className="flex w-full flex-col items-center gap-5 px-2 md:px-6">
      <div className="flex w-full max-w-xl items-end justify-between gap-4 px-2">
        <div>
          <p className="font-heading text-5xl leading-none md:text-7xl">{current.live ? "Live" : "Play"}</p>
          <p className="mt-3 flex items-center gap-2 font-mono text-sm">
            {signal}
            <span className="inline-flex gap-0.5 text-primary" aria-hidden>
              <i className="block h-3 w-0.5 bg-current" />
              <i className="block h-4 w-0.5 bg-current" />
              <i className="block h-2.5 w-0.5 bg-current" />
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] tracking-[0.28em] uppercase opacity-60">FM</p>
          <p className="font-heading text-4xl leading-none">{freq.toFixed(1)}</p>
        </div>
      </div>

      <Tuner freq={freq} />

      <div className={`reel-frame disc-shell relative select-none${current.planet === "saturn" ? " has-rings" : ""}`}>
        <div className="h-full w-full" aria-hidden />
        <div className={current.planet === "saturn" ? "absolute inset-0" : "disc-mask"}>
          <PlanetGlobe planet={current.planet} spinning={playing} />
          {current.planet !== "saturn" && <span className="disc-wedge" />}
        </div>
        {loading && (
          <span className="pointer-events-none absolute top-3 left-1/2 z-10 -translate-x-1/2 rounded-full border border-current/20 bg-[var(--sheet)] px-3 py-1 text-[10px] tracking-[0.2em] uppercase">
            Буфер
          </span>
        )}
      </div>

      <div className="flex max-w-[24rem] flex-col items-center text-center">
        <p className="font-heading text-3xl leading-none md:text-4xl">{current.title}</p>
        <p className="mt-2 text-sm text-muted-foreground">{current.artist}</p>
        <p className="mt-3 text-[11px] tracking-[0.32em] uppercase opacity-55">{current.planetLabel}</p>
        {current.id === RADIO.id && (
          <p className="mt-3 text-[11px] tracking-[0.2em] uppercase text-primary">В эфире</p>
        )}
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>

      <div className="flex items-center gap-6 font-mono text-xs text-muted-foreground">
        {current.live ? (
          <span className="tracking-[0.22em] text-primary">LIVE</span>
        ) : (
          <>
            <span>{formatTime(currentTime)}</span>
            <span className="h-px w-16 bg-current/25" />
            <span>{duration > 0 ? formatTime(duration) : "—"}</span>
          </>
        )}
      </div>
    </div>
  );
}

function Tuner({ freq }: { freq: number }) {
  const min = 88;
  const max = 108;
  const t = Math.min(1, Math.max(0, (freq - min) / (max - min)));
  const x = 16 + t * 168;

  return (
    <svg className="tuner-arc" viewBox="0 0 200 54" aria-hidden>
      {Array.from({ length: 21 }, (_, i) => {
        const px = 16 + (i / 20) * 168;
        const tall = i % 5 === 0;
        return (
          <line
            key={i}
            x1={px}
            y1={tall ? 8 : 16}
            x2={px}
            y2={38}
            stroke="currentColor"
            strokeOpacity={tall ? 0.7 : 0.28}
            strokeWidth={tall ? 1.6 : 1}
          />
        );
      })}
      <line className="tuner-needle" x1={x} y1={4} x2={x} y2={44} />
      <text x="16" y="52" fontSize="7" fill="currentColor" opacity="0.45">
        88
      </text>
      <text x="92" y="52" fontSize="7" fill="currentColor" opacity="0.45" textAnchor="middle">
        98
      </text>
      <text x="184" y="52" fontSize="7" fill="currentColor" opacity="0.45" textAnchor="end">
        108
      </text>
    </svg>
  );
}
