import { Mesh, Texture } from 'three';
import type { MeshBasicMaterial } from 'three';
import { describe, expect, it, vi } from 'vitest';
import { parseEnvironmentData } from '../src/world/EnvironmentData';
import { EnvironmentRenderer } from '../src/rendering/EnvironmentRenderer';
import { tilePosition } from '../src/world/TilemapData';
import { parseLevelData } from '../src/world/LevelData';
import pilot from '../src/world/levels/map-01-visual-pilot.json';
import graybox from '../src/world/levels/map-01-graybox.json';

const data = parseEnvironmentData(pilot.environment);
const fragment = data.decorations.find((entry) => entry.sourceRect)!;

describe('Task 008.2 parapet và nền phố', () => {
  it.each(['upper-roof', 'roof-2', 'roof-3', 'roof-4'])('%s có hai end-cap, thân nối liên tục không chồng đầu/lấn khe', (id) => {
    const roof = pilot.solids.find((entry) => entry.id === id)!;
    const left = roof.position.x - roof.width / 2;
    const right = roof.position.x + roof.width / 2;
    const top = roof.position.y + roof.height / 2;
    const pieces = data.decorations.filter((entry) => entry.sourceRect && Math.abs(entry.worldPosition.y + entry.worldSize.height - top) < 1e-8
      && entry.worldPosition.x >= left && entry.worldPosition.x <= right).sort((a, b) => a.worldPosition.x - b.worldPosition.x);
    expect(pieces.length).toBeGreaterThan(2);
    expect(pieces.filter((entry) => entry.sourceRect!.x === 0)).toHaveLength(1);
    expect(pieces.filter((entry) => entry.sourceRect!.x === 465)).toHaveLength(1);
    let edge = left;
    for (const piece of pieces) {
      expect(piece.worldPosition.x - piece.worldSize.width / 2).toBeCloseTo(edge, 10);
      expect(piece.worldSize.width / piece.sourceRect!.width).toBeCloseTo(3.8 / 525, 10);
      edge = piece.worldPosition.x + piece.worldSize.width / 2;
      expect(edge).toBeLessThanOrEqual(right + 1e-8);
    }
    expect(edge).toBeCloseTo(right, 10);
    for (const body of pieces.slice(1, -1)) {
      expect(body.sourceRect!.x).toBe(80);
      expect(body.sourceRect!.width).toBeLessThanOrEqual(385);
    }
  });

  it('nền phố phủ chính xác dải -4.5..-4, không thêm collision hoặc thay gameplay', () => {
    const level = parseLevelData(pilot);
    const map = level.tilemap!;
    const layer = map.layers.find(({ id }) => id === 'street-foundation')!;
    const cells = layer.cells.flatMap((row, y) => row.flatMap((tile, x) => tile === null ? [] : [tilePosition(map, x, y)]));
    expect(cells).toHaveLength(80);
    expect(cells.every(({ x, y }) => x >= 0.25 && x <= 39.75 && y === -4.25)).toBe(true);
    expect(layer.tint).toBe(0x182656);
    for (const key of ['spawn', 'solids', 'climbables', 'cameraBounds', 'cameraFollowY', 'deathY'] as const) expect(pilot[key]).toEqual(graybox[key]);
  });

  it.each([null, {}, { x: -1, y: 0, width: 10, height: 120 }, { x: 0, y: 0, width: 0, height: 120 },
    { x: 0, y: 0, width: 526, height: 120 }, { x: 80, y: 0, width: 500, height: 120 },
    { x: 0, y: 1, width: 10, height: 120 }, { x: 0, y: NaN, width: 10, height: 120 }])('rect sai bị từ chối: %j', (sourceRect) => {
    expect(() => parseEnvironmentData({ backgrounds: [], decorations: [{ ...fragment, sourceRect }] })).toThrow('environment.decorations[0].sourceRect');
  });

  it('UV fragment riêng không đổi ảnh dùng chung; clone được dispose đúng một lần', async () => {
    const parsed = parseEnvironmentData({ backgrounds: [], decorations: [fragment, { ...fragment, id: 'full', sourceRect: undefined }] });
    const renderer = new EnvironmentRenderer(parsed);
    const texture = new Texture({ width: 525, height: 120 } as HTMLImageElement);
    const loader = vi.fn(async () => texture);
    await renderer.load(loader);
    const meshes = renderer.visual.children as Mesh[];
    const crop = (meshes[0]!.material as MeshBasicMaterial).map!;
    expect(loader).toHaveBeenCalledTimes(1);
    expect(crop).not.toBe(texture);
    expect(crop.repeat.x).toBeCloseTo(fragment.sourceRect!.width / 525);
    expect(crop.offset.x).toBeCloseTo(fragment.sourceRect!.x / 525);
    expect(texture.repeat.toArray()).toEqual([1, 1]);
    expect(meshes[0]!.geometry).toBe(meshes[1]!.geometry);
    const released = [vi.spyOn(crop, 'dispose'), vi.spyOn(texture, 'dispose')];
    renderer.dispose(); renderer.dispose();
    for (const spy of released) expect(spy).toHaveBeenCalledTimes(1);
  });
});
