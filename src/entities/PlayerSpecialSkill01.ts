import { Group } from 'three';
import { AnimationController } from '../animation/AnimationController';
import type { Facing } from '../animation/AnimationClip';
import { SpriteSheetLoader } from '../animation/SpriteSheetLoader';
import type { LoadedSpriteSheet } from '../animation/SpriteSheetLoader';
import settings from '../config/special-01.generated.json';
import type { AABB, Vector2 } from '../physics/Collision';
import { SpriteRenderer } from '../rendering/SpriteRenderer';

interface SkillEffect {
  sprite: SpriteRenderer;
  controller: AnimationController;
}
interface OrbFlight extends SkillEffect {
  direction: number;
  x: number;
  previousX: number;
  y: number;
}

export class PlayerSpecialSkill01 {
  readonly visual = new Group();
  readonly effects = new Group();
  status: 'loading' | 'ready' | 'error' = 'loading';
  error = '';
  private castSprite: SpriteRenderer | null = null;
  private chargeSprite: SpriteRenderer | null = null;
  private castController: AnimationController | null = null;
  private chargeController: AnimationController | null = null;
  private orbSheet: LoadedSpriteSheet | null = null;
  private explosionSheet: LoadedSpriteSheet | null = null;
  private readonly flights: OrbFlight[] = [];
  private readonly bursts: SkillEffect[] = [];
  private colliders: readonly AABB[] = [];
  private limits: Readonly<{ minX: number; maxX: number }> | null = null;
  private active = false;
  private elapsed = 0;
  private released = false;
  private cooldown = 0;
  private facing: Facing = 'right';
  private readonly abort = new AbortController();
  private loading: Promise<void> | null = null;
  private disposed = false;

  constructor() { this.visual.visible = false; }

  get isActive(): boolean { return this.active; }
  get cooldownRemaining(): number { return this.cooldown; }

  setWorld(colliders: readonly AABB[], bounds?: Readonly<{ minX: number; maxX: number }>): void {
    this.colliders = colliders;
    let minX = bounds?.minX ?? Infinity, maxX = bounds?.maxX ?? -Infinity;
    for (const collider of colliders) {
      minX = Math.min(minX, collider.position.x - collider.width / 2);
      maxX = Math.max(maxX, collider.position.x + collider.width / 2);
    }
    this.limits = Number.isFinite(minX) && Number.isFinite(maxX) ? { minX, maxX } : null;
  }

  load(loader: Pick<SpriteSheetLoader, 'load'> = new SpriteSheetLoader()): Promise<void> {
    if (this.disposed) return Promise.resolve();
    return this.loading ??= this.loadAssets(loader);
  }

  private async loadAssets(loader: Pick<SpriteSheetLoader, 'load'>): Promise<void> {
    const results = await Promise.allSettled(['cast', 'orb', 'explosion'].map((name) => loader.load(
      `assets/characters/ninja/skills/special-01/${name}.json`, this.abort.signal)));
    if (this.disposed || results.some((result) => result.status === 'rejected')) {
      for (const result of results) if (result.status === 'fulfilled') result.value.texture.dispose();
      if (!this.disposed) {
        this.status = 'error';
        const failed = results.find((result) => result.status === 'rejected');
        this.error = String(failed?.status === 'rejected' ? failed.reason : 'Không tải được Minh Vương Bạo Viêm');
      }
      return;
    }
    const cast = results[0], orb = results[1], explosion = results[2];
    if (cast?.status !== 'fulfilled' || orb?.status !== 'fulfilled' || explosion?.status !== 'fulfilled') return;
    try {
      if (!cast.value.clips.special_01_cast || cast.value.clips.special_01_cast.loop ||
        !orb.value.clips.special_01_orb?.loop || !explosion.value.clips.special_01_explosion ||
        explosion.value.clips.special_01_explosion.loop) throw new Error('Thiếu clip special1 hợp lệ');
      this.castController = new AnimationController(cast.value.clips, 'special_01_cast');
      this.chargeController = new AnimationController(orb.value.clips, 'special_01_orb');
      this.castSprite = new SpriteRenderer(cast.value);
      this.chargeSprite = new SpriteRenderer({ ...orb.value, texture: orb.value.texture.clone() });
      this.chargeSprite.visual.visible = false;
      this.orbSheet = orb.value;
      this.explosionSheet = explosion.value;
      this.visual.add(this.castSprite.visual, this.chargeSprite.visual);
      this.castSprite.setFrame(this.castController.frame, this.facing);
      this.status = 'ready';
    } catch (error) {
      if (this.castSprite) this.castSprite.dispose();
      else cast.value.texture.dispose();
      this.chargeSprite?.dispose();
      orb.value.texture.dispose();
      explosion.value.texture.dispose();
      this.castSprite = null;
      this.chargeSprite = null;
      this.orbSheet = null;
      this.explosionSheet = null;
      this.status = 'error';
      this.error = String(error);
    }
  }

