import { InputSource, Renderer } from "./interop-interfaces";
import { WsClient, WsServer } from "@dungeon-crawler/network";

import { ServerStateController } from "./controllers";

let activeRenderer: Renderer | null = null;
let activeWsServer: WsServer | null = null;
let activeWsClient: WsClient | null = null;
let activeStateController: ServerStateController | null = null;
let isServer = false;

// @todo: 'Input' isn't really the right word, we need something that will work
// Both on the client AND server; unless we want to do an if statement to check
// what sort of input source we should use based on the environment.
// Initial idea is to have an interface that can be used by both the networking
// and player, that just pipes in what actions are being done (the client handling
// getting the input and just piping that through to the interface)
let activeInput: InputSource | null = null;

// Rendering
export const hasActiveRenderer = (): boolean => activeRenderer !== null;
export const getRenderer = (): Renderer => activeRenderer as Renderer;
export const registerRenderer = (renderer: Renderer): void => {
  activeRenderer = renderer;
};
export const unregisterRenderer = (): void => {
  activeRenderer = null;
};

// Server
export const hasActiveWsServer = (): boolean => activeWsServer !== null;
export const getWsServer = (): WsServer => activeWsServer as WsServer;
export const registerWsServer = (server: WsServer): void => {
  activeWsServer = server;
  isServer = true;
};
export const unregisterWsServer = (): void => {
  activeWsServer = null;
};

// State management
export const hasActiveStateManager = (): boolean =>
  activeStateController !== null;
export const getActiveStateManager = (): ServerStateController =>
  activeStateController as ServerStateController;
export const registerActiveStateManager = (
  manager: ServerStateController
): void => {
  if (manager instanceof ServerStateController) {
    isServer = true;
  }
  activeStateController = manager;
};

export const setServerFlag = (val: boolean): void => {
  isServer = val;
};
export const isServerRuntime = (): boolean => isServer;

// Client
export const hasActiveWsClient = (): boolean => activeWsClient !== null;
export const getWsClient = (): WsClient => activeWsClient as WsClient;
export const registerWsClient = (server: WsClient): void => {
  activeWsClient = server;
};
export const unregisterWsClient = (): void => {
  activeWsServer = null;
};

// Input
export const hasInputManager = (): boolean => activeInput !== null;
export const getInputManager = (): InputSource => activeInput as InputSource;
export const registerInputManager = (manager: InputSource): void => {
  activeInput = manager;
};
export const unregisterInputManager = (): void => {
  activeInput = null;
};
