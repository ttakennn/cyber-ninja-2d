import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { PhysicsWorld } from '../src/physics/PhysicsWorld';
import { GameCamera } from '../src/rendering/GameCamera';
import { parseLevelData } from '../src/world/LevelData';
import { tilePosition } from '../src/world/TilemapData';
import pilot from '../src/world/levels/map-01-visual-pilot.json';
import five from '../src/world/levels/map-01-five-zones.json';
import revision from '../integration/map01-revision-rc2/map-revision-plan.json';
import rc1 from '../integration/z45-atlas-rc1/environment-replacements-atlas.json';
import props from '../public/assets/environments/map01/props-v2/props.json';
import metadata from '../public/assets/environments/map01/revision-rc2/asset-manifest.json';

describe('Map01 visual revision RC2', () => {
  it.each([[1920, 1080], [1280, 720], [1024, 768], [540, 960]])('tường chạm đáy khung hình khi đứng/cúi/respawn trên đường ở %s×%s', (width, height) => {
    for (const source of [pilot, five]) {
      const data = parseLevelData(source);
      const camera = new GameCamera(data.cameraBounds, data.cameraFollowY);
      camera.resize(width!, height!);
      for (const x of [data.spawn.x, data.cameraBounds!.maxX - 2]) {
        camera.reset({ x, y: -1.7 });
        for (const bodyHeight of [1.6, 0.9, 1.6]) {
          camera.follow({ x, y: -2.5 + bodyHeight / 2 }, bodyHeight);
          const viewBottom = camera.camera.position.y + camera.camera.bottom;
          expect(viewBottom).toBe(-3.5);
          expect((-2.5 - viewBottom) / (camera.camera.top - camera.camera.bottom)).toBeCloseTo(1 / 9);
        }
      }
      expect(data.cameraBounds?.minY).toBe(-3.5);
      expect(data.environment!.backgrounds.find(({ id }) => id === 'buildings-near')).toMatchObject({ verticalAnchor: 'world', worldBottom: -3 });
    }
  });

  it('resolve 41 additions đúng một lần, xoá đúng ID và giữ nguyên hazard RC1', () => {
    const data = parseLevelData(five);
    const decorations = data.environment!.decorations;
    expect(revision.appendDecorations).toHaveLength(41);
    expect(new Set(decorations.map(({ id }) => id)).size).toBe(decorations.length);
    const floorAlignedY: Record<string, number> = {
      'rc2-zone4-shops-backdrop-0': -2.828125, 'rc2-zone4-shops-backdrop-1': -2.828125,
      'rc2-zone5-yard-backdrop-0': -3.2421875, 'rc2-zone5-yard-backdrop-1': -3.2421875,
      'rc2-noodle-sign': -0.56875, 'rc2-market-sign': -0.978125,
    };
    for (const entry of revision.appendDecorations) {
      const actual = five.environment.decorations.filter(({ id }) => id === entry.id);
      const expected = /^rc2-street-\d+$/.test(entry.id) ? { ...entry, worldPosition: { ...entry.worldPosition, y: -3.5 },
        worldSize: { ...entry.worldSize, height: 1 }, sourceRect: { x: 0, y: 0, width: entry.worldSize.width * 128, height: 128 } } : entry;
      expect(actual).toHaveLength(1);
      expect({ ...actual[0], worldPosition: expected.worldPosition }).toEqual(expected);
      expect(actual[0]!.worldPosition.x).toBe(entry.worldPosition.x);
      expect(actual[0]!.worldPosition.y).toBeCloseTo(floorAlignedY[entry.id] ?? expected.worldPosition.y, 12);
    }
    for (const id of revision.removeDecorationIds) expect(decorations.find((entry) => entry.id === id)).toBeUndefined();
    expect(five.environment.decorations.find(({ id }) => id === 'z5-floor-edge-stripe')).toEqual(rc1.decorations.find(({ id }) => id === 'z5-floor-edge-stripe'));
    for (const id of revision.removeSolidIds) expect(data.solids.find((entry) => entry.id === id)).toBeUndefined();
    expect(data.solids.slice(-4)).toEqual(revision.appendSolids);
    expect(data.climbables).toEqual(revision.replaceClimbables);
    expect(data.visuals.some(({ shapeId }) => ['alley-ladder', 'street', 'street-extension-z45', 'roof-4'].includes(shapeId))).toBe(false);
  });

  it('alias 80 unit không nhận support/bậc/backdrop Zone4/5; module cuối cắt UV ở X80', () => {
    const data = parseLevelData(pilot);
    expect(data.cameraBounds?.maxX).toBe(80);
    expect(data.tilemap?.columns).toBe(160);
    for (const id of revision.appendSolids.map(({ id }) => id)) expect(data.solids.find((entry) => entry.id === id)).toBeUndefined();
    for (const entry of data.environment!.decorations.filter(({ id }) => id.startsWith('rc2-'))) {
      expect(entry.worldPosition.x + entry.worldSize.width / 2).toBeLessThanOrEqual(80);
    }
    expect(data.environment!.decorations.find(({ id }) => id === 'rc2-street-78')).toMatchObject({
      worldPosition: { x: 79, y: -3.5 }, worldSize: { width: 2, height: 1 }, sourceRect: { x: 0, y: 0, width: 256, height: 128 },
    });
    expect(data.environment!.decorations.some(({ id }) => /rc2-(zone[45]|noodle|market|roof4)/.test(id))).toBe(false);
  });

  it('bỏ marker X27 và bù alpha để chân backdrop chạm đường, biển đi cùng nền', () => {
    for (const source of [pilot, five]) {
      const map = parseLevelData(source).tilemap!;
      const column = (27 - map.origin.x) / map.tileSize.width;
      const row = (map.origin.y - 0.5) / map.tileSize.height;
      expect(map.layers.find(({ id }) => id === 'markers')!.cells[row]![column]).toBeNull();
    }
    for (const [id, padding] of [
      ['rc2-zone4-shops-backdrop-0', 42], ['rc2-zone4-shops-backdrop-1', 42],
      ['rc2-zone5-yard-backdrop-0', 95], ['rc2-zone5-yard-backdrop-1', 95],
    ] as const) {
      const entry = five.environment.decorations.find((entry) => entry.id === id)!;
      expect(entry.worldPosition.y + padding / entry.pixelSize[1]! * entry.worldSize.height).toBeCloseTo(-2.5);
    }
    for (const id of ['rc2-noodle-sign', 'rc2-market-sign']) {
      const before = revision.appendDecorations.find((entry) => entry.id === id)!;
      const after = five.environment.decorations.find((entry) => entry.id === id)!;
      expect(after.worldPosition.y - before.worldPosition.y).toBeCloseTo(-42 / 128);
    }
  });

  it.each([pilot, five])('$id chân tường khớp mép mái, các khe thông thẳng xuống dưới', (source) => {
    const data = parseLevelData(source);
    const map = data.tilemap!;
    for (const layer of map.layers) for (const [row, cells] of layer.cells.entries()) for (const [column, cell] of cells.entries()) {
      const point = tilePosition(map, column, row);
      if (revision.tilemapEdits.suppressStreetSkinRegions.some((region) => point.x > region.minX && point.x < region.maxX && point.y > region.minY && point.y < region.maxY)) expect(cell).toBeNull();
      if (point.x > 7 && point.x < 8 && point.y > -2.5 && point.y < -1.5) expect(cell).toBeNull();
      if (revision.tilemapEdits.keepRoofGaps.some(([left, right]) => point.x > left! && point.x < right!)) expect(cell).toBeNull();
    }
    let edge = 0;
    for (const entry of data.environment!.decorations.filter(({ id }) => /^rc2-street-\d+$/.test(id))
      .sort((a, b) => a.worldPosition.x - b.worldPosition.x)) {
      const left = entry.worldPosition.x - entry.worldSize.width / 2;
      const right = entry.worldPosition.x + entry.worldSize.width / 2;
      const gap = revision.tilemapEdits.keepRoofGaps.find(([start]) => start === edge);
      if (gap) edge = gap[1]!;
      expect(left).toBe(edge);
      for (const [gapLeft, gapRight] of revision.tilemapEdits.keepRoofGaps) expect(left < gapRight! && right > gapLeft!).toBe(false);
      expect(entry.collision).toBe(false);
      edge = right;
      expect(entry.worldSize.height).toBe(1);
      expect(entry.worldPosition.y).toBe(-3.5);
      expect(entry.sourceRect?.height).toBe(128);
      expect(entry.worldPosition.y + entry.worldSize.height).toBe(-2.5);
      expect(entry.worldSize.width / (entry.sourceRect?.width ?? entry.pixelSize[0])).toBe(1 / 128);
    }
    expect(edge).toBe(data.cameraBounds!.maxX);
    expect(data.visuals.filter((entry) => entry.kind === 'rectangle').every((entry) => entry.kind === 'rectangle' && entry.bottom === -3.5)).toBe(true);
    for (const vine of data.environment!.decorations.filter(({ id }) => id.startsWith('foreground-vine_strip_01-'))) {
      expect(vine.worldPosition.y).toBeGreaterThanOrEqual(-3.5);
      expect(vine.worldPosition.y + vine.worldSize.height).toBeCloseTo(-4.15 + 1.5833);
    }
  });

  it('alpha crate/bench/ladder/planter đúng mục tiêu, thang không xuyên mép ban công', () => {
    for (const [id, assetId, x, foot, width, height] of [
      ['rc2-street-crate', 'crate-wood', 7.5, -2.5, 1, 1],
      ['rc2-bench', 'street-bench', 22.5, -2.5, 2.5, 1],
      ['rc2-ladder', 'metal-ladder', 29.55, -2.5, 0.8, 5.5],
      ['rc2-balcony-planter', 'planter-box', 34, 1, 1.5, 0.65],
    ] as const) {
      const entry = five.environment.decorations.find((entry) => entry.id === id)!;
      const asset = props.props.find(({ id }) => id === assetId)!;
      const [minX, minY, maxX, maxY] = asset.alphaBounds;
      expect(entry.worldSize.width * (maxX! - minX! + 1) / asset.sizePx.width).toBeCloseTo(width);
      expect(entry.worldSize.height * (maxY! - minY! + 1) / asset.sizePx.height).toBeCloseTo(height);
      expect(entry.worldPosition.x + ((minX! + maxX! + 1) / 2 / asset.sizePx.width - 0.5) * entry.worldSize.width).toBeCloseTo(x);
      expect(entry.worldPosition.y + (asset.sizePx.height - 1 - maxY!) / asset.sizePx.height * entry.worldSize.height).toBeCloseTo(foot);
      expect(entry.collision).toBe(false);
    }
    const data = parseLevelData(five);
    const world = new PhysicsWorld(-28, data.solids, data.climbables);
    for (const y of [-1.7, 0, 1.8, 2.2]) expect(world.canOccupy({ position: { x: 29.55, y }, width: 0.8, height: 1.6 })).toBe(true);
    for (const x of [122, 128, 134]) expect(world.canOccupy({ position: { x, y: -1.7 }, width: 0.8, height: 1.6 })).toBe(true);
  });

  it('bậc PNG có đúng ba cột 192px và top khớp AABB 1.5/0/-1.5', () => {
    const stairs = five.environment.decorations.find(({ id }) => id === 'rc2-z4-stairs')!;
    for (const [index, solid] of revision.appendSolids.filter(({ id }) => id.startsWith('z4-step-')).entries()) {
      expect(solid.width).toBe(1.5);
      expect(solid.position.x - solid.width / 2).toBe(80 + index * 1.5);
      expect(solid.position.y + solid.height / 2).toBe([1.5, 0, -1.5][index]);
      expect(stairs.worldPosition.y + [512, 320, 128][index]! / stairs.pixelSize[1]! * stairs.worldSize.height).toBeCloseTo(solid.position.y + solid.height / 2);
    }
  });

  it.each(metadata.assets)('$id giữ PNG/provenance nguồn; runtime chỉ tải các trang backdrop nhỏ', (asset) => {
    const png = readFileSync(new URL(`../public/${asset.image}`, import.meta.url));
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual(asset.pixelSize);
    expect(createHash('sha256').update(png).digest('hex')).toBe(asset.sha256);
    if (asset.pixelSize[0]! > 2048) expect(five.environment.decorations.some(({ image }) => image === asset.image)).toBe(false);
    for (const entry of five.environment.decorations.filter(({ image }) => image === asset.image)) expect(entry.pixelSize).toEqual(asset.pixelSize);
  });
});
