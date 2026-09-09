export type SkyStar = {
  x: number;
  y: number;
  mag: number;
  label?: string;
};

export type Constellation = {
  id: string;
  name: string;
  latin: string;
  stars: SkyStar[];
  lines: Array<[number, number]>;
};

const lyra: Constellation = {
  id: "lyra",
  name: "Лира",
  latin: "Lyra",
  stars: [
    { x: 0.5, y: 0.06, mag: 0.02, label: "α" },
    { x: 0.32, y: 0.4, mag: 0.55 },
    { x: 0.68, y: 0.36, mag: 0.5 },
    { x: 0.72, y: 0.72, mag: 0.48 },
    { x: 0.34, y: 0.78, mag: 0.52 },
  ],
  lines: [
    [0, 1],
    [0, 2],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 1],
  ],
};

const cassiopeia: Constellation = {
  id: "cassiopeia",
  name: "Кассиопея",
  latin: "Cassiopeia",
  stars: [
    { x: 0.04, y: 0.58, mag: 0.42 },
    { x: 0.26, y: 0.16, mag: 0.22, label: "α" },
    { x: 0.5, y: 0.5, mag: 0.32 },
    { x: 0.74, y: 0.1, mag: 0.18 },
    { x: 0.96, y: 0.44, mag: 0.28 },
  ],
  lines: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
  ],
};

const orion: Constellation = {
  id: "orion",
  name: "Орион",
  latin: "Orion",
  stars: [
    { x: 0.22, y: 0.14, mag: 0.06, label: "α" },
    { x: 0.74, y: 0.16, mag: 0.22, label: "γ" },
    { x: 0.38, y: 0.5, mag: 0.34 },
    { x: 0.5, y: 0.48, mag: 0.26 },
    { x: 0.62, y: 0.46, mag: 0.32 },
    { x: 0.28, y: 0.86, mag: 0.3 },
    { x: 0.76, y: 0.88, mag: 0.08, label: "β" },
    { x: 0.48, y: 0.02, mag: 0.5 },
  ],
  lines: [
    [7, 0],
    [7, 1],
    [0, 2],
    [1, 4],
    [2, 3],
    [3, 4],
    [2, 5],
    [4, 6],
  ],
};

const andromeda: Constellation = {
  id: "andromeda",
  name: "Андромеда",
  latin: "Andromeda",
  stars: [
    { x: 0.06, y: 0.2, mag: 0.18, label: "α" },
    { x: 0.28, y: 0.38, mag: 0.46 },
    { x: 0.5, y: 0.52, mag: 0.28, label: "β" },
    { x: 0.7, y: 0.3, mag: 0.5 },
    { x: 0.9, y: 0.22, mag: 0.24, label: "γ" },
    { x: 0.62, y: 0.74, mag: 0.55 },
    { x: 0.78, y: 0.62, mag: 0.6 },
  ],
  lines: [
    [0, 1],
    [1, 2],
    [2, 4],
    [2, 3],
    [3, 6],
    [2, 5],
  ],
};

const scorpius: Constellation = {
  id: "scorpius",
  name: "Скорпион",
  latin: "Scorpius",
  stars: [
    { x: 0.08, y: 0.08, mag: 0.4 },
    { x: 0.2, y: 0.22, mag: 0.36 },
    { x: 0.32, y: 0.1, mag: 0.32 },
    { x: 0.42, y: 0.28, mag: 0.38 },
    { x: 0.5, y: 0.42, mag: 0.04, label: "α" },
    { x: 0.58, y: 0.56, mag: 0.34 },
    { x: 0.6, y: 0.7, mag: 0.4 },
    { x: 0.52, y: 0.84, mag: 0.36 },
    { x: 0.68, y: 0.9, mag: 0.3 },
    { x: 0.84, y: 0.8, mag: 0.28 },
  ],
  lines: [
    [0, 1],
    [2, 1],
    [1, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 9],
  ],
};

const cygnus: Constellation = {
  id: "cygnus",
  name: "Лебедь",
  latin: "Cygnus",
  stars: [
    { x: 0.5, y: 0.04, mag: 0.08, label: "α" },
    { x: 0.5, y: 0.4, mag: 0.32 },
    { x: 0.16, y: 0.42, mag: 0.36 },
    { x: 0.84, y: 0.38, mag: 0.34 },
    { x: 0.5, y: 0.9, mag: 0.26, label: "β" },
  ],
  lines: [
    [0, 1],
    [1, 4],
    [2, 1],
    [1, 3],
  ],
};

const BY_TRACK: Record<string, Constellation> = {
  "star-walk-meditation": lyra,
  "ease-into-night": cassiopeia,
  "space-traveler": orion,
  "deep-space-one": andromeda,
  "drone-zone": scorpius,
  "space-station": cygnus,
};

export function constellationForTrack(id: string): Constellation {
  return BY_TRACK[id] ?? lyra;
}
