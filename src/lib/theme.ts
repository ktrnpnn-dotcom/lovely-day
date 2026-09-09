export const DAY_PARTS = ["morning", "day", "evening", "night"] as const;
export const SEASONS = ["spring", "summer", "autumn", "winter"] as const;

export type DayPart = (typeof DAY_PARTS)[number];
export type Season = (typeof SEASONS)[number];

export const DAY_LABELS: Record<DayPart, string> = {
  morning: "Утро",
  day: "День",
  evening: "Вечер",
  night: "Ночь",
};

export const SEASON_LABELS: Record<Season, string> = {
  spring: "Весна",
  summer: "Лето",
  autumn: "Осень",
  winter: "Зима",
};

export function detectDayPart(date = new Date()): DayPart {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "day";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function detectSeason(date = new Date()): Season {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

export const THEME_STORAGE_KEY = "lovely-day-theme";
