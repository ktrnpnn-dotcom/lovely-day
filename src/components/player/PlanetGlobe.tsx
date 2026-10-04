import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree, type ThreeEvent } from "@react-three/fiber";
import { DoubleSide, RepeatWrapping, SRGBColorSpace, TextureLoader, CanvasTexture, type Group, type Mesh } from "three";
import { PLANETS, type PlanetId } from "@/lib/planets";

function makeRingTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new CanvasTexture(canvas);
  const cx = 512;
  const cy = 512;
  ctx.clearRect(0, 0, 1024, 1024);
  for (let r = 210; r < 500; r++) {
    const t = (r - 210) / 290;
    let alpha = 0.35 + Math.sin(t * 42) * 0.12;
    if (t > 0.42 && t < 0.5) alpha *= 0.15;
    if (t > 0.78) alpha *= 1 - (t - 0.78) / 0.22;
    ctx.strokeStyle = `rgba(226, 204, 156, ${Math.max(0, alpha)})`;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function CameraRig({ far }: { far: boolean }) {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(0, 0.06, far ? 5.15 : 3.55);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, far]);
  return null;
}

function PlanetMesh({ planet, spinning }: { planet: PlanetId; spinning: boolean }) {
  const def = PLANETS[planet];
  const group = useRef<Group>(null);
  const cloudsRef = useRef<Mesh>(null);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const urls = useMemo(
    () => [def.map, def.normal, def.clouds].filter(Boolean) as string[],
    [def.map, def.normal, def.clouds],
  );
  const loaded = useLoader(TextureLoader, urls);
  const list = (Array.isArray(loaded) ? loaded : [loaded]) as import("three").Texture[];
  const map = list[0];
  let cursor = 1;
  const normal = def.normal ? list[cursor++] : null;
  const clouds = def.clouds ? list[cursor++] : null;
  const rings = useMemo(() => (def.rings ? makeRingTexture() : null), [def.rings]);

  map.colorSpace = SRGBColorSpace;
  map.anisotropy = 8;
  if (clouds) {
    clouds.colorSpace = SRGBColorSpace;
    clouds.wrapS = RepeatWrapping;
    clouds.anisotropy = 4;
  }

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    if (dragging.current) return;
    node.rotation.y += velocity.current.x;
    node.rotation.x += velocity.current.y;
    velocity.current.x *= 0.94;
    velocity.current.y *= 0.94;
    if (spinning) node.rotation.y += delta * 0.18;
    else node.rotation.y += delta * 0.045;
    node.rotation.x = Math.max(-1.05, Math.min(1.05, node.rotation.x));
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.05;
  });

  const onDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    dragging.current = true;
    last.current = { x: event.clientX, y: event.clientY };
  };

  const onUp = () => {
    dragging.current = false;
  };

  const onMove = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging.current || !group.current) return;
    const dx = event.clientX - last.current.x;
    const dy = event.clientY - last.current.y;
    group.current.rotation.y += dx * 0.008;
    group.current.rotation.x += dy * 0.008;
    velocity.current = { x: dx * 0.00045, y: dy * 0.00045 };
    last.current = { x: event.clientX, y: event.clientY };
  };

  return (
      <group
      ref={group}
      scale={0.92}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerMove={onMove}
    >
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={map}
          normalMap={normal ?? undefined}
          roughness={0.72}
          metalness={0.08}
        />
      </mesh>
      {clouds && (
        <mesh ref={cloudsRef} scale={1.018}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.42} depthWrite={false} />
        </mesh>
      )}
      <mesh scale={1.06}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={def.atmosphere} transparent opacity={0.11} side={DoubleSide} />
      </mesh>
      {rings && (
        <mesh rotation={[Math.PI / 2.32, 0.08, 0.12]}>
          <ringGeometry args={[1.28, 2.22, 128]} />
          <meshBasicMaterial map={rings} transparent side={DoubleSide} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

export function PlanetGlobe({
  planet,
  spinning,
}: {
  planet: PlanetId;
  spinning: boolean;
}) {
  return (
    <div className="planet-canvas">
      <Canvas
        key={planet}
        camera={{ position: [0, 0.06, planet === "saturn" ? 5.15 : 3.55], fov: 28 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.75]}
        style={{ touchAction: "none", width: "100%", height: "100%" }}
      >
        <CameraRig far={planet === "saturn"} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[-3.2, 1.4, 4]} intensity={1.7} />
        <directionalLight position={[2.4, -1, -2]} intensity={0.18} />
        <Suspense fallback={null}>
          <PlanetMesh key={planet} planet={planet} spinning={spinning} />
        </Suspense>
      </Canvas>
    </div>
  );
}
