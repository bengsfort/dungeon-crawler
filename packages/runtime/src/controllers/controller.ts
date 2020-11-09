import { registerUpdateHandler, removeUpdateHandler } from "../game-loop";

import { Entity } from "../entities";

let idCounter = 0;

export interface Controller {
  readonly id: number;
  active: boolean;
  entity: Entity;
  tick(timestamp: number): void;
  setActive(active: boolean): void;
  setEntity(entity: Entity): void;
  unsetEntity(): void;
}

export class BaseController implements Controller {
  public readonly id = ++idCounter;
  public active = false;
  public entity!: Entity;

  private _updateHandlerId = -1;

  setEntity(entity: Entity): void {
    this.entity = entity;
  }

  unsetEntity(): void {
    (this.entity as unknown) = null;
    this.setActive(false);
  }

  setActive(active: boolean): void {
    if (active !== this.active) {
      if (active) {
        this._updateHandlerId = registerUpdateHandler(this.tick);
      } else {
        removeUpdateHandler(this._updateHandlerId);
      }
    }
    this.active = active;
  }

  tick = (): void => {
    if (this.entity === null || this.active === false) {
      return;
    }
  };
}
