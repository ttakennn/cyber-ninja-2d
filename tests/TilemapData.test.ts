import { readFileSync } from 'node:fs';
import { Mesh } from 'three';
import type { MeshBasicMaterial, PlaneGeometry } from 'three';
import { describe, expect, it } from 'vitest';
import { Player } from '../src/entities/Player';
import { PhysicsWorld } from '../src/physics/PhysicsWorld';
import { parseLevelData } from '../src/world/LevelData';
import { parseTilemapData, tilePosition } from '../src/world/TilemapData';
import { TestLevel } from '../src/world/TestLevel';
import { getLevelData } from '../src/world/levels';
import playground from '../src/world/levels/playground.json';
import small from '../src/world/levels/small.json';
import tiles from '../src/world/levels/tiles.json';
import { dt, noInput } from './movement.fixtures';

function fixture() {
  return { origin: { x: -2, y: 3 }, columns: 2, rows: 2, tileSize: { width: 0.5, height: 1 },
    tileset: { image: 'tiles.svg', imageWidth: 64, imageHeight: 32, tileWidth: 16, tileHeight: 16 },
    layers: [{ id: 'back', cells: [[0, null], [4, 7]] }, { id: 'front', opacity: 0.4, cells: [[null, 1], [null, null]] }] };
}

describe('schema tilemap và tọa độ', () => {
  it('đọc atlas, ID 0, ô null, thứ tự layer và clone dữ liệu', () => {
    const input = fixture();
    const map = parseTilemapData(input);
    expect(map.layers.map(({ id, opacity }) => ({ id, opacity }))).toEqual([{ id: 'back', opacity: 1 }, { id: 'front', opacity: 0.4 }]);
    expect(map.layers[0]?.cells).toEqual([[0, null], [4, 7]]);
    input.origin.x = 100;
    input.layers[0]!.cells[0]![0] = 5;
    input.tileset.imageWidth = 999;
    expect(map.origin.x).toBe(-2);
    expect(map.layers[0]?.cells[0]?.[0]).toBe(0);
    expect(map.tileset.imageWidth).toBe(64);
  });

  it('đổi góc trên trái sang tâm world theo hàng xuống dưới và tile không vuông', () => {
    const map = parseTilemapData(fixture());
    expect(tilePosition(map, 0, 0)).toEqual({ x: -1.75, y: 2.5 });
    expect(tilePosition(map, 1, 1)).toEqual({ x: -1.25, y: 1.5 });
    expect(() => tilePosition(map, 2, 0)).toThrow('[0][2]');
    expect(() => tilePosition(map, -1, 0)).toThrow();
    expect(() => tilePosition(map, 0, 0.5)).toThrow();
  });

  it.each(['origin', 'columns', 'rows', 'tileSize', 'tileset', 'layers'])('báo trường tilemap bắt buộc: %s', (field) => {
    const value: Record<string, unknown> = fixture();
    delete value[field];
    expect(() => parseTilemapData(value)).toThrow(`tilemap.${field}`);
  });

  const base = fixture();
  it.each([
    { value: null, path: 'tilemap' },
    { value: { ...base, origin: { x: NaN, y: 0 } }, path: 'tilemap.origin.x' },
    { value: { ...base, origin: { x: 0, y: Infinity } }, path: 'tilemap.origin.y' },
    { value: { ...base, columns: 0 }, path: 'tilemap.columns' },
    { value: { ...base, rows: 1.5 }, path: 'tilemap.rows' },
    { value: { ...base, rows: Number.MAX_SAFE_INTEGER + 1 }, path: 'tilemap.rows' },
    { value: { ...base, tileSize: { width: -1, height: 1 } }, path: 'tilemap.tileSize.width' },
    { value: { ...base, tileSize: { width: 1, height: 0 } }, path: 'tilemap.tileSize.height' },
    { value: { ...base, tileSize: { width: Number.MAX_VALUE, height: 1 } }, path: 'biên lưới' },
    { value: { ...base, columns: 65537 }, path: '65536' },
    { value: { ...base, tileset: { ...base.tileset, image: ' ' } }, path: 'tilemap.tileset.image' },
    { value: { ...base, tileset: { ...base.tileset, imageWidth: 65 } }, path: 'tilemap.tileset' },
    { value: { ...base, tileset: { ...base.tileset, imageHeight: 0 } }, path: 'tilemap.tileset.imageHeight' },
    { value: { ...base, tileset: { ...base.tileset, tileWidth: 0 } }, path: 'tilemap.tileset.tileWidth' },
    { value: { ...base, tileset: { ...base.tileset, tileHeight: 1.5 } }, path: 'tilemap.tileset.tileHeight' },
    { value: { ...base, layers: [] }, path: 'tilemap.layers' },
    { value: { ...base, layers: Array(9).fill(base.layers[0]) }, path: 'tilemap.layers' },
    { value: { ...base, layers: [base.layers[0], base.layers[0]] }, path: 'tilemap.layers[1].id' },
    { value: { ...base, layers: [{ ...base.layers[0], id: '' }] }, path: 'tilemap.layers[0].id' },
    { value: { ...base, layers: [{ ...base.layers[0], opacity: 1.1 }] }, path: 'tilemap.layers[0].opacity' },
    { value: { ...base, layers: [{ ...base.layers[0], opacity: '1' }] }, path: 'tilemap.layers[0].opacity' },
    { value: { ...base, layers: [{ id: 'back', cells: [[0, 1]] }] }, path: 'tilemap.layers[0].cells' },
    { value: { ...base, layers: [{ id: 'back', cells: [[0], [0, 1]] }] }, path: 'tilemap.layers[0].cells[0]' },
    { value: { ...base, layers: [{ id: 'back', cells: [[0, null], [null, -1]] }] }, path: 'tilemap.layers[0].cells[1][1]' },
    { value: { ...base, layers: [{ id: 'back', cells: [[0, null], [null, 8]] }] }, path: 'tilemap.layers[0].cells[1][1]' },
    { value: { ...base, layers: [{ id: 'back', cells: [[0, '1'], [0, 0]] }] }, path: 'tilemap.layers[0].cells[0][1]' },
    { value: { ...base, layers: [{ id: 'back', cells: [[0, 1.5], [0, 0]] }] }, path: 'tilemap.layers[0].cells[0][1]' },
    { value: { ...base, layers: [{ id: 'back', cells: [[0, undefined], [0, 0]] }] }, path: 'tilemap.layers[0].cells[0][1]' },
    { value: { ...base, layers: new Array(1) }, path: 'tilemap.layers[0]' },
  ])('từ chối dữ liệu sai tại $path', ({ value, path }) => {
    expect(() => parseTilemapData(value)).toThrow(path);
  });

  it('tilemap là tùy chọn cho level cũ; null tường minh là lỗi', () => {
    expect(parseLevelData(playground).tilemap).toBeUndefined();
    expect(parseLevelData(small).tilemap).toBeUndefined();
    expect(() => parseLevelData({ ...small, tilemap: null })).toThrow('tilemap');
    expect(parseLevelData(getLevelData('tiles')).tilemap?.layers).toHaveLength(2);
  });
});

