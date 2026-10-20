import { CASINO_STARTING_CHIPS } from "@casino/shared";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./scene/Scene";

export function App() {
  return (
    <>
      <div className="hud">Starting chips: {CASINO_STARTING_CHIPS}</div>
      <Canvas shadows camera={{ position: [0, 12, 10], fov: 50 }}>
        <Scene />
      </Canvas>
    </>
  );
}
