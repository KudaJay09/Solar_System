import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function GalaxyCore({ position = [0, 0, -10], scale = 40 }) {
  const layers = [
    { texture: "/textures/galaxy_core.jpg", speed: 0.0005, opacity: 0.5 },
    { texture: "/textures/galaxy_core.jpg", speed: -0.0003, opacity: 0.4 },
    { texture: "/textures/galaxy_core.jpg", speed: 0.0007, opacity: 0.3 },
  ];

  const refs = useRef([]);

  useFrame(() => {
    refs.current.forEach((ref, i) => {
      if (ref) {
        ref.rotation.z += layers[i].speed;
        const pulse =
          Math.sin(Date.now() * 0.001 + i) * 0.2 + layers[i].opacity;
        ref.material.opacity = pulse;
      }
    });
  });

  return (
    <>
      {layers.map((layer, i) => {
        const texture = useLoader(THREE.TextureLoader, layer.texture);
        return (
          <mesh
            key={i}
            ref={(el) => (refs.current[i] = el)}
            position={position}
            rotation={[0, 0, 0]}
          >
            <planeGeometry args={[scale, scale]} />
            <meshBasicMaterial
              map={texture}
              transparent
              opacity={layer.opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </>
  );
}
