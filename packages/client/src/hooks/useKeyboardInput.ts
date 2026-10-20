import type { MovementInput } from "@casino/shared";
import { useEffect, useRef } from "react";

const KEY_BINDINGS: Record<string, keyof MovementInput> = {
  KeyW: "forward",
  ArrowUp: "forward",
  KeyS: "back",
  ArrowDown: "back",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
};

/**
 * Tracks held movement keys in a ref (no re-renders).
 * Read `input.current` inside useFrame.
 */
export function useKeyboardInput() {
  const input = useRef<MovementInput>({
    forward: false,
    back: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const setKey = (code: string, pressed: boolean): boolean => {
      const action = KEY_BINDINGS[code];
      if (!action) return false;
      input.current[action] = pressed;
      return true;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (setKey(e.code, true)) e.preventDefault(); // stop arrow keys scrolling the page
    };
    const onKeyUp = (e: KeyboardEvent) => {
      setKey(e.code, false);
    };
    // If the window loses focus mid-press, keyup never arriveps and the cube would run forever.
    const onBlur = () => {
      input.current = {
        forward: false,
        back: false,
        left: false,
        right: false,
      };
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return input;
}
