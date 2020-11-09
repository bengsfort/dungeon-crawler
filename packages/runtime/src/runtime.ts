import { InputSource, Renderer } from "./interop-interfaces";

let activeRenderer: Renderer | null = null;

// @todo: 'Input' isn't really the right word, we need something that will work
// Both on the client AND server; unless we want to do an if statement to check
// what sort of input source we should use based on the environment.
// Initial idea is to have an interface that can be used by both the networking
// and player, that just pipes in what actions are being done (the client handling
// getting the input and just piping that through to the interface)
let activeInput: InputSource | null = null;

export const hasActiveRenderer = (): boolean => activeRenderer !== null;
export const getRenderer = (): Renderer => activeRenderer as Renderer;
export const registerRenderer = (renderer: Renderer): void => {
  activeRenderer = renderer;
};
export const unregisterRenderer = (): void => {
  activeRenderer = null;
};

export const hasInputManager = (): boolean => activeInput !== null;
export const getInputManager = (): InputSource => activeInput as InputSource;
export const registerInputManager = (manager: InputSource): void => {
  activeInput = manager;
};
export const unregisterInputManager = (): void => {
  activeInput = null;
};
