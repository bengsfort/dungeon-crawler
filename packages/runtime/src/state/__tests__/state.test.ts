import { SerializeableGameState, getGameStateDiff } from "../game-state";
import { SerializeablePlayerState, getPlayerStateDiff } from "../player-state";

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
    scale: new Vector2(2, 2),
    hp: 125,
    power: 80,
    target: player1.name,
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
      expect(getPlayerStateDiff(player1, player1)).toEqual({});
    });

    it("should return the delta of any changes", () => {
      const moved = {
        ...player1,
        position: new Vector2(8, 5),
      };

      const changedTargetHp = {
        ...player1,
        target: player2.name,
        hp: 132,
      };

      expect(getPlayerStateDiff(player1, moved)).toEqual({
        position: moved.position,
      });
      expect(getPlayerStateDiff(player1, changedTargetHp)).toEqual({
        target: changedTargetHp.target,
        hp: changedTargetHp.hp,
      });
    });

    it("should return a full result if all fields don't match", () => {
      expect(getPlayerStateDiff(player1, player2)).toEqual(player2);
    });
  });

  describe("getGameStateDiff", () => {
    it("it shouldn't include any entities if there are no changes", () => {
      const tick1: SerializeableGameState = {
        tick: 1,
        entities: {
          [player1.name]: player1,
          [player2.name]: player2,
          [player3.name]: player3,
        },
      };
      const tick2: SerializeableGameState = {
        tick: 2,
        entities: {
          [player1.name]: player1,
          [player2.name]: player2,
          [player3.name]: player3,
        },
      };
      expect(getGameStateDiff(tick1, tick2)).toEqual({
        tick: 2,
        entities: {
          [player1.name]: {},
          [player2.name]: {},
          [player3.name]: {},
        },
      });
    });

    it("it should remove any entities no longer in state", () => {
      const tick1: SerializeableGameState = {
        tick: 1,
        entities: {
          [player1.name]: player1,
          [player2.name]: player2,
          [player3.name]: player3,
        },
      };
      const tick2: SerializeableGameState = {
        tick: 2,
        entities: {
          [player1.name]: player1,
          [player2.name]: player2,
        },
      };
      expect(getGameStateDiff(tick1, tick2)).toEqual({
        tick: 2,
        entities: {
          [player1.name]: {},
          [player2.name]: {},
        },
      });
    });

    it("it should add any new entities", () => {
      const tick1: SerializeableGameState = {
        tick: 1,
        entities: {
          [player1.name]: player1,
        },
      };
      const tick2: SerializeableGameState = {
        tick: 2,
        entities: {
          [player1.name]: player1,
          [player2.name]: player2,
        },
      };
      expect(getGameStateDiff(tick1, tick2)).toEqual({
        tick: 2,
        entities: {
          [player1.name]: {},
          [player2.name]: player2,
        },
      });
    });
  });
});