describe('opacity thang tương thích Task 005', () => {
  it.each([playground, small])('giữ nền mờ và ray/bậc đục của $id', (data) => {
    const level = new TestLevel(data);
    const meshes = level.visual.children as Mesh<PlaneGeometry, MeshBasicMaterial>[];
    expect(meshes[4]!.material.opacity).toBe(0.2);
    for (const mesh of meshes.slice(5)) {
      expect(mesh.material.opacity).toBe(1);
      expect(mesh.material.transparent).toBe(false);
      expect(mesh.material.depthWrite).toBe(true);
    }
    level.dispose();
  });

  it('structureOpacity áp dụng cho cả ray và bậc, không đổi nền hoặc collision', () => {
    const level = new TestLevel({ ...playground, visuals: [
      { shapeId: 'ladder-test', kind: 'ladder', color: '#578bbf', opacity: 0.2, structureOpacity: 0.35 },
    ] });
    const meshes = level.visual.children as Mesh<PlaneGeometry, MeshBasicMaterial>[];
    expect(meshes[0]!.material.opacity).toBe(0.2);
    for (const mesh of meshes.slice(1)) {
      expect(mesh.material.opacity).toBe(0.35);
      expect(mesh.material.transparent).toBe(true);
      expect(mesh.material.depthWrite).toBe(false);
    }
    expect(level.colliders).toHaveLength(4);
    expect(level.climbables).toEqual(playground.climbables);
    level.dispose();
  });

  it.each([-0.1, 1.1, NaN, null, '0.5'])('từ chối structureOpacity sai: %s', (structureOpacity) => {
    expect(() => parseLevelData({ ...playground, visuals: [
      { shapeId: 'ladder-test', kind: 'ladder', color: 0, structureOpacity },
    ] })).toThrow('visuals[0].structureOpacity');
  });
});

