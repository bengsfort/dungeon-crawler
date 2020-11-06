import { Controller, ControllerInstance } from "../controllers";
import { registerUpdateHandler, removeUpdateHandler } from "../game-loop";

import { Transform } from "../transform";
import { Vector2 } from "@dungeon-crawler/core";

let idCounter = 0;

export class Entity {
  public readonly id = `entity::${++idCounter}`;
  active: boolean;
  transform: Transform;
  private _controllers: Map<string, ControllerInstance>;

  constructor(pos = new Vector2(0, 0), scale = new Vector2(1, 1)) {
    this.transform = new Transform(pos, scale);
    this._controllers = new Map<string, ControllerInstance>();
    this.active = true;
  }

  addController(controller: Controller): void {
    const { id, _controllers } = this;
    if (!_controllers.has(controller.ID)) {
      const handler = controller(this);
      _controllers.set(controller.ID, handler);
      registerUpdateHandler(`${id}::${controller.ID as string}`, handler);
    }
  }

  getController(controllerId: string): ControllerInstance | undefined {
    const { _controllers } = this;
    if (_controllers.has(controllerId)) {
      return _controllers.get(controllerId);
    }
  }

  removeController(controllerId: string): void {
    this._controllers.delete(this.id);
    removeUpdateHandler(`${this.id}::${controllerId}`);
  }
}
