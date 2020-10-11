import { Actor } from "../actors/actor";

export enum ControllerId {
  PlayerInputController = "player_input_controller",
}

export type ControllerInstance = {
  (): void;
};
export type Controller = {
  (entity: Actor): ControllerInstance;
  ID: ControllerId;
};
