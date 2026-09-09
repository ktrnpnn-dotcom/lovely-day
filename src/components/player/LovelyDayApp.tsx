import { useState } from "react";
import { ListMusic, Radio, X } from "lucide-react";
import { CircularReel } from "@/components/player/CircularReel";
import { CosmicSky } from "@/components/player/CosmicSky";
import { PlayerProvider, usePlayer } from "@/components/player/PlayerProvider";
import { ThemeDials } from "@/components/player/ThemeDials";
import { TrackList } from "@/components/player/TrackList";
import { Transport } from "@/components/player/Transport";
import { cn } from "@/lib/utils";

export function LovelyDayApp() {
  return (
    <PlayerProvider>
      <Shell />
    </PlayerProvider>
  );
}

function Shell() {
  const { mode, dayPart, season } = usePlayer();
  const [playlistOpen, setPlaylistOpen] = useState(false);

  return (
    <div
      data-day={dayPart}
      data-season={season}
      className="relative isolate flex min-h-dvh flex-col overflow-hidden"
    >
      <CosmicSky />
      <header className="relative z-10 flex items-center gap-3 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-[1.15rem] bg-[color-mix(in_oklab,var(--primary)_35%,black)] shadow-[0_8px_30px_color-mix(in_oklab,var(--glow)_30%,transparent)]">
            <span className="block size-4 rounded-full bg-[var(--glow)] shadow-[0_0_16px_var(--glow)]" />
          </span>
          <div>
            <p className="font-heading text-lg leading-none tracking-tight md:text-xl">Lovely day</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Космический плеер
            </p>
          </div>
        </div>

        <div className="mx-auto hidden md:flex">
          <ModeSwitch />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs md:hidden"
            aria-label="Открыть плейлист"
            onClick={() => setPlaylistOpen(true)}
          >
            <ListMusic className="pointer-events-none size-4" />
            Треки
          </button>
          <ThemeDials compact />
        </div>
      </header>

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 gap-6 overflow-visible px-4 pb-6 md:px-6">
        <aside className="glass-panel hidden w-[min(22rem,32%)] shrink-0 flex-col rounded-[2rem] p-4 md:flex">
          <TrackList />
        </aside>

        <main className="glass-panel flex min-w-0 flex-1 flex-col items-center justify-center overflow-visible rounded-[2rem] px-4 py-6 md:px-8">
          <div className="mb-5 flex md:hidden">
            <ModeSwitch />
          </div>
          <CircularReel />
          <div className="mt-6">
            <Transport />
          </div>
        </main>
      </div>

      {playlistOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Закрыть плейлист"
            onClick={() => setPlaylistOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[78dvh] flex-col rounded-t-[2rem] border border-white/10 bg-[color-mix(in_oklab,var(--card)_92%,black)] p-4 shadow-2xl">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="font-heading text-base">{mode === "radio" ? "Радио" : "Плейлист"}</p>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-full hover:bg-white/10"
                aria-label="Закрыть"
                onClick={() => setPlaylistOpen(false)}
              >
                <X className="pointer-events-none size-4" />
              </button>
            </div>
            <div className="h-[60dvh] min-h-0 overflow-hidden">
              <TrackList compact />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ModeSwitch() {
  const { mode, setMode } = usePlayer();
  return (
    <div className="flex items-center rounded-full border border-white/10 bg-black/20 p-1 backdrop-blur-xl">
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm transition",
          mode === "library" && "bg-[color-mix(in_oklab,var(--primary)_38%,black)]",
        )}
        data-testid="mode-library"
        onClick={() => setMode("library")}
      >
        <ListMusic className="pointer-events-none size-4" />
        Плейлист
      </button>
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm transition",
          mode === "radio" && "bg-[color-mix(in_oklab,var(--primary)_38%,black)]",
        )}
        data-testid="mode-radio"
        onClick={() => setMode("radio")}
      >
        <Radio className="pointer-events-none size-4" />
        Радио
      </button>
    </div>
  );
}
