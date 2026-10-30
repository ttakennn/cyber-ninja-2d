import { OrthographicCamera } from 'three';
import { gameConfig } from '../config/game.config';
import type { Vector2 } from '../physics/Collision';
import type { CameraBounds } from '../world/LevelData';

export class GameCamera {
  readonly camera: OrthographicCamera;

  constructor(readonly bounds?: CameraBounds, private readonly followY = false) {
    const halfWidth = gameConfig.viewport.referenceWidth / 2;
    const halfHeight = gameConfig.viewport.height / 2;
    this.camera = new OrthographicCamera(-halfWidth, halfWidth, halfHeight, -halfHeight, 0.1, 100);
    this.camera.position.set(0, 0, 10);
    this.clampPosition();
  }

  resize(width: number, height: number): void {
    const halfHeight = gameConfig.viewport.height / 2;
    const halfWidth = halfHeight * width / Math.max(1, height);
    this.camera.left = -halfWidth;
    this.camera.right = halfWidth;
    this.camera.top = halfHeight;
    this.camera.bottom = -halfHeight;
    this.camera.updateProjectionMatrix();
    this.clampPosition();
  }

  followX(x: number): void {
    this.camera.position.x = x;
    this.clampPosition();
  }

  follow(position: Readonly<Vector2>): void {
    this.camera.position.x = position.x;
    if (this.followY) this.camera.position.y = position.y;
    this.clampPosition();
  }

  reset(position: Readonly<Vector2>): void {
    this.camera.position.set(position.x, this.followY ? position.y : 0, 10);
    this.clampPosition();
  }

  private clampPosition(): void {
    if (!this.bounds) return;
    const { minX, maxX, minY, maxY } = this.bounds;
    const halfWidth = (this.camera.right - this.camera.left) / 2;
    const halfHeight = (this.camera.top - this.camera.bottom) / 2;
    this.camera.position.x = maxX - minX <= halfWidth * 2 ? (minX + maxX) / 2
      : Math.max(minX + halfWidth, Math.min(maxX - halfWidth, this.camera.position.x));
    this.camera.position.y = maxY - minY <= halfHeight * 2 ? (minY + maxY) / 2
      : Math.max(minY + halfHeight, Math.min(maxY - halfHeight, this.camera.position.y));
  }
}
