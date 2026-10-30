import { BufferGeometry, Float32BufferAttribute, Group, LineBasicMaterial, LineLoop } from 'three';
import type { AABB, ClimbableZone } from '../physics/Collision';

export class CollisionDebug {
  readonly visual = new Group();
  private readonly geometry = new BufferGeometry();
  private readonly materials = {
    player: new LineBasicMaterial({ color: 0xffee77 }),
    solid: new LineBasicMaterial({ color: 0xffb77e }),
    climbable: new LineBasicMaterial({ color: 0x80d7ff }),
  };
  private readonly player: LineLoop;

  constructor(solids: readonly AABB[], climbables: readonly ClimbableZone[]) {
    this.geometry.setAttribute('position', new Float32BufferAttribute([
      -0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0,
    ], 3));
    this.player = new LineLoop(this.geometry, this.materials.player);
    this.visual.add(this.player);
    for (const [boxes, material] of [[solids, this.materials.solid], [climbables, this.materials.climbable]] as const) {
      for (const box of boxes) {
        const line = new LineLoop(this.geometry, material);
        line.position.set(box.position.x, box.position.y, 2);
        line.scale.set(box.width, box.height, 1);
        this.visual.add(line);
      }
    }
    this.visual.visible = false;
  }

  toggle(): void {
    this.visual.visible = !this.visual.visible;
  }

  update(x: number, y: number, width: number, height: number): void {
    if (!this.visual.visible) return;
    this.player.position.set(x, y, 2);
    this.player.scale.set(width, height, 1);
  }

  dispose(): void {
    this.visual.removeFromParent();
    this.visual.clear();
    this.geometry.dispose();
    for (const material of Object.values(this.materials)) material.dispose();
  }
}
