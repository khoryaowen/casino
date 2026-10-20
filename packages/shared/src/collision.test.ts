import { describe, expect, it } from "vitest";
import { resolveCollisions } from "./collision";
import { CASINO_LAYOUT, type CasinoLayout } from "./layout";
import { PLAYER_SIZE } from "./movement";

const half = PLAYER_SIZE / 2;
const room = { minX: -10, maxX: 10, minZ: -10, maxZ: 10 };

const emptyLayout: CasinoLayout = { room, tables: [] };

// Footprint spans x: -2..2, z: -1..1
const boxLayout: CasinoLayout = {
  room,
  tables: [
    {
      id: "box",
      kind: "blackjack",
      shape: "box",
      x: 0,
      z: 0,
      width: 4,
      depth: 2,
    },
  ],
};

// Radius 2, centered at the origin
const roundLayout: CasinoLayout = {
  room,
  tables: [
    {
      id: "round",
      kind: "poker",
      shape: "round",
      x: 0,
      z: 0,
      width: 4,
      depth: 4,
    },
  ],
};

describe("resolveCollisions: room walls", () => {
  it("leaves a position in open space unchanged", () => {
    expect(resolveCollisions({ x: 3, z: -4 }, emptyLayout)).toEqual({
      x: 3,
      z: -4,
    });
  });

  it("keeps the whole cube inside every wall", () => {
    expect(resolveCollisions({ x: 100, z: 0 }, emptyLayout).x).toBeCloseTo(
      room.maxX - half,
    );
    expect(resolveCollisions({ x: -100, z: 0 }, emptyLayout).x).toBeCloseTo(
      room.minX + half,
    );
    expect(resolveCollisions({ x: 0, z: 100 }, emptyLayout).z).toBeCloseTo(
      room.maxZ - half,
    );
    expect(resolveCollisions({ x: 0, z: -100 }, emptyLayout).z).toBeCloseTo(
      room.minZ + half,
    );
  });
});

describe("resolveCollisions: box tables", () => {
  it("pushes the player out along the axis of least penetration, leaving them flush", () => {
    // Just inside the north face (z = -1)
    const result = resolveCollisions({ x: 0, z: -0.8 }, boxLayout);
    expect(result.x).toBeCloseTo(0);
    expect(result.z).toBeCloseTo(-1 - half);
  });

  it("preserves movement parallel to the surface (slides)", () => {
    const result = resolveCollisions({ x: 1.3, z: -0.8 }, boxLayout);
    expect(result.x).toBeCloseTo(1.3);
    expect(result.z).toBeCloseTo(-1 - half);
  });

  it("does not move a player who is exactly touching", () => {
    const touching = { x: 0, z: -1 - half };
    const result = resolveCollisions(touching, boxLayout);
    expect(result.x).toBeCloseTo(touching.x);
    expect(result.z).toBeCloseTo(touching.z);
  });
});

describe("resolveCollisions: round tables", () => {
  it("pushes the player out along the contact normal", () => {
    const result = resolveCollisions({ x: 1.7, z: 0 }, roundLayout);
    expect(result.x).toBeCloseTo(2 + half);
    expect(result.z).toBeCloseTo(0);
  });

  it("does not block the empty corner of the bounding square (regression)", () => {
    // Inside the table's bounding square but outside the circle
    const pos = { x: 2, z: 2 };
    expect(resolveCollisions(pos, roundLayout)).toEqual(pos);
  });

  it("ejects a player whose box contains the table's center", () => {
    const result = resolveCollisions({ x: 0, z: 0 }, roundLayout);
    // Nearest point of the player's box must now be at least one radius from the center
    const nearestX = Math.min(Math.max(0, result.x - half), result.x + half);
    const nearestZ = Math.min(Math.max(0, result.z - half), result.z + half);
    expect(Math.hypot(nearestX, nearestZ)).toBeGreaterThanOrEqual(2 - 1e-6);
  });
});

describe("resolveCollisions: real casino layout", () => {
  it("never leaves the player inside a table or outside the room", () => {
    const epsilon = 1e-6;
    const { room: bounds, tables } = CASINO_LAYOUT;

    for (let x = bounds.minX - 2; x <= bounds.maxX + 2; x += 0.25) {
      for (let z = bounds.minZ - 2; z <= bounds.maxZ + 2; z += 0.25) {
        const p = resolveCollisions({ x, z });

        expect(p.x).toBeGreaterThanOrEqual(bounds.minX + half - epsilon);
        expect(p.x).toBeLessThanOrEqual(bounds.maxX - half + epsilon);
        expect(p.z).toBeGreaterThanOrEqual(bounds.minZ + half - epsilon);
        expect(p.z).toBeLessThanOrEqual(bounds.maxZ - half + epsilon);

        for (const table of tables) {
          if (table.shape === "round") {
            const nearestX = Math.min(
              Math.max(table.x, p.x - half),
              p.x + half,
            );
            const nearestZ = Math.min(
              Math.max(table.z, p.z - half),
              p.z + half,
            );
            const dist = Math.hypot(nearestX - table.x, nearestZ - table.z);
            expect(dist).toBeGreaterThanOrEqual(table.width / 2 - epsilon);
          } else {
            const overlapX =
              Math.min(p.x + half, table.x + table.width / 2) -
              Math.max(p.x - half, table.x - table.width / 2);
            const overlapZ =
              Math.min(p.z + half, table.z + table.depth / 2) -
              Math.max(p.z - half, table.z - table.depth / 2);
            expect(overlapX > epsilon && overlapZ > epsilon).toBe(false);
          }
        }
      }
    }
  });
});
