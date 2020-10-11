import { Controls, keyDown } from "../utils/key-down";

import { Controllers } from "@dungeon-crawler/runtime";
import { Entity } from "@dungeon-crawler/core";

const controller: Controllers.Controller = (entity: Entity) => {
  const update = () => {
    if (keyDown(Controls.W)) {
      entity.position.y -= 1;
    } else if (keyDown(Controls.S)) {
      entity.position.y += 1;
    }
    if (keyDown(Controls.A)) {
      entity.position.x += -1;
    } else if (keyDown(Controls.D)) {
      entity.position.x += 1;
    }
  };
  return update;
};

controller.ID = ControllerId.PlayerInputController;

export const playerInputController = controller;