  request(facing: Facing): boolean {
    if (this.disposed || this.status !== 'ready' || this.active || this.cooldown > 1e-9 ||
      !this.castController || !this.castSprite || !this.chargeController) return false;
    this.facing = facing;
    this.elapsed = 0;
    this.released = false;
    this.active = true;
    this.cooldown = settings.cooldownSeconds;
    this.castController.play('special_01_cast', true);
    this.chargeController.play('special_01_orb', true);
    this.castSprite.setFrame(this.castController.frame, facing);
    this.visual.visible = true;
    this.updateCharge(0);
    return true;
  }

  update(delta: number, allowed: boolean, feet: Readonly<Vector2>): void {
    if (this.disposed) return;
    this.cooldown = Math.max(0, this.cooldown - delta);
    for (let index = this.bursts.length - 1; index >= 0; index--) {
      const burst = this.bursts[index]!;
      if (burst.controller.update(delta)) {
        burst.sprite.dispose();
        this.bursts.splice(index, 1);
      } else burst.sprite.setFrame(burst.controller.frame, 'right');
    }
    for (let index = this.flights.length - 1; index >= 0; index--) {
      const flight = this.flights[index]!;
      flight.previousX = flight.x;
      const endX = flight.x + flight.direction * settings.speed * delta;
      const hit = this.firstHit(flight.x, endX, flight.y);
      if (hit !== null || this.outside(endX)) {
        flight.sprite.dispose();
        this.flights.splice(index, 1);
        if (hit !== null) this.explode(hit, flight.y, Math.max(0, delta - Math.abs(hit - flight.x) / settings.speed));
        continue;
      }
      flight.x = endX;
      flight.controller.update(delta);
      flight.sprite.setFrame(flight.controller.frame, flight.direction < 0 ? 'left' : 'right');
    }
    if (!allowed) this.cancel();
    if (!this.active || !this.castController || !this.castSprite) return;
    this.elapsed += delta;
    const finished = this.castController.update(delta);
    this.updateCharge(delta);
    if (!this.released && this.elapsed + 1e-9 >= settings.releaseSeconds) {
      this.released = true;
      this.release(feet, Math.max(0, this.elapsed - settings.releaseSeconds));
    }
    this.castSprite.setFrame(this.castController.frame, this.facing);
    if (finished) this.cancel();
  }

  private updateCharge(delta: number): void {
    if (!this.chargeSprite || !this.chargeController) return;
    const phase = settings.charge.find((entry) => this.elapsed < entry.untilSeconds - 1e-9);
    this.chargeSprite.visual.visible = this.active && !!phase;
    if (!phase) return;
    this.chargeController.update(delta);
    this.chargeSprite.setFrame(this.chargeController.frame, this.facing);
    this.chargeSprite.visual.position.set((this.facing === 'left' ? -1 : 1) * phase.offset.x, phase.offset.y, 0.1);
    this.chargeSprite.visual.scale.setScalar(phase.scale);
  }

