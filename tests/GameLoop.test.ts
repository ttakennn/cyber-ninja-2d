import { describe, expect, it } from 'vitest';
import { GameLoop } from '../src/core/GameLoop';
import type { FrameScheduler } from '../src/core/GameLoop';
import { PhysicsWorld } from '../src/physics/PhysicsWorld';
import type { PhysicsBody } from '../src/physics/Collision';

class ManualScheduler implements FrameScheduler {
  private callback: FrameRequestCallback | null = null;
  requests = 0;

  request(callback: FrameRequestCallback): number {
    this.callback = callback;
    this.requests += 1;
    return this.requests;
  }

  cancel(): void {
    this.callback = null;
  }

  frame(time: number): void {
    const callback = this.callback;
    this.callback = null;
    callback?.(time);
  }
}

describe('fixed timestep scheduling', () => {
  it('produces the same physics result at 30, 60, and 144 render FPS', () => {
    const results = [30, 60, 144].map((fps) => {
      const scheduler = new ManualScheduler();
      const body: PhysicsBody = {
        position: { x: 0, y: 3 }, velocity: { x: 6, y: 0 }, width: 0.8, height: 1.6, isGrounded: false,
      };
      const world = new PhysicsWorld(-28, [{ position: { x: 0, y: -1 }, width: 100, height: 2 }]);
      let steps = 0;
      const loop = new GameLoop((delta) => {
        expect(delta).toBe(1 / 60);
        world.step(body, delta);
        steps += 1;
      }, () => {}, scheduler);
      loop.start();
      for (let frame = 0; frame <= fps * 2; frame += 1) scheduler.frame(frame * 1000 / fps);
      loop.stop();
      return { ...body.position, grounded: body.isGrounded, steps };
    });
    expect(results[0]?.steps).toBe(120);
    expect(results[0]?.x).toBeCloseTo(12);
    expect(results[0]?.y).toBe(0.8);
    expect(results[0]?.grounded).toBe(true);
    expect(results[1]).toEqual(results[0]);
    expect(results[2]).toEqual(results[0]);
  });

  it('renders frames without consuming a simulation update too early', () => {
    const scheduler = new ManualScheduler();
    let steps = 0;
    const alphas: number[] = [];
    const loop = new GameLoop(() => { steps += 1; }, (_, alpha) => { alphas.push(alpha); }, scheduler);
    loop.start();
    scheduler.frame(0);
    scheduler.frame(8);
    expect(steps).toBe(0);
    expect(alphas).toHaveLength(2);
    expect(alphas[1]).toBeCloseTo(0.48);
    scheduler.frame(17);
    expect(steps).toBe(1);
    loop.stop();
  });

  it('caps catch-up steps and drops excess backlog after a long stall', () => {
    const scheduler = new ManualScheduler();
    let steps = 0;
    const loop = new GameLoop(() => { steps += 1; }, () => {}, scheduler);
    loop.start();
    scheduler.frame(0);
    scheduler.frame(10000);
    expect(steps).toBe(8);
    scheduler.frame(10001);
    expect(steps).toBeLessThanOrEqual(9);
    loop.stop();
  });

  it('starts idempotently, cancels on stop, and resets timing on restart', () => {
    const scheduler = new ManualScheduler();
    let steps = 0;
    const loop = new GameLoop(() => { steps += 1; }, () => {}, scheduler);
    loop.start();
    loop.start();
    expect(scheduler.requests).toBe(1);
    scheduler.frame(0);
    loop.stop();
    scheduler.frame(1000);
    expect(steps).toBe(0);
    loop.start();
    scheduler.frame(10000);
    expect(steps).toBe(0);
    scheduler.frame(10017);
    expect(steps).toBe(1);
    loop.stop();
  });
});
