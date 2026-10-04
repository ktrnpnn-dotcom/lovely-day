import type { PlanetId } from "@/lib/planets";
import { PLANETS } from "@/lib/planets";

export type Playable = {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover: string;
  duration: number;
  live?: boolean;
  planet: PlanetId;
  planetLabel: string;
};

function media(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

function radio(devPath: string, liveUrl: string) {
  return import.meta.env.DEV ? devPath : liveUrl;
}

function ia(item: string, file: string) {
  return `https://archive.org/download/${item}/${encodeURIComponent(file)}`;
}

export const RADIO: Playable = {
  id: "deep-space-one",
  title: "Deep Space One",
  artist: "SomaFM · live",
  src: radio("/api/radio/deepspace", "https://ice5.somafm.com/deepspaceone-128-mp3"),
  cover: PLANETS.neptune.map,
  duration: 0,
  live: true,
  planet: "neptune",
  planetLabel: "Deep space",
};

export const STATIONS: Playable[] = [RADIO];

export const SONGS: Playable[] = [
  {
    id: "star-walk-meditation",
    title: "Meditation Among the Stars",
    artist: "HoliznaCC0",
    src: media("/audio/star-walk-meditation.mp3"),
    cover: PLANETS.jupiter.map,
    planet: "jupiter",
    planetLabel: "Jupiter",
    duration: 300,
  },
  {
    id: "ease-into-night",
    title: "Ease Into Night",
    artist: "HoliznaCC0",
    src: media("/audio/ease-into-night.mp3"),
    cover: PLANETS.earth.map,
    planet: "earth",
    planetLabel: "Earth",
    duration: 152,
  },
  {
    id: "space-traveler",
    title: "Space Traveler",
    artist: "Hypnotronic Man",
    src: media("/audio/space-traveler.mp3"),
    cover: PLANETS.saturn.map,
    planet: "saturn",
    planetLabel: "Saturn",
    duration: 358,
  },
  {
    id: "cosmic-waves",
    title: "Cosmic Waves",
    artist: "HoliznaCC0",
    src: ia("holizna-cc-0-cosmic-waves", "HoliznaCC0 - Cosmic Waves.mp3"),
    cover: PLANETS.mars.map,
    planet: "mars",
    planetLabel: "Mars",
    duration: 0,
  },
  {
    id: "dreamscape",
    title: "DreamScape",
    artist: "HoliznaCC0",
    src: ia("holizna-cc-0-cosmic-waves", "HoliznaCC0 - DreamScape.mp3"),
    cover: PLANETS.neptune.map,
    planet: "neptune",
    planetLabel: "Neptune",
    duration: 0,
  },
  {
    id: "rain-sleep",
    title: "Rain · Sleep · Meditation",
    artist: "HoliznaCC0",
    src: ia("holizna-cc-0-cosmic-waves", "HoliznaCC0 - Rain _ Sleep _ Meditation.mp3"),
    cover: PLANETS.moon.map,
    planet: "moon",
    planetLabel: "Moon",
    duration: 0,
  },
  {
    id: "meditation-2",
    title: "Meditation II",
    artist: "HoliznaCC0",
    src: ia("holizna-cc-0-20-minute-meditation-2", "HoliznaCC0 - 20 Minute Meditation 2.mp3"),
    cover: PLANETS.mercury.map,
    planet: "mercury",
    planetLabel: "Mercury",
    duration: 0,
  },
  {
    id: "meditation-3",
    title: "Adrian",
    artist: "HoliznaCC0",
    src: ia("holizna-cc-0-20-minute-meditation-2", "HoliznaCC0 - 20 Minute Meditation 3.mp3"),
    cover: PLANETS.adrian.map,
    planet: "adrian",
    planetLabel: "Adrian",
    duration: 0,
  },
  {
    id: "meditation-4",
    title: "Taulite",
    artist: "HoliznaCC0",
    src: ia("holizna-cc-0-20-minute-meditation-2", "HoliznaCC0 - 20 Minute Meditation 4.mp3"),
    cover: PLANETS.taulite.map,
    planet: "taulite",
    planetLabel: "Taulite",
    duration: 0,
  },
  {
    id: "meditation-5",
    title: "Vex",
    artist: "HoliznaCC0",
    src: ia("holizna-cc-0-20-minute-meditation-2", "HoliznaCC0 - 20 Minute Meditation 5.mp3"),
    cover: PLANETS.vex.map,
    planet: "vex",
    planetLabel: "Vex",
    duration: 0,
  },
  {
    id: "meditation-6",
    title: "Frostveil",
    artist: "HoliznaCC0",
    src: ia("holizna-cc-0-20-minute-meditation-2", "HoliznaCC0 - 20 Minute Meditation 6.mp3"),
    cover: PLANETS.frostveil.map,
    planet: "frostveil",
    planetLabel: "Frostveil",
    duration: 0,
  },
];