  private release(feet: Readonly<Vector2>, age: number): void {
    const sheet = this.orbSheet;
    if (!sheet) return;
    const direction = this.facing === 'left' ? -1 : 1;
    const x = feet.x + direction * settings.releaseOffset.x, y = feet.y + settings.releaseOffset.y;
    const endX = x + direction * settings.speed * age;
    // Kiểm tra từ thân tới tay để không phóng xuyên vật cản sát người.
    const hit = this.firstHit(feet.x, endX, y);
    if (hit !== null) {
      this.explode(hit, y, Math.max(0, age - Math.max(0, direction * (hit - x)) / settings.speed));
      return;
    }
    if (this.outside(endX)) return;
    const controller = new AnimationController(sheet.clips, 'special_01_orb');
    const sprite = new SpriteRenderer({ ...sheet, texture: sheet.texture.clone() });
    controller.update(age);
    sprite.setFrame(controller.frame, this.facing);
    sprite.visual.position.set(x, y, 1.2);
    this.effects.add(sprite.visual);
    this.flights.push({ sprite, controller, direction, x: endX, previousX: x, y });
  }

  private explode(x: number, y: number, age: number): void {
    const sheet = this.explosionSheet;
    if (!sheet) return;
    const controller = new AnimationController(sheet.clips, 'special_01_explosion');
    controller.update(age);
    if (controller.isComplete) return;
    const sprite = new SpriteRenderer({ ...sheet, texture: sheet.texture.clone() });
    sprite.setFrame(controller.frame, 'right');
    sprite.visual.position.set(x, y, 1.3);
    this.effects.add(sprite.visual);
    this.bursts.push({ sprite, controller });
  }

  private firstHit(startX: number, endX: number, y: number): number | null {
    const direction = endX >= startX ? 1 : -1;
    let nearest: number | null = null;
    for (const collider of this.colliders) {
      if (y < collider.position.y - collider.height / 2 || y > collider.position.y + collider.height / 2) continue;
      const left = collider.position.x - collider.width / 2, right = collider.position.x + collider.width / 2;
      const hit = startX >= left && startX <= right ? startX
        : direction > 0 && startX < left && endX >= left ? left
        : direction < 0 && startX > right && endX <= right ? right : null;
      if (hit !== null && (nearest === null || Math.abs(hit - startX) < Math.abs(nearest - startX))) nearest = hit;
    }
    return nearest;
  }

  private outside(x: number): boolean {
    const margin = this.orbSheet?.visual.width ?? 0;
    return this.limits !== null && (x < this.limits.minX - margin || x > this.limits.maxX + margin);
  }

  syncEffects(alpha: number): void {
    const blend = Math.max(0, Math.min(1, alpha));
    for (const flight of this.flights) flight.sprite.visual.position.set(
      flight.previousX + (flight.x - flight.previousX) * blend, flight.y, 1.2);
  }

  cancel(): void {
    this.active = false;
    this.visual.visible = false;
    if (this.chargeSprite) this.chargeSprite.visual.visible = false;
  }

  // Huỷ pose/hiệu ứng khi blur, respawn hoặc stop; giữ cooldown đã dùng.
  reset(): void {
    this.cancel();
    for (const effect of [...this.flights, ...this.bursts]) effect.sprite.dispose();
    this.flights.length = 0;
    this.bursts.length = 0;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.abort.abort();
    this.reset();
    this.castSprite?.dispose();
    this.chargeSprite?.dispose();
    this.orbSheet?.texture.dispose();
    this.explosionSheet?.texture.dispose();
    this.castSprite = null;
    this.chargeSprite = null;
    this.orbSheet = null;
    this.explosionSheet = null;
    this.visual.removeFromParent();
    this.effects.removeFromParent();
    this.visual.clear();
    this.effects.clear();
  }
}

