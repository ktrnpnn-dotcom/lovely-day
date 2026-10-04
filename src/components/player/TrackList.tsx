import { Radio } from "lucide-react";
import { PlanetThumb } from "@/components/player/PlanetThumb";
import { usePlayer } from "@/components/player/PlayerProvider";
import { RADIO } from "@/lib/catalog";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export function TrackList({ compact = false }: { compact?: boolean }) {
  const { catalog, current, playTrack, playing } = usePlayer();
  const radioActive = current.id === RADIO.id;

  return (
    <div className={cn("flex h-full min-h-0 flex-col", compact && "pt-1")}>
      <button
        type="button"
        data-testid={`track-${RADIO.id}`}
        onClick={() => playTrack(RADIO.id)}
        className={cn(
          "mb-4 flex w-full items-center gap-3 rounded-[1.35rem] px-3 py-3 text-left transition",
          radioActive
            ? "bg-[color-mix(in_oklab,var(--primary)_28%,transparent)] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--glow)_55%,transparent),0_0_24px_color-mix(in_oklab,var(--glow)_22%,transparent)]"
            : "bg-white/6 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--glow)_28%,transparent)] hover:bg-white/10",
        )}
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[color-mix(in_oklab,var(--glow)_22%,black)] text-[var(--glow)]">
          <Radio className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold tracking-tight">Live radio</span>
          <span className="block truncate text-xs text-muted-foreground">{RADIO.title}</span>
        </span>
        {radioActive && playing ? (
          <span className="eq">
            <i />
            <i />
            <i />
          </span>
        ) : null}
        <span className="shrink-0 rounded-full bg-[var(--glow)] px-2 py-1 font-mono text-[10px] tracking-[0.18em] text-black">
          LIVE
        </span>
      </button>

      <div className="mb-2 flex items-center gap-2 px-1">
        <h2 className="font-heading text-sm tracking-wide">Playlist</h2>
        <span className="ml-auto text-[11px] text-muted-foreground">{catalog.length}</span>
      </div>
      <ul className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto pr-2">
        {catalog.map((track, index) => {
          const active = track.id === current.id;
          return (
            <li key={track.id}>
              <button
                type="button"
                data-testid={`track-${track.id}`}
                onClick={() => playTrack(track.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-3xl px-2 py-2 text-left transition",
                  active
                    ? "bg-[color-mix(in_oklab,var(--primary)_22%,transparent)] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--glow)_35%,transparent)]"
                    : "hover:bg-white/6",
                )}
              >
                <span className="relative size-12 shrink-0">
                  <PlanetThumb planet={track.planet} spinning={active && playing} />
                  {active && playing && (
                    <span className="absolute inset-0 grid place-items-center rounded-full bg-black/35">
                      <span className="eq">
                        <i />
                        <i />
                        <i />
                      </span>
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{track.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{track.artist}</span>
                </span>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                  {track.duration > 0 ? formatTime(track.duration) : "stream"}
                </span>
                <span className="w-5 shrink-0 text-center font-mono text-[10px] text-muted-foreground/80">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
