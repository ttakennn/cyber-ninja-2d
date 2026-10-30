import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Mesh, OrthographicCamera, Texture } from 'three';
import type { MeshBasicMaterial } from 'three';
import { describe, expect, it, vi } from 'vitest';
import { EnvironmentRenderer } from '../src/rendering/EnvironmentRenderer';
import { TilemapRenderer } from '../src/rendering/TilemapRenderer';
import { parseTilemapData } from '../src/world/TilemapData';
import { parseLevelData } from '../src/world/LevelData';
import { TestLevel } from '../src/world/TestLevel';
import graybox from '../src/world/levels/map-01-graybox.json';
import { parseEnvironmentData } from '../src/world/EnvironmentData';
import pilot from '../src/world/levels/map-01-visual-pilot.json';
import metadata from '../public/assets/environments/map01/foreground/foreground.json';

const city = { id: 'city', image: 'city.png', pixelSize: [200, 100], z: -2, repeatX: true,
  parallaxX: 0.65, parallaxY: 0, worldHeight: 8 };
const prop = { id: 'vine', image: 'vine.png', pixelSize: [10, 20], z: 2, layer: 'foreground',
  worldPosition: { x: 2, y: -4 }, worldSize: { width: 0.5, height: 1 }, anchor: { x: 0.5, y: 1 }, collision: false };

