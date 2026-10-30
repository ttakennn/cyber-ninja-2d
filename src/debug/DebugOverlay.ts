import { gameConfig } from '../config/game.config';
import type { Player } from '../entities/Player';
import type { GameCamera } from '../rendering/GameCamera';

export class DebugOverlay {
  private readonly element = document.createElement('pre');
  private elapsed = 0;
  private frames = 0;
  private fps = 0;

  constructor(container: HTMLElement, private readonly levelId = 'playground') {
    this.element.className = 'debug-overlay';
    this.element.setAttribute('aria-label', 'Engine diagnostics');
    this.element.hidden = true;
    container.append(this.element);
  }

  toggle(): void {
    this.element.hidden = !this.element.hidden;
  }

  update(frameDelta: number, player: Player, alpha: number, camera: GameCamera, respawnCount: number, deathY?: number): void {
    if (frameDelta > 0) {
      this.elapsed += frameDelta;
      this.frames += 1;
    }
    if (this.elapsed >= 0.25) {
      this.fps = this.frames / this.elapsed;
      this.elapsed = 0;
      this.frames = 0;
    }
    if (this.element.hidden) return;
    const { body, state, animator, spriteStatus } = player;
    this.element.textContent = [
      'ENGINE DIAGNOSTICS  /  F3',
      `Level        ${this.levelId}`,
      `Render FPS   ${this.fps.toFixed(0)}`,
      `Fixed step   ${(gameConfig.simulation.fixedDelta * 1000).toFixed(3)} ms (60 Hz)`,
      `Position     X ${body.position.x.toFixed(3)}  Y ${body.position.y.toFixed(3)}`,
      `Camera       X ${camera.camera.position.x.toFixed(3)}  Y ${camera.camera.position.y.toFixed(3)}`,
      `Bounds       ${camera.bounds ? `${camera.bounds.minX}..${camera.bounds.maxX} / ${camera.bounds.minY}..${camera.bounds.maxY}` : '—'}`,
      `Respawns     ${respawnCount}`,
      `Fall         ${deathY === undefined ? 'tắt' : `Y < ${deathY} (${body.position.y < deathY ? 'vượt biên' : 'an toàn'})`}`,
      `Velocity     X ${body.velocity.x.toFixed(3)}  Y ${body.velocity.y.toFixed(3)}`,
      `Grounded     ${body.isGrounded}`,
      `Di chuyển    ${player.movement.mode}`,
      `Tư thế       ${player.movement.stance}`,
      `Vùng leo     ${player.movement.activeClimbable?.id ?? '—'}`,
      `Collider     ${body.width.toFixed(2)} × ${body.height.toFixed(2)}`,
      `Chặn đứng    ${player.movement.standingBlocked}`,
      `State        ${state}`,
      `Animation    ${animator.controller.name}`,
      `Frame        ${animator.controller.frameIndex + 1}`,
      `Hướng        ${animator.facing}`,
      `Hướng vẽ     ${animator.renderFacing}`,
      `Chiều leo    ${animator.climbDirection}`,
      `Sprite       ${spriteStatus}`,
      ...(player.spriteError ? [`Lỗi asset    ${player.spriteError}`] : []),
      `Alpha        ${alpha.toFixed(3)}`,
    ].join('\n');
  }

  dispose(): void {
    this.element.remove();
  }
}
