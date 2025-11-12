import "./index.css";
import Planet from "./components/Planet";
import Loading from "./components/Loading";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import OrbitRing from "./components/OrbitRing";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as React from "react";
import * as THREE from "three";
import Sun from "./components/Sun";
import MiniMap from "./components/MiniMap";
import StarBackground from "./components/StarBackground";

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
  const [showGalaxy, setShowGalaxy] = useState(false);
  const controlsRef = useRef();

  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(
    "Preparing the solar system..."
  );

  useEffect(() => {
    // Build a unique list of texture urls to preload (planets + background)
    const urls = Array.from(
      new Set(
        planets
          .map((p) => p.textureUrl)
          .concat(["/textures/8k_stars_milky_way.jpg"])
      )
    );

    let mounted = true;

    // Enable three.js caching for textures to avoid duplicate uploads
    if (THREE.Cache) THREE.Cache.enabled = true;

    const manager = new THREE.LoadingManager();
    manager.onError = (url) => {
      console.warn("Failed to load", url);
    };

    const loader = new THREE.TextureLoader(manager);
    let loadedCount = 0;
    const totalCount = urls.length;

    const getLoadingMessage = (url) => {
      if (url.includes("8k_stars_milky_way"))
        return "Loading star background...";
      if (url.includes("8k_sun")) return "Loading Sun texture...";
      if (url.includes("8k_earth")) return "Loading Earth texture...";
      if (url.includes("8k_mars") || url.includes("2k_mars"))
        return "Loading Mars texture...";
      if (url.includes("8k_mercury")) return "Loading Mercury texture...";
      if (url.includes("8k_venus")) return "Loading Venus texture...";
      if (url.includes("8k_jupiter")) return "Loading Jupiter texture...";
      if (url.includes("8k_saturn")) return "Loading Saturn texture...";
      if (url.includes("2k_uranus")) return "Loading Uranus texture...";
      if (url.includes("2k_neptune")) return "Loading Neptune texture...";
      if (url.includes("8k_moon")) return "Loading Moon texture...";
      return `Loading texture ${loadedCount + 1} of ${totalCount}...`;
    };

    Promise.all(
      urls.map(
        (u) =>
          new Promise((resolve) => {
            if (!mounted) return resolve(null);
            setLoadingMessage(getLoadingMessage(u));

            loader.load(
              u,
              (tex) => {
                loadedCount++;
                if (mounted && loadedCount < totalCount) {
                  setLoadingMessage(
                    `Loading textures... (${loadedCount}/${totalCount})`
                  );
                }
                resolve(tex);
              },
              undefined,
              () => {
                loadedCount++;
                resolve(null);
              }
            );
          })
      )
    ).then(() => {
      if (!mounted) return;
      setLoadingMessage("Initializing solar system...");
      // Allow a tiny timeout so the spinner isn't a flash for very fast loads
      setTimeout(() => setAssetsLoaded(true), 300);
    });

    return () => {
      mounted = false;
      // clear manager handlers
      manager.onError = null;
    };
  }, []);
  return (
    <>
      <div className="hero">
        {!assetsLoaded && <Loading message={loadingMessage} />}

        <React.Suspense
          fallback={<Loading message={"Loading 3D components..."} />}
        >
          <Canvas
            key={canvasKey}
            camera={{ position: [0, 0, 50], fov: 60 }}
            onCreated={({ gl }) => {
              // Attach handlers directly to the canvas to catch context lost/restored
              const canvas = gl.domElement;
              function handleLost(e) {
                e.preventDefault();
                console.warn("WebGL context lost - seamlessly restarting");
                // Automatically remount Canvas without showing error UI
                setTimeout(() => setCanvasKey((k) => k + 1), 100);
              }
              function handleRestore() {
                console.info("WebGL context restored");
                // context restored, no action needed as we already remounted
              }
              canvas.addEventListener("webglcontextlost", handleLost, false);
              canvas.addEventListener(
                "webglcontextrestored",
                handleRestore,
                false
              );

              // store references on the gl object so we can remove them if needed
              gl.__lostHandler = handleLost;
              gl.__restoreHandler = handleRestore;
            }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[0, 0, 0]} intensity={2} />
            {/* <Stars /> */}
            <StarBackground />
            <OrbitControls ref={controlsRef} />
            {/* Galaxy container: a single group that contains the GalaxyCore and all planet objects.
              This makes the GalaxyCore visually act as a container that surrounds the planets.
              GalaxyCore visibility is controlled by `showGalaxy`. */}
            <group name="galaxy-container">
              {/* <GalaxyCore position={[0, 0, 0]} scale={220} visible={showGalaxy} /> */}

              {/* Sun and planets will go here */}
              {planets.map((planet, index) => (
                <group key={index}>
                  {planet.name === "Sun" ? (
                    <Sun
                      textureUrl={planet.textureUrl}
                      radius={planet.radius}
                    />
                  ) : (
                    <>
                      <Planet
                        {...planet}
                        setSelectedPlanet={setSelectedPlanet}
                      />
                      <OrbitRing distance={planet.distance} />
                    </>
                  )}
                </group>
              ))}
            </group>

            {/* Single CameraController instance to update camera-follow and galaxy visibility */}
            <CameraController
              target={selectedPlanet}
              setShowGalaxy={setShowGalaxy}
            />
          </Canvas>
        </React.Suspense>
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

function CameraController({ target, setShowGalaxy }) {
  const { camera } = useThree();
  const ref = useRef();
  useFrame(() => {
    if (target?.ref?.current) {
      const offset = new THREE.Vector3(0, 2, 5);
      const targetPos = target.ref.current.position.clone().add(offset);
      camera.position.lerp(targetPos, 0.05);
      camera.lookAt(target.ref.current.position);
    }

    const distance = camera.position.length();
    if (setShowGalaxy) {
      setShowGalaxy(distance > 700);
    }
  });
  return null;
}

export default App;
