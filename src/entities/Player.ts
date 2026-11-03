import { Group, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import { SpriteSheetLoader } from '../animation/SpriteSheetLoader';
import type { LoadedSpriteSheet } from '../animation/SpriteSheetLoader';
import { gameConfig } from '../config/game.config';
import type { PhysicsBody, Vector2 } from '../physics/Collision';
import type { PhysicsWorld } from '../physics/PhysicsWorld';
import { SpriteRenderer } from '../rendering/SpriteRenderer';
import { PlayerAnimator } from './PlayerAnimator';
import { PlayerAttack } from './PlayerAttack';
import { PlayerShuriken } from './PlayerShuriken';
import { PlayerSpecialSkill01 } from './PlayerSpecialSkill01';
import { PlayerNineDragons } from './PlayerNineDragons';
import { PlayerSkillGlow } from '../rendering/PlayerSkillGlow';
import { PlayerMovementController } from './PlayerMovementController';
import type { MovementInput } from './PlayerMovementController';

export type MovementState = 'idle' | 'moveLeft' | 'moveRight' | 'jump' | 'fall' | 'land' | 'crouch' | 'climb';

export class Player {
  readonly body: PhysicsBody = {
    position: { ...gameConfig.player.spawn },
    velocity: { x: 0, y: 0 },
    width: gameConfig.player.width,
    height: gameConfig.player.height,
    isGrounded: false,
  };
  readonly visual = new Group();
  readonly animator = new PlayerAnimator();
  readonly attack = new PlayerAttack();
  readonly shuriken = new PlayerShuriken();
  readonly specialSkill1 = new PlayerSpecialSkill01();
  readonly nineDragons = new PlayerNineDragons();
  private readonly skillGlow = new PlayerSkillGlow(this.visual);
  readonly movement = new PlayerMovementController(this.body);
  private readonly placeholder: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private readonly previousPosition = { ...gameConfig.player.spawn } as { x: number; y: number };
  private previousHeight: number = this.body.height;
  private interpolatedHeight: number = this.body.height;
  private sprite: SpriteRenderer | null = null;
  private assetAbort: AbortController | null = null;
  private disposed = false;
  spriteStatus: 'placeholder' | 'loading' | 'development' | 'production' | 'fallback' = 'placeholder';
  spriteError = '';
  state: MovementState = 'fall';

  constructor(spawn: Readonly<Vector2> = gameConfig.player.spawn) {
    this.placeholder = new Mesh(
      new PlaneGeometry(this.body.width, this.body.height),
      new MeshBasicMaterial({ color: gameConfig.player.color }),
    );
    this.placeholder.name = 'player-placeholder';
    this.visual.add(this.placeholder);
    this.visual.add(this.attack.visual);
    this.visual.add(this.shuriken.visual);
    this.visual.add(this.specialSkill1.visual);
    this.visual.add(this.nineDragons.visual, this.nineDragons.effects);
    this.setPosition(spawn.x, spawn.y);
  }

  async loadSprite(loader: Pick<SpriteSheetLoader, 'load'> = new SpriteSheetLoader()): Promise<void> {
    if (this.disposed) return;
    this.assetAbort?.abort();
    const request = new AbortController();
    this.assetAbort = request;
    this.spriteStatus = 'loading';
    this.spriteError = '';
    let sheet: LoadedSpriteSheet | null = null;
    let replacement: SpriteRenderer | null = null;
    try {
      sheet = await loader.load(gameConfig.player.spriteMetadata, request.signal);
      if (request.signal.aborted || this.disposed) {
        sheet.texture.dispose();
        return;
      }
      replacement = new SpriteRenderer(sheet);
      this.animator.setClips(sheet.clips);
      this.sprite?.dispose();
      this.sprite = replacement;
      replacement = null;
      this.sprite.visual.position.y = -this.body.height / 2;
      this.visual.add(this.sprite.visual);
      this.visual.add(this.attack.visual);
      this.visual.add(this.shuriken.visual);
      this.visual.add(this.specialSkill1.visual);
      this.visual.add(this.nineDragons.visual, this.nineDragons.effects);
      this.placeholder.visible = false;
      this.spriteStatus = sheet.kind;
      sheet = null;
      this.sprite.setFrame(this.animator.controller.frame, this.animator.renderFacing);
    } catch (error) {
      if (replacement) replacement.dispose();
      else sheet?.texture.dispose();
      if (request.signal.aborted || this.disposed) return;
      this.sprite?.dispose();
      this.sprite = null;
      this.placeholder.visible = true;
      this.spriteStatus = 'fallback';
      this.spriteError = error instanceof Error ? error.message : String(error);
    } finally {
      if (this.assetAbort === request) this.assetAbort = null;
    }
  }

  move(direction: number): void {
    this.movement.move(direction);
  }

  jump(): boolean {
    return this.movement.jump();
  }

  updateMovement(world: PhysicsWorld, delta: number, input: MovementInput): boolean {
    if (this.nineDragons.isCasting) return this.movement.step(world, delta, {
      horizontal: 0, vertical: 0, crouch: false, enterClimb: false, jump: false, detachJump: false,
    }).landed;
    return this.movement.step(world, delta, input).landed;
  }

  updateState(landed: boolean): void {
    if (this.movement.mode === 'climbing') this.state = 'climb';
    else if (this.movement.stance === 'crouching' && this.body.isGrounded) this.state = 'crouch';
    else if (landed) this.state = 'land';
    else if (!this.body.isGrounded) this.state = this.body.velocity.y > 0 ? 'jump' : 'fall';
    else if (this.body.velocity.x < 0) this.state = 'moveLeft';
    else if (this.body.velocity.x > 0) this.state = 'moveRight';
    else this.state = 'idle';
  }

  capturePreviousPosition(): void {
    this.previousPosition.x = this.body.position.x;
    this.previousPosition.y = this.body.position.y;
    this.previousHeight = this.body.height;
  }

  resetInterpolation(): void {
    this.capturePreviousPosition();
    this.syncVisual(1);
  }

  setPosition(x: number, y: number): void {
    this.body.position.x = x;
    this.body.position.y = y;
    this.resetInterpolation();
  }

  respawn(spawn: Readonly<Vector2>): void {
    this.attack.cancel();
    this.shuriken.reset();
    this.specialSkill1.reset();
    this.nineDragons.reset();
    this.movement.reset();
    this.animator.reset();
    this.state = 'fall';
    this.setPosition(spawn.x, spawn.y);
  }

  updateAnimation(delta: number, landed: boolean): void {
    this.animator.update(delta, this.body, landed, this.movement);
    this.attack.update(delta, this.canAttack);
    this.shuriken.update(delta, this.canThrowShuriken, { x: this.body.position.x, y: this.body.position.y - this.body.height / 2 },
      this.movement.stance === 'crouching');
    this.specialSkill1.update(delta, this.canAttack, { x: this.body.position.x, y: this.body.position.y - this.body.height / 2 });
    this.nineDragons.update(delta, this.canAttack);
  }

  get canAttack(): boolean {
    return this.body.isGrounded && this.movement.mode !== 'climbing' && this.movement.stance === 'standing';
  }

  get canThrowShuriken(): boolean {
    return this.body.isGrounded && this.movement.mode !== 'climbing';
  }

  requestAttack(time?: number): void {
    if (!this.canAttack || this.shuriken.isActive || this.specialSkill1.isActive || this.nineDragons.isCasting) return;
    this.attack.request(this.body.velocity.x < 0 ? 'left' : this.body.velocity.x > 0 ? 'right' : this.animator.facing, time);
  }

  requestShuriken(): void {
    if (!this.canThrowShuriken || this.attack.isActive || this.specialSkill1.isActive || this.nineDragons.isCasting) return;
    this.shuriken.request(this.body.velocity.x < 0 ? 'left' : this.body.velocity.x > 0 ? 'right' : this.animator.facing,
      this.movement.stance === 'crouching');
  }

  requestSpecialSkill1(): boolean {
    if (!this.canAttack || this.attack.isActive || this.shuriken.isActive || this.nineDragons.isCasting) return false;
    return this.specialSkill1.request(this.body.velocity.x < 0 ? 'left' : this.body.velocity.x > 0 ? 'right' : this.animator.facing);
  }

  get renderHeight(): number { return this.interpolatedHeight; }

  requestNineDragons(): boolean {
    if (!this.canAttack || this.attack.isActive || this.shuriken.isActive || this.specialSkill1.isActive) return false;
    const facing = this.body.velocity.x < 0 ? 'left' : this.body.velocity.x > 0 ? 'right' : this.animator.facing;
    if (!this.nineDragons.request(facing)) return false;
    this.animator.facing = facing;
    this.body.velocity.x = 0;
    return true;
  }

  // Chỉ nội suy visual; collider luôn giữ nguyên vị trí mô phỏng hiện tại.
  syncVisual(alpha = 1): void {
    const blend = Math.max(0, Math.min(1, alpha));
    this.interpolatedHeight = this.previousHeight + (this.body.height - this.previousHeight) * blend;
    this.visual.position.set(
      this.previousPosition.x + (this.body.position.x - this.previousPosition.x) * blend,
      this.previousPosition.y + (this.body.position.y - this.previousPosition.y) * blend,
      1,
    );
    this.placeholder.scale.set(this.body.width / gameConfig.player.width, this.interpolatedHeight / gameConfig.player.height, 1);
    if (this.sprite) {
      this.sprite.visual.position.y = -this.interpolatedHeight / 2;
      // Atlas cũ thiếu pose cúi: co visual đứng, vẫn giữ chân tại đáy collider.
      this.sprite.visual.scale.y = this.movement.stance === 'crouching' && this.animator.controller.name !== 'crouch'
        ? this.body.height / gameConfig.player.height : 1;
    }
    this.sprite?.setFrame(this.animator.controller.frame, this.animator.renderFacing);
    this.attack.visual.position.y = -this.interpolatedHeight / 2;
    this.shuriken.visual.position.y = -this.interpolatedHeight / 2;
    this.specialSkill1.visual.position.y = -this.interpolatedHeight / 2;
    this.nineDragons.visual.position.y = this.nineDragons.effects.position.y = -this.interpolatedHeight / 2;
    this.nineDragons.syncVisual(blend, this.interpolatedHeight);
    const actionActive = this.attack.isActive || this.shuriken.isActive || this.specialSkill1.isActive || this.nineDragons.isCasting;
    if (this.sprite) this.sprite.visual.visible = !actionActive;
    this.placeholder.visible = !this.sprite && !actionActive;
    const character = this.nineDragons.isCasting ? this.nineDragons.visual
      : this.attack.isActive ? this.attack.visual : this.shuriken.isActive ? this.shuriken.visual
      : this.specialSkill1.isActive ? this.specialSkill1.visual.children[0] ?? null : this.sprite?.visual ?? null;
    this.skillGlow.sync(character, this.nineDragons.glowStrength,
      [this.shuriken.projectiles, this.specialSkill1.visual, this.specialSkill1.effects]);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.assetAbort?.abort();
    this.assetAbort = null;
    this.visual.removeFromParent();
    this.skillGlow.dispose();
    this.sprite?.dispose();
    this.attack.dispose();
    this.shuriken.dispose();
    this.specialSkill1.dispose();
    this.nineDragons.dispose();
    this.placeholder.geometry.dispose();
    this.placeholder.material.dispose();
    this.visual.clear();
  }
}
