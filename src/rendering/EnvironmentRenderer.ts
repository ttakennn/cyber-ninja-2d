import { Group, LinearFilter, Mesh, MeshBasicMaterial, PlaneGeometry, RepeatWrapping, SRGBColorSpace, TextureLoader } from 'three';
import type { OrthographicCamera, Texture } from 'three';
import type { EnvironmentBackground, EnvironmentData, EnvironmentDecoration } from '../world/EnvironmentData';

interface BackgroundMesh {
  readonly definition: EnvironmentBackground;
  readonly mesh: Mesh<PlaneGeometry, MeshBasicMaterial>;
  readonly texture: Texture;
}

export class EnvironmentRenderer {
  readonly visual = new Group();
  private readonly geometry = new PlaneGeometry(1, 1);
  private readonly textures = new Set<Texture>();
  private readonly materials: MeshBasicMaterial[] = [];
  private readonly backgrounds: BackgroundMesh[] = [];
  private readonly parallaxDecorations: { definition: EnvironmentDecoration; mesh: Mesh<PlaneGeometry, MeshBasicMaterial> }[] = [];
  private readonly ledBorders: { materials: MeshBasicMaterial[]; period: number }[] = [];
  private elapsed = 0;
  private loading: Promise<void> | null = null;
  private disposed = false;

  constructor(private readonly data: EnvironmentData) {}

  load(loadTexture: (url: string) => Promise<Texture> = (url) => new TextureLoader().loadAsync(url)): Promise<void> {
    if (this.disposed) return Promise.resolve();
    return this.loading ??= this.loadImages(loadTexture);
  }

  private async loadImages(loadTexture: (url: string) => Promise<Texture>): Promise<void> {
    const images = new Map([...this.data.backgrounds, ...this.data.decorations].map((entry) => [entry.image, entry]));
    const loaded = new Map<string, Texture>();
    try {
      // Chờ tất cả request kể cả khi một ảnh lỗi để ảnh đến muộn cũng được thu hồi.
      const results = await Promise.allSettled([...images].map(async ([url, definition]) => {
        let texture: Texture;
        try { texture = await loadTexture(url); }
        catch { throw new Error(`Không tải được environment image: ${url}`); }
        if (this.disposed) { texture.dispose(); return; }
        this.textures.add(texture);
        const image = texture.image as { width?: number; height?: number } | undefined;
        if (image?.width !== definition.pixelSize[0] || image?.height !== definition.pixelSize[1]) {
          throw new Error(`environment image ${url}: kích thước ${image?.width}×${image?.height}, cần ${definition.pixelSize.join('×')}`);
        }
        texture.colorSpace = SRGBColorSpace;
        texture.magFilter = LinearFilter;
        texture.minFilter = LinearFilter;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;
        loaded.set(url, texture);
      }));
      if (this.disposed) return;
      const failed = results.find((result) => result.status === 'rejected');
      if (failed?.status === 'rejected') throw failed.reason;
      for (const definition of this.data.backgrounds) {
        // UV repeat/offset riêng mỗi background, không làm đổi texture dùng chung của prop.
        const texture = loaded.get(definition.image)!.clone();
        texture.wrapS = definition.repeatX ? RepeatWrapping : texture.wrapS;
        texture.needsUpdate = true;
        this.textures.add(texture);
        const mesh = this.addMesh(definition.id, texture, definition.z);
        this.backgrounds.push({ definition, mesh, texture });
      }
      for (const definition of this.data.decorations) {
        let texture = loaded.get(definition.image)!;
        if (definition.sourceRect) {
          const rect = definition.sourceRect;
          texture = texture.clone();
          texture.repeat.set(rect.width / definition.pixelSize[0], rect.height / definition.pixelSize[1]);
          texture.offset.set(rect.x / definition.pixelSize[0], 1 - (rect.y + rect.height) / definition.pixelSize[1]);
          texture.needsUpdate = true;
          this.textures.add(texture);
        }
        const mesh = this.addMesh(definition.id, texture, definition.z);
        mesh.renderOrder = definition.layer === 'foreground' ? 1 : 0;
        mesh.position.set(definition.worldPosition.x, definition.worldPosition.y + definition.worldSize.height / 2, definition.z);
        mesh.scale.set(definition.worldSize.width, definition.worldSize.height, 1);
        if (definition.parallaxX !== undefined) this.parallaxDecorations.push({ definition, mesh });
        if (definition.ledBorder) {
          const materials = definition.ledBorder.colors.map((color) => new MeshBasicMaterial({ color, transparent: true, depthWrite: false }));
          this.materials.push(...materials);
          this.ledBorders.push({ materials, period: definition.ledBorder.period });
          const led = (x: number, y: number, index: number): void => {
            const bulb = new Mesh(this.geometry, materials[index % 2]!);
            bulb.position.set(x, y, 0.01);
            bulb.scale.set(0.008, 0.028, 1);
            mesh.add(bulb);
          };
          for (let index = 0; index < 12; index += 1) {
            led(-0.46 + index * 0.92 / 11, 0.43, index);
            led(-0.46 + index * 0.92 / 11, -0.43, index + 1);
          }
          for (let index = 0; index < 4; index += 1) {
            led(-0.48, -0.28 + index * 0.56 / 3, index);
            led(0.48, -0.28 + index * 0.56 / 3, index + 1);
          }
        }
      }
    } catch (error) {
      this.dispose();
      throw error;
    }
  }

