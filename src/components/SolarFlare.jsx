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
  const eruption = useRef({
    phase: Math.random() * Math.PI * 2, // Random start phase
    cycleLength: 4 + Math.random() * 4, // 4-8 second cycles
    maxLength: 3 + Math.random() * 4, // Maximum flare length
  });

  const baseDirection = useMemo(() => {
    // Create a random outward direction from the sun surface
    const dir = new THREE.Vector3(
      position[0] + (Math.random() - 0.5) * 0.3,
      position[1] + (Math.random() - 0.5) * 0.3,
      position[2] + (Math.random() - 0.5) * 0.3
    ).normalize();
    return dir;
  }, [position]);

  // Create snake segments
  const segments = useMemo(() => {
    const segmentCount = 12 + Math.floor(Math.random() * 8); // 12-20 segments for smoother snake
    return Array.from({ length: segmentCount }, (_, i) => ({
      id: i,
      segmentIndex: i,
      baseDistance: i * 0.25, // Closer segments for smoother snake
      wavePhase: Math.random() * Math.PI * 2,
      snakePhase: i * 0.3, // Phase offset for snake wave propagation
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const time = clock.getElapsedTime();
    const cycleTime =
      (time + eruption.current.phase) / eruption.current.cycleLength;
    const cycleProgress = (Math.sin(cycleTime * Math.PI * 2) + 1) / 2; // 0 to 1 cycle

    // Eruption lifecycle: 0 = dormant, 0.2 = emerging, 0.8 = peak, 1.0 = fading
    let activeLength, intensity;

    if (cycleProgress < 0.2) {
      // Eruption starting
      activeLength = (cycleProgress / 0.2) * eruption.current.maxLength * 0.3;
      intensity = cycleProgress / 0.2;
    } else if (cycleProgress < 0.8) {
      // Flare extending and active
      const extendProgress = (cycleProgress - 0.2) / 0.6;
      activeLength = (0.3 + extendProgress * 0.7) * eruption.current.maxLength;
      intensity = 0.8 + 0.2 * Math.sin(time * 8); // Flickering at peak
    } else {
      // Flare fading away
      const fadeProgress = (cycleProgress - 0.8) / 0.2;
      activeLength = (1 - fadeProgress * 0.8) * eruption.current.maxLength;
      intensity = Math.max(0, 1 - fadeProgress * 2);
    }

    // Update each segment
    flareSegments.current.forEach((segmentRef, i) => {
      if (!segmentRef) return;

      const segment = segments[i];
      const segmentDistance = segment.baseDistance;

      // Check if this segment should be visible based on active flare length
      const isActive = segmentDistance <= activeLength;

      if (!isActive) {
        segmentRef.visible = false;
        return;
      }

      segmentRef.visible = true;

      // Snake wave motion - each segment follows the one before it
      const snakeWaveTime = time * 2 - segment.snakePhase;
      const snakeAmplitude =
        0.4 * (1 - segmentDistance / eruption.current.maxLength);

      // Primary snake wave (side to side)
      const snakeWave1 =
        Math.sin(snakeWaveTime * 3 + segmentDistance * 8) * snakeAmplitude;
      // Secondary wave (up and down)
      const snakeWave2 =
        Math.cos(snakeWaveTime * 2.5 + segmentDistance * 6) *
        snakeAmplitude *
        0.7;
      // Tertiary wave (twist motion)
      const snakeWave3 =
        Math.sin(snakeWaveTime * 4 + segmentDistance * 10) *
        snakeAmplitude *
        0.5;

      // Create perpendicular vectors for snake motion
      const perpendicular1 = new THREE.Vector3(1, 0, 0)
        .cross(baseDirection)
        .normalize();
      const perpendicular2 = baseDirection
        .clone()
        .cross(perpendicular1)
        .normalize();

      // Build the snake position
      const basePos = baseDirection.clone().multiplyScalar(segmentDistance);
      const snakeOffset1 = perpendicular1.clone().multiplyScalar(snakeWave1);
      const snakeOffset2 = perpendicular2.clone().multiplyScalar(snakeWave2);
      const twistOffset = perpendicular1
        .clone()
        .multiplyScalar(snakeWave3 * 0.3);

      const finalPos = basePos
        .add(snakeOffset1)
        .add(snakeOffset2)
        .add(twistOffset);
      segmentRef.position.copy(finalPos);

      // Segment size - tapers toward the tip and pulses
      const tapering = Math.max(
        0.1,
        1 - segmentDistance / eruption.current.maxLength
      );
      const pulse = 0.8 + 0.2 * Math.sin(time * 12 + segment.wavePhase);
      const segmentScale = tapering * pulse * scale * 0.8;
      segmentRef.scale.set(segmentScale, segmentScale, segmentScale);

      // Opacity - fades toward tip and with overall intensity
      const distanceFade = Math.max(0, 1 - segmentDistance / activeLength);
      const flickerFade = 0.7 + 0.3 * Math.sin(time * 15 + segment.wavePhase);
      const finalOpacity = distanceFade * intensity * flickerFade * 0.9;
      segmentRef.material.opacity = Math.max(0, finalOpacity);

      // Color temperature - hot orange at base, cooler red at tip
      const temperature = Math.max(
        0.2,
        1 - segmentDistance / eruption.current.maxLength
      );
      const r = Math.min(1, 1.0 * temperature + 0.2);
      const g = Math.min(1, 0.6 * temperature * temperature + 0.1);
      const b = Math.min(0.3, 0.1 * temperature);
      segmentRef.material.color.setRGB(r, g, b);
    });

    // Gentle rotation of the entire flare
    groupRef.current.rotation.y += rotationSpeed * 0.2;
  });

  return (
    <group ref={groupRef} position={position}>
      {segments.map((segment, i) => (
        <mesh
          key={segment.id}
          ref={(el) => (flareSegments.current[i] = el)}
          visible={false} // Start invisible
        >
          <sphereGeometry args={[0.12, 8, 6]} />
          <meshBasicMaterial
            color="#ff3300"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
