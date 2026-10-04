import { usePlayer } from "@/components/player/PlayerProvider";
import { THEME_PRESETS, themeIndex } from "@/lib/theme";

export function ThemeDials() {
  const { dayPart, season, setDayPart, setSeason } = usePlayer();
  const index = themeIndex(dayPart, season);
  const current = THEME_PRESETS[index] ?? THEME_PRESETS[0];

  return (
    <div className="min-w-0 flex-1">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">Sky</span>
        <span className="truncate text-[11px] text-foreground">{current.label}</span>
      </div>
      <input
        type="range"
        min={0}
        max={THEME_PRESETS.length - 1}
        step={1}
        value={index}
        aria-label="Sky"
        aria-valuetext={current.label}
        className="theme-range"
        onChange={(event) => {
          const next = THEME_PRESETS[Number(event.target.value)];
          if (!next) return;
          setDayPart(next.dayPart);
          setSeason(next.season);
        }}
      />
    </div>
  );
}
