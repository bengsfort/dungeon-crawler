import { SerializeablePlayerState } from "../state";
import { StatefulComponent } from "./stateful-components";

export class Status implements StatefulComponent {
  readonly maxHealth: number;
  hp: number;
  readonly maxPower: number;
  power: number;
  displayName: string;
  target: string;

  constructor(hp: number, power: number, maxPower: number, name: string) {
    this.maxHealth = hp;
    this.hp = hp;
    this.maxPower = maxPower;
    this.power = power;
    this.displayName = name;
    this.target = "";
  }

  increaseHealth(amount: number): number {
    this.hp = Math.min(this.hp + amount, this.maxHealth);
    return this.hp;
  }

  decreaseHealth(amount: number): number {
    this.hp = Math.max(this.hp - amount, 0);
    return this.hp;
  }

  increasePower(amount: number): number {
    this.power = Math.min(this.power + amount, this.maxPower);
    return this.power;
  }

  decreasePower(amount: number): number {
    this.power = Math.max(this.power - amount, 0);
    return this.power;
  }

  setTarget(targetId: string): void {
    this.target = targetId;
  }

  removeTarget(): void {
    this.target = "";
  }

  getStateProperties(): Partial<SerializeablePlayerState> {
    return {
      hp: this.hp,
      power: this.power,
      displayName: this.displayName,
      target: this.target,
    };
  }

  getDiff(prev: SerializeablePlayerState): Partial<SerializeablePlayerState> {
    const result: Partial<SerializeablePlayerState> = {};
    if (this.hp !== prev.hp) {
      result.hp = this.hp;
    }
    if (this.power !== prev.power) {
      result.power = this.power;
    }
    if (this.displayName !== prev.displayName) {
      result.displayName = this.displayName;
    }
    if (this.target !== prev.target) {
      result.target = this.target;
    }
    return result;
  }
}
