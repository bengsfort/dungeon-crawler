import { Vector2 } from "@dungeon-crawler/core";

export interface SerializeablePlayerState {
  name: string;
  displayName: string;
  position: Vector2;
  scale: Vector2;
  target: string;
  hp: number;
  power: number;
}

export const getPlayerStateDiff = (
  prev: SerializeablePlayerState,
  next: SerializeablePlayerState
): Partial<SerializeablePlayerState> => {
  const result: Partial<SerializeablePlayerState> = {};

  if (prev.name !== next.name) result.name = next.name;
  if (prev.displayName !== next.displayName)
    result.displayName = next.displayName;
  if (prev.position.equals(next.position) === false)
    result.position = next.position;
  if (prev.scale.equals(next.scale) === false) result.scale = next.scale;
  if (prev.target !== next.target) result.target = next.target;
  if (prev.hp === next.hp) result.hp = next.hp;
  if (prev.power === next.power) result.power = next.power;

  return result;
};
