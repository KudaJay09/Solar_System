import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SolarFlare({
  position,
  scale = 1,
  rotationSpeed = 0.01,
}) {
  const ref = useRef();
  const pulse = useRef(Math.random() * Math.PI * 2);

  useFrame(() => {
    pulse.current += 0.05;
    const s = Math.sin(pulse.current) * 0.5 + 1;
    ref.current.scale.set(s * scale, s * scale, s * scale);
    ref.current.material.opacity = Math.max(0, Math.sin(pulse.current));
    ref.current.rotation.y += rotationSpeed;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={[
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ]}
    >
      <coneGeometry args={[0.5, 2, 16]} />
      <meshBasicMaterial
        color={"#ff6600"}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}
