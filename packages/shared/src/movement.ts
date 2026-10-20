export type Vec2 = {
  readonly x: number;
  readonly z: number;
};

export type MovementInput = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
};

/** Player speed in world units per second. */
export const PLAYER_SPEED = 6;

/** Player footprint: a square of this side length, in world units. */
export const PLAYER_SIZE = 1;

/** Largest time step we will simulate in one call, in seconds (guards against tab-switch spikes). */
const MAX_DT = 0.1;

/**
 * Pure movement step on the floor plane (XZ).
 * Forward is -Z, right is +X (matches the three.js convention used by the client).
 */
export function stepPlayer(
  pos: Vec2,
  input: Readonly<MovementInput>,
  dt: number,
): Vec2 {
  const dx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const dz = (input.back ? 1 : 0) - (input.forward ? 1 : 0);

  if (dx === 0 && dz === 0) return pos;

  const length = Math.hypot(dx, dz); // 1 for straight, √2 for diagonal
  const distance = PLAYER_SPEED * Math.min(dt, MAX_DT);

  return {
    x: pos.x + (dx / length) * distance,
    z: pos.z + (dz / length) * distance,
  };
}
