import { Group } from 'three';
import { AnimationController } from '../animation/AnimationController';
import type { Facing } from '../animation/AnimationClip';
import { SpriteSheetLoader } from '../animation/SpriteSheetLoader';
import type { LoadedSpriteSheet } from '../animation/SpriteSheetLoader';
import settings from '../config/fire-shuriken.generated.json';
import type { AABB, Vector2 } from '../physics/Collision';
import { SpriteRenderer } from '../rendering/SpriteRenderer';

interface Flight {
  sprite: SpriteRenderer;
  controller: AnimationController;
  direction: number;
  x: number;
  previousX: number;
  y: number;
}

export class PlayerShuriken {
  readonly visual = new Group();
  readonly projectiles = new Group();
  status: 'loading' | 'ready' | 'error' = 'loading';
  error = '';
  private sprite: SpriteRenderer | null = null;
  private crouchSprite: SpriteRenderer | null = null;
  private controller: AnimationController | null = null;
  private projectileSheet: LoadedSpriteSheet | null = null;
  private readonly flights: Flight[] = [];
  private active = false;
  private elapsed = 0;
  private released = false;
  private facing: Facing = 'right';
  private crouched = false;
  private colliders: readonly AABB[] = [];
  private limits: Readonly<{ minX: number; maxX: number }> | null = null;
  private readonly abort = new AbortController();
  private loading: Promise<void> | null = null;
  private disposed = false;

  constructor() { this.visual.visible = false; }

