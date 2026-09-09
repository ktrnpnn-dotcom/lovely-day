export type Playable = {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover: string;
  video?: string;
  duration: number;
  live?: boolean;
};

function media(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

function radio(devPath: string, liveUrl: string) {
  return import.meta.env.DEV ? devPath : liveUrl;
}

export const SONGS: Playable[] = [
  {
    id: "star-walk-meditation",
    title: "Медитация среди звёзд",
    artist: "HoliznaCC0",
    src: media("/audio/star-walk-meditation.mp3"),
    cover: media("/covers/cover-nebula-dawn.png"),
    duration: 300,
  },
  {
    id: "ease-into-night",
    title: "Вход в ночь",
    artist: "HoliznaCC0",
    src: media("/audio/ease-into-night.mp3"),
    cover: media("/covers/cover-lunar-garden.png"),
    duration: 152,
  },
  {
    id: "space-traveler",
    title: "Путешественник",
    artist: "Hypnotronic Man",
    src: media("/audio/space-traveler.mp3"),
    cover: media("/covers/cover-solar-drift.png"),
    duration: 358,
  },
];

export const STATIONS: Playable[] = [
  {
    id: "deep-space-one",
    title: "Deep Space One",
    artist: "SomaFM · живой эфир",
    src: radio("/api/radio/deepspace", "https://ice5.somafm.com/deepspaceone-128-mp3"),
    cover: media("/covers/cover-frozen-orbit.png"),
    duration: 0,
    live: true,
  },
  {
    id: "drone-zone",
    title: "Drone Zone",
    artist: "SomaFM · живой эфир",
    src: radio("/api/radio/dronezone", "https://ice6.somafm.com/dronezone-128-mp3"),
    cover: media("/covers/cover-aurora-signal.png"),
    duration: 0,
    live: true,
  },
  {
    id: "space-station",
    title: "Space Station Soma",
    artist: "SomaFM · живой эфир",
    src: radio("/api/radio/spacestation", "https://ice5.somafm.com/spacestation-128-mp3"),
    cover: media("/covers/cover-starlight-harbor.png"),
    duration: 0,
    live: true,
  },
];
