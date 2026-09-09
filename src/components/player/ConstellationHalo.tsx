import { constellationForTrack } from "@/lib/constellations";

const VIEW = 200;
const CENTER = VIEW / 2;

function project(x: number, y: number, live: boolean) {
  const scale = live ? 58 : 52;
  const anchorR = live ? 94 : 110;
  const anchorAngle = -0.62;
  const ax = CENTER + Math.cos(anchorAngle) * anchorR;
  const ay = CENTER + Math.sin(anchorAngle) * anchorR;
  return {
    x: ax + (x - 0.5) * scale,
    y: ay + (y - 0.5) * scale,
  };
}

export function ConstellationHalo({
  trackId,
  live,
  playing,
}: {
  trackId: string;
  live: boolean;
  playing: boolean;
}) {
  const figure = constellationForTrack(trackId);
  const points = figure.stars.map((star) => ({
    ...star,
    ...project(star.x, star.y, live),
  }));
  const hole = live ? 70 : 74;

  return (
    <svg
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      className="constellation-halo"
      aria-hidden
    >
      <defs>
        <clipPath id="constellation-outside-disc" clipRule="evenodd">
          <path
            d={`M -48 -48 H 248 V 248 H -48 Z M ${CENTER} ${CENTER} m -${hole} 0 a ${hole} ${hole} 0 1 0 ${hole * 2} 0 a ${hole} ${hole} 0 1 0 -${hole * 2} 0`}
          />
        </clipPath>
      </defs>
      <g
        className="constellation-spin"
        style={{ animationPlayState: playing ? "running" : "paused" }}
      >
        <g clipPath="url(#constellation-outside-disc)">
          {figure.lines.map(([a, b]) => (
            <g key={`${a}-${b}`}>
              <line
                x1={points[a].x}
                y1={points[a].y}
                x2={points[b].x}
                y2={points[b].y}
                className="constellation-line-glow"
              />
              <line
                x1={points[a].x}
                y1={points[a].y}
                x2={points[b].x}
                y2={points[b].y}
                className="constellation-line"
              />
            </g>
          ))}
        </g>
        {points.map((star, index) => {
          const r = 1.2 + (1 - star.mag) * 2.8;
          return (
            <g key={index}>
              {star.mag < 0.25 && (
                <path
                  d={`M ${star.x - r * 4.2} ${star.y} L ${star.x + r * 4.2} ${star.y} M ${star.x} ${star.y - r * 4.2} L ${star.x} ${star.y + r * 4.2}`}
                  className="constellation-spike"
                />
              )}
              <circle cx={star.x} cy={star.y} r={r * 2.8} className="constellation-halo-dot" />
              <circle cx={star.x} cy={star.y} r={r} className="constellation-star" />
              {star.label && (
                <text x={star.x + 3.6} y={star.y - 3.8} className="constellation-bayer">
                  {star.label}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
