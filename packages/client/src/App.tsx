import { CASINO_STARTING_CHIPS } from "@casino/shared";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { FollowCamera } from "./scene/FollowCamera";
import { Floor } from "./scene/Floor";
import { Lighting } from "./scene/Lighting";
import { Player } from "./scene/Player";

export function App() {
  const playerRef = useRef<Group>(null);

  return (
    <>
      <div className="hud">Chips: {CASINO_STARTING_CHIPS}</div>
      <Canvas shadows camera={{ position: [0, 12, 10], fov: 50 }}>
        <Lighting />
        <Floor />
        <Player ref={playerRef} />
        <FollowCamera target={playerRef} />
      </Canvas>
    </>
  );
}
