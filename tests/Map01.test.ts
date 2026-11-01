import { describe, expect, it } from 'vitest';
import { gameConfig } from '../src/config/game.config';
import { Game } from '../src/core/Game';
import { Player } from '../src/entities/Player';
import type { MovementInput } from '../src/entities/PlayerMovementController';
import { overlaps } from '../src/physics/Collision';
import { PhysicsWorld } from '../src/physics/PhysicsWorld';
import { parseLevelData } from '../src/world/LevelData';
import { TestLevel } from '../src/world/TestLevel';
import { tilePosition } from '../src/world/TilemapData';
import { getLevelData } from '../src/world/levels';
import map01 from '../src/world/levels/map-01-graybox.json';
import { dt, noInput } from './movement.fixtures';

describe('dữ liệu camera và fall boundary', () => {
  it('đọc Map 1 và sao chép bounds, spawn hợp lệ đứng trên nền', () => {
    const input = structuredClone(map01);
    const level = parseLevelData(getLevelData('map01'));
    expect(level.id).toBe('map01');
    expect(level.cameraBounds).toEqual({ minX: 0, maxX: 80, minY: -3.5, maxY: 11.5 });
    expect(level.cameraFollowY).toBe(true);
    expect(level.deathY).toBe(-8);
    expect(level.tilemap?.columns).toBe(160);
    const parsed = parseLevelData(input);
    input.cameraBounds.minX = -100;
    expect(parsed.cameraBounds?.minX).toBe(0);
    const body = { position: level.spawn, width: 0.8, height: 1.6 };
    expect(new PhysicsWorld(-28, level.solids).canOccupy(body)).toBe(true);
    expect(body.position.y - body.height / 2).toBeCloseTo(-2.5);
  });

  it.each(['playground', 'small', 'tiles'])('level %s giữ các field mới vắng mặt', (id) => {
    const data = parseLevelData(getLevelData(id));
    expect(data.cameraBounds).toBeUndefined();
    expect(data.cameraFollowY).toBeUndefined();
    expect(data.deathY).toBeUndefined();
  });

  it.each([
    { fields: { cameraBounds: null }, path: 'cameraBounds' },
    { fields: { cameraBounds: [] }, path: 'cameraBounds' },
    { fields: { cameraBounds: {} }, path: 'cameraBounds.minX' },
    { fields: { cameraBounds: { ...map01.cameraBounds, minX: NaN } }, path: 'cameraBounds.minX' },
    { fields: { cameraBounds: { ...map01.cameraBounds, maxY: Infinity } }, path: 'cameraBounds.maxY' },
    { fields: { cameraBounds: { ...map01.cameraBounds, minX: 80 } }, path: 'minX < maxX' },
    { fields: { cameraBounds: { ...map01.cameraBounds, minY: 12 } }, path: 'minY < maxY' },
    { fields: { cameraBounds: { ...map01.cameraBounds, minX: -Number.MAX_VALUE, maxX: Number.MAX_VALUE } }, path: 'chiều rộng hữu hạn' },
    { fields: { cameraBounds: { ...map01.cameraBounds, minY: -Number.MAX_VALUE, maxY: Number.MAX_VALUE } }, path: 'chiều cao hữu hạn' },
    { fields: { cameraFollowY: 'true' }, path: 'cameraFollowY' },
    { fields: { cameraFollowY: null }, path: 'cameraFollowY' },
    { fields: { deathY: null }, path: 'deathY' },
    { fields: { deathY: '-8' }, path: 'deathY' },
    { fields: { deathY: NaN }, path: 'deathY' },
    { fields: { deathY: Infinity }, path: 'deathY' },
    { fields: { deathY: -1.7 }, path: 'thấp hơn tâm spawn' },
    { fields: { deathY: 0 }, path: 'thấp hơn tâm spawn' },
    { fields: { spawn: { x: -1, y: -1.7 } }, path: 'spawn' },
    { fields: { spawn: { x: 2, y: 12 } }, path: 'spawn' },
  ])('từ chối cấu hình sai tại $path', ({ fields, path }) => {
    expect(() => parseLevelData({ ...map01, ...fields })).toThrow(path);
  });

  it('cho phép theo dọc không bounds, false tường minh và kiểm spawn chồng solid trước WebGL', () => {
    expect(parseLevelData({ ...map01, cameraBounds: undefined, cameraFollowY: false }).cameraFollowY).toBe(false);
    expect(parseLevelData({ ...map01, cameraBounds: undefined }).cameraFollowY).toBe(true);
    expect(() => new Game({} as HTMLElement, { ...map01, spawn: { x: 2, y: -3 } })).toThrow('spawn không đủ khoảng trống');
  });
});

