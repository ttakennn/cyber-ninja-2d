import { Mesh, NearestFilter, SRGBColorSpace, Texture } from 'three';
import type { BufferGeometry, MeshBasicMaterial } from 'three';
import { describe, expect, it, vi } from 'vitest';
import { TilemapRenderer } from '../src/rendering/TilemapRenderer';
import { parseTilemapData } from '../src/world/TilemapData';

function map() {
  return parseTilemapData({ origin: { x: -2, y: 3 }, columns: 2, rows: 2, tileSize: { width: 0.5, height: 1 },
    tileset: { image: 'tiles.svg', imageWidth: 64, imageHeight: 32, tileWidth: 16, tileHeight: 16 },
    layers: [{ id: 'back', cells: [[0, null], [4, 7]] }, { id: 'front', opacity: 0.4, cells: [[null, 1], [null, null]] },
      { id: 'empty', cells: [[null, null], [null, null]] }] });
}

function texture(width = 64, height = 32): Texture {
  return new Texture({ width, height } as HTMLImageElement);
}

describe('render tile atlas theo layer', () => {
  it('bỏ ô null, batch mỗi layer, vị trí/UV đúng chiều, layer sau vẫn ở sau nhân vật', async () => {
    const renderer = new TilemapRenderer(map());
    const atlas = texture();
    const loader = vi.fn(async () => atlas);
    await Promise.all([renderer.load(loader), renderer.load(loader)]);
    expect(loader).toHaveBeenCalledExactlyOnceWith('tiles.svg');
    expect(renderer.visual.children.map((child) => child.name)).toEqual(['back', 'front']);
    const [back, front] = renderer.visual.children as Mesh<BufferGeometry, MeshBasicMaterial>[];
    const positions = back!.geometry.getAttribute('position');
    expect(positions.count).toBe(12);
    expect(back!.geometry.index?.count).toBe(18);
    expect(Array.from(positions.array).slice(0, 12)).toEqual([-2, 3, 0, -1.5, 3, 0, -2, 2, 0, -1.5, 2, 0]);
    expect(Array.from(positions.array).slice(-12)).toEqual([-1.5, 2, 0, -1, 2, 0, -1.5, 1, 0, -1, 1, 0]);
    const uv = back!.geometry.getAttribute('uv');
    expect(uv.getX(0)).toBeCloseTo(0.5 / 64);
    expect(uv.getY(0)).toBeCloseTo(1 - 0.5 / 32);
    expect(uv.getY(8)).toBeCloseTo(1 - 16.5 / 32);
    expect(uv.getX(11)).toBeCloseTo(63.5 / 64);
    expect(front!.geometry.getAttribute('position').count).toBe(4);
    expect(front!.position.z).toBeGreaterThan(back!.position.z);
    expect(front!.position.z).toBeLessThan(0);
    expect(front!.material.opacity).toBe(0.4);
    expect(back!.material.map).toBe(front!.material.map);
    expect(atlas.colorSpace).toBe(SRGBColorSpace);
    expect(atlas.magFilter).toBe(NearestFilter);
    expect(atlas.minFilter).toBe(NearestFilter);
    expect(atlas.generateMipmaps).toBe(false);
    renderer.dispose();
  });

  it('giải phóng geometry/material mỗi layer và atlas đúng một lần', async () => {
    const renderer = new TilemapRenderer(map());
    const atlas = texture();
    const released = vi.spyOn(atlas, 'dispose');
    await renderer.load(async () => atlas);
    const meshes = renderer.visual.children as Mesh<BufferGeometry, MeshBasicMaterial>[];
    const geometries = meshes.map((mesh) => vi.spyOn(mesh.geometry, 'dispose'));
    const materials = meshes.map((mesh) => vi.spyOn(mesh.material, 'dispose'));
    renderer.dispose();
    renderer.dispose();
    expect(released).toHaveBeenCalledTimes(1);
    for (const spy of [...geometries, ...materials]) expect(spy).toHaveBeenCalledTimes(1);
    expect(renderer.visual.children).toHaveLength(0);
  });

  it('từ chối ảnh thực khác metadata và giải phóng texture', async () => {
    const renderer = new TilemapRenderer(map());
    const atlas = texture(32, 32);
    const released = vi.spyOn(atlas, 'dispose');
    await expect(renderer.load(async () => atlas)).rejects.toThrow('tilemap.tileset: ảnh tiles.svg có kích thước 32×32, cần 64×32');
    expect(released).toHaveBeenCalledTimes(1);
    expect(renderer.visual.children).toHaveLength(0);
    renderer.dispose();
    expect(released).toHaveBeenCalledTimes(1);
  });

  it('báo lỗi đường dẫn khi tải thất bại, không thay bằng texture fallback', async () => {
    const renderer = new TilemapRenderer(map());
    await expect(renderer.load(async () => { throw new Error('404'); })).rejects.toThrow('tilemap.tileset.image: tiles.svg');
    expect(renderer.visual.children).toHaveLength(0);
    renderer.dispose();
  });

  it('dispose trong lúc tải: giải phóng ảnh đến muộn và không gắn mesh', async () => {
    const renderer = new TilemapRenderer(map());
    const atlas = texture();
    const released = vi.spyOn(atlas, 'dispose');
    let finish!: (value: Texture) => void;
    const pending = renderer.load(() => new Promise((resolve) => { finish = resolve; }));
    renderer.dispose();
    finish(atlas);
    await pending;
    expect(released).toHaveBeenCalledTimes(1);
    expect(renderer.visual.children).toHaveLength(0);
    const loader = vi.fn(async () => texture());
    await renderer.load(loader);
    expect(loader).not.toHaveBeenCalled();
  });

  it('không báo lỗi tải cũ vào trang mới sau dispose/HMR', async () => {
    const renderer = new TilemapRenderer(map());
    let reject!: (error: Error) => void;
    const pending = renderer.load(() => new Promise((_, fail) => { reject = fail; }));
    renderer.dispose();
    reject(new Error('network'));
    await expect(pending).resolves.toBeUndefined();
  });
});
