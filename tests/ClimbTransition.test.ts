import { describe, expect, it } from 'vitest';
import { AnimationController } from '../src/animation/AnimationController';
import { parseSpriteSheet } from '../src/animation/SpriteSheetLoader';
import { PlayerAnimator } from '../src/entities/PlayerAnimator';
import metadata from '../public/assets/characters/ninja/animations.json';
import { clips } from './animation.fixtures';
import { dt } from './movement.fixtures';

const production = parseSpriteSheet(metadata).clips;
const climbing = { mode: 'climbing', stance: 'standing' } as const;

describe('giữ pha animation khi đổi chiều leo', () => {
  it('chuyển hai loop khác độ dài/FPS theo pha, giữ hành vi reset mặc định', () => {
    const controller = new AnimationController(clips, 'run');
    controller.update(0.3);
    expect(controller.frameIndex).toBe(3);
    controller.play('idle', false, true);
    expect(controller.frameIndex).toBe(1);
    controller.update(0.05);
    expect(controller.frameIndex).toBe(0);
    controller.play('run');
    expect(controller.frameIndex).toBe(0);
    controller.update(0.2);
    controller.play('run', true, true);
    expect(controller.frameIndex).toBe(0);
  });

  it('không kế thừa pha vào one-shot hoặc từ one-shot đã hoàn tất', () => {
    const controller = new AnimationController(clips, 'run');
    controller.update(0.3);
    controller.play('land', false, true);
    expect(controller.frameIndex).toBe(0);
    expect(controller.update(0.3)).toBe('land');
    expect(controller.update(0.3)).toBeNull();
    controller.play('run', false, true);
    expect(controller.frameIndex).toBe(0);
  });

  it.each([1, 3, 6])('đổi Up ↔ Down tại frame %s mà không kéo về đầu clip', (frame) => {
    const animator = new PlayerAnimator(production);
    const body = { position: { x: 8, y: 0 }, velocity: { x: 0, y: 1 }, width: 0.8, height: 1.6, isGrounded: false };
    animator.facing = 'left';
    for (let step = 0; step < frame * 6; step += 1) animator.update(dt, body, false, climbing);
    expect(animator.controller.frameIndex).toBe(frame);
    body.velocity.y = -1;
    animator.update(0, body, false, climbing);
    expect(animator.controller.name).toBe('climbDown');
    expect(animator.controller.frameIndex).toBe(frame);
    body.velocity.y = 0;
    for (let step = 0; step < 60; step += 1) animator.update(dt, body, false, climbing);
    expect(animator.controller.frameIndex).toBe(frame);
    body.velocity.y = 1;
    animator.update(0, body, false, climbing);
    expect(animator.controller.name).toBe('climbUp');
    expect(animator.controller.frameIndex).toBe(frame);
    expect(animator.renderFacing).toBe('right');
    expect(body.position).toEqual({ x: 8, y: 0 });
  });

  it('đổi chiều liên tục vẫn tiến theo tổng quãng đường thay vì reset mỗi bước', () => {
    const animator = new PlayerAnimator(production);
    const body = { position: { x: 8, y: 0 }, velocity: { x: 0, y: 1 }, width: 0.8, height: 1.6, isGrounded: false };
    for (let step = 0; step < 240; step += 1) {
      body.velocity.y = step % 2 === 0 ? 1 : -1;
      animator.update(dt, body, false, climbing);
      expect(animator.controller.frameIndex).toBe(Math.floor((step + 1) / 6 + 1e-9) % 8);
    }
    body.isGrounded = true;
    body.velocity.y = 0;
    animator.update(dt, body, true, { mode: 'grounded', stance: 'standing' });
    expect(animator.controller.name).toBe('land');
    expect(animator.controller.frameIndex).toBe(0);
  });
});
