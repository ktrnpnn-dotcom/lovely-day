import { PlanetGlobe } from "@/components/player/PlanetGlobe";
import { SeekBar } from "@/components/player/SeekBar";
import { usePlayer } from "@/components/player/PlayerProvider";

export function CircularReel() {
  const { current, playing, loading, error } = usePlayer();

  return (
    <div className="flex w-full flex-col items-center gap-5 px-4 md:px-8">
      {!current.live && (
        <div className={`reel-frame is-live relative select-none${current.planet === "saturn" ? " has-rings" : ""}`}>
          <div className="h-full w-full" aria-hidden />
          <div className="reel-glow" />
          <div className="planet-stage">
            <PlanetGlobe planet={current.planet} spinning={playing} />
            {loading && (
              <span className="pointer-events-none absolute top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[10px] tracking-[0.2em] uppercase">
                Buffer
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex max-w-[22rem] flex-col items-center text-center">
        <p className="font-heading text-2xl leading-tight tracking-tight md:text-3xl">{current.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{current.artist}</p>
        {!current.live && <p className="constellation-caption">{current.planetLabel}</p>}
        {current.live && (
          <p className="mt-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--glow)]">
            On air
          </p>
        )}
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>

      <SeekBar />

      {!current.live && (
        <p className="max-w-sm text-center text-[12px] leading-relaxed text-muted-foreground">
          Drag the planet to turn it in space.
        </p>
      )}
    </div>
  );
}
