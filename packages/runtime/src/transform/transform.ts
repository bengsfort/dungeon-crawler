import { Vector2 } from "@dungeon-crawler/core";

export class Transform {
  private _position: Vector2;
  private _rotation: number;
  private _scale: Vector2;
  // @todo: Test if this should be a direct reference or relational reference
  parent: Transform | null;
  children: Transform[];

  constructor(pos = new Vector2(0, 0), scale = new Vector2(1, 1)) {
    this._position = pos;
    this._rotation = 0;
    this._scale = scale;

    this.parent = null;
    this.children = [];
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
      return Vector2.Add(this._scale, parentScale);
    }
    return this._scale;
  }
}
