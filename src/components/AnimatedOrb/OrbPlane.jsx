import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function OrbPlane() {

  const mesh = useRef();

  const texture = useLoader(
    THREE.TextureLoader,
    "/assets/athena.svg"
  );

  texture.colorSpace = THREE.SRGBColorSpace;

  texture.anisotropy = 16;

  // Create curved geometry
  const geometry = useMemo(() => {

    const geo = new THREE.PlaneGeometry(
      1.6,
      1.6,
      80,
      80
    );

    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {

      const x = pos.getX(i);
      const y = pos.getY(i);

      const distance = Math.sqrt(x * x + y * y);

      // Curve amount
      const z = -distance * distance * 0.12;

      pos.setZ(i, z);

    }

    pos.needsUpdate = true;

    geo.computeVertexNormals();

    return geo;

  }, []);

  useFrame((state) => {

    if (!mesh.current) return;

    mesh.current.rotation.y +=
      ((state.mouse.x * 0.45) - mesh.current.rotation.y) * 0.08;

    mesh.current.rotation.x +=
      ((-state.mouse.y * 0.35) - mesh.current.rotation.x) * 0.08;

    mesh.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.35) * 0.03;

  });

  return (

    <mesh
      ref={mesh}
      geometry={geometry}
      scale={1.75}
    >

      <meshPhysicalMaterial

        map={texture}

        transparent

        roughness={0.08}

        metalness={0.05}

        transmission={0.45}

        thickness={0.9}

        clearcoat={1}

        clearcoatRoughness={0}

        reflectivity={1}

        side={THREE.DoubleSide}

      />

    </mesh>

  );

}