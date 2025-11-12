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
  const pausedTimeRef = useRef(0);
  const pauseStartRef = useRef(0);

  useFrame(({ clock }) => {
    if (!PlanetRef.current) return;

    if (hovered) {
      // When hovered, pause the animation by storing when we paused
      if (pauseStartRef.current === 0) {
        pauseStartRef.current = clock.getElapsedTime();
      }
    } else {
      // When not hovered, continue animation accounting for paused time
      if (pauseStartRef.current > 0) {
        pausedTimeRef.current += clock.getElapsedTime() - pauseStartRef.current;
        pauseStartRef.current = 0;
      }
    }

    // Calculate animation time, subtracting any paused time
    const animationTime = clock.getElapsedTime() - pausedTimeRef.current;
    const t = animationTime * speed;

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
          <div
            className="bg-gray-700/80 text-white px-2.5 py-1.5 rounded text-sm whitespace-nowrap transition-opacity duration-200 cursor-default opacity-0 animate-[fadeIn_0.3s_forwards] shadow-md"
            style={{
              backgroundColor: "rgba(55, 65, 81, 0.8)",
              color: "white",
              padding: "6px 10px",
              borderRadius: "6px",
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              transition: "opacity 0.2s ease",
              cursor: "default",
              opacity: 0,
              animation: "fadeIn 0.3s forwards",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              pointerEvents: "none",
            }}
          >
            {name}
          </div>
        </Html>
      )}
    </mesh>
  );
}
