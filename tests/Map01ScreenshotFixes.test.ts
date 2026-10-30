import { describe, expect, it } from 'vitest';
import type { PhysicsBody } from '../src/physics/Collision';
import { PhysicsWorld } from '../src/physics/PhysicsWorld';
import { parseLevelData } from '../src/world/LevelData';
import { TestLevel } from '../src/world/TestLevel';
import pilot from '../src/world/levels/map-01-visual-pilot.json';
import graybox from '../src/world/levels/map-01-graybox.json';

describe('Map01: sửa theo năm ảnh người dùng', () => {
  it('chỉ thêm một tường chặn X=37, không đổi các collider cũ và vùng leo', () => {
    expect(pilot.solids.slice(0, 10)).toEqual(graybox.solids);
    expect(pilot.solids).toHaveLength(11);
    expect(pilot.solids[10]).toEqual({ id: 'upper-roof-support', position: { x: 42.5, y: -1.75 }, width: 11, height: 5.5 });
    expect(pilot.climbables).toEqual(graybox.climbables);
    const body: PhysicsBody = { position: { x: 36, y: -1.7 }, velocity: { x: 6, y: 0 }, width: 0.8, height: 1.6, isGrounded: true };
    new PhysicsWorld(-28, pilot.solids).moveHorizontal(body, 4);
    expect(body.position.x).toBeCloseTo(36.6);
  });

  it('tường che dưới các mái là visual opaque, không sinh thêm collider ở mái sau', () => {
    const level = new TestLevel(pilot);
    const panels = level.visual.children.filter((entry) => entry.position.z === -0.6);
    expect(panels).toHaveLength(5);
    expect(level.colliders).toHaveLength(11);
    expect(parseLevelData(pilot).visuals.filter((entry) => entry.kind === 'rectangle')
      .every((entry) => entry.opacity === 1 && entry.kind === 'rectangle' && entry.bottom === -4.5)).toBe(true);
    level.dispose();
  });

  it('bù chân quán theo alpha, biển Nhà thuốc nằm trong mặt tiền thay vì trên trời', () => {
    const shop = pilot.environment.decorations.find(({ id }) => id === 'foreground-street_shop_awning-9')!;
    expect(shop.worldPosition.y + 9 / 330 * shop.worldSize.height).toBeCloseTo(-2.5);
    const pharmacy = pilot.environment.decorations.find(({ id }) => id === 'props-sign-pharmacy-2')!;
    expect(pharmacy.worldPosition).toEqual({ x: 16.35, y: 2 });
    expect(pharmacy.worldPosition.y + pharmacy.worldSize.height).toBeLessThan(3.5);
    for (const id of ['props-street-tree-3', 'props-aircon-unit-4', 'production-wall-b-ac-mount']) {
      expect(pilot.environment.decorations.some((entry) => entry.id === id)).toBe(false);
    }
  });

  it('visual bottom/z tùy chọn không ảnh hưởng level cũ và báo lỗi dữ liệu sai', () => {
    expect(parseLevelData(graybox).visuals[0]).not.toHaveProperty('bottom');
    for (const fields of [{ bottom: Infinity }, { bottom: 100 }, { z: 10 }, { z: -90 }]) {
      expect(() => parseLevelData({ ...pilot, visuals: [{ kind: 'rectangle', shapeId: 'street', color: '#182656', ...fields }] })).toThrow('visuals[0]');
    }
  });
});
