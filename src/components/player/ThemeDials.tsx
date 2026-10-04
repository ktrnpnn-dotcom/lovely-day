import { Flower2, Leaf, Moon, Snowflake, Sun, Sunrise, Sunset, TreePalm } from "lucide-react";
import { usePlayer } from "@/components/player/PlayerProvider";
import {
  DAY_LABELS,
  DAY_PARTS,
  SEASON_LABELS,
  SEASONS,
  type DayPart,
  type Season,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

const DAY_ICONS = {
  morning: Sunrise,
  day: Sun,
  evening: Sunset,
  night: Moon,
} as const;

const SEASON_ICONS = {
  spring: Flower2,
  summer: TreePalm,
  autumn: Leaf,
  winter: Snowflake,
} as const;

export function ThemeDials({ compact = false }: { compact?: boolean }) {
  const { dayPart, season, setDayPart, setSeason } = usePlayer();

  return (
    <div className={cn("flex flex-col items-end gap-1", compact ? "" : "gap-3")}>
      <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
        {DAY_LABELS[dayPart]} · {SEASON_LABELS[season]}
      </p>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Segment
          label="Время суток"
          compact={compact}
          items={DAY_PARTS.map((part) => ({
            id: part,
            label: DAY_LABELS[part],
            icon: DAY_ICONS[part],
            active: dayPart === part,
            onSelect: () => setDayPart(part as DayPart),
          }))}
        />
        <Segment
          label="Сезон"
          compact={compact}
          items={SEASONS.map((item) => ({
            id: item,
            label: SEASON_LABELS[item],
            icon: SEASON_ICONS[item],
            active: season === item,
            onSelect: () => setSeason(item as Season),
          }))}
        />
      </div>
    </div>
  );
}

function Segment({
  label,
  items,
  compact,
}: {
  label: string;
  compact: boolean;
  items: {
    id: string;
    label: string;
    icon: typeof Sun;
    active: boolean;
    onSelect: () => void;
  }[];
}) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.active}
            aria-label={`${label}: ${item.label}`}
            title={item.label}
            data-testid={`theme-${item.id}`}
            onClick={item.onSelect}
            className={cn(
              "inline-flex items-center justify-center rounded-full text-[11px] transition",
              compact ? "size-8" : "size-9",
              item.active ? "bg-foreground text-[var(--background)]" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="pointer-events-none size-3.5" />
            <span className="sr-only">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
