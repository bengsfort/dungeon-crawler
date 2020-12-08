import { Entity } from "../entities";
import { SerializeablePlayerState } from "../state";
import { Vector2 } from "@dungeon-crawler/core";

export class Transform {
  private _position: Vector2;
  private _rotation: number;
  private _scale: Vector2;
  private _entity: Entity | null;

  parent: Transform | null;
  children: Transform[];

  constructor(
    pos = new Vector2(0, 0),
    scale = new Vector2(1, 1),
    entity: Entity | null = null
  ) {
    this._position = pos;
    this._rotation = 0;
    this._scale = scale;
    this._entity = entity;

    this.parent = null;
    this.children = [];
  }

  get entity(): Entity | null {
    return this._entity;
  }

  set position(pos: Vector2) {
    this._position = pos;
  }
  get position(): Vector2 {
    const parentPos = this.parent?.position;
    if (parentPos) {
      return Vector2.Add(this._position, parentPos);
    }
    return this._position;
  }

  set rotation(rot: number) {
    this._rotation = rot;
  }
  get rotation(): number {
    const parentRot = this.parent?.rotation;
    if (parentRot) {
      return this._rotation + parentRot;
    }
    return this._rotation;
  }

  set scale(scale: Vector2) {
    this._scale = scale;
  }
  get scale(): Vector2 {
    const parentScale = this.parent?.scale;
    if (parentScale) {
      return Vector2.Multiply(this._scale, parentScale);
    }
    return this._scale;
  }

  addChild(child: Transform): void {
    if (this.children.includes(child)) return;
    this.children.push(child);
    child.parent = this;
  }

  getStateProperties(): Partial<SerializeablePlayerState> {
    return {
      position: this._position,
      scale: this._scale,
    };
  }

  getDiff(prev: SerializeablePlayerState): Partial<SerializeablePlayerState> {
    const result: Partial<SerializeablePlayerState> = {};
    if (this._position.equals(prev.position)) result.position = this._position;
    if (this._scale.equals(prev.scale)) result.scale = this._scale;
    return result;
  }
}