  private addMesh(id: string, texture: Texture, z: number): Mesh<PlaneGeometry, MeshBasicMaterial> {
    const material = new MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.01, depthWrite: false });
    const mesh = new Mesh(this.geometry, material);
    mesh.name = id;
    mesh.position.z = z;
    this.materials.push(material);
    this.visual.add(mesh);
    return mesh;
  }

  update(camera: OrthographicCamera, delta = 0): void {
    if (this.disposed) return;
    this.elapsed += Math.max(0, delta);
    for (const { materials, period } of this.ledBorders) {
      const active = Math.floor(this.elapsed / period * 2) % 2;
      for (const [index, material] of materials.entries()) material.opacity = index === active ? 1 : 0.15;
    }
    for (const { definition, mesh } of this.parallaxDecorations) {
      mesh.position.x = definition.worldPosition.x + camera.position.x * (1 - definition.parallaxX!);
    }
    const width = (camera.right - camera.left) / camera.zoom;
    const height = (camera.top - camera.bottom) / camera.zoom;
    for (const { definition, mesh, texture } of this.backgrounds) {
      const aspect = definition.pixelSize[0] / definition.pixelSize[1];
      mesh.position.x = camera.position.x;
      if (!definition.repeatX) {
        const coverHeight = Math.max(height, width / aspect);
        mesh.scale.set(coverHeight * aspect, coverHeight, 1);
        mesh.position.y = camera.position.y;
      } else {
        const worldWidth = definition.worldHeight * aspect;
        const phase = (camera.position.x * definition.parallaxX - width / 2) / worldWidth;
        texture.repeat.set(width / worldWidth, 1);
        texture.offset.x = ((phase % 1) + 1) % 1;
        mesh.scale.set(width, definition.worldHeight, 1);
        mesh.position.y = definition.verticalAnchor === 'world'
          ? definition.worldBottom! + definition.worldHeight / 2
          : camera.position.y * (1 - definition.parallaxY) - height / 2 + definition.bottomOffset + definition.worldHeight / 2;
      }
    }
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.visual.removeFromParent();
    this.geometry.dispose();
    for (const material of this.materials) material.dispose();
    for (const texture of this.textures) texture.dispose();
    this.textures.clear();
    this.backgrounds.length = 0;
    this.parallaxDecorations.length = 0;
    this.ledBorders.length = 0;
    this.visual.clear();
  }
}
