import { AnimationController } from '../animation/AnimationController';
import type { AnimationClips, Facing, SpriteFrame } from '../animation/AnimationClip';
import { gameConfig } from '../config/game.config';
import type { PhysicsBody } from '../physics/Collision';
import type { LocomotionMode, PlayerStance } from './PlayerMovementController';

export type PlayerAnimation = 'idle' | 'run' | 'jump' | 'fall' | 'land' | 'crouch' | 'climb' | 'climbUp' | 'climbDown';
const names = ['idle', 'run', 'jump', 'fall', 'land'] as const;
const climbNames: readonly string[] = ['climb', 'climbUp', 'climbDown'];
const fallbackFrame: SpriteFrame = {
  x: 0, y: 0, width: 1, height: 1, sourceWidth: 1, sourceHeight: 1, offsetX: 0, offsetY: 0,
};
const fallbackClips: AnimationClips = Object.fromEntries(names.map((name) => [name, {
  name, frames: [fallbackFrame], fps: 5, loop: name !== 'land',
}]));

export class PlayerAnimator {
  controller: AnimationController;
  facing: Facing = 'right';
  climbDirection: 'up' | 'down' | 'idle' = 'idle';
  private climbing = false;

  // Pose leo nhìn từ sau luôn cùng hướng, không đổi facing của các pose bên hông.
  get renderFacing(): Facing { return this.climbing ? 'right' : this.facing; }

  constructor(clips: AnimationClips = fallbackClips) {
    this.controller = this.createController(clips, 'fall');
  }

  setClips(clips: AnimationClips): void {
    const current = this.controller.name;
    const initial = Object.hasOwn(clips, current) ? current : current === 'crouch' ? 'idle'
      : climbNames.includes(current) && Object.hasOwn(clips, 'climb') ? 'climb' : 'fall';
    this.controller = this.createController(clips, initial);
  }

  update(delta: number, body: Readonly<PhysicsBody>, landed: boolean,
    movement?: Readonly<{ mode: LocomotionMode; stance: PlayerStance }>): string | null {
    if (body.velocity.x < 0) this.facing = 'left';
    else if (body.velocity.x > 0) this.facing = 'right';

    const climbing = movement?.mode === 'climbing';
    this.climbing = climbing;
    const velocity = climbing ? body.velocity.y : 0;
    const moving = Math.abs(velocity) > gameConfig.player.climbAnimationVelocityEpsilon;
    this.climbDirection = moving ? velocity > 0 ? 'up' : 'down' : 'idle';
    this.controller.setPlaybackSpeed(1);
    if (climbing) {
      const directional = velocity < 0 ? 'climbDown' : 'climbUp';
      const current = this.controller.name;
      const clip = !moving && climbNames.includes(current) ? current
        : this.controller.hasClip(directional) ? directional
        : this.controller.hasClip('climb') ? 'climb'
        : !moving && this.controller.hasClip('climbDown') ? 'climbDown' : 'fall';
      // Hai bộ pose leo dùng cùng pha chu kỳ, tránh kéo về frame đầu mỗi lần đổi chiều.
      const preservePhase = (current === 'climbUp' || current === 'climbDown') &&
        (clip === 'climbUp' || clip === 'climbDown');
      this.controller.play(clip, false, preservePhase);
      // Một chu kỳ pose riêng tương ứng hai bậc thang 0.4 unit; bước cuối bị chặn chỉ tiến phần đã đi.
      const speed = clip === 'climbUp' || clip === 'climbDown'
        ? Math.abs(velocity) * this.controller.duration / gameConfig.player.climbAnimationDistancePerCycle
        : Math.abs(velocity) / gameConfig.player.climbSpeed;
      this.controller.setPlaybackSpeed(moving ? speed : 0);
    } else if (movement?.stance === 'crouching' && body.isGrounded) {
      this.controller.play(this.controller.hasClip('crouch') ? 'crouch' : 'idle');
    } else if (!body.isGrounded) {
      this.controller.play(body.velocity.y > 0 ? 'jump' : 'fall');
    } else if (landed) {
      // Sự kiện vật lý được tiêu thụ ngay mỗi bước, không chờ đến render.
      this.controller.play('land', true);
    } else if (this.controller.name !== 'land' || this.controller.isComplete) {
      this.controller.play(body.velocity.x === 0 ? 'idle' : 'run');
    }
    return this.controller.update(delta);
  }

  private createController(clips: AnimationClips, initial: string): AnimationController {
    for (const name of names) {
      if (!Object.hasOwn(clips, name) || clips[name]?.name !== name) {
        throw new Error(`Thiếu animation nhân vật: ${name}`);
      }
    }
    if (clips.land!.loop) throw new Error('Animation land phải phát một lần');
    return new AnimationController(clips, initial);
  }
}
