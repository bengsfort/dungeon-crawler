import { SerializeablePlayerState } from "../state";

export interface StatefulComponent {
  getStateProperties(): Partial<SerializeablePlayerState>;
  getDiff(prev: SerializeablePlayerState): Partial<SerializeablePlayerState>;
}
