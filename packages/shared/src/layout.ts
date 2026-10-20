/** Axis-aligned bounding box on the floor plane (XZ). */
export type Aabb = {
  readonly minX: number;
  readonly maxX: number;
  readonly minZ: number;
  readonly maxZ: number;
};

export type TableKind = "blackjack" | "roulette" | "poker";

/** "round" tables are drawn as cylinders; `width === depth` is their diameter. */
export type TableShape = "box" | "round";

export type TableDef = {
  readonly id: string;
  readonly kind: TableKind;
  readonly shape: TableShape;
  /** Center of the table footprint, in world units. */
  readonly x: number;
  readonly z: number;
  /** Footprint size along X and Z. */
  readonly width: number;
  readonly depth: number;
};

export type CasinoLayout = {
  readonly room: Aabb;
  readonly tables: readonly TableDef[];
};

/** Room dimensions in world units (1 unit ≈ 1 metre). Floor is centered on the origin. */
export const ROOM_SIZE = {
  width: 40, // along X
  depth: 30, // along Z
} as const;

export const CASINO_LAYOUT: CasinoLayout = {
  room: {
    minX: -ROOM_SIZE.width / 2,
    maxX: ROOM_SIZE.width / 2,
    minZ: -ROOM_SIZE.depth / 2,
    maxZ: ROOM_SIZE.depth / 2,
  },
  tables: [
    // West side: blackjack row
    {
      id: "blackjack-1",
      kind: "blackjack",
      shape: "box",
      x: -12,
      z: -8,
      width: 5,
      depth: 3,
    },
    {
      id: "blackjack-2",
      kind: "blackjack",
      shape: "box",
      x: -12,
      z: 0,
      width: 5,
      depth: 3,
    },
    {
      id: "blackjack-3",
      kind: "blackjack",
      shape: "box",
      x: -12,
      z: 8,
      width: 5,
      depth: 3,
    },
    // Center: poker, leaving the middle aisle (and the spawn at the origin) clear
    {
      id: "poker-1",
      kind: "poker",
      shape: "round",
      x: 0,
      z: -9,
      width: 5,
      depth: 5,
    },
    {
      id: "poker-2",
      kind: "poker",
      shape: "round",
      x: 0,
      z: 9,
      width: 5,
      depth: 5,
    },
    // East side: roulette
    {
      id: "roulette-1",
      kind: "roulette",
      shape: "box",
      x: 12,
      z: -8,
      width: 7,
      depth: 3.5,
    },
    {
      id: "roulette-2",
      kind: "roulette",
      shape: "box",
      x: 12,
      z: 8,
      width: 7,
      depth: 3.5,
    },
  ],
};
