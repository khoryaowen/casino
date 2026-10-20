import { usePlayerController } from "../hooks/usePlayerController";
import { Floor } from "./Floor";
import { FollowCamera } from "./FollowCamera";
import { Lighting } from "./Lighting";
import { Player } from "./Player";

export function Scene() {
  const playerRef = usePlayerController();

  return (
    <>
      <Lighting />
      <Floor />
      <Player ref={playerRef} />
      <FollowCamera target={playerRef} />
    </>
  );
}
