import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { usePlayer } from "@/components/player/PlayerProvider";

export function Transport() {
  const { playing, toggle, next, prev, volume, setVolume, muted, toggleMute, mode } =
    usePlayer();

  return (
    <div className="flex w-full max-w-lg items-center justify-center gap-3">
      <button
        type="button"
        className="grid size-11 place-items-center rounded-full hover:bg-white/10"
        aria-label={mode === "radio" ? "Предыдущая станция" : "Предыдущий трек"}
        onClick={prev}
      >
        <SkipBack className="pointer-events-none size-5 fill-current" />
      </button>
      <button
        type="button"
        className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_40px_color-mix(in_oklab,var(--glow)_45%,transparent)]"
        data-testid="play-button"
        aria-label={playing ? "Пауза" : "Играть"}
        onClick={toggle}
      >
        {playing ? (
          <Pause className="pointer-events-none size-6 fill-current" />
        ) : (
          <Play className="pointer-events-none size-6 fill-current" />
        )}
      </button>
      <button
        type="button"
        className="grid size-11 place-items-center rounded-full hover:bg-white/10"
        aria-label={mode === "radio" ? "Следующая станция" : "Следующий трек"}
        onClick={next}
      >
        <SkipForward className="pointer-events-none size-5 fill-current" />
      </button>
      <div className="ml-2 hidden min-w-32 items-center gap-2 sm:flex">
        <button
          type="button"
          className="grid size-8 place-items-center rounded-full hover:bg-white/10"
          aria-label={muted ? "Включить звук" : "Выключить звук"}
          onClick={toggleMute}
        >
          {muted || volume === 0 ? (
            <VolumeX className="pointer-events-none size-4" />
          ) : (
            <Volume2 className="pointer-events-none size-4" />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={muted ? 0 : Math.round(volume * 100)}
          onChange={(event) => setVolume(Number(event.target.value) / 100)}
          className="volume-range"
          aria-label="Громкость"
        />
      </div>
    </div>
  );
}
