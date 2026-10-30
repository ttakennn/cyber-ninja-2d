import { describe, expect, it } from 'vitest';
import { GameLoop } from '../src/core/GameLoop';
import { Player } from '../src/entities/Player';
import { PlayerAnimator } from '../src/entities/PlayerAnimator';
import { GameCamera } from '../src/rendering/GameCamera';
import { clips, groundedBody } from './animation.fixtures';

describe('nội suy vị trí', () => {
  it('nội suy đúng hai trục mà không thay đổi collider', () => {
    const player = new Player();
    player.setPosition(0, 2);
    player.capturePreviousPosition();
    player.body.position.x = 10;
    player.body.position.y = 6;
    player.syncVisual(0.25);
    expect(player.visual.position.toArray()).toEqual([2.5, 3, 1]);
    expect(player.body.position).toEqual({ x: 10, y: 6 });
    player.syncVisual(0);
    expect(player.visual.position.x).toBe(0);
    player.syncVisual(1);
    expect(player.visual.position.x).toBe(10);
    player.dispose();
  });

  it('không kéo visual về vị trí cũ khi khởi tạo, pause/resume hoặc đặt lại vị trí', () => {
    const player = new Player();
    player.syncVisual(0);
    expect(player.visual.position.x).toBe(player.body.position.x);
    expect(player.visual.position.y).toBe(player.body.position.y);
    player.capturePreviousPosition();
    player.body.position.x += 10;
    player.resetInterpolation();
    player.syncVisual(0.1);
    expect(player.visual.position.x).toBe(player.body.position.x);
    player.setPosition(-20, 9);
    player.syncVisual(0);
    expect(player.visual.position.toArray()).toEqual([-20, 9, 1]);
    player.dispose();
  });

  it.each([30, 60, 120, 144])('nội suy đều và camera theo visual ở %s FPS', (fps) => {
    const player = new Player();
    const camera = new GameCamera();
    player.setPosition(0, 0);
    let callback: FrameRequestCallback | undefined;
    let renderTime = 0;
    let steps = 0;
    const loop = new GameLoop((delta) => {
      player.capturePreviousPosition();
      player.body.position.x += 6 * delta;
      steps += 1;
    }, (_, alpha) => {
      const physicsX = player.body.position.x;
      player.syncVisual(alpha);
      camera.followX(player.visual.position.x);
      expect(player.body.position.x).toBe(physicsX);
      expect(camera.camera.position.x).toBe(player.visual.position.x);
      expect(player.visual.position.x).toBeCloseTo(Math.max(0, renderTime / 1000 - 1 / 60) * 6, 8);
    }, {
      request: (next) => { callback = next; return 1; },
      cancel: () => { callback = undefined; },
    });
    loop.start();
    for (let frame = 0; frame <= fps * 2; frame += 1) {
      renderTime = frame * 1000 / fps;
      callback?.(renderTime);
    }
    expect(steps).toBe(120);
    loop.stop();
    player.dispose();
  });
});

describe('animation theo thời gian mô phỏng', () => {
  it('cho cùng frame, hướng, sự kiện hoàn tất ở 30/60/120/144 FPS', () => {
    const timelines = [30, 60, 120, 144].map((fps) => {
      const animator = new PlayerAnimator(clips);
      const body = groundedBody();
      let callback: FrameRequestCallback | undefined;
      let step = 0;
      let renderedLanding = false;
      const timeline: string[] = [];
      const loop = new GameLoop((delta) => {
        step += 1;
        body.velocity.x = step < 40 ? 6 : -6;
        body.isGrounded = step >= 59;
        body.velocity.y = step < 30 ? 5 : body.isGrounded ? 0 : -5;
        const completion = animator.update(delta, body, step === 59);
        timeline.push(`${animator.controller.name}:${animator.controller.frameIndex}:${animator.facing}:${completion}`);
      }, () => {
        if (animator.controller.name === 'land') renderedLanding = true;
      }, {
        request: (next) => { callback = next; return 1; },
        cancel: () => { callback = undefined; },
      });
      loop.start();
      for (let frame = 0; frame <= fps * 2; frame += 1) callback?.(frame * 1000 / fps);
      loop.stop();
      expect(renderedLanding).toBe(true);
      expect(timeline).toHaveLength(120);
      expect(timeline.filter((entry) => entry.endsWith(':land'))).toHaveLength(1);
      return timeline;
    });
    for (const timeline of timelines.slice(1)) expect(timeline).toEqual(timelines[0]);
  });
});
