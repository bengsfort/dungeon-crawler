import {
  PartialSerializeableGameState,
  SerializeableGameState,
} from "../state";
import { ServerStateUpdateMessage, WsClient } from "@dungeon-crawler/network";
import {
  registerPostUpdateHandler,
  removePostUpdateHandler,
} from "../game-loop";

import { BaseController } from "./controller";
import { PlayerCommands } from "../commands/player-commands";

export class ClientStateController extends BaseController {
  _wsClient: WsClient;
  _currentState: SerializeableGameState;
  _nextState: SerializeableGameState;
  _localPlayerId: string;

  _queuedCommands: PlayerCommands[];

  _lastAcknowledgement = 0;

  constructor(client: WsClient, playerId: string) {
    super();

    this._wsClient = client;
    this._currentState = { tick: 0, entities: {} };
    this._nextState = { tick: 0, entities: {} };
    this._localPlayerId = playerId;

    this._queuedCommands = [];

    this._wsClient.onServerStateUpdate = this._onServerStateUpdated;
  }

  // We override this to use the PostUpdate handler, that way we can guarantee that
  // we are running AFTER all controller updates have completed.
  setActive(active: boolean): void {
    if (active !== this.active) {
      if (active) {
        this._updateHandlerId = registerPostUpdateHandler(this.tick);
      } else {
        removePostUpdateHandler(this._updateHandlerId);
      }
    }
    this.active = active;
    this.onActive();
  }

  _onServerStateUpdated = (
    msg: ServerStateUpdateMessage<PartialSerializeableGameState>
  ): void => {};
}
