import { resolveCollisions, stepPlayer, type Vec2 } from "@casino/shared";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { useKeyboardInput } from "./useKeyboardInput";

/**
 * Owns the player's logical position and the ref for the player's scene object.
 * Attach the returned ref to <Player ref={...} />.
 * Must be called from a component rendered inside <Canvas>.
 */
export function usePlayerController() {
  const playerRef = useRef<Group>(null);
  const input = useKeyboardInput();
  const position = useRef<Vec2>({ x: 0, z: 0 });

  useFrame((_state, dt) => {
    const object = playerRef.current;
    if (!object) return;

    position.current = resolveCollisions(
      stepPlayer(position.current, input.current, dt),
    );
    object.position.x = position.current.x;
    object.position.z = position.current.z;
  });

  return playerRef;
}
