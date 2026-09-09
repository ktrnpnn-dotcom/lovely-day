import { Radio, Disc3 } from "lucide-react";
import { usePlayer } from "@/components/player/PlayerProvider";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export function TrackList({ compact = false }: { compact?: boolean }) {
  const { catalog, current, playTrack, mode, playing } = usePlayer();

  return (
    <div className={cn("flex h-full min-h-0 flex-col", compact && "pt-1")}>
      <div className="mb-3 flex items-center gap-2 px-1">
        {mode === "radio" ? (
          <Radio className="size-4 text-[var(--glow)]" />
        ) : (
          <Disc3 className="size-4 text-[var(--glow)]" />
        )}
        <h2 className="font-heading text-sm tracking-wide">
          {mode === "radio" ? "Станции" : "Плейлист"}
        </h2>
        <span className="ml-auto text-[11px] text-muted-foreground">{catalog.length}</span>
      </div>
      <p className="mb-3 px-1 text-[11px] leading-relaxed text-muted-foreground">
        {mode === "radio"
          ? "Живые эфиры SomaFM — Deep Space One, Drone Zone и Space Station."
          : "Три настоящих трека: медитация HoliznaCC0 и космический Space Traveler."}
      </p>
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
                <span className="relative size-12 shrink-0 overflow-hidden rounded-2xl">
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
                  <span className="block truncate text-xs text-muted-foreground">{track.artist}</span>
                  {track.video && (
                    <span className="mt-0.5 inline-flex rounded-full bg-[color-mix(in_oklab,var(--glow)_25%,transparent)] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em]">
                      клип
                    </span>
                  )}
                </span>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                  {mode === "radio" ? "LIVE" : formatTime(track.duration)}
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
