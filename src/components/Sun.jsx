import { useRef } from "react";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import SolarFlare from "./SolarFlare";
import { SunGlowMaterial } from "../shaders/SunGlowMaterial";

export default function Sun({ textureUrl, radius }) {
  const glowRef = useRef();
  const { camera } = useThree();
  const texture = useLoader(THREE.TextureLoader, textureUrl);

  useFrame(() => {
    if (glowRef.current) {
      SunGlowMaterial.uniforms.viewVector.value = camera.position
        .clone()
        .sub(glowRef.current.position);
      glowRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      {/* Core sun with texture */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          emissive={"#ffaa00"}
          emissiveIntensity={1.5}
        />
      </mesh>

      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 2.5;
        const x = Math.cos(angle) * radius;
        const y = (Math.random() - 0.5) * 2;
        const z = Math.sin(angle) * radius;
        return (
          <SolarFlare
            key={i}
            position={[x, y, z]}
            scale={0.8 + Math.random() * 0.6}
            rotationSpeed={0.005 + Math.random() * 0.01}
          />
        );
      })}
      {/* Glow shell */}
      <mesh ref={glowRef} scale={1.8}>
        <sphereGeometry args={[radius, 64, 64]} />
        <primitive object={SunGlowMaterial} attach="material" />
      </mesh>
    </group>
  );
}
