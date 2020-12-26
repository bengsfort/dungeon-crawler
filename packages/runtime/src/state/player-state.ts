import { V2, Vector2 } from "@dungeon-crawler/core";

export interface SerializeablePlayerState {
  name: string;
  displayName: string;
  position: V2;
  scale: V2;
  target: string;
  hp: number;
  power: number;
}

export const defaultPlayerState: SerializeablePlayerState = {
  name: "unknown",
  displayName: "Unknown",
  position: Vector2.Zero,
  scale: Vector2.One,
  target: "",
  hp: 100,
  power: 100,
};

export const getPlayerStateDiff = (
  prev: SerializeablePlayerState,
  next: SerializeablePlayerState
): Partial<SerializeablePlayerState> => {
  const result: Partial<SerializeablePlayerState> = {};
  if (prev.name !== next.name) result.name = next.name;
  if (prev.displayName !== next.displayName)
    result.displayName = next.displayName;
  if (Vector2.Equals(prev.position, next.position) === false)
    result.position = next.position;
  if (Vector2.Equals(prev.scale, next.scale) === false)
    result.scale = next.scale;
  if (prev.target !== next.target) result.target = next.target;
  if (prev.hp !== next.hp) result.hp = next.hp;
  if (prev.power !== next.power) result.power = next.power;

  return result;
};
