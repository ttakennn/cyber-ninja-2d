import { Mesh, OrthographicCamera, Texture } from 'three';
import type { MeshBasicMaterial } from 'three';
import { describe, expect, it, vi } from 'vitest';
import { EnvironmentRenderer } from '../src/rendering/EnvironmentRenderer';
import { parseEnvironmentData } from '../src/world/EnvironmentData';
import five from '../src/world/levels/map-01-five-zones.json';
import pilot from '../src/world/levels/map-01-visual-pilot.json';
import layout from '../integration/map01-street-layout.json';
import revision from '../integration/map01-revision-rc2/map-revision-plan.json';

const segment = { id: 'segment', image: 'street.png', pixelSize: [512, 256], z: -2, layer: 'background', parallaxX: 0.65,
  worldPosition: { x: 4, y: -2.5 }, worldSize: { width: 4, height: 2 }, anchor: { x: 0.5, y: 1 }, collision: false };

describe('phố hỗn hợp cùng mặt phẳng', () => {
  it('chỉ năm zone thay lớp phố lặp bằng layout hữu hạn, giữ lớp xa và gameplay', () => {
    const data = parseEnvironmentData(five.environment);
    expect(data.backgrounds).toHaveLength(3);
    expect(pilot.environment.backgrounds.find(({ id }) => id === layout.backgroundId)).toBeDefined();
    expect(data.backgrounds.find(({ id }) => id === layout.backgroundId)).toBeUndefined();
    expect(data.backgrounds).toEqual(parseEnvironmentData(pilot.environment).backgrounds.filter(({ id }) => id !== layout.backgroundId));
    for (const id of layout.mergeDecorationIds) {
      expect(data.decorations.find((entry) => entry.id === id)).toBeUndefined();
      const actual = data.decorations.filter((entry) => entry.id === `street-mix-${id}`);
      expect(actual).toHaveLength(1);
      const original = revision.appendDecorations.find((entry) => entry.id === id)!;
      expect(actual[0]).toMatchObject({ image: original.image, pixelSize: original.pixelSize, layer: 'background', z: -2, parallaxX: 0.65, collision: false });
      expect(actual[0]!.worldPosition.x).toBeCloseTo(original.worldPosition.x * layout.scale);
      expect(actual[0]!.worldSize.width).toBeCloseTo(original.worldSize.width * layout.scale);
      const heightScale = id.startsWith('rc2-zone5-yard-backdrop-') ? layout.zone5HeightScale : layout.heightScale;
      expect(actual[0]!.worldSize.height).toBeCloseTo(original.worldSize.height * layout.scale * heightScale);
    }
    const panels = data.decorations.filter(({ id }) => id.startsWith('street-mix-near-') || id.startsWith('street-mix-rc2-zone') || id === 'street-mix-transition-planter')
      .sort((a, b) => a.worldPosition.x - b.worldPosition.x);
    let edge = -32 * layout.scale;
    for (const panel of panels) {
      expect(panel.worldPosition.x - panel.worldSize.width / 2).toBeCloseTo(edge, 10);
      edge = panel.worldPosition.x + panel.worldSize.width / 2;
      const padding = panel.id === 'street-mix-transition-planter' ? 0 : panel.id.startsWith('street-mix-near-') ? 34 : panel.id.includes('zone4-') ? 42 : 95;
      expect(panel.worldPosition.y + padding / panel.pixelSize[1] * panel.worldSize.height).toBeCloseTo(layout.groundY - layout.groundOverlap);
    }
    expect(edge).toBeCloseTo(176 * layout.scale, 10);
    expect(data.decorations.find(({ id }) => id === 'street-mix-near-0')!.worldSize.height).toBeCloseTo(7.28);
    for (const [id, firstAlphaRow] of [['street-mix-rc2-zone5-yard-backdrop-0', 280], ['street-mix-rc2-zone5-yard-backdrop-1', 290]] as const) {
      const yard = data.decorations.find((entry) => entry.id === id)!;
      expect(yard.worldSize.height).toBeCloseTo(8.97);
      expect((673 - firstAlphaRow) / yard.pixelSize[1] * yard.worldSize.height).toBeGreaterThan(4.4);
    }
  });

  it.each([
    { fields: { layer: 'behind-player' }, path: '.z' },
    { fields: { parallaxX: -0.1 }, path: '.parallaxX' },
    { fields: { parallaxX: 1.1 }, path: '.parallaxX' },
    { fields: { parallaxX: NaN }, path: '.parallaxX' },
    { fields: { parallaxX: null }, path: '.parallaxX' },
    { fields: { z: -1 }, path: '.z' },
    { fields: { layer: 'behind-player', z: -0.2 }, path: '.parallaxX' },
    { fields: { layer: 'foreground', z: 2 }, path: '.parallaxX' },
  ])('từ chối cấu hình cuộn/depth sai $path', ({ fields, path }) => {
    expect(() => parseEnvironmentData({ backgrounds: [], decorations: [{ ...segment, ...fields }] })).toThrow(`environment.decorations[0]${path}`);
  });

  it('parser sao chép parallax, mặc định cũ giữ tĩnh, layer background có thể đứng yên', () => {
    const parsed = parseEnvironmentData({ backgrounds: [], decorations: [segment] });
    expect(parsed.decorations[0]?.parallaxX).toBe(0.65);
    const staticSegment = { ...segment, parallaxX: undefined };
    expect(parseEnvironmentData({ backgrounds: [], decorations: [staticSegment] }).decorations[0]).not.toHaveProperty('parallaxX');
  });

  it.each([[1920, 1080], [1280, 720], [1024, 768], [540, 960]])('ảnh và biển cuộn cùng pha, giữ chân đường và không tải lặp ở %s×%s', async (width, height) => {
    const data = parseEnvironmentData(five.environment);
    const sizes = new Map([...data.backgrounds, ...data.decorations].map((entry) => [entry.image, entry.pixelSize]));
    const renderer = new EnvironmentRenderer(data);
    const loader = vi.fn(async (url: string) => new Texture({ width: sizes.get(url)![0], height: sizes.get(url)![1] } as HTMLImageElement));
    await renderer.load(loader);
    const camera = new OrthographicCamera(-4.5 * width! / height!, 4.5 * width! / height!, 4.5, -4.5, 0.1, 100);
    const meshes = [...renderer.visual.children] as Mesh[];
    const prop = meshes.find(({ name }) => name === 'rc2-street-crate')!;
    const originalProp = prop.position.clone();
    for (const x of [8, 80, 94, 106, 120, 136]) {
      camera.position.set(x, 1, 10);
      renderer.update(camera);
      for (const entry of data.decorations.filter(({ id }) => id.startsWith('street-mix-'))) {
        const mesh = meshes.find(({ name }) => name === entry.id)!;
        expect(mesh.position.x).toBeCloseTo(entry.worldPosition.x + x * 0.35);
        expect(mesh.position.y).toBeCloseTo(entry.worldPosition.y + entry.worldSize.height / 2);
        expect(mesh.position.z).toBe(-2);
        expect(mesh.scale.x).toBe(entry.worldSize.width);
        expect(mesh.scale.y).toBe(entry.worldSize.height);
        expect((mesh.material as MeshBasicMaterial).depthWrite).toBe(false);
      }
      expect(renderer.visual.children).toEqual(meshes);
      expect(prop.position).toEqual(originalProp);
    }
    expect(loader).toHaveBeenCalledTimes(sizes.size);
    const materials = meshes.map((mesh) => vi.spyOn(mesh.material as MeshBasicMaterial, 'dispose'));
    renderer.dispose(); renderer.dispose();
    for (const spy of materials) expect(spy).toHaveBeenCalledTimes(1);
  });
});