  get isActive(): boolean { return this.active; }

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
    const results = await Promise.allSettled(['throw', 'crouch-throw', 'projectile'].map((name) => loader.load(
      `assets/characters/ninja/skills/fire-shuriken/${name}.json`, this.abort.signal)));
    if (this.disposed || results.some((result) => result.status === 'rejected')) {
      for (const result of results) if (result.status === 'fulfilled') result.value.texture.dispose();
      if (!this.disposed) {
        this.status = 'error';
        const failed = results.find((result) => result.status === 'rejected');
        this.error = String(failed?.status === 'rejected' ? failed.reason : 'Không tải được phi tiêu');
      }
      return;
    }
    const actor = results[0], crouch = results[1], projectile = results[2];
    if (actor?.status !== 'fulfilled' || crouch?.status !== 'fulfilled' || projectile?.status !== 'fulfilled') return;
    try {
      if (!actor.value.clips.throw || actor.value.clips.throw.loop ||
        !crouch.value.clips.crouch_throw || crouch.value.clips.crouch_throw.loop ||
        !projectile.value.clips.projectile?.loop) throw new Error('Thiếu clip phóng/phi tiêu hợp lệ');
      this.controller = new AnimationController({ ...actor.value.clips, ...crouch.value.clips }, 'throw');
      this.sprite = new SpriteRenderer(actor.value);
      this.crouchSprite = new SpriteRenderer(crouch.value);
      this.crouchSprite.visual.visible = false;
      this.projectileSheet = projectile.value;
      this.visual.add(this.sprite.visual, this.crouchSprite.visual);
      this.sprite.setFrame(this.controller.frame, this.facing);
      this.status = 'ready';
    } catch (error) {
      if (this.sprite) this.sprite.dispose();
      else actor.value.texture.dispose();
      if (this.crouchSprite) this.crouchSprite.dispose();
      else crouch.value.texture.dispose();
      projectile.value.texture.dispose();
      this.sprite = null;
      this.crouchSprite = null;
      this.controller = null;
      this.projectileSheet = null;
      this.status = 'error';
      this.error = String(error);
    }
  }

  request(facing: Facing, crouched = false): boolean {
    if (this.disposed || this.status !== 'ready' || this.active || !this.controller || !this.sprite || !this.crouchSprite) return false;
    this.facing = facing;
    this.crouched = crouched;
    this.elapsed = 0;
    this.released = false;
    this.active = true;
    this.controller.play(crouched ? 'crouch_throw' : 'throw', true);
    this.sprite.visual.visible = !crouched;
    this.crouchSprite.visual.visible = crouched;
    (crouched ? this.crouchSprite : this.sprite).setFrame(this.controller.frame, facing);
    this.visual.visible = true;
    return true;
  }

  update(delta: number, allowed: boolean, feet: Readonly<Vector2>, crouched = this.crouched): void {
    if (this.disposed) return;
    for (let index = this.flights.length - 1; index >= 0; index--) {
      const flight = this.flights[index]!;
      flight.previousX = flight.x;
      const nextX = flight.x + flight.direction * settings.speed * delta;
      if (this.blockedOrOutside(flight.x, nextX, flight.y)) {
        flight.sprite.dispose();
        this.flights.splice(index, 1);
        continue;
      }
      flight.x = nextX;
      flight.controller.update(delta);
      flight.sprite.setFrame(flight.controller.frame, flight.direction < 0 ? 'left' : 'right');
    }
    // Đổi stance/nhảy/leo huỷ pose đang phóng; phi tiêu đã bay sống độc lập.
    if (!allowed || crouched !== this.crouched) this.cancel();
    const sprite = this.crouched ? this.crouchSprite : this.sprite;
    if (!this.active || !this.controller || !sprite) return;
    this.elapsed += delta;
    const finished = this.controller.update(delta);
    const release = this.crouched ? settings.crouch : settings;
    if (!this.released && this.elapsed + 1e-9 >= release.releaseSeconds) {
      this.released = true;
      this.release(feet, Math.max(0, this.elapsed - release.releaseSeconds));
    }
    sprite.setFrame(this.controller.frame, this.facing);
    if (finished) this.cancel();
  }

  private release(feet: Readonly<Vector2>, age: number): void {
    const sheet = this.projectileSheet;
    if (!sheet) return;
    const direction = this.facing === 'left' ? -1 : 1;
    const offset = (this.crouched ? settings.crouch : settings).releaseOffset;
    const x = feet.x + direction * offset.x;
    const y = feet.y + offset.y;
    const nextX = x + direction * settings.speed * age;
    // Quét từ thân tới tay để không sinh phi tiêu xuyên vật cản sát người.
    if (this.blockedOrOutside(feet.x, nextX, y)) return;
    // Mỗi renderer sở hữu texture clone riêng; ảnh nguồn chỉ tải một lần.
    const sprite = new SpriteRenderer({ ...sheet, texture: sheet.texture.clone() });
    const controller = new AnimationController(sheet.clips, 'projectile');
    controller.update(age);
    sprite.setFrame(controller.frame, this.facing);
    sprite.visual.position.set(x, y, 1.1);
    this.projectiles.add(sprite.visual);
    this.flights.push({ sprite, controller, direction, previousX: x, x: nextX, y });
  }

  private blockedOrOutside(startX: number, endX: number, y: number): boolean {
    const left = Math.min(startX, endX), right = Math.max(startX, endX);
    if (this.colliders.some((collider) =>
      y >= collider.position.y - collider.height / 2 && y <= collider.position.y + collider.height / 2 &&
      right >= collider.position.x - collider.width / 2 && left <= collider.position.x + collider.width / 2)) return true;
    // Chỉ dọn ngoài toàn bộ level, không dọn khi vừa ra khỏi camera hiện tại.
    const margin = this.projectileSheet?.visual.width ?? 0;
    return this.limits !== null && (endX < this.limits.minX - margin || endX > this.limits.maxX + margin);
  }

  syncProjectiles(alpha: number): void {
    const blend = Math.max(0, Math.min(1, alpha));
    for (const flight of this.flights) flight.sprite.visual.position.set(
      flight.previousX + (flight.x - flight.previousX) * blend, flight.y, 1.1);
  }

  cancel(): void {
    this.active = false;
    this.visual.visible = false;
  }

  reset(): void {
    this.cancel();
    for (const flight of this.flights) flight.sprite.dispose();
    this.flights.length = 0;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.abort.abort();
    this.reset();
    this.sprite?.dispose();
    this.crouchSprite?.dispose();
    this.projectileSheet?.texture.dispose();
    this.sprite = null;
    this.crouchSprite = null;
    this.projectileSheet = null;
    this.visual.removeFromParent();
    this.projectiles.removeFromParent();
    this.visual.clear();
    this.projectiles.clear();
  }
}

