import { BaseController } from "./controller";
import { PlayerCharacter } from "../entities/player-character";
import { SerializeablePlayerState } from "../state";
import { ServerStateController } from "./server-state-controller";
import { getActiveStateManager } from "../runtime";

export class ServerStateReporterController extends BaseController {
  entity: PlayerCharacter;

  _stateMgr: ServerStateController;
  _lastState: SerializeablePlayerState;

  constructor() {
    super();
    this.entity = super.entity as PlayerCharacter;
    this._stateMgr = getActiveStateManager();
    this._lastState = this.getState(true);
  }

  onActive(): void {
    this._stateMgr.registerEntity(this.entity);
  }

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
    const state: SerializeablePlayerState = this.getState();
    this._stateMgr.reportStateUpdate(this.entity.name, state);
    this._lastState = Object.freeze(state);
  };
}
