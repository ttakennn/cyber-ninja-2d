import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { parseEnvironmentData } from '../src/world/EnvironmentData';
import { parseLevelData } from '../src/world/LevelData';
import { parseTilemapData } from '../src/world/TilemapData';
import { TestLevel } from '../src/world/TestLevel';
import { getLevelData } from '../src/world/levels';
import graybox from '../src/world/levels/map-01-graybox.json';
import pilot from '../src/world/levels/map-01-visual-pilot.json';
import placements from '../scripts/map01-environment-pilot.input.json';
import foreground from '../public/assets/environments/map01/foreground/foreground.json';
import revision from '../integration/map01-revision-rc2/map-revision-plan.json';

const background = { id: 'sky', image: 'sky.png', pixelSize: [2048, 1024], z: -8, parallaxX: 0, parallaxY: 0, repeatX: false, worldHeight: 9 };
const prop = { id: 'tank', image: 'tank.png', pixelSize: [128, 256], z: -0.25, worldPosition: { x: 4, y: 2 },
  worldSize: { width: 1, height: 2 }, anchor: { x: 0.5, y: 1 }, collision: false };
const base = { backgrounds: [background], decorations: [prop] };

describe('schema môi trường tùy chọn', () => {
  it('đọc và sao chép background/prop, giữ bottom-center và collision false', () => {
    const source = structuredClone(base);
    const data = parseEnvironmentData(source);
    source.backgrounds[0]!.pixelSize[0] = 10;
    source.decorations[0]!.worldPosition.x = 100;
    source.decorations[0]!.worldSize.height = 100;
    expect(data.backgrounds[0]?.pixelSize).toEqual([2048, 1024]);
    expect(data.decorations[0]?.worldPosition).toEqual({ x: 4, y: 2 });
    expect(data.decorations[0]?.worldSize).toEqual({ width: 1, height: 2 });
    expect(data.decorations[0]?.anchor).toEqual({ x: 0.5, y: 1 });
    expect(data.decorations[0]?.collision).toBe(false);
  });

  it.each([
    { data: null, path: 'environment' },
    { data: {}, path: 'environment.backgrounds' },
    { data: { backgrounds: [] }, path: 'environment.decorations' },
    { data: { ...base, backgrounds: new Array(1) }, path: 'environment.backgrounds[0]' },
    { data: { ...base, backgrounds: Array(9).fill(background) }, path: 'environment.backgrounds' },
    { data: { ...base, decorations: Array(257).fill(prop) }, path: 'environment.decorations' },
    ...[
      { id: '', path: '.id' }, { id: ' ', path: '.id' }, { image: '', path: '.image' },
      { pixelSize: [2048], path: '.pixelSize' }, { pixelSize: [0, 1024], path: '.pixelSize[0]' },
      { pixelSize: [2048, Infinity], path: '.pixelSize[1]' }, { pixelSize: [2.5, 3], path: '.pixelSize' },
      { z: -91, path: '.z' }, { z: -90, path: '.z' }, { z: 10, path: '.z' }, { z: -0.5, path: '.z' },
      { parallaxX: -0.1, path: '.parallaxX' }, { parallaxY: 1.1, path: '.parallaxY' },
      { parallaxX: '0', path: '.parallaxX' }, { repeatX: 'false', path: '.repeatX' },
      { parallaxX: 0.15, path: 'cố định theo camera' }, { worldHeight: 0, path: '.worldHeight' },
      { worldHeight: Infinity, path: '.worldHeight' },
      { bottomOffset: NaN, path: '.bottomOffset' }, { bottomOffset: 1, path: '.bottomOffset' },
    ].map(({ path, ...fields }) => ({ data: { ...base, backgrounds: [{ ...background, ...fields }] }, path: path.startsWith('.') ? `environment.backgrounds[0]${path}` : path })),
    ...[
      { collision: true, path: '.collision' }, { collision: 'none', path: '.collision' },
      { z: 0, path: '.z' }, { z: 1, path: '.z' }, { z: -0.5, path: '.z' },
      { worldSize: { width: -1, height: 2 }, path: '.worldSize.width' },
      { worldSize: { width: 1, height: NaN }, path: '.worldSize.height' },
      { worldPosition: { x: Infinity, y: 2 }, path: '.worldPosition.x' },
      { anchor: { x: 0.5, y: 0 }, path: '.anchor' }, { anchor: null, path: '.anchor' },
    ].map(({ path, ...fields }) => ({ data: { ...base, decorations: [{ ...prop, ...fields }] }, path: `environment.decorations[0]${path}` })),
    { data: { ...base, decorations: [{ ...prop, id: 'sky' }] }, path: 'environment.decorations[0].id' },
    { data: { ...base, decorations: [prop, prop] }, path: 'environment.decorations[1].id' },
    { data: { ...base, backgrounds: [background, { ...background, id: 'city', z: -9 }] }, path: 'environment.backgrounds[1].z' },
    { data: { ...base, decorations: [prop, { ...prop, id: 'other', pixelSize: [128, 128] }] }, path: 'environment.decorations[1].pixelSize' },
  ])('từ chối dữ liệu sai tại $path', ({ data, path }) => {
    expect(() => parseEnvironmentData(data)).toThrow(path);
  });

  it.each(['playground', 'small', 'tiles', 'map01-graybox'])('không tạo environment cho level cũ %s', (id) => {
    expect(parseLevelData(getLevelData(id)).environment).toBeUndefined();
    const level = new TestLevel(getLevelData(id));
    const old = new TestLevel(id === 'map01-graybox' ? graybox : getLevelData(id));
    expect(level.colliders).toEqual(old.colliders);
    expect(level.climbables).toEqual(old.climbables);
    level.dispose(); old.dispose();
  });

  it('environment null là lỗi, mảng rỗng tường minh hợp lệ', () => {
    expect(() => parseLevelData({ ...graybox, environment: null })).toThrow('environment');
    expect(parseEnvironmentData({ backgrounds: [], decorations: [] })).toEqual({ backgrounds: [], decorations: [] });
  });
});

