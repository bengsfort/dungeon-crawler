let id = 0;

export class Vector2 {
  public x = 0;
  public y = 0;

  private _id = `vector2_${++id}`;
  public get id(): string {
    return this._id;
  }

  public get magnitude(): number {
    const { x, y } = this;
    return x * x + y * y;
  }

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  add(other: Vector2): void {
    this.x += other.x;
    this.y += other.y;
  }

  multiply(val: number): void {
    this.x *= val;
    this.y *= val;
  }
}
