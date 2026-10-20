import { describe, expect, it } from "vitest";
import { PLAYER_SPEED, stepPlayer, type MovementInput } from "./movement";

const none: MovementInput = {
  forward: false,
  back: false,
  left: false,
  right: false,
};
const origin = { x: 0, z: 0 };

describe("stepPlayer", () => {
  it("does not move without input", () => {
    expect(stepPlayer(origin, none, 0.016)).toEqual(origin);
  });

  it("moves forward along -Z at PLAYER_SPEED", () => {
    const next = stepPlayer(origin, { ...none, forward: true }, 0.1);
    expect(next.x).toBeCloseTo(0);
    expect(next.z).toBeCloseTo(-PLAYER_SPEED * 0.1);
  });

  it("moves right along +X", () => {
    const next = stepPlayer(origin, { ...none, right: true }, 0.1);
    expect(next.x).toBeCloseTo(PLAYER_SPEED * 0.1);
    expect(next.z).toBeCloseTo(0);
  });

  it("moves diagonally at the same speed as straight", () => {
    const straight = stepPlayer(origin, { ...none, forward: true }, 0.1);
    const diagonal = stepPlayer(
      origin,
      { ...none, forward: true, right: true },
      0.1,
    );
    expect(Math.hypot(diagonal.x, diagonal.z)).toBeCloseTo(
      Math.hypot(straight.x, straight.z),
    );
  });

  it("cancels opposite keys", () => {
    expect(
      stepPlayer(origin, { ...none, left: true, right: true }, 0.1),
    ).toEqual(origin);
  });

  it("covers the same distance regardless of frame rate", () => {
    const run = (steps: number, dt: number) => {
      let pos = origin;
      for (let i = 0; i < steps; i++)
        pos = stepPlayer(pos, { ...none, forward: true }, dt);
      return pos;
    };
    // One simulated second at 60 FPS, 10 FPS and 144 FPS
    const at60 = run(60, 1 / 60);
    const at10 = run(10, 1 / 10);
    const at144 = run(144, 1 / 144);
    expect(at60.z).toBeCloseTo(-PLAYER_SPEED);
    expect(at10.z).toBeCloseTo(-PLAYER_SPEED);
    expect(at144.z).toBeCloseTo(-PLAYER_SPEED);
  });

  it("clamps huge time steps (e.g. returning from a background tab)", () => {
    const next = stepPlayer(origin, { ...none, forward: true }, 5);
    expect(next.z).toBeCloseTo(-PLAYER_SPEED * 0.1);
  });
});
