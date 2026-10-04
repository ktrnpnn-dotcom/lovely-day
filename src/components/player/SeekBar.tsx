import { usePlayer } from "@/components/player/PlayerProvider";
import { formatTime } from "@/lib/format";

export function SeekBar() {
  const { current, currentTime, duration, jogToRatio, beginJog, endJog } = usePlayer();
  const ratio = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;

  if (current.live) {
    return (
      <div className="flex w-full max-w-3xl items-center justify-center py-2">
        <span className="tracking-[0.28em] text-[var(--glow)]">LIVE</span>
      </div>
    );
  }

  return (
      <div className="flex w-full items-center gap-4">
      <span className="w-12 shrink-0 text-right font-mono text-xs text-muted-foreground">
        {formatTime(currentTime)}
      </span>
      <input
        type="range"
        min={0}
        max={1000}
        value={Math.round(ratio * 1000)}
        aria-label="Seek"
        className="seek-range"
        onPointerDown={beginJog}
        onPointerUp={endJog}
        onPointerCancel={endJog}
        onChange={(event) => jogToRatio(Number(event.target.value) / 1000)}
      />
      <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">
        {duration > 0 ? formatTime(duration) : "—"}
      </span>
    </div>
  );
}
