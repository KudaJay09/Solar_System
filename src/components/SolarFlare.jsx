import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SolarFlare({
  position,
  scale = 1,
  rotationSpeed = 0.01,
}) {
  const groupRef = useRef();
  const flareSegments = useRef([]);
  const waveTime = useRef(Math.random() * Math.PI * 2);
  const baseDirection = useMemo(() => {
    // Create a random outward direction from the sun
    const dir = new THREE.Vector3(
      position[0] + (Math.random() - 0.5) * 0.5,
      position[1] + (Math.random() - 0.5) * 0.5,
      position[2] + (Math.random() - 0.5) * 0.5
    ).normalize();
    return dir;
  }, [position]);

  // Create multiple segments for the flare
  const segments = useMemo(() => {
    const segmentCount = 8 + Math.floor(Math.random() * 6); // 8-14 segments
    return Array.from({ length: segmentCount }, (_, i) => ({
      id: i,
      offset: i * 0.3, // Distance along the flare
      wavePhase: Math.random() * Math.PI * 2,
      size: (1 - i / segmentCount) * scale, // Taper from base to tip
      opacity: 1 - i / segmentCount,
    }));
  }, [scale]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    waveTime.current = clock.getElapsedTime() * 2;

    // Update each flare segment
    flareSegments.current.forEach((segmentRef, i) => {
      if (!segmentRef) return;

      const segment = segments[i];
      const time = waveTime.current + segment.wavePhase;

      // Wave motion along the flare
      const waveAmplitude = 0.3;
      const waveFrequency = 2;
      const waveOffset =
        Math.sin(time * waveFrequency + segment.offset * 3) * waveAmplitude;

      // Create undulating movement
      const lateralWave = Math.cos(time * 1.5 + segment.offset * 2) * 0.2;

      // Position along the main direction with wave distortion
      const mainPos = baseDirection
        .clone()
        .multiplyScalar(segment.offset + waveOffset);

      // Add lateral movement for wave effect
      const perpendicular1 = new THREE.Vector3(1, 0, 0)
        .cross(baseDirection)
        .normalize();
      const perpendicular2 = baseDirection
        .clone()
        .cross(perpendicular1)
        .normalize();

      const lateralPos1 = perpendicular1
        .clone()
        .multiplyScalar(lateralWave * segment.size);
      const lateralPos2 = perpendicular2
        .clone()
        .multiplyScalar(
          Math.sin(time * 3 + segment.offset) * 0.15 * segment.size
        );

      const finalPos = mainPos.add(lateralPos1).add(lateralPos2);

      segmentRef.position.copy(finalPos);

      // Dynamic scaling with pulse
      const pulse = Math.sin(time * 4 + segment.offset * 2) * 0.3 + 0.7;
      const segmentScale = segment.size * pulse;
      segmentRef.scale.set(segmentScale, segmentScale, segmentScale);

      // Dynamic opacity with flickering
      const flicker = Math.sin(time * 6 + segment.wavePhase) * 0.3 + 0.7;
      segmentRef.material.opacity = segment.opacity * flicker * 0.8;

      // Color variation based on position (hotter at base, cooler at tip)
      const colorFactor = 1 - i / segments.length;
      const r = Math.min(1, 1.0 * colorFactor + 0.3);
      const g = Math.min(1, 0.4 * colorFactor + 0.2);
      const b = Math.min(1, 0.1 * colorFactor);
      segmentRef.material.color.setRGB(r, g, b);
    });

    // Rotate the entire flare group slowly
    groupRef.current.rotation.y += rotationSpeed * 0.5;
    groupRef.current.rotation.z += rotationSpeed * 0.3;
  });

  return (
    <group ref={groupRef} position={position}>
      {segments.map((segment, i) => (
        <mesh key={segment.id} ref={(el) => (flareSegments.current[i] = el)}>
          <sphereGeometry args={[0.15, 8, 6]} />
          <meshBasicMaterial
            color="#ff4400"
            transparent
            opacity={segment.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
