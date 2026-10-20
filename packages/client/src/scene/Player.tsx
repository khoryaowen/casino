import type { Ref } from "react";
import type { Group } from "three";

const PLAYER_SIZE = 1;

type PlayerProps = {
  ref?: Ref<Group>;
};

export function Player({ ref }: PlayerProps) {
  return (
    <group ref={ref}>
      <mesh position-y={PLAYER_SIZE / 2} castShadow>
        <boxGeometry args={[PLAYER_SIZE, PLAYER_SIZE, PLAYER_SIZE]} />
        <meshStandardMaterial color="#e8c547" />
      </mesh>
    </group>
  );
}
