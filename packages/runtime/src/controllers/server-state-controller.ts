import * as Time from "../time";

import {
  ClientAcknowledgementHandler,
  ClientDisconnectedHandler,
  ClientJoinedHandler,
  ServerStateUpdateMessage,
  WsServer,
} from "@dungeon-crawler/network";
import {
  PartialSerializeableGameState,
  SerializeableGameState,
  SerializeablePlayerState,
  getGameStateDiff,
} from "../state";
import {
  registerPostUpdateHandler,
  removePostUpdateHandler,
} from "../game-loop";

import { BaseController } from "./controller";
import { PlayerCharacter } from "../entities";
import { ServerStateReporterController } from "./server-state-reporter-controller";

const NOOP = (): void => {};

// temp
const TICKRATE = 15;
const TIMESTEP = 1000 / TICKRATE;

export type OnPlayerConnectionHandler = (player: PlayerCharacter) => void;

// IMPORTANT TODO: This SHOULD NOT send a new update every tick!
// We need a tickrate that will be shared between client and server!
// ie. every 5 ticks send an update

export class ServerStateController extends BaseController {
  readonly historyCapacity: number;
  readonly fullDiffDelta: number;

  get CurrentTick(): number {
    return this._currentSnapshot.tick;
  }

  get HistoryLength(): number {
    return this._snapshotHistory.length;
  }

  get TrackedEntityCount(): number {
    return this._statefulEntities.size;
  }

  onNewPlayer: OnPlayerConnectionHandler = NOOP;
  onPlayerDisconnected: OnPlayerConnectionHandler = NOOP;

  private _wsServer: WsServer;
  private _statefulEntities: Map<string, ServerStateReporterController>;

  private _currentSnapshot: SerializeableGameState;
  private _snapshotHistory: SerializeableGameState[];

  private _lastMessageTimestamp = 0;

  private _acknowledgements: Map<string, number>;

  constructor(server: WsServer, historyCapacity = 60, fullDiffDelta = 10) {
    super();
    this._wsServer = server;

    this.historyCapacity = historyCapacity;
    this.fullDiffDelta = fullDiffDelta;

    this._snapshotHistory = [];
    this._acknowledgements = new Map<string, number>();
    this._statefulEntities = new Map<string, ServerStateReporterController>();
    this._currentSnapshot = {
      tick: 0,
      entities: {},
    };

    this._wsServer.onClientAcknowledgement = this._onAcknowledgement;
    this._wsServer.onClientConnected = this._onClientConnected;
    this._wsServer.onClientDisconnected = this._onClientDisconnected;

    // @todo: add handler for on client message
    // add an "acknowledged" network message
    // Add the game state to the network package
    // add handler for input command
    // add handler for acknowledgement messages
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

  _onClientConnected: ClientJoinedHandler = (clientId: string) => {
    const player = new PlayerCharacter(clientId);
    const stateReporter = new ServerStateReporterController(this);
    player.addController(stateReporter);
    this._statefulEntities.set(clientId, stateReporter);
    this._currentSnapshot.entities[clientId] = stateReporter.getState(true);
    this.onNewPlayer(player);
  };

  _onClientDisconnected: ClientDisconnectedHandler = (clientId: string) => {
    const reporter = this._statefulEntities.get(
      clientId
    ) as ServerStateReporterController;
    this._statefulEntities.delete(clientId);
    delete this._currentSnapshot.entities[clientId];
    this.onPlayerDisconnected(reporter.entity);
  };

  _onAcknowledgement: ClientAcknowledgementHandler = (clientId, tick) => {
    this._acknowledgements.set(clientId, tick);
  };

  public getLastClientAcknowledgement(id: string): number {
    const acknowledgement = this._acknowledgements.get(id);
    return typeof acknowledgement !== "undefined" ? acknowledgement : -1;
  }

  public reportStateUpdate(
    clientId: string,
    update: SerializeablePlayerState
  ): void {
    this._currentSnapshot.entities[clientId] = update;
  }

  public tick = (): void => {
    const snapshot = this._currentSnapshot;
    const localTime = Time.getCurrentTime();

    if (localTime - this._lastMessageTimestamp >= TIMESTEP) {
      // Iterate through each client diff, and send them a message
      this._wsServer.clients.forEach((client) => {
        // Update the current state...
        const instance = this._statefulEntities.get(client.id);
        if (instance) snapshot.entities[client.id] = instance.getState(true);

        // Then get the delta.
        const delta = this._getClientStateDiff(client.id, snapshot);
        const message = new ServerStateUpdateMessage(delta, localTime);

        // @todo: check if we should store the messages, then send them all at once after calculating diffs
        client.message(message);
      });
      this._lastMessageTimestamp = localTime;
    }

    if (this._snapshotHistory.length === this.historyCapacity) {
      this._snapshotHistory.pop();
    }
    this._snapshotHistory.unshift(snapshot);
    this._currentSnapshot = {
      tick: snapshot.tick + 1,
      entities: {
        ...snapshot.entities,
      },
    };
    this._currentSnapshot.toString = () =>
      JSON.stringify(this._currentSnapshot);
  };

  _getClientStateDiff(
    clientId: string,
    snapshot: SerializeableGameState
  ): PartialSerializeableGameState {
    const lastAcknowledgedTick = this._acknowledgements.get(clientId);
    if (typeof lastAcknowledgedTick === "undefined") return snapshot;

    const tickDifference = Math.max(0, snapshot.tick - lastAcknowledgedTick);
    const snapshotIndex = Math.min(
      Math.max(0, tickDifference - 1),
      this.HistoryLength
    );

    if (
      snapshotIndex >= this._snapshotHistory.length ||
      tickDifference >= this.fullDiffDelta
    )
      return snapshot;

    return getGameStateDiff(this._snapshotHistory[snapshotIndex], snapshot);
  }
}
