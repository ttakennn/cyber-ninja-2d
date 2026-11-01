import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import five from '../src/world/levels/map-01-five-zones.json';
import replacements from '../integration/z45-atlas-rc1/environment-replacements-atlas.json';
import mapping from '../integration/z45-atlas-rc1/replacement-map.json';
import master from '../integration/five-zone-design/map01-five-zones.master.json';
import reuse from '../integration/five-zone-design/runtime-reuse-additions.json';
import metadata from '../public/assets/environments/map01/expansion-z45-rc1/asset-manifest.json';
import revision from '../integration/map01-revision-rc2/map-revision-plan.json';

describe('Zone4/5 atlas RC1 integration', () => {
  it('giữ nguồn 22 replacement RC1; runtime chỉ giữ các ID không bị RC2 xoá', () => {
    const decorations = five.environment.decorations;
    expect(new Set(decorations.map(({ id }) => id)).size).toBe(decorations.length);
    expect(mapping.entries).toHaveLength(22);
    expect(replacements.decorations).toHaveLength(22);
    for (const entry of replacements.decorations) {
      const actual = decorations.filter(({ id }) => id === entry.id);
      if (revision.removeDecorationIds.includes(entry.id)) expect(actual).toHaveLength(0);
      else expect(actual).toEqual([entry]);
      const original = master.placements.find(({ id }) => id === entry.id)!;
      for (const key of ['worldPosition', 'worldSize', 'anchor', 'collision', 'layer', 'z'] as const) expect(entry[key]).toEqual(original[key]);
    }
    for (const id of mapping.keepExistingReusePlacementIds) expect(decorations.find((entry) => entry.id === id)).toEqual(revision.removeDecorationIds.includes(id) ? undefined : reuse.decorations.find((entry) => entry.id === id));
    expect(decorations.some(({ image }) => image.includes('five-zone-graybox/'))).toBe(false);
    expect(decorations.filter(({ image }) => image.includes('expansion-z45-rc1/')).every(({ image }) => image.includes('/atlases/'))).toBe(true);
  });

  it.each(metadata.assets)('$id giữ PNG/hash nguồn và map đúng rect atlas', (asset) => {
    const png = readFileSync(new URL(`../public/${asset.image}`, import.meta.url));
    expect(createHash('sha256').update(png).digest('hex')).toBe(asset.sha256);
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual(asset.pixelSize);
    for (const entry of mapping.entries.filter(({ assetId }) => assetId === asset.id)) {
      expect(replacements.decorations.find(({ id }) => id === entry.placementId)).toMatchObject({ image: asset.atlas.image, pixelSize: asset.atlas.pixelSize, sourceRect: asset.atlas.sourceRect });
    }
  });

  it.each(metadata.atlases)('$image đúng hash/kích thước; tường full page không cần gutter', (atlas) => {
    const png = readFileSync(new URL(`../public/${atlas.image}`, import.meta.url));
    expect(createHash('sha256').update(png).digest('hex')).toBe(atlas.sha256);
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual(atlas.pixelSize);
    if (atlas.standalone) {
      expect(atlas.edgeExtrusionPixels).toBe(0);
      expect(replacements.decorations.find(({ image }) => image === atlas.image)?.sourceRect).toEqual({ x: 0, y: 0, width: 2048, height: 768 });
    } else for (const entry of replacements.decorations.filter(({ image }) => image === atlas.image)) {
      expect(entry.sourceRect.x).toBeGreaterThanOrEqual(atlas.edgeExtrusionPixels);
      expect(entry.sourceRect.y).toBeGreaterThanOrEqual(atlas.edgeExtrusionPixels);
      expect(entry.sourceRect.x + entry.sourceRect.width + atlas.edgeExtrusionPixels).toBeLessThanOrEqual(atlas.pixelSize[0]!);
      expect(entry.sourceRect.y + entry.sourceRect.height + atlas.edgeExtrusionPixels).toBeLessThanOrEqual(atlas.pixelSize[1]!);
    }
  });
});
