import { useState } from "react";
import { ListMusic, X } from "lucide-react";
import { CircularReel } from "@/components/player/CircularReel";
import { CosmicSky } from "@/components/player/CosmicSky";
import { PlayerProvider, usePlayer } from "@/components/player/PlayerProvider";
import { SpaceStage } from "@/components/player/SpaceStage";
import { ThemeDials } from "@/components/player/ThemeDials";
import { TrackList } from "@/components/player/TrackList";
import { Transport } from "@/components/player/Transport";

export function LovelyDayApp() {
  return (
    <PlayerProvider>
      <Shell />
    </PlayerProvider>
  );
}

function Shell() {
  const { dayPart, season, current } = usePlayer();
  const [playlistOpen, setPlaylistOpen] = useState(false);

  return (
    <div
      data-day={dayPart}
      data-season={season}
      className="relative isolate flex min-h-dvh flex-col overflow-hidden"
    >
      <CosmicSky />
      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col px-4 md:px-6">
        <header className="flex items-center gap-6 py-3">
          <div className="flex min-w-0 w-full items-center gap-4 md:w-[min(22rem,32%)] md:shrink-0">
            <div className="flex shrink-0 items-center gap-3">
              <span className="grid size-10 place-items-center rounded-[1.15rem] bg-[color-mix(in_oklab,var(--primary)_35%,black)] shadow-[0_8px_30px_color-mix(in_oklab,var(--glow)_30%,transparent)]">
                <span className="block size-4 rounded-full bg-[var(--glow)] shadow-[0_0_16px_var(--glow)]" />
              </span>
              <p className="font-heading text-lg leading-none tracking-tight md:text-xl">Lovely day</p>
            </div>
            <ThemeDials />
          </div>
          <div className="hidden min-w-0 flex-1 md:block" />
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs md:hidden"
            aria-label="Open playlist"
            onClick={() => setPlaylistOpen(true)}
          >
            <ListMusic className="pointer-events-none size-4" />
            Tracks
          </button>
        </header>

        <div className="flex min-h-0 flex-1 gap-6 overflow-visible pb-6">
          <aside className="glass-panel hidden w-[min(22rem,32%)] shrink-0 flex-col rounded-[2rem] p-4 md:flex">
            <TrackList />
          </aside>

          <main
            className={
              current.live
                ? "relative flex min-w-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/12 px-4 py-6 md:px-8"
                : "glass-panel relative flex min-w-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-[2rem] px-4 py-6 md:px-8"
            }
          >
            {current.live ? <SpaceStage /> : null}
            <div className="relative z-10 flex w-full flex-col items-center">
              <CircularReel />
              <div className="mt-6">
                <Transport />
              </div>
            </div>
          </main>
        </div>
      </div>

      {playlistOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close playlist"
            onClick={() => setPlaylistOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[78dvh] flex-col rounded-t-[2rem] border border-white/10 bg-[color-mix(in_oklab,var(--card)_92%,black)] p-4 shadow-2xl">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="font-heading text-base">Playlist</p>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-full hover:bg-white/10"
                aria-label="Close"
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
