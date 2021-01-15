import { SerializeablePlayerState, defaultPlayerState } from "../state";

import { BaseController } from "./controller";
import { Entity } from "src/entities";
import { PlayerCharacter } from "../entities/player-character";
import { ServerStateController } from "./server-state-controller";
import { Vector2 } from "@dungeon-crawler/core";

// @todo: ADD TESTS
export class ServerStateReporterController extends BaseController {
  entity!: PlayerCharacter;

  private _stateMgr: ServerStateController;
  private _lastState: SerializeablePlayerState;

  constructor(stateManager: ServerStateController) {
    super();
    this._stateMgr = stateManager;
    this._lastState = { ...defaultPlayerState };
  }

  // Currently this isn't much a reporter, more a bridge.
  // The server state reporter is grabbing the state before calculating the
  // diff itself, so currently `getDiff` isn't being used at all. Not sure
  // that this is how I want it to work, but it works for now
  getState(fullUpdate = false): SerializeablePlayerState {
    const { entity, _lastState } = this;
    if (fullUpdate === true) {
      return {
        ...entity.transform.getStateProperties(),
        ...entity.status.getStateProperties(),
      } as SerializeablePlayerState;
    }
    return {
      ..._lastState,
      ...entity.transform.getDiff(_lastState),
      ...entity.status.getDiff(_lastState),
    };
  }

  tick = (): void => {
    // const state: SerializeablePlayerState = this.getState();
    // this._stateMgr.reportStateUpdate(this.entity.name, state);
    // this._lastState = Object.freeze(state);
  };
}
