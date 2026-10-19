import { CASINO_STARTING_CHIPS } from "@casino/shared";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

function SpinningCube() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.8;
    meshRef.current.rotation.y += delta * 1.2;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#e63946" />
    </mesh>
  );
}

export function App() {
  return (
    <>
      <div className="hud">Starting chips: {CASINO_STARTING_CHIPS}</div>
      <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={1.5} />
        <SpinningCube />
        <OrbitControls />
      </Canvas>
    </>
  );
}
