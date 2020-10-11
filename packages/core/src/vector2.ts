let id = 0;

export class Vector2 {
  // Helpers
  public static readonly Down = new Vector2(0, -1);
  public static readonly Up = new Vector2(0, 1);
  public static readonly Left = new Vector2(-1, 0);
  public static readonly Right = new Vector2(1, 0);
  public static readonly One = new Vector2(1, 1);
  public static readonly Zero = new Vector2(0, 0);

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

  equals(val: Vector2): boolean {
    return val.x === this.x && val.y === this.y;
  }
}
