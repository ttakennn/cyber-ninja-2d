import { Mesh } from 'three';
import type { MeshBasicMaterial, PlaneGeometry } from 'three';
import { describe, expect, it } from 'vitest';
import { gameConfig } from '../src/config/game.config';
import { Game } from '../src/core/Game';
import { Player } from '../src/entities/Player';
import type { AABB, ClimbableZone } from '../src/physics/Collision';
import { PhysicsWorld } from '../src/physics/PhysicsWorld';
import { parseLevelData } from '../src/world/LevelData';
import { TestLevel } from '../src/world/TestLevel';
import { getLevelData } from '../src/world/levels';
import playground from '../src/world/levels/playground.json';
import small from '../src/world/levels/small.json';
import { dt, noInput } from './movement.fixtures';

// Mốc hình học Task 004, độc lập với dữ liệu mới để phát hiện thay đổi ngoài ý muốn.
const originalSolids: readonly AABB[] = [
  { position: { x: 0, y: -3.25 }, width: 160, height: 1.5 },
  { position: { x: 4, y: -1.9 }, width: 1.2, height: 1.2 },
  { position: { x: -5, y: -1.15 }, width: 4, height: 0.5 },
  { position: { x: 10.6, y: 1 }, width: 4, height: 0.4 },
];
const originalLadder: ClimbableZone = {
  id: 'ladder-test', kind: 'ladder', position: { x: 8, y: 0.45 }, width: 1, height: 5.9,
};

