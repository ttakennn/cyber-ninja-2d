import { BufferGeometry, Float32BufferAttribute, Group, Mesh, MeshBasicMaterial, NearestFilter, SRGBColorSpace, TextureLoader } from 'three';
import type { Texture } from 'three';
import { tilePosition } from '../world/TilemapData';
import type { TilemapData } from '../world/TilemapData';

export class TilemapRenderer {
  readonly visual = new Group();
  private readonly meshes: Mesh<BufferGeometry, MeshBasicMaterial>[] = [];
  private texture: Texture | null = null;
  private loading: Promise<void> | null = null;
  private disposed = false;

  constructor(private readonly data: TilemapData) {}

  load(loadTexture: (url: string) => Promise<Texture> = (url) => new TextureLoader().loadAsync(url)): Promise<void> {
    if (this.disposed) return Promise.resolve();
    return this.loading ??= this.loadAtlas(loadTexture);
  }

  private async loadAtlas(loadTexture: (url: string) => Promise<Texture>): Promise<void> {
    const { tileset } = this.data;
    let texture: Texture;
    try {
      texture = await loadTexture(tileset.image);
    } catch {
      if (this.disposed) return;
      throw new Error(`Không tải được tilemap.tileset.image: ${tileset.image}`);
    }
    if (this.disposed) { texture.dispose(); return; }
    try {
      const image = texture.image as { width?: number; height?: number } | undefined;
      if (image?.width !== tileset.imageWidth || image?.height !== tileset.imageHeight) {
        throw new Error(`tilemap.tileset: ảnh ${tileset.image} có kích thước ${image?.width}×${image?.height}, cần ${tileset.imageWidth}×${tileset.imageHeight}`);
      }
      texture.colorSpace = SRGBColorSpace;
      texture.magFilter = NearestFilter;
      texture.minFilter = NearestFilter;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
      this.texture = texture;
      this.buildLayers(texture);
    } catch (error) {
      if (this.texture) this.dispose();
      else texture.dispose();
      throw error;
    }
  }

  private buildLayers(texture: Texture): void {
    const { tileset, tileSize } = this.data;
    const atlasColumns = tileset.imageWidth / tileset.tileWidth;
    for (const [layerIndex, layer] of this.data.layers.entries()) {
      const positions: number[] = [];
      const uvs: number[] = [];
      const indices: number[] = [];
      for (const [row, cells] of layer.cells.entries()) {
        for (const [column, tile] of cells.entries()) {
          if (tile === null) continue;
          const center = tilePosition(this.data, column, row);
          const left = center.x - tileSize.width / 2;
          const right = center.x + tileSize.width / 2;
          const top = center.y + tileSize.height / 2;
          const bottom = center.y - tileSize.height / 2;
          const x = tile % atlasColumns * tileset.tileWidth;
          const y = Math.floor(tile / atlasColumns) * tileset.tileHeight;
          // Inset nửa texel tránh lấy pixel của ô atlas kế cận; texture dùng nearest, không mipmap.
          const u0 = (x + 0.5) / tileset.imageWidth;
          const u1 = (x + tileset.tileWidth - 0.5) / tileset.imageWidth;
          const v0 = 1 - (y + 0.5) / tileset.imageHeight;
          const v1 = 1 - (y + tileset.tileHeight - 0.5) / tileset.imageHeight;
          const offset = positions.length / 3;
          positions.push(left, top, 0, right, top, 0, left, bottom, 0, right, bottom, 0);
          uvs.push(u0, v0, u1, v0, u0, v1, u1, v1);
          indices.push(offset, offset + 2, offset + 1, offset + 1, offset + 2, offset + 3);
        }
      }
      if (!indices.length) continue;
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
      geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
      geometry.setIndex(indices);
      const mesh = new Mesh(geometry, new MeshBasicMaterial({ map: texture, transparent: true,
        opacity: layer.opacity, alphaTest: 0.01, depthWrite: false }));
      mesh.name = layer.id;
      // Layer sau gần camera hơn, vẫn ở sau hình chữ nhật cũ (Z=0) và nhân vật (Z=1).
      mesh.position.z = -0.5 + layerIndex * 0.01;
      this.meshes.push(mesh);
      this.visual.add(mesh);
    }
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.visual.removeFromParent();
    for (const mesh of this.meshes) { mesh.geometry.dispose(); mesh.material.dispose(); }
    this.texture?.dispose();
    this.texture = null;
    this.visual.clear();
  }
}
