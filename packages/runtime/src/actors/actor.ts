import * as GameLoop from "../game-loop";

import {
  Controller,
  ControllerId,
  ControllerInstance,
} from "../controllers/controller";
import { Entity, Vector2 } from "@dungeon-crawler/core";

let idCounter = 0;

export class Actor implements Entity {
  public readonly id = `actor::${++idCounter}`;
  public position: Vector2;

  private _controllers = new Map<string, ControllerInstance>();

  constructor(position = new Vector2(0, 0)) {
    this.position = position;
  }

  addController(controller: Controller): void {
    const { id, _controllers } = this;
    if (!_controllers.has(controller.ID)) {
      const handler = controller(this);
      _controllers.set(controller.ID, handler);
      GameLoop.registerUpdateHandler(
        `${id}::${controller.ID as string}`,
        handler
      );
    }
  }

  getController(controllerId: ControllerId): ControllerInstance | undefined {
    const { _controllers } = this;
    if (_controllers.has(controllerId)) {
      return _controllers.get(controllerId);
    }
  }

  removeController(controllerId: ControllerId): void {
    this._controllers.delete(this.id);
    GameLoop.removeUpdateHandler(`${this.id}::${controllerId}`);
  }
}