describe('đọc và kiểm tra dữ liệu level', () => {
  it('đọc hai JSON đã đăng ký và giữ spawn mặc định tương thích', () => {
    expect(parseLevelData(getLevelData()).id).toBe('playground');
    expect(parseLevelData(getLevelData('small')).id).toBe('small');
    expect(parseLevelData(playground).spawn).toEqual({ x: 0, y: 1.8 });
    expect(gameConfig.player.spawn).toEqual(playground.spawn);
    expect(parseLevelData(small).spawn).toEqual({ x: -2, y: 1 });
  });

  it.each(['missing', '', 'toString', '__proto__'])('báo lỗi khi chọn level không tồn tại: %s', (id) => {
    expect(() => getLevelData(id)).toThrow('Không tìm thấy level');
  });

  it.each(['version', 'id', 'spawn', 'solids', 'climbables', 'visuals'])('báo rõ trường bắt buộc bị thiếu: %s', (key) => {
    const data: Record<string, unknown> = structuredClone(playground);
    delete data[key];
    expect(() => parseLevelData(data)).toThrow(key);
  });

  it.each([
    { name: 'root null', value: null, path: 'level' },
    { name: 'sai version', value: { ...playground, version: 2 }, path: 'version' },
    { name: 'id rỗng', value: { ...playground, id: ' ' }, path: 'id' },
    { name: 'spawn không phải object', value: { ...playground, spawn: [] }, path: 'spawn' },
    { name: 'tọa độ NaN', value: { ...playground, spawn: { x: NaN, y: 0 } }, path: 'spawn.x' },
    { name: 'tọa độ vô hạn', value: { ...playground, spawn: { x: 0, y: Infinity } }, path: 'spawn.y' },
    { name: 'tọa độ chuỗi', value: { ...playground, spawn: { x: '0', y: 0 } }, path: 'spawn.x' },
    { name: 'solids không phải mảng', value: { ...playground, solids: {} }, path: 'solids' },
    { name: 'solid null', value: { ...playground, solids: [null] }, path: 'solids[0]' },
    { name: 'width bằng 0', value: { ...playground, solids: [{ ...playground.solids[0], width: 0 }] }, path: 'solids[0].width' },
    { name: 'height âm', value: { ...playground, solids: [{ ...playground.solids[0], height: -1 }] }, path: 'solids[0].height' },
    { name: 'width vô hạn', value: { ...playground, solids: [{ ...playground.solids[0], width: Infinity }] }, path: 'solids[0].width' },
    { name: 'thiếu position', value: { ...playground, solids: [{ id: 'box', width: 1, height: 1 }] }, path: 'solids[0].position' },
    { name: 'biên tràn số', value: { ...playground, solids: [{ id: 'box', position: { x: Number.MAX_VALUE, y: 0 }, width: Number.MAX_VALUE, height: 1 }] }, path: 'biên hình chữ nhật' },
    { name: 'loại vùng leo sai', value: { ...playground, climbables: [{ ...playground.climbables[0], kind: 'wall' }] }, path: 'climbables[0].kind' },
    { name: 'trùng id hai category', value: { ...playground, climbables: [{ ...playground.climbables[0], id: 'ground' }] }, path: 'bị trùng' },
    { name: 'visual tham chiếu sai', value: { ...playground, visuals: [{ shapeId: 'missing', kind: 'rectangle', color: '#ffffff' }] }, path: 'visuals[0].shapeId' },
    { name: 'visual kind sai', value: { ...playground, visuals: [{ shapeId: 'ground', kind: 'tilemap', color: '#ffffff' }] }, path: 'visuals[0].kind' },
    { name: 'màu không hợp lệ', value: { ...playground, visuals: [{ shapeId: 'ground', kind: 'rectangle', color: '#12ZZZZ' }] }, path: 'visuals[0].color' },
    { name: 'opacity sai', value: { ...playground, visuals: [{ shapeId: 'ground', kind: 'rectangle', color: 0, opacity: 2 }] }, path: 'visuals[0].opacity' },
    { name: 'ladder trỏ solid', value: { ...playground, visuals: [{ shapeId: 'ground', kind: 'ladder', color: 0 }] }, path: 'tham chiếu vùng leo' },
    { name: 'khoảng bậc bằng 0', value: { ...playground, visuals: [{ shapeId: 'ladder-test', kind: 'ladder', color: 0, rungSpacing: 0 }] }, path: 'rungSpacing' },
    { name: 'quá nhiều bậc', value: { ...playground, visuals: [{ shapeId: 'ladder-test', kind: 'ladder', color: 0, rungSpacing: 1e-10 }] }, path: '4096' },
  ])('$name', ({ value, path }) => {
    expect(() => parseLevelData(value)).toThrow(path);
  });

  it('chuẩn hóa màu/default visual và không giữ tham chiếu dữ liệu đầu vào', () => {
    const input = structuredClone(playground);
    const parsed = parseLevelData(input);
    expect(parsed.visuals[0]?.color).toBe(0x27374c);
    expect(parsed.visuals[0]?.opacity).toBe(1);
    input.spawn.x = 100;
    input.solids[0]!.position.x = 100;
    input.visuals[0]!.color = '#ffffff';
    expect(parsed.spawn.x).toBe(0);
    expect(parsed.solids[0]?.position.x).toBe(0);
    expect(parsed.visuals[0]?.color).toBe(0x27374c);
    const defaults = parseLevelData({ ...playground, visuals: [{ shapeId: 'ladder-test', kind: 'ladder', color: 0x578bbf }] });
    expect(defaults.visuals[0]).toEqual({ shapeId: 'ladder-test', kind: 'ladder', color: 0x578bbf, opacity: 1, rungSpacing: 0.4, structureOpacity: 1 });
  });

  it('cho phép mảng rỗng, collision vô hình hoặc visual khác mà không tự đổi collision', () => {
    expect(parseLevelData({ ...playground, solids: [], climbables: [], visuals: [] }).solids).toEqual([]);
    const original = parseLevelData(playground);
    const changed = parseLevelData({ ...playground, visuals: [{ shapeId: 'ladder-test', kind: 'rectangle', color: '#ffffff' }] });
    expect(changed.solids).toEqual(original.solids);
    expect(changed.climbables).toEqual(original.climbables);
  });

  it('báo lỗi dữ liệu và spawn chồng solid trước khi cần DOM/WebGL', () => {
    expect(() => new TestLevel({ ...playground, spawn: null })).toThrow('spawn');
    expect(() => new Game({} as HTMLElement, { ...playground, spawn: { x: 0, y: -3.25 } })).toThrow('spawn không đủ khoảng trống');
  });
});

