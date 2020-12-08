import * as assert from "assert";

import { SerializeableGameState, getGameStateDiff } from "./game-state";
import { SerializeablePlayerState, getPlayerStateDiff } from "./player-state";

import { Vector2 } from "@dungeon-crawler/core";
import { v4 as uuidv4 } from "uuid";

describe("State types/utils", () => {
  const player1: SerializeablePlayerState = {
    name: uuidv4(),
    displayName: "BobbyBoi",
    position: new Vector2(5, 5),
    scale: new Vector2(1, 1),
    hp: 155,
    power: 100,
    target: "",
  };

  const player2: SerializeablePlayerState = {
    name: uuidv4(),
    displayName: "Jimbo",
    position: new Vector2(1, 2),
    scale: new Vector2(1, 1),
    hp: 155,
    power: 100,
    target: "",
  };

  const player3: SerializeablePlayerState = {
    name: uuidv4(),
    displayName: "joulupukki",
    position: new Vector2(10, 15),
    scale: new Vector2(1, 1),
    hp: 73,
    power: 100,
    target: "",
  };

  describe("getPlayerStateDiff", () => {
    it("should return an empty object if there are no changes", () => {
      assert.deepStrictEqual(getPlayerStateDiff(player1, player1), {});
    });
  });
});
