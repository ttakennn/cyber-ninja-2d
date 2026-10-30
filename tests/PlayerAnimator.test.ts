import { describe, expect, it } from 'vitest';
import { PlayerAnimator } from '../src/entities/PlayerAnimator';
import { clips, groundedBody } from './animation.fixtures';

const dt = 1 / 60;

describe('chuyển trạng thái animation nhân vật', () => {
  it('chuyển Idle ↔ Run và đổi hướng mà không tạo clip trái/phải', () => {
    const animator = new PlayerAnimator(clips);
    const body = groundedBody();
    animator.update(dt, body, false);
    expect(animator.controller.name).toBe('idle');
    body.velocity.x = 6;
    animator.update(0.15, body, false);
    expect(animator.controller.name).toBe('run');
    const controller = animator.controller;
    body.velocity.x = -6;
    animator.update(0.05, body, false);
    expect(animator.facing).toBe('left');
    expect(animator.controller).toBe(controller);
    expect(animator.controller.frameIndex).toBe(2);
    body.velocity.x = 0;
    animator.update(dt, body, false);
    expect(animator.controller.name).toBe('idle');
    expect(animator.facing).toBe('left');
    body.velocity.x = 6;
    animator.update(dt, body, false);
    expect(animator.facing).toBe('right');
  });

  it('chuyển Jump → Fall → Land từ trạng thái vật lý', () => {
    const animator = new PlayerAnimator(clips);
    const body = groundedBody();
    body.isGrounded = false;
    body.velocity.y = 11;
    animator.update(dt, body, false);
    expect(animator.controller.name).toBe('jump');
    body.velocity.y = -1;
    animator.update(dt, body, false);
    expect(animator.controller.name).toBe('fall');
    body.isGrounded = true;
    body.velocity.y = 0;
    animator.update(dt, body, true);
    expect(animator.controller.name).toBe('land');
  });

  it('giữ Land qua nhiều bước vật lý và tiếp tục Run khi clip hoàn tất', () => {
    const animator = new PlayerAnimator(clips);
    const body = groundedBody();
    body.velocity.x = 6;
    animator.update(dt, body, true);
    for (let step = 1; step < 18; step += 1) {
      expect(animator.controller.name).toBe('land');
      animator.update(dt, body, false);
    }
    expect(animator.controller.isComplete).toBe(true);
    expect(body.velocity.x).toBe(6);
    animator.update(dt, body, false);
    expect(animator.controller.name).toBe('run');
  });

  it('trở về Idle sau Land nếu không di chuyển', () => {
    const animator = new PlayerAnimator(clips);
    const body = groundedBody();
    expect(animator.update(0.3, body, true)).toBe('land');
    animator.update(dt, body, false);
    expect(animator.controller.name).toBe('idle');
  });

  it('cho phép Jump ngắt Land ngay lập tức', () => {
    const animator = new PlayerAnimator(clips);
    const body = groundedBody();
    animator.update(dt, body, true);
    body.isGrounded = false;
    body.velocity.y = 11;
    animator.update(dt, body, false);
    expect(animator.controller.name).toBe('jump');
  });

  it('rơi khỏi nền sẽ phát Fall kể cả chưa Jump và có thể ngắt Land', () => {
    const animator = new PlayerAnimator(clips);
    const body = groundedBody();
    animator.update(dt, body, true);
    body.isGrounded = false;
    body.velocity.y = -0.5;
    animator.update(dt, body, false);
    expect(animator.controller.name).toBe('fall');
  });

  it('từ chối bộ clip thiếu Land hoặc cấu hình Land lặp', () => {
    expect(() => new PlayerAnimator({ idle: clips.idle! })).toThrow();
    expect(() => new PlayerAnimator({ ...clips, land: { ...clips.land!, loop: true } })).toThrow();
  });
});
