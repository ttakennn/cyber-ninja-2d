import { Group, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import type { AABB, ClimbableZone, Vector2 } from '../physics/Collision';
import { TilemapRenderer } from '../rendering/TilemapRenderer';
import { parseLevelData } from './LevelData';
import playground from './levels/playground.json';

export class TestLevel {
  readonly visual = new Group();
  readonly id: string;
  readonly spawn: Readonly<Vector2>;
  readonly colliders: readonly AABB[];
  readonly climbables: readonly ClimbableZone[];
  private readonly meshes: Mesh<PlaneGeometry, MeshBasicMaterial>[] = [];
  private readonly tilemap: TilemapRenderer | null;

  constructor(value: unknown = playground) {
    const data = parseLevelData(value);
    this.id = data.id;
    this.spawn = data.spawn;
    this.colliders = data.solids;
    this.climbables = data.climbables;
    const shapes = new Map([...data.solids, ...data.climbables].map((shape) => [shape.id, shape]));
    for (const visual of data.visuals) {
      const shape = shapes.get(visual.shapeId)!;
      this.addPlatform(shape, visual.color, visual.opacity);
      if (visual.kind === 'ladder') this.addLadder(shape, visual.color, visual.rungSpacing, visual.structureOpacity);
    }
    this.tilemap = data.tilemap ? new TilemapRenderer(data.tilemap) : null;
    if (this.tilemap) this.visual.add(this.tilemap.visual);
  }

  async loadVisuals(): Promise<void> {
    await this.tilemap?.load();
  }

  private addLadder(ladder: AABB, color: number, rungSpacing: number, opacity: number): void {
    for (const direction of [-1, 1]) {
      this.addPlatform({ position: { x: ladder.position.x + direction * ladder.width * 0.4, y: ladder.position.y },
        width: 0.08, height: ladder.height }, color, opacity);
    }
    const count = Math.ceil(Math.max(0, ladder.height - 0.2) / rungSpacing);
    for (let index = 0; index < count; index += 1) {
      const y = ladder.position.y - ladder.height / 2 + 0.2 + index * rungSpacing;
      this.addPlatform({ position: { x: ladder.position.x, y }, width: ladder.width * 0.8, height: 0.06 }, color, opacity);
    }
  }

  private addPlatform(collider: AABB, color: number, opacity = 1): void {
    const mesh = new Mesh(
      new PlaneGeometry(collider.width, collider.height),
      new MeshBasicMaterial({ color, transparent: opacity < 1, opacity, depthWrite: opacity === 1 }),
    );
    mesh.position.set(collider.position.x, collider.position.y, 0);
    this.meshes.push(mesh);
    this.visual.add(mesh);
  }

  dispose(): void {
    this.visual.removeFromParent();
    this.tilemap?.dispose();
    for (const mesh of this.meshes) {
      mesh.geometry.dispose();
      mesh.material.dispose();
    }
    this.visual.clear();
  }
}
