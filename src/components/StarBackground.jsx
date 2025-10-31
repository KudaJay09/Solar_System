import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

export default function StarCubeBackground() {
  const { scene, gl } = useThree();

  useEffect(() => {
    // The original code used CubeTextureLoader with one non-square equirectangular
    // image repeated 6 times which causes WebGL errors:
    // "Each cubemap face must have equal width and height" and mipmap generation errors.
    // Instead, load the single equirectangular panorama with TextureLoader and
    // convert it to an environment/cube texture via PMREMGenerator.

    const loader = new THREE.TextureLoader();
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();

    let mounted = true;
    loader.load(
      "/textures/8k_stars_milky_way.jpg",
      (texture) => {
        if (!mounted) return;
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.encoding = THREE.sRGBEncoding;

        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        scene.background = envMap;

        // cleanup the original texture and pmrem generator resources
        texture.dispose();
        pmremGenerator.dispose();
      },
      undefined,
      (err) => {
        console.warn("Failed to load background texture:", err);
        pmremGenerator.dispose();
      }
    );

    return () => {
      mounted = false;
    };
  }, [scene, gl]);

  return null;
}
