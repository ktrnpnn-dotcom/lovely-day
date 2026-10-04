import { useState } from "react";
import { ListMusic, X } from "lucide-react";
import { CircularReel } from "@/components/player/CircularReel";
import { CosmicSky } from "@/components/player/CosmicSky";
import { PlayerProvider, usePlayer } from "@/components/player/PlayerProvider";
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
  const { dayPart, season } = usePlayer();
  const [playlistOpen, setPlaylistOpen] = useState(false);

  return (
    <div
      data-day={dayPart}
      data-season={season}
      className="relative isolate flex min-h-dvh flex-col overflow-hidden"
    >
      <CosmicSky />
      <header className="relative z-10 flex items-center gap-3 px-4 py-5 md:px-8">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full border border-current">
            <span className="block h-3.5 w-px bg-primary" />
          </span>
          <p className="font-heading text-xl leading-none md:text-2xl">Lovely day</p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-current/20 px-3 py-2 text-xs md:hidden"
            aria-label="Открыть плейлист"
            onClick={() => setPlaylistOpen(true)}
          >
            <ListMusic className="pointer-events-none size-4" />
            Треки
          </button>
          <ThemeDials compact />
        </div>
      </header>

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 gap-5 overflow-visible px-4 pb-6 md:px-8">
        <aside className="sheet hidden w-[min(22rem,32%)] shrink-0 flex-col rounded-[1.75rem] p-4 md:flex">
          <TrackList />
        </aside>

        <main className="sheet flex min-w-0 flex-1 flex-col items-center justify-center overflow-visible rounded-[1.75rem] px-4 py-6 md:px-10">
          <CircularReel />
          <div className="mt-8">
            <Transport />
          </div>
        </main>
      </div>

      {playlistOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Закрыть плейлист"
            onClick={() => setPlaylistOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[78dvh] flex-col rounded-t-[1.75rem] border border-current/10 bg-[var(--sheet)] p-4 shadow-2xl">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="font-heading text-base">Плейлист</p>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-full hover:bg-black/5"
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