describe('graybox Map 1 với physics hiện có', () => {
  it('AABB không trùng/chồng nhau; terrain khớp geometry và layer trang trí không sinh collision', () => {
    const level = new TestLevel(map01);
    expect(level.colliders).toHaveLength(10);
    for (let a = 0; a < level.colliders.length; a += 1) for (let b = a + 1; b < level.colliders.length; b += 1) {
      expect(overlaps(level.colliders[a]!, level.colliders[b]!)).toBe(false);
    }
    const data = parseLevelData(map01);
    const map = data.tilemap!;
    const counts = data.solids.map(() => 0);
    for (const [row, cells] of map.layers[1]!.cells.entries()) for (const [column, tile] of cells.entries()) {
      if (tile === null) continue;
      const center = tilePosition(map, column, row);
      const index = data.solids.findIndex((solid) => Math.abs(center.x - solid.position.x) < solid.width / 2 && Math.abs(center.y - solid.position.y) < solid.height / 2);
      expect(index).toBeGreaterThanOrEqual(0);
      counts[index]! += 1;
    }
    expect(counts).toEqual(data.solids.map((solid) => solid.width * solid.height / 0.25));
    const stripped = new TestLevel({ ...map01, tilemap: undefined, visuals: [] });
    expect(stripped.colliders).toEqual(level.colliders);
    expect(stripped.climbables).toEqual(level.climbables);
    expect(stripped.spawn).toEqual(level.spawn);
    stripped.dispose();
    level.dispose();
  });

  it('mọi chuyển mái cách 2 unit, độ cao nằm dưới giới hạn nhảy theo tham số thực', () => {
    const { runSpeed, jumpVelocity } = gameConfig.player;
    const gravity = -gameConfig.physics.gravity;
    expect(jumpVelocity ** 2 / (2 * gravity)).toBeCloseTo(2.1607, 3);
    expect(runSpeed * 2 * jumpVelocity / gravity).toBeCloseTo(4.7143, 3);
    const roofs = map01.solids.filter((solid) => solid.id === 'upper-roof' || /^roof-/.test(solid.id));
    for (let index = 1; index < roofs.length; index += 1) {
      const from = roofs[index - 1]!;
      const to = roofs[index]!;
      const gap = to.position.x - to.width / 2 - (from.position.x + from.width / 2);
      const rise = to.position.y + to.height / 2 - (from.position.y + from.height / 2);
      const descendingTime = (jumpVelocity + Math.sqrt(jumpVelocity ** 2 - 2 * gravity * rise)) / gravity;
      expect(gap).toBe(2);
      expect(rise).toBeLessThan(jumpVelocity ** 2 / (2 * gravity));
      expect(gap + 1).toBeLessThan(runSpeed * descendingTime);
    }
  });

  it('đi toàn tuyến A → B → C qua input 60 Hz: hầm, bậc, thang, ban công và ba khoảng hở', () => {
    const level = new TestLevel(map01);
    const player = new Player(level.spawn);
    const world = new PhysicsWorld(gameConfig.physics.gravity, level.colliders, level.climbables);
    const run = (steps: number, input: MovementInput = noInput) => {
      for (let step = 0; step < steps; step += 1) {
        const landed = player.updateMovement(world, dt, { ...input, jump: step === 0 && input.jump,
          enterClimb: step === 0 && input.enterClimb, detachJump: step === 0 && input.detachJump });
        player.updateState(landed);
        player.updateAnimation(dt, landed);
        expect(world.canOccupy(player.body)).toBe(true);
      }
    };
    const right = { ...noInput, horizontal: 1 };
    const jumpRight = { ...right, jump: true };
    const walkTo = (x: number) => {
      for (let step = 0; step < 1000 && player.body.position.x < x - 1e-6; step += 1) run(1, right);
      expect(player.body.position.x).toBeGreaterThanOrEqual(x - 1e-6);
      expect(player.body.position.x).toBeLessThan(x + gameConfig.player.runSpeed * dt + 1e-6);
    };
    run(2);
    walkTo(6);
    run(45, jumpRight);
    run(80, { ...right, crouch: true });
    expect(player.movement.stance).toBe('crouching');
    run(1);
    expect(player.movement.standingBlocked).toBe(true);
    expect(player.body.height).toBe(0.9);
    run(100, { ...right, crouch: true });
    run(1);
    expect(player.movement.stance).toBe('standing');
    walkTo(20);
    run(45, jumpRight);
    run(90);
    walkTo(29);
    run(1, { ...noInput, enterClimb: true });
    expect(player.body.position.x).toBeCloseTo(29);
    expect(player.movement.activeClimbable?.id).toBe('alley-ladder');
    run(130, { ...noInput, vertical: 1 });
    expect(player.body.position.y).toBeCloseTo(3.2);
    run(20, { ...noInput, vertical: -1 });
    const stoppedY = player.body.position.y;
    run(60);
    expect(player.body.position.y).toBe(stoppedY);
    run(20, { ...noInput, vertical: 1 });
    run(30, right);
    run(60);
    expect(player.body.position.y).toBeCloseTo(1.8);
    expect(player.movement.activeClimbable).toBeNull();
    run(6, right);
    run(30, jumpRight);
    run(60);
    expect(player.body.position.x).toBeCloseTo(35.6);
    expect(player.body.position.y).toBeCloseTo(1.8);
    run(35, jumpRight);
    run(60);
    expect(player.body.position.y).toBeCloseTo(2.8);
    walkTo(47.5);
    expect(player.body.position.x).toBeCloseTo(47.5);
    for (const [index, targetY] of [3.8, 4.3, 3.8].entries()) {
      run(35, jumpRight);
      run(60);
      expect(player.body.position.y).toBeCloseTo(targetY);
      expect(player.body.isGrounded).toBe(true);
      if (index < 2) run(65, right);
    }
    run(60, right);
    expect(player.body.position.x).toBeCloseTo(77);
    expect(player.body.isGrounded).toBe(true);
    player.dispose();
    level.dispose();
  });
});
