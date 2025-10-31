import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import { Html } from "@react-three/drei";

export default function Planet({
  textureUrl,
  radius,
  distance,
  speed,
  name,
  mass,
  orbitPeriod,
  wiki,
  ref,
  setSelectedPlanet,
}) {
  useEffect(() => {
    const audio = new Audio("/sounds/planet-sound.mp3");
    audio.load();
  }, []);

  const PlanetRef = useRef();
  const audio = new Audio("/sounds/zoom-sound.mp3");

  const [hovered, setHovered] = useState(false);
  const texture = useLoader(TextureLoader, textureUrl);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    PlanetRef.current.position.x = Math.sin(t) * distance;
    PlanetRef.current.position.z = Math.cos(t) * distance;
  });

  return (
    <mesh
      ref={PlanetRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => {
        setSelectedPlanet({
          name,
          radius,
          distance,
          textureUrl,
          mass,
          orbitPeriod,
          wiki,
          ref: PlanetRef,
          position: PlanetRef.current.position.clone(),
        });

        audio.play();
      }}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial map={texture} />

      {hovered && (
        <Html position={[0, radius + 1.2, 0]} style={{ pointerEvents: "none" }}>
          <div className="tooltip">{name}</div>
        </Html>
      )}
    </mesh>
  );
}
