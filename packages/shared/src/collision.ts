import {
  CASINO_LAYOUT,
  type Aabb,
  type CasinoLayout,
  type TableDef,
} from "./layout";
import { PLAYER_SIZE, type Vec2 } from "./movement";

/** Max resolve passes; settles cases where fixing one overlap creates another. */
const MAX_ITERATIONS = 4;

function boxBounds(table: TableDef): Aabb {
  return {
    minX: table.x - table.width / 2,
    maxX: table.x + table.width / 2,
    minZ: table.z - table.depth / 2,
    maxZ: table.z + table.depth / 2,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Pushes the player's square out of a box table along the axis of least penetration.
 * Returns the new position, or null if there is no overlap.
 */
function pushOutOfBox(
  x: number,
  z: number,
  half: number,
  table: TableDef,
): Vec2 | null {
  const b = boxBounds(table);
  const overlapX = Math.min(x + half, b.maxX) - Math.max(x - half, b.minX);
  const overlapZ = Math.min(z + half, b.maxZ) - Math.max(z - half, b.minZ);
  if (overlapX <= 0 || overlapZ <= 0) return null;

  if (overlapX <= overlapZ) {
    return { x: x + (x < (b.minX + b.maxX) / 2 ? -overlapX : overlapX), z };
  }
  return { x, z: z + (z < (b.minZ + b.maxZ) / 2 ? -overlapZ : overlapZ) };
}

/**
 * Pushes the player's square out of a round table along the contact normal.
 * Returns the new position, or null if there is no overlap.
 */
function pushOutOfCircle(
  x: number,
  z: number,
  half: number,
  table: TableDef,
): Vec2 | null {
  const radius = table.width / 2;

  // Point on the player's square closest to the circle's center
  const nearestX = clamp(table.x, x - half, x + half);
  const nearestZ = clamp(table.z, z - half, z + half);
  const dx = nearestX - table.x;
  const dz = nearestZ - table.z;
  const dist = Math.hypot(dx, dz);

  if (dist >= radius) return null;

  if (dist > 0) {
    const push = (radius - dist) / dist;
    return { x: x + dx * push, z: z + dz * push };
  }

  // Degenerate case: the circle's center is inside the player's square. Eject radially.
  const ox = x - table.x;
  const oz = z - table.z;
  const len = Math.hypot(ox, oz);
  const dirX = len > 0 ? ox / len : 1;
  const dirZ = len > 0 ? oz / len : 0;
  const clearance = radius + half * Math.SQRT2;
  return { x: table.x + dirX * clearance, z: table.z + dirZ * clearance };
}

/**
 * Returns a position that is inside the room and not overlapping any table.
 * Box tables resolve along the axis of least penetration; round tables along the
 * contact normal. Either way, movement parallel to the surface is preserved, so
 * the player slides instead of sticking.
 */
export function resolveCollisions(
  pos: Vec2,
  layout: CasinoLayout = CASINO_LAYOUT,
): Vec2 {
  const half = PLAYER_SIZE / 2;
  const { room } = layout;
  let x = pos.x;
  let z = pos.z;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    let moved = false;

    for (const table of layout.tables) {
      const pushed =
        table.shape === "round"
          ? pushOutOfCircle(x, z, half, table)
          : pushOutOfBox(x, z, half, table);
      if (pushed) {
        x = pushed.x;
        z = pushed.z;
        moved = true;
      }
    }

    // Keep the whole cube inside the room walls
    const clampedX = clamp(x, room.minX + half, room.maxX - half);
    const clampedZ = clamp(z, room.minZ + half, room.maxZ - half);
    if (clampedX !== x || clampedZ !== z) {
      x = clampedX;
      z = clampedZ;
      moved = true;
    }

    if (!moved) break;
  }

  return { x, z };
}
