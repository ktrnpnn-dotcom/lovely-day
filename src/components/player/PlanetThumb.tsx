import { PlanetGlobe } from "@/components/player/PlanetGlobe";
import { type PlanetId } from "@/lib/planets";

export function PlanetThumb({
  planet,
  spinning = false,
}: {
  planet: PlanetId;
  spinning?: boolean;
}) {
  return (
    <span className="planet-thumb-globe">
      <PlanetGlobe planet={planet} spinning={spinning} interactive={false} compact />
    </span>
  );
}
