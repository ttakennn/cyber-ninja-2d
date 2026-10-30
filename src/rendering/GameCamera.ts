import { OrthographicCamera } from 'three';
import { gameConfig } from '../config/game.config';

export class GameCamera {
  readonly camera: OrthographicCamera;

  constructor() {
    const halfWidth = gameConfig.viewport.referenceWidth / 2;
    const halfHeight = gameConfig.viewport.height / 2;
    this.camera = new OrthographicCamera(-halfWidth, halfWidth, halfHeight, -halfHeight, 0.1, 100);
    this.camera.position.set(0, 0, 10);
  }

  resize(width: number, height: number): void {
    const halfHeight = gameConfig.viewport.height / 2;
    const halfWidth = halfHeight * width / Math.max(1, height);
    this.camera.left = -halfWidth;
    this.camera.right = halfWidth;
    this.camera.top = halfHeight;
    this.camera.bottom = -halfHeight;
    this.camera.updateProjectionMatrix();
  }

  followX(x: number): void {
    this.camera.position.x = x;
  }
}
