import { WorkerType } from "../constants";
import cluster from "cluster";
import os from "os";

export class WorkerManager {
  // really need to use dotenv files soon....
  private _numCPUS: number = os.cpus().length / 2;

  // @todo: We need to figure out how to better manage creating an idle worker when a room exits
  private _workers = new Map<number, cluster.Worker>();
  private _idleWorkers: number[] = [];
  private _roomWorkers: number[] = [];

  init = (): void => {
    console.log(
      `[WorkerManager] Starting working manager to manage workers across ${this._numCPUS} cpus`
    );
    cluster.on("exit", this.onWorkerExit);
    for (let i = 0; i < this._numCPUS - 1; i++) {
      this.startIdleWorker();
    }
  };

  hasAvailableWorker = (): boolean => this._idleWorkers.length > 0;

  onWorkerExit = (worker: cluster.Worker): void => {
    if (this._workers.has(worker.process.pid)) {
      this._workers.delete(worker.process.pid);
    }
    if (this._idleWorkers.includes(worker.process.pid)) {
      this._idleWorkers = this._idleWorkers.filter(
        (pid) => pid !== worker.process.pid
      );
    }
    if (this._roomWorkers.includes(worker.process.pid)) {
      this._roomWorkers = this._roomWorkers.filter(
        (pid) => pid !== worker.process.pid
      );
      // Start a room worker in it's place
      this.startIdleWorker();
    }
  };

  startIdleWorker = (): void => {
    if (this._workers.size == this._numCPUS - 1) {
      console.log(
        "[WorkerManager] Trying to start idle worker but already at capacity!"
      );
      return;
    }
    const worker = cluster.fork({ type: WorkerType.idle });
    this._workers.set(worker.process.pid, worker);
    this._idleWorkers.push(worker.process.pid);
  };

  createRoomWorker = (roomId: string): number => {
    if (this._idleWorkers.length === 0) {
      console.log(
        "[WorkerManager] Trying to create room but there are no available workers!"
      );
      return -1;
    }
    const idlePid = this._idleWorkers.pop() as number;
    const idleWorker = this._workers.get(idlePid);
    this._workers.delete(idlePid);

    if (!idleWorker) {
      console.log(
        `[WorkerManager] Tried to get an idle worker that didn't exist: ${idlePid}`
      );
      return -1;
    }

    idleWorker.kill();
    const worker = cluster.fork({ type: WorkerType.room, roomId });
    this._workers.set(worker.process.pid, worker);
    this._roomWorkers.push(worker.process.pid);
    return worker.process.pid;
  };

  // @todo: implement
  killRoomWorker = (): void => {};
}

export const workers = new WorkerManager();
