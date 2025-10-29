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
  setSelectedPlanet,
}) {
  useEffect(() => {
    const audio = new Audio("/sounds/planet-sound.mp3");
    audio.load();
  }, []);

  const ref = useRef();
  const audio = new Audio("/sounds/planet-sound.mp3");

  const [hovered, setHovered] = useState(false);
  const texture = useLoader(TextureLoader, textureUrl);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.position.x = Math.sin(t) * distance;
    ref.current.position.z = Math.cos(t) * distance;
  });

  return (
    <mesh
      ref={ref}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => {
        setSelectedPlanet(ref.current.position.clone());
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
