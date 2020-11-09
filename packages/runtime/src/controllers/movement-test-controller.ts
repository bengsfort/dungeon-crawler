import { getInputManager, hasInputManager } from "../runtime";

import { BaseController } from "./controller";
import { InputSource } from "../interop-interfaces";

const tickModifer = 1 / 60;
interface Opts {
  speed: number;
}
export class TestMovementController extends BaseController {
  _speed: number;
  _inputMgr: InputSource;

  constructor({ speed }: Opts) {
    super();
    this._speed = speed;
    this._inputMgr = getInputManager();
  }

  tick = (): void => {
    if (hasInputManager() === false) return;
    const { _inputMgr, _speed, entity } = this;

    if (_inputMgr.forward()) {
      entity.transform.position.y -= _speed * tickModifer;
    } else if (_inputMgr.backwards()) {
      entity.transform.position.y += _speed * tickModifer;
    }

    if (_inputMgr.left()) {
      entity.transform.position.x -= _speed * tickModifer;
    } else if (_inputMgr.right()) {
      entity.transform.position.x += _speed * tickModifer;
    }

    if (_inputMgr.space()) {
      entity.transform.scale.x += entity.transform.scale.x * 0.2 * tickModifer;
      entity.transform.scale.y += entity.transform.scale.y * 0.2 * tickModifer;
    } else if (_inputMgr.control()) {
      entity.transform.scale.x -= entity.transform.scale.x * 0.2 * tickModifer;
      entity.transform.scale.y -= entity.transform.scale.y * 0.2 * tickModifer;
    }
  };
}
