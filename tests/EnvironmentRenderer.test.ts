import { LinearFilter, Mesh, RepeatWrapping, SRGBColorSpace, Texture } from 'three';
import type { MeshBasicMaterial, PlaneGeometry } from 'three';
import { describe, expect, it, vi } from 'vitest';
import { EnvironmentRenderer } from '../src/rendering/EnvironmentRenderer';
import { GameCamera } from '../src/rendering/GameCamera';
import { TilemapRenderer } from '../src/rendering/TilemapRenderer';
import { parseEnvironmentData } from '../src/world/EnvironmentData';
import { parseLevelData } from '../src/world/LevelData';
import pilot from '../src/world/levels/map-01-visual-pilot.json';

const data = parseEnvironmentData(pilot.environment);
const definitions = new Map([...data.backgrounds, ...data.decorations].map((entry) => [entry.image, entry]));
const texture = (url: string) => new Texture({ width: definitions.get(url)!.pixelSize[0], height: definitions.get(url)!.pixelSize[1] } as HTMLImageElement);
const modulo = (value: number) => ((value % 1) + 1) % 1;

describe('environment Three.js theo camera', () => {
  it('tải duy nhất mỗi ảnh, bottom-center, alpha/Z đúng và dùng chung geometry', async () => {
    const renderer = new EnvironmentRenderer(data);
    const loader = vi.fn(async (url: string) => texture(url));
    await Promise.all([renderer.load(loader), renderer.load(loader)]);
    expect(loader).toHaveBeenCalledTimes(definitions.size);
    const meshes = renderer.visual.children as Mesh<PlaneGeometry, MeshBasicMaterial>[];
    expect(meshes).toHaveLength(data.backgrounds.length + data.decorations.length);
    expect(new Set(meshes.map((mesh) => mesh.geometry)).size).toBe(1);
    for (const mesh of meshes) {
      expect(mesh.material.transparent).toBe(true);
      expect(mesh.material.depthWrite).toBe(false);
      expect(mesh.material.map?.colorSpace).toBe(SRGBColorSpace);
      expect(mesh.material.map?.minFilter).toBe(LinearFilter);
      expect(mesh.material.map?.generateMipmaps).toBe(false);
    }
    for (const decoration of data.decorations) {
      const mesh = meshes.find(({ name }) => name === decoration.id)!;
      expect(mesh.position.x).toBe(decoration.worldPosition.x);
      expect(mesh.position.y - mesh.scale.y / 2).toBeCloseTo(decoration.worldPosition.y);
      expect(mesh.scale.toArray()).toEqual([decoration.worldSize.width, decoration.worldSize.height, 1]);
      expect(mesh.position.z).toBe(decoration.z);
    }
    const tanks = meshes.filter(({ name }) => name.includes('water-tank'));
    expect(tanks[0]!.material.map).toBe(tanks[1]!.material.map);
    renderer.dispose();
  });

  it.each([[1920, 1080], [1280, 720], [800, 600], [360, 640]])('parallax liên tục ở viewport %s×%s, sky chỉ một ảnh cover', async (width, height) => {
    const renderer = new EnvironmentRenderer(data);
    await renderer.load(async (url) => texture(url));
    const camera = new GameCamera(undefined, true);
    camera.resize(width!, height!);
    for (const x of [0, 13, 33, 63, 80]) for (const y of [0, 3.2, 7]) {
      camera.camera.position.set(x, y, 10);
      renderer.update(camera.camera);
      const viewWidth = camera.camera.right - camera.camera.left;
      const viewHeight = camera.camera.top - camera.camera.bottom;
      for (const layer of data.backgrounds) {
        const mesh = renderer.visual.children.find(({ name }) => name === layer.id)! as Mesh<PlaneGeometry, MeshBasicMaterial>;
        expect(mesh.position.x).toBe(x);
        expect(mesh.position.z).toBe(layer.z);
        if (layer.repeatX) {
          const worldWidth = layer.worldHeight * layer.pixelSize[0] / layer.pixelSize[1];
          expect(mesh.material.map?.wrapS).toBe(RepeatWrapping);
          expect(mesh.material.map?.offset.x).toBeCloseTo(modulo((x * layer.parallaxX - viewWidth / 2) / worldWidth));
          expect(mesh.material.map?.repeat.x).toBeCloseTo(viewWidth / worldWidth);
          expect(mesh.position.y).toBeCloseTo(layer.verticalAnchor === 'world' ? layer.worldBottom! + layer.worldHeight / 2
            : y * (1 - layer.parallaxY) - viewHeight / 2 + layer.bottomOffset + layer.worldHeight / 2);
        } else {
          expect(mesh.material.map?.repeat.toArray()).toEqual([1, 1]);
          expect(mesh.material.map?.offset.toArray()).toEqual([0, 0]);
          expect(mesh.position.y).toBe(y);
          expect(mesh.scale.x).toBeGreaterThanOrEqual(viewWidth);
          expect(mesh.scale.y).toBeGreaterThanOrEqual(viewHeight);
          expect(mesh.scale.x / mesh.scale.y).toBeCloseTo(2);
        }
      }
      expect(renderer.visual.children.filter(({ name }) => name === 'sky')).toHaveLength(1);
    }
    renderer.dispose();
  });

  it('resize giữ pha ở tâm; qua một chu kỳ repeat không nhảy hình, zoom vẫn phủ viewport', async () => {
    const renderer = new EnvironmentRenderer(data);
    await renderer.load(async (url) => texture(url));
    const camera = new GameCamera(undefined, true);
    camera.camera.position.set(33, 4, 10);
    renderer.update(camera.camera);
    const mesh = renderer.visual.children.find(({ name }) => name === 'city-far')! as Mesh<PlaneGeometry, MeshBasicMaterial>;
    const map = mesh.material.map!;
    const phase = modulo(map.offset.x + map.repeat.x / 2);
    camera.resize(800, 600);
    renderer.update(camera.camera);
    expect(modulo(map.offset.x + map.repeat.x / 2)).toBeCloseTo(phase);
    const worldWidth = 4 * 2048 / 640;
    camera.camera.position.x += worldWidth / 0.15;
    renderer.update(camera.camera);
    expect(modulo(map.offset.x + map.repeat.x / 2)).toBeCloseTo(phase);
    camera.camera.zoom = 2;
    camera.camera.updateProjectionMatrix();
    renderer.update(camera.camera);
    expect(mesh.scale.x).toBeCloseTo(6);
    renderer.dispose();
  });

  it('1000 render update không tạo mesh/geometry mới, tải thêm ảnh hoặc dịch prop trong world', async () => {
    const renderer = new EnvironmentRenderer(data);
    const loader = vi.fn(async (url: string) => texture(url));
    await renderer.load(loader);
    const meshes = [...renderer.visual.children] as Mesh<PlaneGeometry, MeshBasicMaterial>[];
    const geometry = meshes[0]!.geometry;
    const prop = meshes.find(({ name }) => name === data.decorations[0]!.id)!;
    const position = prop.position.clone();
    const camera = new GameCamera(undefined, true);
    for (let frame = 0; frame < 1000; frame += 1) {
      camera.camera.position.set(frame / 10, Math.sin(frame / 20), 10);
      renderer.update(camera.camera);
    }
    expect(renderer.visual.children).toEqual(meshes);
    expect(meshes.every((mesh) => mesh.geometry === geometry)).toBe(true);
    expect(prop.position).toEqual(position);
    expect(loader).toHaveBeenCalledTimes(definitions.size);
    renderer.dispose();
  });

  it('dispose giải phóng geometry chia sẻ, từng material và cả texture gốc/clone đúng một lần', async () => {
    const renderer = new EnvironmentRenderer(data);
    const loaded: Texture[] = [];
    await renderer.load(async (url) => { const result = texture(url); loaded.push(result); return result; });
    const meshes = renderer.visual.children as Mesh<PlaneGeometry, MeshBasicMaterial>[];
    const textures = new Set([...loaded, ...meshes.map((mesh) => mesh.material.map!)]);
    const spies = [...textures].map((entry) => vi.spyOn(entry, 'dispose'));
    spies.push(vi.spyOn(meshes[0]!.geometry, 'dispose'));
    for (const mesh of meshes) spies.push(vi.spyOn(mesh.material, 'dispose'));
    renderer.dispose(); renderer.dispose();
    for (const spy of spies) expect(spy).toHaveBeenCalledTimes(1);
    expect(renderer.visual.children).toHaveLength(0);
    const loader = vi.fn(async (url: string) => texture(url));
    await renderer.load(loader);
    expect(loader).not.toHaveBeenCalled();
  });

  it('lỗi một ảnh vẫn thu hồi những ảnh khác, không fallback hoặc rò resource', async () => {
    const renderer = new EnvironmentRenderer(data);
    const textures: Texture[] = [];
    const spies: ReturnType<typeof vi.spyOn>[] = [];
    await expect(renderer.load(async (url) => {
      if (url.endsWith('sky.png')) throw new Error('404');
      const result = texture(url);
      textures.push(result); spies.push(vi.spyOn(result, 'dispose'));
      return result;
    })).rejects.toThrow('environment image: assets/environments/map01/backgrounds/sky.png');
    expect(textures).toHaveLength(definitions.size - 1);
    for (const spy of spies) expect(spy).toHaveBeenCalledTimes(1);
    expect(renderer.visual.children).toHaveLength(0);
    renderer.dispose();
  });

  it('PNG khác kích thước khai báo tạo lỗi rõ và giải phóng', async () => {
    const renderer = new EnvironmentRenderer(data);
    await expect(renderer.load(async (url) => {
      const result = texture(url);
      if (url.endsWith('sky.png')) result.image = { width: 1, height: 1 } as HTMLImageElement;
      return result;
    })).rejects.toThrow('kích thước 1×1, cần 2048×1024');
    expect(renderer.visual.children).toHaveLength(0);
  });

  it('dispose trong lúc tải không gắn ảnh muộn và không báo lỗi mạng cũ', async () => {
    const only = parseEnvironmentData({ backgrounds: [pilot.environment.backgrounds[0]], decorations: [] });
    const renderer = new EnvironmentRenderer(only);
    let finish!: (value: Texture) => void;
    const pending = renderer.load(() => new Promise((resolve) => { finish = resolve; }));
    renderer.dispose();
    const late = texture(only.backgrounds[0]!.image);
    const released = vi.spyOn(late, 'dispose');
    finish(late); await pending;
    expect(released).toHaveBeenCalledTimes(1);
    expect(renderer.visual.children).toHaveLength(0);
    const failed = new EnvironmentRenderer(only);
    let reject!: (error: Error) => void;
    const rejected = failed.load(() => new Promise((_, fail) => { reject = fail; }));
    failed.dispose(); reject(new Error('network'));
    await expect(rejected).resolves.toBeUndefined();
  });

  it('tint chỉ tác động layer được khai báo, layer cũ mặc định trắng', async () => {
    const map = parseLevelData(pilot).tilemap!;
    const renderer = new TilemapRenderer(map);
    await renderer.load(async () => new Texture({ width: 1024, height: 1024 } as HTMLImageElement));
    const meshes = renderer.visual.children as Mesh<PlaneGeometry, MeshBasicMaterial>[];
    expect(meshes.find(({ name }) => name === 'terrain')!.material.color.getHex()).toBe(0x687da6);
    expect(meshes.find(({ name }) => name === 'markers')!.material.color.getHex()).toBe(0xffffff);
    renderer.dispose();
  });
});
