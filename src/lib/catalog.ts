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

export const SONGS: Playable[] = [
  {
    id: "star-walk-meditation",
    title: "Медитация среди звёзд",
    artist: "HoliznaCC0",
    src: "/audio/star-walk-meditation.mp3",
    cover: "/covers/cover-nebula-dawn.png",
    duration: 300,
  },
  {
    id: "ease-into-night",
    title: "Вход в ночь",
    artist: "HoliznaCC0",
    src: "/audio/ease-into-night.mp3",
    cover: "/covers/cover-lunar-garden.png",
    duration: 152,
  },
  {
    id: "space-traveler",
    title: "Путешественник",
    artist: "Hypnotronic Man",
    src: "/audio/space-traveler.mp3",
    cover: "/covers/cover-solar-drift.png",
    duration: 358,
  },
];

export const STATIONS: Playable[] = [
  {
    id: "deep-space-one",
    title: "Deep Space One",
    artist: "SomaFM · живой эфир",
    src: "/api/radio/deepspace",
    cover: "/covers/cover-frozen-orbit.png",
    duration: 0,
    live: true,
  },
  {
    id: "drone-zone",
    title: "Drone Zone",
    artist: "SomaFM · живой эфир",
    src: "/api/radio/dronezone",
    cover: "/covers/cover-aurora-signal.png",
    duration: 0,
    live: true,
  },
  {
    id: "space-station",
    title: "Space Station Soma",
    artist: "SomaFM · живой эфир",
    src: "/api/radio/spacestation",
    cover: "/covers/cover-starlight-harbor.png",
    duration: 0,
    live: true,
  },
];
