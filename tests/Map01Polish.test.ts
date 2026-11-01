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
  it.each([pilot, five])('$id có ba thùng đều nhau, bench/chậu/hai lan can là vật cản', (source) => {
    const level = parseLevelData(source);
    for (const [decoId, solidId, assetId, x, footY, width, height] of [
      ['rc2-street-crate', 'street-crate', 'crate-wood', 7.5, -2.5, 1, 1],
      ['polish-crate-2', 'polish-crate-2', 'crate-wood', 9.1, -2.5, 1, 1],
      ['polish-crate-3', 'polish-crate-3', 'crate-wood', 10.7, -2.5, 1, 1],
      ['rc2-bench', 'rc2-bench', 'street-bench', 22.5, -2.5, 2.5, 1],
      ['rc2-balcony-planter', 'rc2-balcony-planter', 'planter-box', 34, 1, 1.5, 0.65],
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
    for (const id of ['polish-roof-railing-1', 'polish-roof-railing-2']) {
      expect(level.solids.find((entry) => entry.id === id)).toMatchObject({ width: 2.2, height: 1.2, position: { y: 2.6 } });
      expect(level.environment!.decorations.find((entry) => entry.id === id)).toMatchObject({ worldPosition: { y: 1.98 }, sourceRect: { x: 10, y: 8, width: 346, height: 171 } });
    }
    for (const id of ['props-scooter-red-0', 'props-sign-pho-247-1', 'foreground-railing_cross-11']) expect(level.environment!.decorations.find((entry) => entry.id === id)).toBeUndefined();
  });

  it('prop lớn hơn nhân vật và chín chậu mái chỉ trang trí, chân neo vào mặt mái', () => {
    const level = parseLevelData(pilot);
    for (const [id, assetId, foot] of [
      ['props-rooftop-water-tank-5', 'rooftop-water-tank', 2], ['props-satellite-dish-6', 'satellite-dish', 3],
      ['props-antenna-7', 'antenna', 3.5], ['props-rooftop-water-tank-8', 'rooftop-water-tank', 3],
    ] as const) {
      const entry = level.environment!.decorations.find((entry) => entry.id === id)!;
      const asset = props.props.find(({ id }) => id === assetId)!;
      const bounds = asset.alphaBounds;
      expect((bounds[3]! - bounds[1]! + 1) / asset.sizePx.height * entry.worldSize.height).toBeGreaterThan(1.6);
      expect(entry.worldPosition.y + (asset.sizePx.height - 1 - bounds[3]!) / asset.sizePx.height * entry.worldSize.height).toBeCloseTo(foot - 0.02);
      expect(level.solids.find((solid) => solid.id === id)).toBeUndefined();
    }
    const pots = level.environment!.decorations.filter(({ id }) => id.startsWith('polish-roof-pot-'));
    expect(pots).toHaveLength(9);
    for (const entry of [...pots, level.environment!.decorations.find(({ id }) => id === 'polish-street-lamp')!]) expect(level.solids.find(({ id }) => id === entry.id)).toBeUndefined();
    expect(level.environment!.decorations.find(({ id }) => id === 'props-rooftop-water-tank-5')!.worldPosition.x).toBeLessThan(40);
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
    expect(plant.worldPosition.y).toBeCloseTo(-2.535);
    expect(level.environment!.decorations.find(({ id }) => id === 'street-mix-near-6')).toBeUndefined();
    for (const [index, solid] of level.solids.filter(({ id }) => id.startsWith('z4-step-')).entries()) {
      const face = level.environment!.decorations.find(({ id }) => id === `polish-stair-face-${index}`)!;
      const cap = level.environment!.decorations.find(({ id }) => id === `polish-stair-cap-${index}`)!;
      expect(face.image).toContain('production/atlases/architecture-0.png');
      expect(face.sourceRect?.x).toBe(512);
      expect(face.worldSize).toEqual({ width: solid.width, height: solid.height });
      expect(face.worldPosition.y + face.worldSize.height).toBeCloseTo(solid.position.y + solid.height / 2);
      expect(cap.worldPosition.y + cap.worldSize.height).toBeCloseTo(solid.position.y + solid.height / 2);
    }
  });
});