describe('hình học level và physics độc lập với tile', () => {
  it('level small giữ spawn và mọi hình học Task 005', () => {
    const level = new TestLevel(small);
    expect(level.spawn).toEqual({ x: -2, y: 1 });
    expect(level.colliders).toEqual([
      { id: 'floor', position: { x: 0, y: -3 }, width: 20, height: 1 },
      { id: 'block', position: { x: 0, y: -2 }, width: 0.8, height: 1 },
      { id: 'roof', position: { x: -4, y: -1.15 }, width: 2, height: 0.5 },
      { id: 'platform', position: { x: 5, y: -0.8 }, width: 2, height: 0.4 },
    ]);
    expect(level.climbables).toEqual([{ id: 'small-scaffold', kind: 'scaffolding', position: { x: 3, y: -0.5 }, width: 1, height: 4 }]);
    level.dispose();
  });

  it('các ô terrain của level thử khớp sàn/mái/vật cản, background không sinh solid', () => {
    const data = parseLevelData(tiles);
    const map = data.tilemap!;
    const terrain = map.layers[1]!;
    const counts = [0, 0, 0, 0];
    for (const [row, cells] of terrain.cells.entries()) for (const [column, tile] of cells.entries()) {
      if (tile === null) continue;
      const center = tilePosition(map, column, row);
      const index = data.solids.findIndex((solid) => Math.abs(center.x - solid.position.x) < solid.width / 2 && Math.abs(center.y - solid.position.y) < solid.height / 2);
      expect(index).toBeGreaterThanOrEqual(0);
      counts[index]! += 1;
    }
    expect(counts).toEqual([80, 4, 6, 6]);
    expect(data.climbables).toEqual([{ id: 'tiles-ladder', kind: 'ladder', position: { x: 6, y: 0.25 }, width: 1, height: 5.5 }]);
    expect(data.spawn).toEqual({ x: 0, y: 1.8 });
    const empty = parseLevelData({ ...tiles, visuals: [], tilemap: { ...tiles.tilemap, layers: tiles.tilemap.layers.map((layer) => ({ ...layer, cells: layer.cells.map((row) => row.map(() => null)) })) } });
    expect(empty.solids).toEqual(data.solids);
    expect(empty.climbables).toEqual(data.climbables);
    const svg = readFileSync(new URL('../public/assets/environments/test-tileset.svg', import.meta.url), 'utf8');
    expect(svg).toContain('width="128" height="64"');
    expect(map.tileset).toEqual({ image: 'assets/environments/test-tileset.svg', imageWidth: 128, imageHeight: 64, tileWidth: 32, tileHeight: 32 });
  });

  it('cùng physics cũ giữ headroom, leo và rời sang sàn của level tile', () => {
    const level = new TestLevel(tiles);
    const player = new Player(level.spawn);
    const world = new PhysicsWorld(-28, level.colliders, level.climbables);
    const run = (steps: number, input = noInput) => {
      for (let step = 0; step < steps; step += 1) player.updateMovement(world, dt, input);
    };
    run(90);
    expect(player.body.position.y).toBeCloseTo(-1.7);
    run(130, { ...noInput, horizontal: -1, crouch: true });
    expect(player.body.position.x).toBeLessThan(-3.4);
    run(1);
    expect(player.movement.stance).toBe('crouching');
    run(130, { ...noInput, horizontal: 1 });
    expect(player.movement.stance).toBe('standing');
    player.setPosition(6, -1.7);
    player.body.isGrounded = true;
    run(1, { ...noInput, enterClimb: true });
    run(120, { ...noInput, vertical: 1 });
    expect(player.body.position.y).toBeCloseTo(2.2);
    run(30, { ...noInput, vertical: -1 });
    expect(player.body.position.y).toBeCloseTo(0.8);
    run(1);
    expect(player.body.velocity.y).toBe(0);
    run(30, { ...noInput, vertical: 1 });
    run(30, { ...noInput, horizontal: 1 });
    run(60);
    expect(player.movement.mode).toBe('grounded');
    expect(player.body.position.y).toBeCloseTo(0.8);
    expect(player.body.width).toBe(0.8);
    expect(player.body.height).toBe(1.6);
    player.dispose();
    level.dispose();
  });
});
