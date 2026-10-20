import { ROOM_SIZE } from "@casino/shared";

export function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[ROOM_SIZE.width, ROOM_SIZE.depth]} />
      <meshStandardMaterial color="#2b5d3a" />
    </mesh>
  );
}
