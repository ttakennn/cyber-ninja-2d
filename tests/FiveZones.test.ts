import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parseLevelData } from '../src/world/LevelData';
import { getLevelData } from '../src/world/levels';
import { PhysicsWorld } from '../src/physics/PhysicsWorld';
import type { PhysicsBody } from '../src/physics/Collision';
import base from '../src/world/levels/map-01-visual-pilot.json';
import five from '../src/world/levels/map-01-five-zones.json';
import manifest from '../integration/five-zone-design/asset-manifest.json';
import plan from '../integration/five-zone-design/level-extension.plan.json';
import revision from '../integration/map01-revision-rc2/map-revision-plan.json';

describe('Map01 five zones graybox', () => {
  it('alias riêng, giữ source gameplay mới nhất và đúng một ground mới', () => {
    expect(getLevelData('map01')).toBe(base);
    expect(getLevelData('map01-five-zones')).toBe(five);
    const parsed = parseLevelData(five);
    expect(parsed.solids.slice(0, base.solids.length)).toEqual(base.solids);
    expect(parsed.solids.slice(base.solids.length)).toEqual([...plan.appendSolids, ...revision.appendSolids]);
    for (const key of ['spawn', 'climbables', 'cameraFollowY', 'deathY'] as const) expect(parsed[key]).toEqual(base[key]);
    expect(parsed.cameraBounds).toEqual({ ...base.cameraBounds, maxX: 144 });
    expect(parsed.solids).toHaveLength(13);
    expect(five.environment.backgrounds).toEqual(base.environment.backgrounds);
    for (const entry of base.environment.decorations.filter(({ id }) => id !== 'rc2-street-78')) expect(five.environment.decorations.find(({ id }) => id === entry.id)).toEqual(entry);
  });

  it('grid đúng ngân sách, giữ ô cũ trừ marker kết thúc, sàn mới phẳng', () => {
    const map = parseLevelData(five).tilemap!;
    expect(map.columns * map.rows * map.layers.length).toBe(55296);
    expect(map.tileSize).toEqual(base.tilemap.tileSize);
    for (const [index, layer] of map.layers.entries()) for (const [row, cells] of layer.cells.entries()) {
      expect(cells).toHaveLength(288);
      for (let column = 0; column < 160; column += 1) {
        const retired = layer.id === 'markers' && column >= 155 && column < 157 && row >= 12 && row < 17;
        expect(cells[column]).toBe(retired ? null : base.tilemap.layers[index]!.cells[row]![column]);
      }
    }
    expect(map.layers.find(({ id }) => id === 'roof-edges')!.cells[28]!.slice(160)).toEqual(Array(128).fill(null));
  });

  it('chỉ tải URL có thật; không tải plannedImage hoặc SVG reference khi đã resolve RC1', () => {
    const runtime = JSON.stringify(five);
    expect(runtime).not.toContain('assets/environments/map01/five-zone-graybox/');
    for (const asset of manifest.assets.filter(({ runtimeReady }) => !runtimeReady)) {
      expect(runtime).not.toContain(asset.plannedImage!);
      const svg = readFileSync(new URL(`../public/assets/environments/map01/five-zone-graybox/${asset.id}.svg`, import.meta.url), 'utf8');
      expect(svg).toContain('GRAYBOX');
      if ('text' in asset) expect(svg).toContain(asset.text);
    }
    for (const entry of five.environment.decorations) expect(() => readFileSync(new URL(`../public/${entry.image}`, import.meta.url))).not.toThrow();
    expect(five.environment.decorations.filter((entry) => entry.worldPosition.x >= 80).every((entry) => entry.collision === false && entry.layer === 'behind-player')).toBe(true);
    expect(five.environment.decorations.filter((entry) => entry.worldPosition.x > 80 && entry.worldPosition.x - entry.worldSize.width / 2 < 88)
      .every(({ id }) => id === 'rc2-z4-stairs' || id.startsWith('rc2-street-'))).toBe(true);
    expect(five).not.toHaveProperty('encounter');
  });

  it.each([false, true])('rời mái chạy/nhảy=%s đáp trong 80..88 rồi đi hết phố mới', (jump) => {
    const parsed = parseLevelData(five);
    const world = new PhysicsWorld(-28, parsed.solids, parsed.climbables);
    const body: PhysicsBody = { position: { x: 79.5, y: 3.8 }, velocity: { x: 6, y: jump ? 11 : 0 }, width: 0.8, height: 1.6, isGrounded: !jump };
    let landedX: number | undefined;
    for (let frame = 0; frame < 640; frame += 1) {
      body.velocity.x = 6;
      world.step(body, 1 / 60);
      expect(body.position.y).toBeGreaterThan(-8);
      if (body.position.x > 80.4 && body.isGrounded && landedX === undefined) landedX = body.position.x;
    }
    expect(landedX).toBeGreaterThan(80);
    expect(landedX).toBeLessThanOrEqual(88);
    expect(body.position.x).toBeGreaterThan(143);
    expect(body.position.y).toBeCloseTo(-1.7);
  });

  it('generator tái tạo JSON revision RC2 đã review', () => {
    expect(() => execFileSync(process.execPath, [fileURLToPath(new URL('../scripts/generate_map01_five_zones.mjs', import.meta.url)), '--check'])).not.toThrow();
  });
});
