import { Group, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import type { AABB, ClimbableZone, Vector2 } from '../physics/Collision';
import { TilemapRenderer } from '../rendering/TilemapRenderer';
import { EnvironmentRenderer } from '../rendering/EnvironmentRenderer';
import type { OrthographicCamera } from 'three';
import { parseLevelData } from './LevelData';
import type { CameraBounds } from './LevelData';
import playground from './levels/playground.json';

export class TestLevel {
  readonly visual = new Group();
  readonly id: string;
  readonly spawn: Readonly<Vector2>;
  readonly colliders: readonly AABB[];
  readonly climbables: readonly ClimbableZone[];
  readonly cameraBounds?: CameraBounds;
  readonly cameraFollowY?: boolean;
  readonly deathY?: number;
  private readonly meshes: Mesh<PlaneGeometry, MeshBasicMaterial>[] = [];
  private readonly tilemap: TilemapRenderer | null;
  private readonly environment: EnvironmentRenderer | null;

  constructor(value: unknown = playground) {
    const data = parseLevelData(value);
    this.id = data.id;
    this.spawn = data.spawn;
    this.colliders = data.solids;
    this.climbables = data.climbables;
    this.cameraBounds = data.cameraBounds;
    this.cameraFollowY = data.cameraFollowY;
    this.deathY = data.deathY;
    const shapes = new Map([...data.solids, ...data.climbables].map((shape) => [shape.id, shape]));
    for (const visual of data.visuals) {
      const shape = shapes.get(visual.shapeId)!;
      this.addPlatform(shape, visual.color, visual.opacity);
      if (visual.kind === 'ladder') this.addLadder(shape, visual.color, visual.rungSpacing, visual.structureOpacity, visual.railHighlight);
    }
    this.tilemap = data.tilemap ? new TilemapRenderer(data.tilemap) : null;
    if (this.tilemap) this.visual.add(this.tilemap.visual);
    this.environment = data.environment ? new EnvironmentRenderer(data.environment) : null;
    if (this.environment) this.visual.add(this.environment.visual);
  }

  async loadVisuals(): Promise<void> {
    await this.tilemap?.load();
    await this.environment?.load();
  }

  updateVisuals(camera: OrthographicCamera): void {
    this.environment?.update(camera);
  }

  private addLadder(ladder: AABB, color: number, rungSpacing: number, opacity: number, railHighlight?: number): void {
    for (const direction of [-1, 1]) {
      this.addPlatform({ position: { x: ladder.position.x + direction * ladder.width * 0.4, y: ladder.position.y },
        width: 0.08, height: ladder.height }, color, opacity);
      if (railHighlight !== undefined) {
        this.addPlatform({ position: { x: ladder.position.x + direction * ladder.width * 0.4 - 0.02, y: ladder.position.y },
          width: 0.02, height: ladder.height }, railHighlight, opacity, 0.02);
        for (let y = ladder.position.y - ladder.height / 2 + 0.3; y < ladder.position.y + ladder.height / 2; y += 1.2) {
          this.addPlatform({ position: { x: ladder.position.x + direction * ladder.width * 0.4, y },
            width: 0.18, height: 0.1 }, railHighlight, opacity, 0.01);
        }
      }
    }
    const count = Math.ceil(Math.max(0, ladder.height - 0.2) / rungSpacing);
    for (let index = 0; index < count; index += 1) {
      const y = ladder.position.y - ladder.height / 2 + 0.2 + index * rungSpacing;
      this.addPlatform({ position: { x: ladder.position.x, y }, width: ladder.width * 0.8, height: 0.06 }, color, opacity);
    }
  }

  private addPlatform(collider: AABB, color: number, opacity = 1, z = 0): void {
    const mesh = new Mesh(
      new PlaneGeometry(collider.width, collider.height),
      new MeshBasicMaterial({ color, transparent: opacity < 1, opacity, depthWrite: opacity === 1 }),
    );
    mesh.position.set(collider.position.x, collider.position.y, z);
    this.meshes.push(mesh);
    this.visual.add(mesh);
  }

  dispose(): void {
    this.visual.removeFromParent();
    this.tilemap?.dispose();
    this.environment?.dispose();
    for (const mesh of this.meshes) {
      mesh.geometry.dispose();
      mesh.material.dispose();
    }
    this.visual.clear();
  }
}
