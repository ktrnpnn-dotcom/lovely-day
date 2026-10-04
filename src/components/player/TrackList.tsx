import { usePlayer } from "@/components/player/PlayerProvider";
import { RADIO } from "@/lib/catalog";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export function TrackList({ compact = false }: { compact?: boolean }) {
  const { catalog, current, playTrack, playing } = usePlayer();
  const radioActive = current.id === RADIO.id;

  return (
    <div className={cn("flex h-full min-h-0 flex-col", compact && "pt-1")}>
      <div className="mb-4 flex items-end gap-2 border-b border-current/10 px-1 pb-3">
        <h2 className="font-heading text-lg leading-none">Плейлист</h2>
        <span className="text-[11px] text-muted-foreground">{catalog.length}</span>
        <button
          type="button"
          data-testid={`track-${RADIO.id}`}
          onClick={() => playTrack(RADIO.id)}
          className={cn(
            "ml-auto flex min-w-0 items-center gap-2 rounded-full px-2 py-1 text-left",
            radioActive ? "bg-foreground text-[var(--background)]" : "hover:bg-black/5",
          )}
        >
          {radioActive && playing && (
            <span className="eq scale-75">
              <i />
              <i />
              <i />
            </span>
          )}
          <span className="truncate text-xs font-medium">Эфир</span>
          <span className="shrink-0 font-mono text-[10px] tracking-[0.16em]">LIVE</span>
        </button>
      </div>
      <ul className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {catalog.map((track, index) => {
          const active = track.id === current.id;
          return (
            <li key={track.id} className="border-b border-current/8">
              <button
                type="button"
                data-testid={`track-${track.id}`}
                onClick={() => playTrack(track.id)}
                className={cn(
                  "flex w-full items-center gap-3 px-1 py-3 text-left transition",
                  active ? "bg-foreground text-[var(--background)]" : "hover:bg-black/4",
                )}
              >
                <span className="relative size-11 shrink-0 overflow-hidden rounded-full border border-current/15">
                  <img src={track.cover} alt="" className="h-full w-full object-cover" />
                  {active && playing && (
                    <span className="absolute inset-0 grid place-items-center bg-black/35">
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
                  <span className={cn("block truncate text-xs", active ? "opacity-70" : "text-muted-foreground")}>
                    {track.artist}
                  </span>
                </span>
                <span className={cn("shrink-0 font-mono text-[11px]", active ? "opacity-70" : "text-muted-foreground")}>
                  {track.duration > 0 ? formatTime(track.duration) : "stream"}
                </span>
                <span className={cn("w-6 shrink-0 text-right font-mono text-[10px]", active ? "opacity-70" : "text-muted-foreground")}>
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
