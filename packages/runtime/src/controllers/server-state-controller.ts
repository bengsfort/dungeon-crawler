import * as Time from "../time";

import {
  ClientAcknowledgementHandler,
  ClientDisconnectedHandler,
  ClientJoinedHandler,
  WsServer,
} from "@dungeon-crawler/network";
import {
  PartialSerializeableGameState,
  SerializeableGameState,
  SerializeablePlayerState,
  getGameStateDiff,
} from "../state";

import { BaseController } from "./controller";
import { Entity } from "../entities";
import { ServerStateUpdateMessage } from "@dungeon-crawler/network/dist/messages";
import { registerActiveStateManager } from "../runtime";

export class ServerStateController extends BaseController {
  private _wsServer: WsServer;
  private _statefulEntities: Map<string, Entity>;

  private _currentSnapshot: SerializeableGameState;
  private _snapshotHistory: SerializeableGameState[];

  private _acknowledgements: Map<string, number>;

  constructor(server: WsServer) {
    super();
    this._wsServer = server;

    this._snapshotHistory = [];
    this._acknowledgements = new Map<string, number>();
    this._statefulEntities = new Map<string, Entity>();
    this._currentSnapshot = {
      tick: 0,
      entities: {},
    };

    registerActiveStateManager(this);

    this._wsServer.onClientAcknowledgement = this._onAcknowledgement;
    this._wsServer.onClientConnected = this._onClientConnected;
    this._wsServer.onClientDisconnected = this._onClientDisconnected;

    // @todo: add handler for on client message
    // add an "acknowledged" network message
    // Add the game state to the network package
    // add handler for input command
    // add handler for acknowledgement messages
  }

  _onClientConnected: ClientJoinedHandler = (clientId) => {};

  _onClientDisconnected: ClientDisconnectedHandler = (clientId) => {};

  _onAcknowledgement: ClientAcknowledgementHandler = (clientId, tick) => {
    this._acknowledgements.set(clientId, tick);
  };

  public registerEntity(entity: Entity): void {
    this._statefulEntities.set(entity.id.toString(), entity);
  }

  public reportStateUpdate(
    clientId: string,
    update: SerializeablePlayerState
  ): void {
    this._currentSnapshot.entities[clientId] = update;
  }

  public tick = (): void => {
    const snapshot = Object.freeze(this._currentSnapshot);
    const localTime = Time.getCurrentTime();

    // Iterate through each client diff, and send them a message
    this._wsServer.clients.forEach((client) => {
      const delta = this._getClientStateDiff(client.id, snapshot);
      const message = new ServerStateUpdateMessage(delta, localTime);
      // @todo: check if we should store the messages, then send them all at once after calculating diffs
      client.message(message);
    });

    if (this._snapshotHistory.length === 60) {
      this._snapshotHistory.pop();
    }
    this._snapshotHistory.unshift(snapshot);
    this._currentSnapshot = {
      tick: snapshot.tick + 1,
      entities: {
        ...snapshot.entities,
      },
    };
  };

  _getClientStateDiff(
    clientId: string,
    snapshot: SerializeableGameState
  ): PartialSerializeableGameState {
    const lastTick = this._acknowledgements.get(clientId) || 0;
    const tickDifference = snapshot.tick - lastTick;

    // If it's been more than 30 ticks, send a full update
    if (tickDifference > this._snapshotHistory.length) return snapshot;

    console.log(
      "Checking with reference:",
      lastTick,
      this._snapshotHistory[tickDifference].tick
    );
    return getGameStateDiff(this._snapshotHistory[tickDifference], snapshot);
  }
}
