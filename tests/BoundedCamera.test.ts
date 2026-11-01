import { describe, expect, it } from 'vitest';
import { Player } from '../src/entities/Player';
import { GameCamera } from '../src/rendering/GameCamera';

const bounds = { minX: 0, maxX: 80, minY: -4.5, maxY: 11.5 };

describe('camera theo viewport và biên level', () => {
  it('giữ chế độ ngang và Y=0 ở level cũ', () => {
    const camera = new GameCamera();
    camera.follow({ x: -20, y: 50 });
    expect(camera.camera.position.toArray()).toEqual([-20, 0, 10]);
    camera.followX(90);
    expect(camera.camera.position.toArray()).toEqual([90, 0, 10]);
    camera.reset({ x: 2, y: -1.7 });
    expect(camera.camera.position.toArray()).toEqual([2, 0, 10]);
  });

  it('clamp ngang tính cả nửa viewport, không clamp tâm player vào biên', () => {
    const camera = new GameCamera(bounds);
    camera.follow({ x: -10, y: 5 });
    expect(camera.camera.position.toArray()).toEqual([8, 0, 10]);
    camera.follow({ x: 30, y: 5 });
    expect(camera.camera.position.toArray()).toEqual([30, 0, 10]);
    camera.followX(100);
    expect(camera.camera.position.x).toBe(72);
  });

  it('bật theo dọc tường minh và clamp đúng viewport cao 9', () => {
    const camera = new GameCamera(bounds, true);
    camera.follow({ x: 30, y: -10 });
    expect(camera.camera.position.y).toBe(0);
    camera.follow({ x: 30, y: 4 });
    expect(camera.camera.position.y).toBe(4);
    camera.follow({ x: 30, y: 20 });
    expect(camera.camera.position.y).toBe(7);
    expect(camera.camera.position.z).toBe(10);
  });

  it('theo dọc không cần bounds khi được bật và không sửa body', () => {
    const camera = new GameCamera(undefined, true);
    const player = new Player({ x: 20, y: 3 });
    player.capturePreviousPosition();
    player.body.position.x = 21;
    player.body.position.y = 4;
    player.syncVisual(0.25);
    camera.follow(player.visual.position);
    expect(camera.camera.position.toArray()).toEqual([20.25, 3.25, 10]);
    expect(player.body.position).toEqual({ x: 21, y: 4 });
    player.dispose();
  });

  it.each([[1920, 1080], [1280, 720], [1024, 768], [540, 960]])('cúi/đứng 20 lần giữ chân nội suy và camera Y trên mái ở %s×%s', (width, height) => {
    const camera = new GameCamera(bounds, true);
    camera.resize(width!, height!);
    for (const [x, footY] of [[54, 3], [64, 3.5], [75, 3]] as const) {
      const player = new Player({ x, y: footY + 0.8 });
      for (let cycle = 0; cycle < 20; cycle += 1) {
        player.capturePreviousPosition();
        player.body.height = cycle % 2 === 0 ? 0.9 : 1.6;
        player.body.position.y = footY + player.body.height / 2;
        for (const alpha of [0, 0.25, 0.5, 1]) {
          player.syncVisual(alpha);
          camera.follow(player.visual.position, player.renderHeight);
          expect(player.visual.position.y - player.renderHeight / 2).toBeCloseTo(footY);
          expect(camera.camera.position.y).toBeCloseTo(footY + 0.8);
        }
      }
      player.dispose();
    }
  });

  it('resize re-clamp ngay cả trước frame follow kế tiếp', () => {
    const camera = new GameCamera(bounds, true);
    camera.resize(800, 600);
    camera.follow({ x: 100, y: 20 });
    expect(camera.camera.position.toArray()).toEqual([74, 7, 10]);
    camera.resize(1600, 900);
    expect(camera.camera.position.toArray()).toEqual([72, 7, 10]);
    expect(camera.camera.right - camera.camera.left).toBe(16);
  });

  it('world nhỏ hơn viewport được đặt giữa cả hai trục, không clamp ngược', () => {
    const camera = new GameCamera({ minX: 10, maxX: 14, minY: 2, maxY: 6 }, true);
    camera.follow({ x: -100, y: 100 });
    expect(camera.camera.position.toArray()).toEqual([12, 4, 10]);
    camera.resize(2400, 600);
    camera.reset({ x: 14, y: 2 });
    expect(camera.camera.position.toArray()).toEqual([12, 4, 10]);
  });

  it('viewport rộng hơn toàn map đặt giữa X nhưng vẫn clamp/follow Y', () => {
    const camera = new GameCamera(bounds, true);
    camera.resize(10000, 600);
    camera.follow({ x: 1000, y: 4 });
    expect(camera.camera.position.toArray()).toEqual([40, 4, 10]);
    camera.resize(1280, 720);
    camera.reset({ x: 2, y: -1.7 });
    expect(camera.camera.position.toArray()).toEqual([8, 0, 10]);
  });

  it('theo liên tục tại biên và reset tức thời từ mái nhà về spawn', () => {
    const camera = new GameCamera(bounds, true);
    camera.follow({ x: 7.99, y: 4 });
    expect(camera.camera.position.x).toBe(8);
    camera.follow({ x: 8.01, y: 4 });
    expect(camera.camera.position.x).toBe(8.01);
    camera.follow({ x: 77, y: 4 });
    expect(camera.camera.position.x).toBe(72);
    camera.reset({ x: 2, y: -1.7 });
    expect(camera.camera.position.toArray()).toEqual([8, 0, 10]);
  });
});
