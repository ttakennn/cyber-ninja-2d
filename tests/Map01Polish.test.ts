import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Mesh, OrthographicCamera, Texture } from 'three';
import type { MeshBasicMaterial } from 'three';
import { describe, expect, it, vi } from 'vitest';
import { EnvironmentRenderer } from '../src/rendering/EnvironmentRenderer';
import { parseEnvironmentData } from '../src/world/EnvironmentData';
import { parseLevelData } from '../src/world/LevelData';
import pilot from '../src/world/levels/map-01-visual-pilot.json';
import five from '../src/world/levels/map-01-five-zones.json';
import props from '../public/assets/environments/map01/props-v2/props.json';
import signAsset from '../public/assets/environments/map01/ui-polish-rc3/asset-manifest.json';
import streetLayout from '../integration/map01-street-layout.json';

const sign = pilot.environment.decorations.find(({ id }) => id === 'polish-sign-pho-sai-gon')!;

describe('Map01 polish RC3 theo bảy ảnh', () => {
  it.each([pilot, five])('$id có ba thùng sát nhau, bench là vật cản và lan can chỉ trang trí', (source) => {
    const level = parseLevelData(source);
    for (const [decoId, solidId, assetId, x, footY, width, height] of [
      ['rc2-street-crate', 'street-crate', 'crate-wood', 21.5, -2.5, 1, 1],
      ['polish-crate-2', 'polish-crate-2', 'crate-wood', 22.5, -2.5, 1, 1],
      ['polish-crate-3', 'polish-crate-3', 'crate-wood', 23.5, -2.5, 1, 1],
      ['rc2-bench', 'rc2-bench', 'street-bench', 8.5, -2.5, 2.5, 1],
    ] as const) {
      const solid = level.solids.find(({ id }) => id === solidId)!;
      expect(solid).toMatchObject({ position: { x, y: footY + height / 2 }, width, height });
      const visual = level.environment!.decorations.find(({ id }) => id === decoId)!;
      const asset = props.props.find(({ id }) => id === assetId)!;
      const [left, top, right, bottom] = asset.alphaBounds;
      expect(visual.worldSize.width * (right! - left! + 1) / asset.sizePx.width).toBeCloseTo(width);
      expect(visual.worldSize.height * (bottom! - top! + 1) / asset.sizePx.height).toBeCloseTo(height);
      expect(visual.worldPosition.y + (asset.sizePx.height - 1 - bottom!) / asset.sizePx.height * visual.worldSize.height).toBeCloseTo(footY - 0.02);
    }
    const crates = level.solids.filter(({ id }) => id === 'street-crate' || /^polish-crate-/.test(id)).sort((a, b) => a.position.x - b.position.x);
    expect(crates).toHaveLength(3);
    expect(crates[1]!.position.x - crates[0]!.position.x).toBeCloseTo(crates[2]!.position.x - crates[1]!.position.x);
    expect(crates[1]!.position.x - crates[0]!.position.x).toBeCloseTo((crates[0]!.width + crates[1]!.width) / 2);
    for (const id of ['polish-roof-railing-1', 'polish-roof-railing-2']) {
      expect(level.solids.find((entry) => entry.id === id)).toBeUndefined();
      expect(level.environment!.decorations.find((entry) => entry.id === id)).toMatchObject({ worldPosition: { y: 1.98 }, sourceRect: { x: 10, y: 8, width: 346, height: 171 } });
    }
    const rails = level.environment!.decorations.filter(({ id }) => id.startsWith('polish-roof-railing-'));
    expect(rails[0]!.flipX).toBe(true);
    expect(rails[1]!.flipX).toBeUndefined();
    expect(rails[0]!.worldPosition.x + rails[0]!.worldSize.width / 2 - (rails[1]!.worldPosition.x - rails[1]!.worldSize.width / 2)).toBeCloseTo(0.4);
    for (const id of ['props-scooter-red-0', 'props-sign-pho-247-1', 'foreground-railing_cross-11', 'rc2-balcony-planter', 'polish-roof-metal-crate']) {
      expect(level.environment!.decorations.find((entry) => entry.id === id)).toBeUndefined();
      expect(level.solids.find((entry) => entry.id === id)).toBeUndefined();
    }
  });

  it('prop lớn hơn nhân vật và chín chậu mái chỉ trang trí, chân neo vào mặt mái', () => {
    const level = parseLevelData(pilot);
    for (const [id, assetId, foot, width, height] of [
      ['props-rooftop-water-tank-5', 'rooftop-water-tank', 2, 1.37, 2.2], ['props-satellite-dish-6', 'satellite-dish', 3, 1.79, 2.1],
      ['props-antenna-7', 'antenna', 3.5, 1.53, 2.2], ['props-rooftop-water-tank-8', 'rooftop-water-tank', 3, 1.37, 2.2],
    ] as const) {
      const entry = level.environment!.decorations.find((entry) => entry.id === id)!;
      const asset = props.props.find(({ id }) => id === assetId)!;
      const bounds = asset.alphaBounds;
      expect((bounds[2]! - bounds[0]! + 1) / asset.sizePx.width * entry.worldSize.width).toBeCloseTo(width * 1.5);
      expect((bounds[3]! - bounds[1]! + 1) / asset.sizePx.height * entry.worldSize.height).toBeCloseTo(height * 1.5);
      expect(entry.worldPosition.y + (asset.sizePx.height - 1 - bounds[3]!) / asset.sizePx.height * entry.worldSize.height).toBeCloseTo(foot - 0.02);
      expect(level.solids.find((solid) => solid.id === id)).toBeUndefined();
    }
    const pots = level.environment!.decorations.filter(({ id }) => id.startsWith('polish-roof-pot-'));
    expect(pots).toHaveLength(9);
    for (const [left, right] of [[0, 1], [4, 5], [6, 7]]) {
      const first = pots[left!]!;
      const second = pots[right!]!;
      expect(second.worldPosition.x - first.worldPosition.x).toBeLessThanOrEqual(0.65 * 1.5);
    }
    const potAsset = props.props.find(({ id }) => id === 'potted-plant')!;
    for (const entry of pots) {
      expect(entry.worldSize.width * (potAsset.alphaBounds[2]! - potAsset.alphaBounds[0]! + 1) / potAsset.sizePx.width).toBeCloseTo(0.65 * 1.5);
      const foot = entry.id === 'polish-roof-pot-3' || entry.id === 'polish-roof-pot-4' || entry.id === 'polish-roof-pot-5' ? 3.5 : 3;
      expect(entry.worldPosition.y + (potAsset.sizePx.height - 1 - potAsset.alphaBounds[3]!) / potAsset.sizePx.height * entry.worldSize.height).toBeCloseTo(foot - 0.08);
    }
    for (const entry of level.environment!.decorations.filter(({ id }) => id.startsWith('polish-roof-') || id.startsWith('polish-balcony-') || id === 'polish-street-lamp')) expect(level.solids.find(({ id }) => id === entry.id)).toBeUndefined();
    expect(level.environment!.decorations.find(({ id }) => id === 'props-rooftop-water-tank-5')!.worldPosition.x).toBeLessThan(40);
  });

  it('dùng chậu individual/props-v2 có crop sát chân, nằm trong mái và không thêm collider', () => {
    const level = parseLevelData(five);
    for (const [id, foot, left, right, originalWidth] of [
      ['polish-balcony-mixed', 1, 30, 36.5, 1.35], ['polish-balcony-tropical', 1, 30, 36.5, 1.35],
      ['polish-roof-large', 3, 50, 58, 1.4], ['polish-roof-amber-1', 3, 50, 58, 0.7],
      ['polish-roof-tropical', 3, 70, 80, 1.5], ['polish-roof-amber-2', 3, 70, 80, 0.75],
    ] as const) {
      const entry = level.environment!.decorations.find((entry) => entry.id === id)!;
      expect(entry.sourceRect).toBeDefined();
      expect(entry.worldPosition.y).toBeCloseTo(foot - 0.08);
      expect(entry.worldSize.width).toBeCloseTo(originalWidth * 1.5);
      expect(entry.worldPosition.x - entry.worldSize.width / 2).toBeGreaterThanOrEqual(left);
      expect(entry.worldPosition.x + entry.worldSize.width / 2).toBeLessThanOrEqual(right);
      expect(entry.worldSize.width / entry.worldSize.height).toBeCloseTo(entry.sourceRect!.width / entry.sourceRect!.height);
    }
    expect(level.environment!.decorations.find(({ id }) => id === 'polish-roof-planter-box')!.image).toContain('props-v2/props/street/planter-box.png');
    for (const [leftId, rightId] of [['polish-roof-amber-1', 'polish-roof-pot-2'], ['polish-roof-amber-2', 'polish-roof-pot-8']]) {
      const first = level.environment!.decorations.find(({ id }) => id === leftId)!;
      const second = level.environment!.decorations.find(({ id }) => id === rightId)!;
      expect(first.worldPosition.x + first.worldSize.width / 2).toBeGreaterThan(second.worldPosition.x - second.worldSize.width / 2);
    }
  });

  it('đèn lật ngang riêng instance, tiến gần ghế và giữ kích thước dương trong dữ liệu', async () => {
    const lamp = pilot.environment.decorations.find(({ id }) => id === 'polish-street-lamp')!;
    const asset = props.props.find(({ id }) => id === 'street-lamp')!;
    const data = parseEnvironmentData({ backgrounds: [], decorations: [lamp, { ...lamp, id: 'unflipped', flipX: false }] });
    const renderer = new EnvironmentRenderer(data);
    await renderer.load(async () => new Texture({ width: asset.sizePx.width, height: asset.sizePx.height } as HTMLImageElement));
    expect(data.decorations[0]!.flipX).toBe(true);
    expect(data.decorations[0]!.worldSize.width).toBeGreaterThan(0);
    expect(lamp.worldPosition.x).toBeLessThan(10);
    expect(renderer.visual.children[0]!.scale.x).toBe(-lamp.worldSize.width);
    expect(renderer.visual.children[1]!.scale.x).toBe(lamp.worldSize.width);
    expect(() => parseEnvironmentData({ backgrounds: [], decorations: [{ ...lamp, flipX: 'true' }] })).toThrow('flipX');
    renderer.dispose();
  });

  it('biển mới giữ PNG/hash và crop trong atlas nguồn; chân cổng vẫn chạm đường', () => {
    const png = readFileSync(new URL(`../public/${signAsset.image}`, import.meta.url));
    expect(createHash('sha256').update(png).digest('hex')).toBe(signAsset.sha256);
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual(signAsset.pixelSize);
    expect(sign).toMatchObject({ image: signAsset.image, sourceRect: signAsset.sourceRect, ledBorder: { colors: ['#78fff3', '#fa7cfd'], period: 0.8 } });
    const gate = pilot.environment.decorations.find(({ id }) => id === 'foreground-street_shop_awning-9')!;
    expect(gate.worldSize.height).toBe(3.8);
    expect(gate.worldPosition.y + 9 / 330 * gate.worldSize.height).toBeCloseTo(-2.5);
  });

  it('LED chỉ nhấp nháy viền theo delta, giữ chữ và không tạo thêm mesh mỗi frame', async () => {
    const data = parseEnvironmentData({ backgrounds: [], decorations: [sign] });
    const renderer = new EnvironmentRenderer(data);
    await renderer.load(async () => new Texture({ width: signAsset.pixelSize[0], height: signAsset.pixelSize[1] } as HTMLImageElement));
    const mesh = renderer.visual.children[0]! as Mesh;
    expect(mesh.children).toHaveLength(32);
    const lights = [...new Set(mesh.children.map((child) => (child as Mesh).material as MeshBasicMaterial))];
    expect(lights).toHaveLength(2);
    const camera = new OrthographicCamera();
    renderer.update(camera, 0);
    const initial = lights.map(({ opacity }) => opacity);
    renderer.update(camera, 0.4);
    expect(lights.map(({ opacity }) => opacity)).toEqual([...initial].reverse());
    expect((mesh.material as MeshBasicMaterial).opacity).toBe(1);
    expect(mesh.children).toHaveLength(32);
    const dispose = lights.map((material) => vi.spyOn(material, 'dispose'));
    renderer.dispose(); renderer.dispose();
    for (const spy of dispose) expect(spy).toHaveBeenCalledTimes(1);
  });

  it.each([null, { colors: ['#fff'], period: 0.8 }, { colors: ['white', '#00ffff'], period: 0.8 },
    { colors: ['#ffffff', '#00ffff'], period: 0 }, { colors: ['#ffffff', '#00ffff'], period: Infinity }])('LED sai báo lỗi rõ: %j', (ledBorder) => {
    expect(() => parseEnvironmentData({ backgrounds: [], decorations: [{ ...sign, ledBorder }] })).toThrow('ledBorder');
  });

  it('mảnh phố cắt được thay bằng cây, background ăn khớp đường và mặt bậc khớp collider', () => {
    const level = parseLevelData(five);
    const plant = level.environment!.decorations.find(({ id }) => id === 'street-mix-transition-planter')!;
    expect(plant.image).toBe(streetLayout.transitionPlant.image);
    expect(plant.image).toContain('foreground/individual/planters_mixed.png');
    expect(plant.sourceRect).toEqual(streetLayout.transitionPlant.sourceRect);
    expect(plant.worldPosition.y).toBeCloseTo(-2.58);
    expect(level.environment!.decorations.find(({ id }) => id === 'street-mix-near-6')).toBeUndefined();
    for (const [index, solid] of level.solids.filter(({ id }) => id.startsWith('z4-step-')).entries()) {
      const face = level.environment!.decorations.find(({ id }) => id === `polish-stair-face-${index}`)!;
      const cap = level.environment!.decorations.find(({ id }) => id === `polish-stair-cap-${index}`)!;
      const vines = level.environment!.decorations.find(({ id }) => id === `polish-stair-vines-${index}`)!;
      expect(face.image).toContain('production/atlases/architecture-0.png');
      expect(face.sourceRect?.x).toBe(512);
      expect(face.worldSize).toEqual({ width: solid.width, height: solid.height });
      expect(face.worldPosition.y + face.worldSize.height).toBeCloseTo(solid.position.y + solid.height / 2);
      expect(cap.worldPosition.y + cap.worldSize.height).toBeCloseTo(solid.position.y + solid.height / 2);
      expect(vines.z).toBeGreaterThan(face.z);
      expect(vines.z).toBeGreaterThan(cap.z);
      expect(vines.worldPosition.y).toBeGreaterThanOrEqual(-2.5);
      expect(vines.worldPosition.y + vines.worldSize.height).toBeLessThan(solid.position.y + solid.height / 2);
      expect(level.solids.find(({ id }) => id === vines.id)).toBeUndefined();
    }
    expect(streetLayout.transitionPlant.scale).toBe(1.5);
    expect(plant.worldSize.width / plant.worldSize.height).toBeCloseTo(344 / 243);
    expect(level.environment!.decorations.find(({ id }) => id === 'polish-stair-landing-planters')).toBeUndefined();
    expect(level.solids.find(({ id }) => id === 'polish-stair-landing-planters')).toBeUndefined();
  });
});
