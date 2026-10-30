import type { Player } from '../entities/Player';
import type { InputManager } from '../input/InputManager';
import type { Vector2 } from '../physics/Collision';
import type { GameCamera } from '../rendering/GameCamera';

// Tách khỏi DOM/WebGL để kiểm tra cùng luồng hồi sinh mà Game sử dụng.
export class FallRecovery {
  private respawns = 0;

  constructor(private readonly spawn: Readonly<Vector2>, readonly deathY?: number) {}

  get count(): number { return this.respawns; }

  update(player: Player, input: Pick<InputManager, 'reset'>, camera: GameCamera): boolean {
    if (this.deathY === undefined || player.body.position.y >= this.deathY) return false;
    player.respawn(this.spawn);
    input.reset();
    camera.reset(player.visual.position);
    this.respawns += 1;
    return true;
  }
}
