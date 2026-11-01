import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Mesh, Texture } from 'three';
import type { MeshBasicMaterial } from 'three';
import { describe, expect, it } from 'vitest';
import { parseLevelData } from '../src/world/LevelData';
import { tilePosition } from '../src/world/TilemapData';
import { EnvironmentRenderer } from '../src/rendering/EnvironmentRenderer';
import pilot from '../src/world/levels/map-01-visual-pilot.json';
import graybox from '../src/world/levels/map-01-graybox.json';
import additions from '../integration/map01-production-additions.json';
import metadata from '../public/assets/environments/map01/production/production-assets.json';
import revision from '../integration/map01-revision-rc2/map-revision-plan.json';

const level = parseLevelData(pilot);
const production = level.environment!.decorations.filter(({ id }) => id.startsWith('production-'));

describe('RC1 production architecture', () => {
  it.each(metadata.assets)('$id đúng atlas, sourceRect, world bounds và SHA-256 nguồn', (asset) => {
    const entry = production.find(({ id }) => id === `production-${asset.id}`)!;
    if (asset.id === 'wall-b-ac-mount' || revision.removeDecorationIds.includes(`production-${asset.id}`)) {
      expect(entry).toBeUndefined();
      expect(createHash('sha256').update(readFileSync(new URL(`../public/${asset.image}`, import.meta.url))).digest('hex')).toBe(asset.sha256);
      return;
    }
    expect(entry).toEqual(additions.decorations.find(({ id }) => id === entry.id));
    expect(entry.image).toBe(asset.atlas.image);
    expect(entry.pixelSize).toEqual(asset.atlas.pixelSize);
    expect(entry.sourceRect).toEqual(asset.atlas.sourceRect);
    expect(entry.worldSize).toEqual(asset.worldSize);
    expect(entry.worldPosition).toEqual(asset.worldPosition);
    expect(entry.sourceRect!.width / entry.worldSize.width).toBe(128);
    expect(entry.sourceRect!.height / entry.worldSize.height).toBe(128);
    expect(entry.collision).toBe(false);
    expect(entry.z).toBe(-0.3);
    const png = readFileSync(new URL(`../public/${asset.image}`, import.meta.url));
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual(asset.pixelSize);
    expect(png[25]).toBe(6);
    expect(createHash('sha256').update(png).digest('hex')).toBe(asset.sha256);
  });

  it('hai atlas nguyên byte, rect không gồm extrusion và không vượt ảnh', () => {
    expect(production).toHaveLength(3);
    expect(new Set(production.map(({ image }) => image)).size).toBe(2);
    for (const atlas of metadata.atlases) {
      const png = readFileSync(new URL(`../public/${atlas.image}`, import.meta.url));
      expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual(atlas.pixelSize);
      expect(createHash('sha256').update(png).digest('hex')).toBe(atlas.sha256);
      for (const entry of production.filter(({ image }) => image === atlas.image)) {
        const rect = entry.sourceRect!;
        expect(rect.x).toBeGreaterThanOrEqual(atlas.edgeExtrusionPixels);
        expect(rect.y).toBeGreaterThanOrEqual(atlas.edgeExtrusionPixels);
        expect(rect.x + rect.width + atlas.edgeExtrusionPixels).toBeLessThanOrEqual(atlas.pixelSize[0]!);
        expect(rect.y + rect.height + atlas.edgeExtrusionPixels).toBeLessThanOrEqual(atlas.pixelSize[1]!);
      }
    }
  });

  it('RC2 bỏ decal A/tường thang; giữ kiến trúc mái và các field ngoài revision', () => {
    for (const key of ['spawn', 'cameraBounds', 'cameraFollowY', 'deathY'] as const) expect(pilot[key]).toEqual(graybox[key]);
    const retained = graybox.solids.filter(({ id }) => !revision.removeSolidIds.includes(id));
    expect(pilot.solids.slice(0, retained.length)).toEqual(retained);
    expect(pilot.climbables).toEqual(revision.replaceClimbables);
    expect(level.tilemap!.layers.find(({ id }) => id === 'passage-masonry')!.cells.flat().every((cell) => cell === null)).toBe(true);
    expect(level.tilemap!.layers.find(({ id }) => id === 'hand-placed-details')!.cells.flat().every((cell) => cell === null)).toBe(true);
    const map = level.tilemap!;
    const terrain = map.layers.find(({ id }) => id === 'terrain')!;
    for (const [row, cells] of terrain.cells.entries()) for (const [column, tile] of cells.entries()) {
      if (tile === null) continue;
      const point = tilePosition(map, column, row);
      for (const facade of production.filter(({ id }) => id.includes('facade-c-'))) {
        if (point.x > facade.worldPosition.x - facade.worldSize.width / 2 && point.x < facade.worldPosition.x + facade.worldSize.width / 2 && point.y > facade.worldPosition.y) {
          expect(point.y).toBeGreaterThanOrEqual(facade.worldPosition.y + facade.worldSize.height);
        }
      }
    }
    for (const id of ['facade-shutter', 'facade-shop', 'facade-light']) expect(level.environment!.decorations.some((entry) => entry.id === id)).toBe(false);
    expect(map.layers.some(({ id }) => id === 'roof-edges')).toBe(true);
    expect(map.layers.some(({ id }) => id === 'street-foundation')).toBe(true);
    expect(production.find(({ id }) => id === 'production-wall-b-ladder')).toBeUndefined();
    expect(production.find(({ id }) => id === 'production-wall-b-ac-mount')).toBeUndefined();
    expect(level.environment!.decorations.find(({ id }) => id === 'props-aircon-unit-4')).toBeUndefined();
  });

  it('atlas cùng URL có UV riêng từng mảng, không tint ảnh và không tạo collider', async () => {
    const renderer = new EnvironmentRenderer(level.environment!);
    const images = new Map([...level.environment!.backgrounds, ...level.environment!.decorations].map((entry) => [entry.image, entry.pixelSize]));
    await renderer.load(async (url) => new Texture({ width: images.get(url)![0], height: images.get(url)![1] } as HTMLImageElement));
    for (const entry of production) {
      const mesh = renderer.visual.children.find(({ name }) => name === entry.id)! as Mesh;
      const material = mesh.material as MeshBasicMaterial;
      expect(material.color.getHex()).toBe(0xffffff);
      expect(material.map!.repeat.x).toBeCloseTo(entry.sourceRect!.width / entry.pixelSize[0]);
      expect(material.map!.offset.y).toBeCloseTo(1 - (entry.sourceRect!.y + entry.sourceRect!.height) / entry.pixelSize[1]);
      expect(mesh.position.y + mesh.scale.y / 2).toBeCloseTo(entry.worldPosition.y + entry.worldSize.height);
    }
    renderer.dispose();
  });
});
