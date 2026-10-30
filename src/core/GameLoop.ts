import { gameConfig } from '../config/game.config';

export interface FrameScheduler {
  request(callback: FrameRequestCallback): number;
  cancel(handle: number): void;
}

export class GameLoop {
  private handle: number | null = null;
  private running = false;
  private lastTime: number | null = null;
  private accumulator = 0;

  constructor(
    private readonly update: (delta: number) => void,
    // Alpha dùng để nội suy visual; mô phỏng vẫn là nguồn trạng thái chính thức.
    private readonly render: (frameDelta: number, alpha: number) => void,
    private readonly scheduler: FrameScheduler = {
      request: (callback) => requestAnimationFrame(callback),
      cancel: (handle) => cancelAnimationFrame(handle),
    },
  ) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = null;
    this.accumulator = 0;
    this.handle = this.scheduler.request(this.tick);
  }

  stop(): void {
    this.running = false;
    if (this.handle !== null) this.scheduler.cancel(this.handle);
    this.handle = null;
    this.lastTime = null;
    this.accumulator = 0;
  }

  private readonly tick = (time: number): void => {
    if (!this.running) return;
    const elapsed = this.lastTime === null ? 0 : Math.max(0, (time - this.lastTime) / 1000);
    this.lastTime = time;
    const { fixedDelta, maxFrameDelta, maxStepsPerFrame } = gameConfig.simulation;
    this.accumulator += Math.min(elapsed, maxFrameDelta);
    let steps = 0;

    while (this.accumulator + Number.EPSILON >= fixedDelta && steps < maxStepsPerFrame) {
      this.update(fixedDelta);
      if (!this.running) return;
      this.accumulator = Math.max(0, this.accumulator - fixedDelta);
      steps += 1;
    }

    // Drop overdue whole steps after a stall rather than build an unbounded backlog.
    if (steps === maxStepsPerFrame) this.accumulator %= fixedDelta;
    this.render(elapsed, this.accumulator / fixedDelta);
    if (this.running) this.handle = this.scheduler.request(this.tick);
  };
}