describe('Task 008 Fix: neo world và foreground', () => {
  it('ladder thêm highlight/pát chỉ ở pilot, không đổi vùng leo; màu sai báo rõ', () => {
    expect(parseLevelData(pilot).visuals[0]).toMatchObject({ railHighlight: 0x8b98aa, opacity: 0 });
    const level = new TestLevel(pilot);
    const old = new TestLevel(graybox);
    expect(level.climbables).toEqual(old.climbables);
    expect(level.visual.children.filter((mesh) => mesh.position.z === 0.02)).toHaveLength(2);
    expect(old.visual.children.filter((mesh) => mesh.position.z === 0.02)).toHaveLength(0);
    expect(() => parseLevelData({ ...pilot, visuals: [{ ...pilot.visuals[0], railHighlight: 'wrong' }] })).toThrow('visuals[0].railHighlight');
    level.dispose(); old.dispose();
  });
  it('dữ liệu cũ mặc định giữ neo camera và lớp sau player', () => {
    const { layer, ...legacy } = prop;
    const parsed = parseEnvironmentData({ backgrounds: [city], decorations: [{ ...legacy, z: -0.25 }] });
    expect(parsed.backgrounds[0]?.verticalAnchor).toBeUndefined();
    expect(parsed.decorations[0]?.layer).toBeUndefined();
  });

  it.each([
    { verticalAnchor: 'screen' }, { verticalAnchor: 'world' },
    { verticalAnchor: 'world', worldBottom: NaN }, { worldBottom: -2.5 },
    { verticalAnchor: 'world', worldBottom: -2.5, parallaxY: 0.2 },
    { verticalAnchor: 'world', worldBottom: -2.5, bottomOffset: 1 },
    { verticalAnchor: 'world', worldBottom: -2.5, repeatX: false, parallaxX: 0 },
  ])('từ chối cấu hình neo mâu thuẫn %j', (fields) => {
    expect(() => parseEnvironmentData({ backgrounds: [{ ...city, ...fields }], decorations: [] })).toThrow('environment.backgrounds[0]');
  });

  it.each([{ layer: 'unknown' }, { z: 1 }, { z: 9 }, { z: -0.25 }, { collision: true }])('từ chối foreground không an toàn %j', (fields) => {
    expect(() => parseEnvironmentData({ backgrounds: [], decorations: [{ ...prop, ...fields }] })).toThrow('environment.decorations[0]');
  });

  it('neo world không thay Y khi follow/resize, neo camera cũ tiếp tục theo camera; foreground alpha và dispose', async () => {
    const data = parseEnvironmentData({ backgrounds: [{ ...city, id: 'far', z: -4 },
      { ...city, verticalAnchor: 'world', worldBottom: -2.7 }], decorations: [prop] });
    const renderer = new EnvironmentRenderer(data);
    const textures: Texture[] = [];
    await renderer.load(async (url) => {
      const texture = new Texture({ width: url === 'city.png' ? 200 : 10, height: url === 'city.png' ? 100 : 20 } as HTMLImageElement);
      textures.push(texture); return texture;
    });
    const meshes = renderer.visual.children as Mesh[];
    const world = meshes.find(({ name }) => name === 'city')!;
    const far = meshes.find(({ name }) => name === 'far')!;
    const foreground = meshes.find(({ name }) => name === 'vine')!;
    const camera = new OrthographicCamera(-8, 8, 4.5, -4.5, 0.1, 100);
    for (const y of [0, 3.2, 7]) for (const width of [16, 12, 5]) {
      camera.position.set(33, y, 10); camera.left = -width / 2; camera.right = width / 2;
      renderer.update(camera);
      expect(world.position.y).toBeCloseTo(1.3);
      expect(far.position.y).toBeCloseTo(y - 0.5);
      const map = (world.material as MeshBasicMaterial).map!;
      expect(((map.offset.x + map.repeat.x / 2) % 1 + 1) % 1).toBeCloseTo((33 * 0.65 / 16) % 1);
      expect(foreground.position.toArray()).toEqual([2, -3.5, 2]);
    }
    expect(foreground.renderOrder).toBeGreaterThan(world.renderOrder);
    expect((foreground.material as MeshBasicMaterial).transparent).toBe(true);
    expect((foreground.material as MeshBasicMaterial).depthWrite).toBe(false);
    const resources = new Set([...textures, ...meshes.map((mesh) => (mesh.material as MeshBasicMaterial).map!)]);
    const spies = [...resources].map((resource) => vi.spyOn(resource, 'dispose'));
    renderer.dispose(); renderer.dispose();
    for (const spy of spies) expect(spy).toHaveBeenCalledTimes(1);
  });

  it('mặt tiền/parapet mới đúng ảnh đã duyệt, kích thước và không lấn các khe nhảy', () => {
    for (const decoration of pilot.environment.decorations.filter(({ id }) => id.startsWith('facade-') || id.includes('parapet_wall'))) {
      const asset = metadata.assets.find(({ image }) => decoration.image.endsWith(`/${image}`))!;
      expect(asset.artReviewStatus).toMatch(/^APPROVED_/);
      if ('sourceRect' in decoration && decoration.sourceRect) {
        expect(decoration.worldSize.width).toBeCloseTo(decoration.sourceRect.width * asset.worldSize.width / asset.pixelSize.width);
        expect(decoration.worldSize.height).toBe(asset.worldSize.height);
      } else expect(decoration.worldSize).toEqual(asset.worldSize);
      const bytes = readFileSync(new URL(`../public/${decoration.image}`, import.meta.url));
      expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual(decoration.pixelSize);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(asset.sha256);
      if (decoration.id.includes('parapet_wall')) {
        const left = decoration.worldPosition.x - decoration.worldSize.width / 2;
        const right = decoration.worldPosition.x + decoration.worldSize.width / 2;
        expect(pilot.solids.some((solid) => left >= solid.position.x - solid.width / 2 - 1e-8
          && right <= solid.position.x + solid.width / 2 + 1e-8
          && Math.abs(decoration.worldPosition.y + decoration.worldSize.height - solid.position.y - solid.height / 2) < 1e-8)).toBe(true);
      }
    }
    expect(pilot.environment.decorations.filter((entry) => 'layer' in entry && entry.layer === 'foreground')).toHaveLength(2);
    const near = pilot.environment.backgrounds.find(({ id }) => id === 'buildings-near')!;
    expect(near).toMatchObject({ verticalAnchor: 'world', worldBottom: -2.7, bottomOffset: 0 });
    expect(new Set(pilot.tilemap.layers.flatMap(({ cells }) => cells.flat().filter((tile) => tile !== null))))
      .toEqual(new Set([2, 3, 10, 11]));
  });

  it('generator tái tạo đúng JSON đã review, không ghi file trong chế độ check', () => {
    expect(() => execFileSync(process.execPath, [fileURLToPath(new URL('../scripts/generate_map01_pilot.mjs', import.meta.url)), '--check'])).not.toThrow();
  });

  it.each([-1, 32, 100, 0.5, null, '20', NaN])('sampleInset sai báo đúng layer: %j', (sampleInset) => {
    expect(() => parseTilemapData({ ...pilot.tilemap, layers: [{ ...pilot.tilemap.layers[0], sampleInset }] })).toThrow('tilemap.layers[0].sampleInset');
  });

  it('UV mặt tường chỉ lấy phần trong tile đã chọn; mép mái vẫn lấy toàn tile, ô world giữ 0.5', async () => {
    const data = parseTilemapData(pilot.tilemap);
    const renderer = new TilemapRenderer(data);
    await renderer.load(async () => new Texture({ width: 1024, height: 1024 } as HTMLImageElement));
    const wall = renderer.visual.children.find(({ name }) => name === 'terrain')! as Mesh;
    const uv = wall.geometry.getAttribute('uv');
    expect(uv.getX(0)).toBeCloseTo((3 * 64 + 20.5) / 1024);
    expect(uv.getX(1)).toBeCloseTo((4 * 64 - 20.5) / 1024);
    const positions = wall.geometry.getAttribute('position');
    expect(positions.getX(1) - positions.getX(0)).toBe(0.5);
    expect(data.layers.find(({ id }) => id === 'roof-edges')?.sampleInset).toBeUndefined();
    renderer.dispose();
  });
});
