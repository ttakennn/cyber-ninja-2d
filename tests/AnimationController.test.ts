import { describe, expect, it } from 'vitest';
import { AnimationController } from '../src/animation/AnimationController';
import { clips } from './animation.fixtures';

describe('bộ điều khiển animation thuần', () => {
  it('tiến frame theo thời gian mô phỏng', () => {
    const controller = new AnimationController(clips, 'run');
    controller.update(0.05);
    expect(controller.frameIndex).toBe(0);
    controller.update(0.05);
    expect(controller.frameIndex).toBe(1);
    expect(controller.frame).toBe(clips.run!.frames[1]);
  });

  it('lặp đúng khi đi qua nhiều vòng trong một lần cập nhật', () => {
    const controller = new AnimationController(clips, 'run');
    expect(controller.update(1.15)).toBeNull();
    expect(controller.frameIndex).toBe(3);
    controller.update(0.05);
    expect(controller.frameIndex).toBe(0);
    expect(controller.isComplete).toBe(false);
  });

  it('giữ frame cuối và phát sự kiện hoàn tất đúng một lần', () => {
    const controller = new AnimationController(clips, 'land');
    controller.update(0.2);
    expect(controller.frameIndex).toBe(2);
    expect(controller.isComplete).toBe(false);
    expect(controller.update(0.1)).toBe('land');
    expect(controller.isComplete).toBe(true);
    expect(controller.update(1)).toBeNull();
    expect(controller.frameIndex).toBe(2);
    controller.play('land');
    expect(controller.update(1)).toBeNull();
    controller.play('land', true);
    expect(controller.update(0.3)).toBe('land');
  });

  it('không đặt lại clip khi trạng thái yêu cầu không đổi', () => {
    const controller = new AnimationController(clips, 'run');
    for (let step = 0; step < 12; step += 1) {
      controller.play('run');
      controller.update(1 / 60);
    }
    expect(controller.frameIndex).toBe(2);
    controller.play('idle');
    expect(controller.frameIndex).toBe(0);
  });

  it('kết hợp tốc độ clip và tốc độ phát, hỗ trợ tốc độ bằng không', () => {
    const controller = new AnimationController({ run: { ...clips.run!, speed: 2 } }, 'run');
    controller.setPlaybackSpeed(0.5);
    controller.update(0.1);
    expect(controller.frameIndex).toBe(1);
    controller.setPlaybackSpeed(0);
    controller.update(1);
    expect(controller.frameIndex).toBe(1);
  });

  it('từ chối clip hoặc thời gian không hợp lệ', () => {
    expect(() => new AnimationController({ run: { ...clips.run!, frames: [] } }, 'run')).toThrow();
    expect(() => new AnimationController({ run: { ...clips.run!, fps: 0 } }, 'run')).toThrow();
    const controller = new AnimationController(clips, 'idle');
    expect(() => controller.play('missing')).toThrow();
    expect(() => controller.setPlaybackSpeed(-1)).toThrow();
    expect(() => controller.update(NaN)).toThrow();
  });
});
