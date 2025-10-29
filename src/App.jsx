import "./index.css";
import Planet from "./components/Planet";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import OrbitRing from "./components/OrbitRing";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useState } from "react";

function App() {
  const planets = [
    {
      name: "Mars",
      textureUrl: "/textures/2k_mars.jpg",
      radius: 1,
      distance: 10,
      speed: 0.5,
    },
    {
      name: "Mercury",
      textureUrl: "/textures/8k_mercury.jpg",
      radius: 0.8,
      distance: 14,
      speed: 0.3,
    },
    {
      name: "Venus",
      textureUrl: "/textures/8k_venus_surface.jpg",
      radius: 1.2,
      distance: 18,
      speed: 0.4,
    },
    {
      name: "Jupiter",
      textureUrl: "/textures/8k_jupiter.jpg",
      radius: 2,
      distance: 25,
      speed: 0.2,
    },
    {
      name: "Saturn",
      textureUrl: "/textures/8k_saturn.jpg",
      radius: 1.8,
      distance: 30,
      speed: 0.15,
    },
    {
      name: "Uranus",
      textureUrl: "/textures/2k_uranus.jpg",
      radius: 1.5,
      distance: 35,
      speed: 0.1,
    },
    {
      name: "Neptune",
      textureUrl: "/textures/2k_neptune.jpg",
      radius: 1.5,
      distance: 40,
      speed: 0.08,
    },
    {
      name: "Earth",
      textureUrl: "/textures/8k_earth_daymap.jpg",
      radius: 1,
      distance: 12,
      speed: 0.45,
    },
    {
      name: "Sun",
      textureUrl: "/textures/8k_sun.jpg",
      radius: 3,
      distance: 0,
      speed: 0,
    },
    {
      name: "Moon",
      textureUrl: "/textures/8k_moon.jpg",
      radius: 0.27,
      distance: 13,
      speed: 0.6,
    },
  ];
  const controlsRef = useRef();

  const [selectedPlanet, setSelectedPlanet] = useState(null);
  return (
    <>
      <div className="hero">
        <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 0]} intensity={2} />
          <Stars />
          <OrbitControls ref={controlsRef} />
          {/* Sun and planets will go here */}
          {planets.map((planet, index) => (
            <>
              <Planet
                key={index}
                {...planet}
                setSelectedPlanet={setSelectedPlanet}
              />
              <OrbitRing distance={planet.distance} />
              <CameraController
                target={selectedPlanet}
                controlsRef={controlsRef}
              />
            </>
          ))}
        </Canvas>
      </div>
      {selectedPlanet && (
        <button
          style={{
            position: "absolute",
            top: "6px",
            left: "8px",
            color: "white",
            fontWeight: "600",
            borderRadius: "6px",
            background: "red",
            padding: "4px 6px",
          }}
          onClick={() => setSelectedPlanet(null)}
        >
          Reset View
        </button>
      )}
    </>
  );
}

function ease(current, target, factor = 0.1) {
  return current + (target - current) * factor;
}

function CameraController({ target, controlsRef }) {
  const { camera } = useThree();

  useFrame(() => {
    const destination = target
      ? target.clone().add(new THREE.Vector3(0, 2, 5))
      : new THREE.Vector3(0, 0, 20);

    camera.position.set(
      ease(camera.position.x, destination.x),
      ease(camera.position.y, destination.y),
      ease(camera.position.z, destination.z)
    );

    // Instead of camera.lookAt, update OrbitControls target
    if (controlsRef.current) {
      controlsRef.current.target.lerp(
        target || new THREE.Vector3(0, 0, 0),
        0.1
      );
      controlsRef.current.update();
    }
  });

  return null;
}

export default App;
