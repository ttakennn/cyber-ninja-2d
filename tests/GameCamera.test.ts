import { describe, expect, it } from 'vitest';
import { GameCamera } from '../src/rendering/GameCamera';

describe('orthographic camera', () => {
  it('starts with a 16 by 9 reference viewport', () => {
    const { camera } = new GameCamera();
    expect(camera.right - camera.left).toBe(16);
    expect(camera.top - camera.bottom).toBe(9);
  });

  it('keeps the vertical span fixed and adjusts horizontal span on resize', () => {
    const camera = new GameCamera();
    camera.resize(800, 800);
    expect(camera.camera.right - camera.camera.left).toBe(9);
    expect(camera.camera.top - camera.camera.bottom).toBe(9);
    camera.resize(1600, 900);
    expect(camera.camera.right - camera.camera.left).toBe(16);
  });

  it('follows horizontally without changing vertical position or depth', () => {
    const camera = new GameCamera();
    camera.followX(12);
    expect(camera.camera.position.toArray()).toEqual([12, 0, 10]);
  });
});
