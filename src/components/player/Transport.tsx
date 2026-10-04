import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { usePlayer } from "@/components/player/PlayerProvider";

export function Transport() {
  const { playing, toggle, next, prev, volume, setVolume, muted, toggleMute, current } =
    usePlayer();

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-4">
      <div className="transport-bar">
        <button
          type="button"
          aria-label={current.live ? "К плейлисту" : "Предыдущий трек"}
          onClick={prev}
        >
          <SkipBack className="pointer-events-none size-4 fill-current" />
        </button>
        <button type="button" className="play" data-testid="play-button" aria-label={playing ? "Пауза" : "Играть"} onClick={toggle}>
          {playing ? (
            <Pause className="pointer-events-none size-5 fill-current" />
          ) : (
            <Play className="pointer-events-none size-5 fill-current" />
          )}
        </button>
        <button
          type="button"
          aria-label={current.live ? "К плейлисту" : "Следующий трек"}
          onClick={next}
        >
          <SkipForward className="pointer-events-none size-4 fill-current" />
        </button>
      </div>
      <div className="hidden items-center gap-2 sm:flex">
        <button
          type="button"
          className="grid size-8 place-items-center rounded-full hover:bg-black/5"
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
