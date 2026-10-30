import { gameConfig } from '../config/game.config';
import { overlaps } from '../physics/Collision';
import type { ClimbableZone, PhysicsBody } from '../physics/Collision';
import { PhysicsWorld, tryJump } from '../physics/PhysicsWorld';
import type { CollisionResult } from '../physics/PhysicsWorld';

export type LocomotionMode = 'grounded' | 'airborne' | 'climbing';
export type PlayerStance = 'standing' | 'crouching';

export interface MovementInput {
  readonly horizontal: number;
  readonly vertical: number;
  readonly crouch: boolean;
  readonly enterClimb: boolean;
  readonly jump: boolean;
  readonly detachJump: boolean;
}

export class PlayerMovementController {
  stance: PlayerStance = 'standing';
  activeClimbable: ClimbableZone | null = null;
  standingBlocked = false;

  constructor(private readonly body: PhysicsBody) {}

  get mode(): LocomotionMode {
    return this.activeClimbable ? 'climbing' : this.body.isGrounded ? 'grounded' : 'airborne';
  }

  move(direction: number): void {
    const speed = this.stance === 'crouching' ? gameConfig.player.crouchSpeed : gameConfig.player.runSpeed;
    this.body.velocity.x = Math.max(-1, Math.min(1, direction)) * speed;
  }

  jump(): boolean {
    if (this.stance === 'crouching' || this.activeClimbable) return false;
    return tryJump(this.body, gameConfig.player.jumpVelocity);
  }

  resetInput(): void {
    this.body.velocity.x = 0;
    if (this.activeClimbable) this.body.velocity.y = 0;
  }

  step(world: PhysicsWorld, delta: number, input: MovementInput): CollisionResult {
    if (this.activeClimbable && !overlaps(this.body, this.activeClimbable)) this.detach();
    if (!this.activeClimbable) {
      this.updateStance(world, input.crouch);
      if (input.enterClimb) this.enterClimb(world);
    }

    if (this.activeClimbable) {
      if (input.detachJump && world.canOccupy(this.body)) {
        this.detach();
        this.body.velocity.y = gameConfig.player.jumpVelocity;
      } else if (input.horizontal !== 0 && this.canExitHorizontally(world, input.horizontal, delta)) {
        this.detach();
        this.body.velocity.y = 0;
      } else {
        return this.climb(world, delta, input.vertical);
      }
      // Chỉ Space được nhảy rời thang; không xử lý lại cạnh W/Up của bước này.
      this.move(input.horizontal);
      return world.step(this.body, delta);
    }

    this.move(input.horizontal);
    if (input.jump) this.jump();
    const result = world.step(this.body, delta);
    this.updateStance(world, input.crouch);
    return result;
  }

  private updateStance(world: PhysicsWorld, crouchHeld: boolean): void {
    const { width, height, crouchWidth, crouchHeight } = gameConfig.player;
    if (crouchHeld && this.body.isGrounded) {
      if (this.stance === 'standing' && world.tryResize(this.body, crouchWidth, crouchHeight)) this.stance = 'crouching';
    } else if (this.stance === 'crouching' && world.tryResize(this.body, width, height)) {
      this.stance = 'standing';
    }
    const standingPosition = { x: this.body.position.x, y: this.body.position.y - this.body.height / 2 + height / 2 };
    this.standingBlocked = this.stance === 'crouching' && !world.canOccupy(this.body, standingPosition, width, height);
  }

  private enterClimb(world: PhysicsWorld): void {
    const zone = world.findClimbable(this.body);
    const { width, height } = gameConfig.player;
    if (!zone || zone.height < height) return;
    const probe: PhysicsBody = {
      position: { x: this.body.position.x, y: this.body.position.y - this.body.height / 2 + height / 2 },
      velocity: { x: 0, y: 0 }, width, height, isGrounded: false,
    };
    const bottom = zone.position.y - zone.height / 2 + height / 2;
    const top = zone.position.y + zone.height / 2 - height / 2;
    if (probe.position.y < bottom - 1e-9 || probe.position.y > top + 1e-9 || !world.canOccupy(probe)) return;
    // Quét đường căn ngang thay vì chỉ kiểm tra điểm đến, tránh xuyên tường mỏng.
    world.moveHorizontal(probe, zone.position.x - probe.position.x);
    if (Math.abs(probe.position.x - zone.position.x) > 1e-9 || !world.canOccupy(probe)) return;
    this.body.position.x = probe.position.x;
    this.body.position.y = probe.position.y;
    this.body.width = width;
    this.body.height = height;
    this.stance = 'standing';
    this.standingBlocked = false;
    this.activeClimbable = zone;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.body.isGrounded = false;
  }

  private canExitHorizontally(world: PhysicsWorld, horizontal: number, delta: number): boolean {
    const probe: PhysicsBody = {
      ...this.body, position: { ...this.body.position }, velocity: { ...this.body.velocity },
    };
    world.moveHorizontal(probe, Math.sign(horizontal) * gameConfig.player.runSpeed * delta);
    return Math.abs(probe.position.x - this.body.position.x) > 1e-9 && world.canOccupy(probe);
  }

  private climb(world: PhysicsWorld, delta: number, vertical: number): CollisionResult {
    const zone = this.activeClimbable!;
    const minY = zone.position.y - zone.height / 2 + this.body.height / 2;
    const maxY = zone.position.y + zone.height / 2 - this.body.height / 2;
    const nextY = this.body.position.y + Math.max(-1, Math.min(1, vertical)) * gameConfig.player.climbSpeed * delta;
    this.body.velocity.x = 0;
    this.body.velocity.y = delta > 0 ? (Math.max(minY, Math.min(maxY, nextY)) - this.body.position.y) / delta : 0;
    world.step(this.body, delta, false);
    // Tiếp xúc nền dưới thang không biến trạng thái bám thang thành grounded.
    this.body.isGrounded = false;
    return { landed: false };
  }

  private detach(): void {
    this.activeClimbable = null;
    this.body.isGrounded = false;
  }
}