describe('playground dựng từ dữ liệu giữ tương ứng Task 004', () => {
  it('giữ nguyên thứ tự và toàn bộ AABB, climbable, spawn và khoảng hầm', () => {
    const level = new TestLevel();
    expect(level.colliders.map(({ position, width, height }) => ({ position, width, height }))).toEqual(originalSolids);
    expect(level.climbables).toEqual([originalLadder]);
    expect(level.spawn).toEqual({ x: 0, y: 1.8 });
    const groundTop = level.colliders[0]!.position.y + level.colliders[0]!.height / 2;
    const roofBottom = level.colliders[2]!.position.y - level.colliders[2]!.height / 2;
    expect(roofBottom - groundTop).toBeCloseTo(1.1);
    level.dispose();
  });

  it('visual giữ kích thước/màu cũ, ray và bậc thang không thành solid', () => {
    const level = new TestLevel();
    expect(level.visual.children).toHaveLength(22);
    for (const [index, box] of [...originalSolids, originalLadder].entries()) {
      const mesh = level.visual.children[index] as Mesh<PlaneGeometry, MeshBasicMaterial>;
      expect([mesh.position.x, mesh.position.y, mesh.geometry.parameters.width, mesh.geometry.parameters.height])
        .toEqual([box.position.x, box.position.y, box.width, box.height]);
      expect(mesh.material.color.getHex()).toBe(index === 0 ? 0x27374c : index === 4 ? 0x578bbf : 0xd69b64);
      expect(mesh.material.opacity).toBe(index === 4 ? 0.2 : 1);
    }
    for (let index = 0; index < 15; index += 1) {
      expect(level.visual.children[7 + index]!.position.y).toBeCloseTo(-2.3 + index * 0.4, 10);
    }
    expect(level.colliders).toHaveLength(4);
    level.dispose();
  });

  it('cùng input cho cùng physics, stance và visual trước/sau chuyển dữ liệu', () => {
    const level = new TestLevel();
    const worlds = [new PhysicsWorld(-28, originalSolids, [originalLadder]), new PhysicsWorld(-28, level.colliders, level.climbables)];
    const players = [new Player(), new Player(level.spawn)];
    const run = (steps: number, input = noInput) => {
      for (let step = 0; step < steps; step += 1) {
        players.forEach((player, index) => {
          player.capturePreviousPosition();
          const landed = player.updateMovement(worlds[index]!, dt, input);
          player.updateState(landed);
          player.updateAnimation(dt, landed);
          player.syncVisual(0.35);
        });
        expect(players[1]!.body).toEqual(players[0]!.body);
        expect(players[1]!.movement.stance).toBe(players[0]!.movement.stance);
        expect(players[1]!.movement.mode).toBe(players[0]!.movement.mode);
        expect(players[1]!.visual.position.toArray()).toEqual(players[0]!.visual.position.toArray());
      }
    };
    run(90);
    for (const player of players) { player.setPosition(-2.4, -1.7); player.body.isGrounded = true; }
    run(80, { ...noInput, crouch: true, horizontal: -1 });
    run(100, { ...noInput, horizontal: 1 });
    for (const player of players) { player.setPosition(8, -1.7); player.body.isGrounded = true; }
    run(1, { ...noInput, enterClimb: true });
    run(80, { ...noInput, vertical: 1 });
    run(30, { ...noInput, vertical: -1 });
    run(20);
    run(1, { ...noInput, detachJump: true });
    run(100);
    for (const player of players) player.dispose();
    level.dispose();
  });

  it('level nhỏ dùng spawn riêng và cùng physics để leo lên sàn khác', () => {
    const level = new TestLevel(getLevelData('small'));
    const player = new Player(level.spawn);
    const world = new PhysicsWorld(-28, level.colliders, level.climbables);
    expect(player.body.position).toEqual({ x: -2, y: 1 });
    player.syncVisual(0);
    expect(player.visual.position.toArray()).toEqual([-2, 1, 1]);
    for (let step = 0; step < 120; step += 1) player.updateMovement(world, dt, noInput);
    expect(player.body.position.y - player.body.height / 2).toBeCloseTo(-2.5);
    player.setPosition(3, -1.7);
    player.body.isGrounded = true;
    player.updateMovement(world, dt, { ...noInput, enterClimb: true });
    expect(player.movement.activeClimbable?.kind).toBe('scaffolding');
    for (let step = 0; step < 120; step += 1) player.updateMovement(world, dt, { ...noInput, vertical: 1 });
    for (let step = 0; step < 20; step += 1) player.updateMovement(world, dt, { ...noInput, horizontal: 1 });
    for (let step = 0; step < 60; step += 1) player.updateMovement(world, dt, noInput);
    expect(player.movement.mode).toBe('grounded');
    expect(player.body.position.y - player.body.height / 2).toBeCloseTo(-0.6);
    expect(world.canOccupy(player.body)).toBe(true);
    player.dispose();
    level.dispose();
  });
});
