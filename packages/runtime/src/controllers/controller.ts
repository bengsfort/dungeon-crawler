import { Entity } from "../entities";

export enum ControllerId {
  PlayerInputController = "player_input_controller",
}

export type ControllerInstance = {
  (): void;
};
export type Controller = {
  (entity: Entity): ControllerInstance;
  ID: ControllerId;
};
