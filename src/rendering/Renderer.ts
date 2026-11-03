import { Color, Scene, WebGLRenderer } from 'three';
import type { Camera } from 'three';
import { gameConfig } from '../config/game.config';

export class Renderer {
  readonly scene = new Scene();
  private readonly renderer: WebGLRenderer;

  constructor(container: HTMLElement) {
    this.renderer = new WebGLRenderer({ antialias: true, alpha: false });
    this.scene.background = new Color(gameConfig.viewport.background);
    this.renderer.domElement.setAttribute('aria-label', 'Dùng A/D để đi, Space để nhảy, S để cúi, F để bám thang, W/S để leo, click trái để đánh combo, click phải để phóng phi tiêu hoả khi đứng hoặc cúi và E để thi triển Minh Vương Bạo Viêm (hồi chiêu 5 giây), Q để thi triển Cửu Long Hỏa Trận (hồi chiêu 12 giây)');
    this.renderer.domElement.setAttribute('role', 'img');
    container.prepend(this.renderer.domElement);
  }

  resize(width: number, height: number): void {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, gameConfig.viewport.maxPixelRatio));
    this.renderer.setSize(width, height, false);
  }

  render(camera: Camera): void {
    this.renderer.render(this.scene, camera);
  }

  dispose(): void {
    this.scene.clear();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
