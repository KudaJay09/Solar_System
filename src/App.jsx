import "./index.css";
import Planet from "./components/Planet";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import OrbitRing from "./components/OrbitRing";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useState } from "react";
import Sun from "./components/Sun";
import MiniMap from "./components/MiniMap";

function App() {
  const planets = [
    {
      name: "Mars",
      textureUrl: "/textures/2k_mars.jpg",
      radius: 1,
      distance: 10,
      speed: 0.5,
      mass: "6.42 × 10²³ kg",
      orbitPeriod: "687 days",
      wiki: "https://en.wikipedia.org/wiki/Mars",
    },
    {
      name: "Mercury",
      textureUrl: "/textures/8k_mercury.jpg",
      radius: 0.8,
      distance: 14,
      speed: 0.3,
      mass: "3.30 × 10²³ kg",
      orbitPeriod: "88 days",
      wiki: "https://en.wikipedia.org/wiki/Mercury_(planet)",
    },
    {
      name: "Venus",
      textureUrl: "/textures/8k_venus_surface.jpg",
      radius: 1.2,
      distance: 18,
      speed: 0.4,
      mass: "4.87 × 10²⁴ kg",
      orbitPeriod: "224.7 days",
      wiki: "https://en.wikipedia.org/wiki/Venus",
    },
    {
      name: "Jupiter",
      textureUrl: "/textures/8k_jupiter.jpg",
      radius: 2,
      distance: 25,
      speed: 0.2,
      mass: "1.90 × 10²⁷ kg",
      orbitPeriod: "11.86 years",
      wiki: "https://en.wikipedia.org/wiki/Jupiter",
    },
    {
      name: "Saturn",
      textureUrl: "/textures/8k_saturn.jpg",
      radius: 1.8,
      distance: 30,
      speed: 0.15,
      mass: "5.68 × 10²⁶ kg",
      orbitPeriod: "29.45 years",
      wiki: "https://en.wikipedia.org/wiki/Saturn",
    },
    {
      name: "Uranus",
      textureUrl: "/textures/2k_uranus.jpg",
      radius: 1.5,
      distance: 35,
      speed: 0.1,
      mass: "8.68 × 10²⁵ kg",
      orbitPeriod: "84.02 years",
      wiki: "https://en.wikipedia.org/wiki/Uranus",
    },
    {
      name: "Neptune",
      textureUrl: "/textures/2k_neptune.jpg",
      radius: 1.5,
      distance: 40,
      speed: 0.08,
      mass: "1.02 × 10²⁶ kg",
      orbitPeriod: "164.8 years",
      wiki: "https://en.wikipedia.org/wiki/Neptune",
    },
    {
      name: "Earth",
      textureUrl: "/textures/8k_earth_daymap.jpg",
      radius: 1,
      distance: 12,
      speed: 0.45,
      mass: "5.97 × 10²⁴ kg",
      orbitPeriod: "365.25 days",
      wiki: "https://en.wikipedia.org/wiki/Earth",
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
      mass: "7.35 × 10²² kg",
      orbitPeriod: "27.3 days",
      wiki: "https://en.wikipedia.org/wiki/Moon",
    },
  ];
  const controlsRef = useRef();

  const [selectedPlanet, setSelectedPlanet] = useState(null);
  return (
    <>
      <div className="hero">
        <Canvas camera={{ position: [0, 0, 50], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 0]} intensity={2} />
          <Stars />

          <OrbitControls ref={controlsRef} />
          {/* Sun and planets will go here */}
          {planets.map((planet, index) => (
            <>
              {planet.name === "Sun" ? (
                <Sun
                  key={index}
                  textureUrl={planet.textureUrl}
                  radius={planet.radius}
                />
              ) : (
                <>
                  <Planet
                    key={index}
                    {...planet}
                    setSelectedPlanet={setSelectedPlanet}
                  />
                  <OrbitRing distance={planet.distance} />
                </>
              )}
              <CameraController target={selectedPlanet} />
            </>
          ))}
        </Canvas>
      </div>

      {selectedPlanet && (
        <>
          <MiniMap
            planets={planets}
            selected={selectedPlanet?.name}
            onSelect={(planet) => {
              const audio = new Audio("/sounds/zoom.mp3");
              audio.play();
              setSelectedPlanet({
                ...planet,
                position: new THREE.Vector3(planet.distance, 0, 0),
              });
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "rgba(0,0,0,0.8)",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              maxWidth: "240px",
              fontSize: "0.9rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "1.1rem" }}>
              {selectedPlanet.name}
            </h3>
            <p>
              <strong>Radius:</strong> {selectedPlanet.radius} units
            </p>
            <p>
              <strong>Distance from Sun:</strong> {selectedPlanet.distance}{" "}
              units
            </p>
            <p>
              <strong>Mass:</strong> {selectedPlanet.mass}
            </p>
            <p>
              <strong>Orbit Period:</strong> {selectedPlanet.orbitPeriod}
            </p>
            <a
              href={selectedPlanet.wiki}
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 More Info
            </a>

            <p>
              <strong>Texture:</strong>{" "}
              {selectedPlanet.textureUrl.split("/").pop()}
            </p>
            {/* Add more facts later */}
          </div>

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
            onClick={() => {
              const audio = new Audio("/sounds/zoom-sound.mp3");
              audio.play();
              setSelectedPlanet(null);
            }}
          >
            Reset View
          </button>
        </>
      )}
    </>
  );
}

function CameraController({ target }) {
  const { camera } = useThree();
  const ref = useRef();
  useFrame(() => {
    if (target?.position) {
      camera.position.lerp(
        target.position.clone().add(new THREE.Vector3(0, 2, 5)),
        0.05
      );
      camera.lookAt(target.position);
    }
  });
  return null;
}

export default App;