describe('pilot dùng asset thật và giữ gameplay', () => {
  it('map01 chuyển sang pilot, graybox gốc còn nguyên mọi field gameplay', () => {
    expect(getLevelData('map01')).toBe(pilot);
    expect(getLevelData('map01-graybox')).toBe(graybox);
    for (const key of ['version', 'id', 'spawn', 'cameraFollowY', 'deathY'] as const) {
      expect(pilot[key]).toEqual(graybox[key]);
    }
    expect(pilot.cameraBounds).toEqual({ ...graybox.cameraBounds, minY: -3.5 });
    const level = new TestLevel(pilot);
    const retained = graybox.solids.filter(({ id }) => !revision.removeSolidIds.includes(id))
      .map((entry) => entry.id === 'street-crate' ? { ...entry, position: { ...entry.position, x: 21.5 } } : entry);
    expect(level.colliders.slice(0, retained.length)).toEqual(retained);
    expect(level.climbables).toEqual(revision.replaceClimbables);
    expect(level.colliders).toHaveLength(11);
    expect(level.climbables[0]?.position.x).toBe(29.55);
    level.dispose();
  });

  it('mọi PNG dùng đúng kích thước khai báo, RGBA/palette và tỷ lệ prop từ placement thật', () => {
    const environment = parseEnvironmentData(pilot.environment);
    const images = new Map([...environment.backgrounds, ...environment.decorations].map((entry) => [entry.image, entry]));
    expect(images.has('assets/environments/map01/revision-rc2/street-cap-ivy.png')).toBe(true);
    for (const [path, entry] of images) {
      const png = readFileSync(new URL(`../public/${path}`, import.meta.url));
      expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
      expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual(entry.pixelSize);
      if (entry.id !== 'sky') expect([3, 6]).toContain(png[25]);
    }
    expect(environment.backgrounds.map(({ parallaxX, z, repeatX }) => [parallaxX, z, repeatX]))
      .toEqual([[0, -8, false], [0.15, -6, true], [0.35, -4, true], [0.65, -2, true]]);
    for (const decoration of environment.decorations) {
      const original = placements.decorations.find(({ id }) => id === decoration.id);
      if (!original) continue;
      // Kích thước/alpha các prop được đổi theo yêu cầu RC3, kiểm riêng trong Map01Polish.
      if (['foreground-street_shop_awning-9', 'props-rooftop-water-tank-5', 'props-satellite-dish-6', 'props-antenna-7', 'props-rooftop-water-tank-8'].includes(decoration.id)) continue;
      expect(decoration.worldSize).toEqual(original.worldSize);
      const adjusted: Record<string, { x: number; y: number }> = {
        'foreground-street_shop_awning-9': { x: 4.7, y: -2.5 - 9 / 330 * 2.4832 },
        'props-sign-pho-247-1': { x: 4.7, y: -0.8 - 9 / 330 * 2.4832 },
        'props-sign-pharmacy-2': { x: 16.35, y: 2 },
        'foreground-railing_cross-11': { x: 46, y: 2 },
      };
      expect(decoration.worldPosition).toEqual(adjusted[decoration.id] ?? original.worldPosition);
      expect(decoration.worldSize.width / decoration.worldSize.height).toBeCloseTo(decoration.pixelSize[0] / decoration.pixelSize[1], 3);
      expect(decoration.z).toBeLessThan(0);
      expect(Math.abs(decoration.worldPosition.x - 29)).toBeGreaterThan(decoration.worldSize.width / 2 + 0.5);
    }
  });

  it('foreground dùng ảnh được metadata chấp nhận, hash đúng; không dùng ảnh quarantined/concept', () => {
    for (const decoration of pilot.environment.decorations.filter(({ id }) => id.startsWith('foreground-'))) {
      const id = /^foreground-(.+)-\d+$/.exec(decoration.id)![1];
      const asset = foreground.assets.find((entry) => entry.id === id)!;
      expect(decoration.image).toBe(`assets/environments/map01/foreground/${asset.image}`);
      const png = readFileSync(new URL(`../public/${decoration.image}`, import.meta.url));
      expect(createHash('sha256').update(png).digest('hex')).toBe(asset.sha256);
      expect(decoration.image).not.toMatch(/references|previews|quarantined/);
    }
  });

  it('terrain 64px=0.5 unit, không còn ID test ngầm và mái hầm tối với chi tiết thưa', () => {
    const map = parseLevelData(pilot).tilemap!;
    expect(map.tileSize).toEqual({ width: 0.5, height: 0.5 });
    expect(map.tileset).toEqual({ image: 'assets/environments/map01/tilesets/terrain-64-atlas.png', imageWidth: 1024, imageHeight: 1024, tileWidth: 64, tileHeight: 64 });
    const png = readFileSync(new URL(`../public/${map.tileset.image}`, import.meta.url));
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1024, 1024]);
    const roof = map.layers.find(({ id }) => id === 'passage-masonry')!;
    expect(roof.tint).toBe(0x687da6);
    expect(roof.cells.flat().filter((tile) => tile !== null)).toHaveLength(0);
    const details = map.layers.find(({ id }) => id === 'hand-placed-details')!;
    expect(details.cells.flatMap((row) => row.slice(24, 34)).filter((tile) => tile === 8)).toHaveLength(0);
  });

  it.each([-1, 0x1000000, NaN, null, '#ZZZZZZ', 'white'])('tint sai được báo đúng layer: %s', (tint) => {
    expect(() => parseTilemapData({ ...pilot.tilemap, layers: [{ ...pilot.tilemap.layers[0], tint }] })).toThrow('tilemap.layers[0].tint');
  });
});
