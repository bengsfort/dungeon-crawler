import { SerializeablePlayerState, getPlayerStateDiff } from "./player-state";

export interface SerializeableGameState {
  tick: number;
  entities: {
    [id: string]: SerializeablePlayerState;
  };
}

export interface PartialSerializeableGameState {
  tick: number;
  entities: {
    [id: string]: Partial<SerializeablePlayerState>;
  };
}

export const getGameStateDiff = (
  prev: SerializeableGameState,
  next: SerializeableGameState
): PartialSerializeableGameState => {
  const result: PartialSerializeableGameState = {
    tick: next.tick,
    entities: {},
  };

  const nextEntities = Object.keys(next.entities);

  // We use nextEntities because it is a full state, so any missing ones would
  // be already excluded from the map.
  for (let i = 0; i < nextEntities.length; i++) {
    const entityId = nextEntities[i] as keyof SerializeableGameState;
    if (typeof prev.entities[entityId] === "undefined") continue;
    result.entities[entityId] = getPlayerStateDiff(
      prev.entities[entityId],
      next.entities[entityId]
    );
  }

  return result;
};
