import { Group, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import type { BufferAttribute } from 'three';
import type { Facing, SpriteFrame } from '../animation/AnimationClip';
import type { LoadedSpriteSheet } from '../animation/SpriteSheetLoader';

export class SpriteRenderer {
  readonly visual = new Group();
  private readonly mesh: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private frame: SpriteFrame | null = null;
  private facing: Facing = 'right';
  private disposed = false;

  // Renderer nhận quyền sở hữu texture, không chia sẻ texture này với renderer khác.
  constructor(private readonly sheet: LoadedSpriteSheet) {
    this.mesh = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({
      map: sheet.texture, transparent: true, alphaTest: 0.01, depthWrite: false,
    }));
    this.visual.add(this.mesh);
  }

  setFrame(frame: SpriteFrame, facing: Facing): void {
    if (this.frame === frame && this.facing === facing) return;
    this.frame = frame;
    this.facing = facing;
    const { visual, imageWidth, imageHeight } = this.sheet;
    const unitX = visual.width * visual.scale.x / frame.sourceWidth;
    const unitY = visual.height * visual.scale.y / frame.sourceHeight;
    const pivotX = frame.pivot?.x ?? visual.anchor.x * frame.sourceWidth;
    const pivotY = frame.pivot?.y ?? (1 - visual.anchor.y) * frame.sourceHeight;
    const direction = facing === 'left' ? -1 : 1;
    this.mesh.position.set(
      visual.offset.x + direction * (frame.offsetX + frame.width / 2 - pivotX) * unitX,
      visual.offset.y + (pivotY - frame.offsetY - frame.height / 2) * unitY,
      0,
    );
    this.mesh.scale.set(frame.width * unitX, frame.height * unitY, 1);
    const left = (facing === 'left' ? frame.x + frame.width : frame.x) / imageWidth;
    const right = (facing === 'left' ? frame.x : frame.x + frame.width) / imageWidth;
    const top = 1 - frame.y / imageHeight;
    const bottom = 1 - (frame.y + frame.height) / imageHeight;
    const uv = this.mesh.geometry.getAttribute('uv') as BufferAttribute;
    uv.setXY(0, left, top);
    uv.setXY(1, right, top);
    uv.setXY(2, left, bottom);
    uv.setXY(3, right, bottom);
    uv.needsUpdate = true;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.visual.removeFromParent();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.sheet.texture.dispose();
    this.visual.clear();
  }
}
