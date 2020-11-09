import { Controller } from "../controllers";
import { Transform } from "../transform";
import { Vector2 } from "@dungeon-crawler/core";

let idCounter = 0;

export class Entity {
  public readonly id = ++idCounter;
  public readonly name: string;
  active: boolean;
  transform: Transform;
  private _controllers: Map<number, Controller>;

  constructor(pos = new Vector2(0, 0), scale = new Vector2(1, 1), name = "") {
    this.name = name || this.id.toString();
    this.transform = new Transform(pos, scale, this);
    this._controllers = new Map<number, Controller>();
    this.active = true;
  }

  addController(controller: Controller): void {
    const { _controllers } = this;
    if (!_controllers.has(controller.id)) {
      _controllers.set(controller.id, controller);
      controller.setEntity(this);
      controller.setActive(true);
    }
  }

  getController(controllerId: number): Controller | undefined {
    const { _controllers } = this;
    if (_controllers.has(controllerId)) {
      return _controllers.get(controllerId);
    }
  }

  removeController(controllerId: number): void {
    const controller = this._controllers.get(controllerId);
    if (controller) {
      controller.unsetEntity();
      this._controllers.delete(controllerId);
    }
  }

  addChild(child: Entity | Transform): void {
    const { transform } = this;
    if (child instanceof Entity) {
      transform.addChild(child.transform);
    } else {
      transform.addChild(child);
    }
  }

  addChildren(children: Entity[] | Transform[]): void {
    for (let i = 0; i < children.length; i++) {
      this.addChild(children[i]);
    }
  }
}
