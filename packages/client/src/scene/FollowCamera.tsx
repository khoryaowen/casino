import { useFrame, useThree } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import { Vector3, type Object3D } from "three";

const OFFSET = new Vector3(0, 12, 10);
const DAMPING = 5;

type FollowCameraProps = {
  target: RefObject<Object3D | null>;
};

export function FollowCamera({ target }: FollowCameraProps) {
  const camera = useThree((state) => state.camera);
  const desired = useRef(new Vector3());

  useFrame((_, dt) => {
    const t = target.current;
    if (!t) return;

    desired.current.copy(t.position).add(OFFSET);
    camera.position.lerp(desired.current, 1 - Math.exp(-DAMPING * dt));
    camera.lookAt(t.position);
  });

  return null;
}
