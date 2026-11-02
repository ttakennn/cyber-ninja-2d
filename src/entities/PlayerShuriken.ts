import { Group } from 'three';
import { AnimationController } from '../animation/AnimationController';
import type { Facing } from '../animation/AnimationClip';
import { SpriteSheetLoader } from '../animation/SpriteSheetLoader';
import type { LoadedSpriteSheet } from '../animation/SpriteSheetLoader';
import settings from '../config/fire-shuriken.generated.json';
import type { Vector2 } from '../physics/Collision';
import { SpriteRenderer } from '../rendering/SpriteRenderer';

interface Flight {
  sprite: SpriteRenderer;
  controller: AnimationController;
  direction: number;
  x: number;
  previousX: number;
  y: number;
  age: number;
}

export class PlayerShuriken {
  readonly visual = new Group();
  readonly projectiles = new Group();
  status: 'loading' | 'ready' | 'error' = 'loading';
  error = '';
  private sprite: SpriteRenderer | null = null;
  private controller: AnimationController | null = null;
  private projectileSheet: LoadedSpriteSheet | null = null;
  private readonly flights: Flight[] = [];
  private active = false;
  private elapsed = 0;
  private released = false;
  private facing: Facing = 'right';
  private readonly abort = new AbortController();
  private loading: Promise<void> | null = null;
  private disposed = false;

  constructor() { this.visual.visible = false; }

  get isActive(): boolean { return this.active; }

  load(loader: Pick<SpriteSheetLoader, 'load'> = new SpriteSheetLoader()): Promise<void> {
    if (this.disposed) return Promise.resolve();
    return this.loading ??= this.loadAssets(loader);
  }

  private async loadAssets(loader: Pick<SpriteSheetLoader, 'load'>): Promise<void> {
    const results = await Promise.allSettled(['throw', 'projectile'].map((name) => loader.load(
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
    const actor = results[0], projectile = results[1];
    if (actor?.status !== 'fulfilled' || projectile?.status !== 'fulfilled') return;
    try {
      if (!actor.value.clips.throw || actor.value.clips.throw.loop ||
        !projectile.value.clips.projectile?.loop) throw new Error('Thiếu clip phóng/phi tiêu hợp lệ');
      this.controller = new AnimationController(actor.value.clips, 'throw');
      this.sprite = new SpriteRenderer(actor.value);
      this.projectileSheet = projectile.value;
      this.visual.add(this.sprite.visual);
      this.sprite.setFrame(this.controller.frame, this.facing);
      this.status = 'ready';
    } catch (error) {
      if (this.sprite) this.sprite.dispose();
      else actor.value.texture.dispose();
      projectile.value.texture.dispose();
      this.sprite = null;
      this.controller = null;
      this.projectileSheet = null;
      this.status = 'error';
      this.error = String(error);
    }
  }

  request(facing: Facing): boolean {
    if (this.disposed || this.status !== 'ready' || this.active || !this.controller || !this.sprite) return false;
    this.facing = facing;
    this.elapsed = 0;
    this.released = false;
    this.active = true;
    this.controller.play('throw', true);
    this.sprite.setFrame(this.controller.frame, facing);
    this.visual.visible = true;
    return true;
  }

  update(delta: number, allowed: boolean, feet: Readonly<Vector2>): void {
    if (this.disposed) return;
    for (let index = this.flights.length - 1; index >= 0; index--) {
      const flight = this.flights[index]!;
      flight.previousX = flight.x;
      flight.age += delta;
      flight.x += flight.direction * settings.speed * delta;
      flight.controller.update(delta);
      flight.sprite.setFrame(flight.controller.frame, flight.direction < 0 ? 'left' : 'right');
      if (flight.age >= settings.lifetime) {
        flight.sprite.dispose();
        this.flights.splice(index, 1);
      }
    }
    // Huỷ pose chưa thả khi nhảy/cúi/leo; phi tiêu đã bay sống độc lập.
    if (!allowed) this.cancel();
    if (!this.active || !this.controller || !this.sprite) return;
    this.elapsed += delta;
    const finished = this.controller.update(delta);
    if (!this.released && this.elapsed + 1e-9 >= settings.releaseSeconds) {
      this.released = true;
      this.release(feet, Math.max(0, this.elapsed - settings.releaseSeconds));
    }
    this.sprite.setFrame(this.controller.frame, this.facing);
    if (finished) this.cancel();
  }

  private release(feet: Readonly<Vector2>, age: number): void {
    const sheet = this.projectileSheet;
    if (!sheet || age >= settings.lifetime) return;
    // Mỗi renderer sở hữu texture clone riêng; ảnh nguồn chỉ tải một lần.
    const sprite = new SpriteRenderer({ ...sheet, texture: sheet.texture.clone() });
    const controller = new AnimationController(sheet.clips, 'projectile');
    const direction = this.facing === 'left' ? -1 : 1;
    const x = feet.x + direction * settings.releaseOffset.x;
    const y = feet.y + settings.releaseOffset.y;
    controller.update(age);
    sprite.setFrame(controller.frame, this.facing);
    sprite.visual.position.set(x, y, 1.1);
    this.projectiles.add(sprite.visual);
    this.flights.push({ sprite, controller, direction, previousX: x, x: x + direction * settings.speed * age, y, age });
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
    this.projectileSheet?.texture.dispose();
    this.sprite = null;
    this.projectileSheet = null;
    this.visual.removeFromParent();
    this.projectiles.removeFromParent();
    this.visual.clear();
    this.projectiles.clear();
  }
}

