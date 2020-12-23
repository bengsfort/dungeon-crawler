import { hasActiveStateManager, isServerRuntime } from "../runtime";

import { Entity } from "./entity";
// import { ServerStateReporterController } from "../controllers/server-state-reporter-controller";
import { Status } from "../components/status";
import { Vector2 } from "@dungeon-crawler/core";

export class PlayerCharacter extends Entity {
  status: Status;

  isPlayerControlled = true;

  constructor(name = "", displayName = "", pos = new Vector2(0, 0)) {
    super(pos, new Vector2(1, 1), name);
    this.status = new Status(155, 100, 100, displayName);
  }
}
