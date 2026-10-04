export type PlanetId =
  | "earth"
  | "jupiter"
  | "saturn"
  | "mars"
  | "venus"
  | "neptune"
  | "uranus"
  | "mercury"
  | "moon"
  | "adrian"
  | "taulite"
  | "vex"
  | "frostveil";

export type PlanetDef = {
  map: string;
  normal?: string;
  clouds?: string;
  rings?: boolean;
  atmosphere: string;
};

function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

export const PLANETS: Record<PlanetId, PlanetDef> = {
  earth: {
    map: asset("/planets/earth-day.jpg"),
    normal: asset("/planets/earth-normal.jpg"),
    clouds: asset("/planets/earth-clouds.jpg"),
    atmosphere: "#7ec8ff",
  },
  jupiter: {
    map: asset("/planets/jupiter.jpg"),
    atmosphere: "#e0b07a",
  },
  saturn: {
    map: asset("/planets/planet-saturn-map.png"),
    rings: true,
    atmosphere: "#ead6a6",
  },
  mars: {
    map: asset("/planets/mars.jpg"),
    atmosphere: "#d98962",
  },
  venus: {
    map: asset("/planets/venus.jpg"),
    atmosphere: "#e8c98a",
  },
  neptune: {
    map: asset("/planets/neptune.jpg"),
    atmosphere: "#6ea4ff",
  },
  uranus: {
    map: asset("/planets/uranus.jpg"),
    atmosphere: "#9fe7e0",
  },
  mercury: {
    map: asset("/planets/mercury.jpg"),
    atmosphere: "#c4b8a8",
  },
  moon: {
    map: asset("/planets/moon.jpg"),
    atmosphere: "#d5d2cc",
  },
  adrian: {
    map: asset("/planets/adrian.png"),
    atmosphere: "#c47a4a",
  },
  taulite: {
    map: asset("/planets/taulite.png"),
    atmosphere: "#5ad0c8",
  },
  vex: {
    map: asset("/planets/vex.png"),
    atmosphere: "#b48cff",
  },
  frostveil: {
    map: asset("/planets/frostveil.png"),
    atmosphere: "#b9e7ff",
  },
};
