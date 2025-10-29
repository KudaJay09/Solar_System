import { Line } from "@react-three/drei";
import * as THREE from "three";

export default function OrbitRing({ distance }) {
  const points = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
      )
    );
  }

  return <Line points={points} color="gray" lineWidth={1} dashed={false} />;
}
