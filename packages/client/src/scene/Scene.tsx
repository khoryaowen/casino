import { usePlayerController } from "../hooks/usePlayerController";
import { Floor } from "./Floor";
import { FollowCamera } from "./FollowCamera";
import { Lighting } from "./Lighting";
import { Player } from "./Player";
import { Tables } from "./Tables";

export function Scene() {
  const playerRef = usePlayerController();

  return (
    <>
      <Lighting />
      <Floor />
      <Tables />
      <Player ref={playerRef} />
      <FollowCamera target={playerRef} />
    </>
  );
}
