import { Group } from 'three';
import type { Mesh, MeshBasicMaterial } from 'three';
import type { AnimationClip, Facing } from '../animation/AnimationClip';
import { SpriteSheetLoader } from '../animation/SpriteSheetLoader';
import type { LoadedSpriteSheet } from '../animation/SpriteSheetLoader';
import settings from '../config/nine-dragons.generated.json';
import { SpriteRenderer } from '../rendering/SpriteRenderer';

interface SkillSprite {
  sprite: SpriteRenderer;
  material: MeshBasicMaterial;
  clip: AnimationClip;
}
const names = ['cast', 'dragon', 'seal', 'burst', 'aura'] as const;

export class PlayerNineDragons {
  readonly visual = new Group();
  readonly effects = new Group();
  status: 'loading' | 'ready' | 'error' = 'loading';
  error = '';
  private readonly sheets: LoadedSpriteSheet[] = [];
  private readonly sprites: SkillSprite[] = [];
  private readonly dragons: SkillSprite[] = [];
  private caster: SkillSprite | null = null;
  private seal: SkillSprite | null = null;
  private burst: SkillSprite | null = null;
  private aura: SkillSprite | null = null;
  private active = false;
  private elapsed = 0;
  private previousElapsed = 0;
  private cooldown = 0;
  private facing: Facing = 'right';
  private readonly abort = new AbortController();
  private loading: Promise<void> | null = null;
  private disposed = false;

  constructor() { this.visual.visible = this.effects.visible = false; }

  get isActive(): boolean { return this.active; }
  get isCasting(): boolean { return this.active && this.elapsed < settings.castSeconds - 1e-9; }
  get cooldownRemaining(): number { return this.cooldown; }
  get auraRemaining(): number {
    return this.active && !this.isCasting ? Math.max(0, settings.castSeconds + settings.auraSeconds - this.elapsed) : 0;
  }
  get glowStrength(): number {
    if (!this.active) return 0;
    const pulse = settings.glow.pulseMinimum + (1 - settings.glow.pulseMinimum) *
      (Math.sin(this.elapsed * Math.PI * 2 * settings.glow.pulseHz) + 1) / 2;
    return pulse * Math.min(1, (settings.castSeconds + settings.auraSeconds - this.elapsed) / settings.fadeSeconds);
  }

  load(loader: Pick<SpriteSheetLoader, 'load'> = new SpriteSheetLoader()): Promise<void> {
    if (this.disposed) return Promise.resolve();
    return this.loading ??= this.loadAssets(loader);
  }

  private async loadAssets(loader: Pick<SpriteSheetLoader, 'load'>): Promise<void> {
    const results = await Promise.allSettled(names.map((name) => loader.load(
      `assets/characters/ninja/skills/nine-dragons/${name}.json`, this.abort.signal)));
    if (this.disposed || results.some((result) => result.status === 'rejected')) {
      for (const result of results) if (result.status === 'fulfilled') result.value.texture.dispose();
      if (!this.disposed) {
        this.status = 'error';
        const failed = results.find((result) => result.status === 'rejected');
        this.error = String(failed?.status === 'rejected' ? failed.reason : 'Không tải được Cửu Long Hỏa Trận');
      }
      return;
    }
    try {
      for (const result of results) if (result.status === 'fulfilled') this.sheets.push(result.value);
      for (let i = 0; i < names.length; i++) {
        const name = names[i]!, sheet = this.sheets[i]!, clip = sheet.clips[`nine_dragons_${name}`];
        if (!clip || clip.loop !== (name === 'dragon' || name === 'aura')) throw new Error(`Thiếu clip Cửu Long hợp lệ: ${name}`);
      }
      this.caster = this.makeSprite(this.sheets[0]!, 'cast', this.visual);
      this.seal = this.makeSprite(this.sheets[2]!, 'seal', this.effects);
      this.burst = this.makeSprite(this.sheets[3]!, 'burst', this.effects);
      this.aura = this.makeSprite(this.sheets[4]!, 'aura', this.effects);
      for (let i = 0; i < settings.dragon.count; i++) this.dragons.push(this.makeSprite(this.sheets[1]!, 'dragon', this.effects));
      this.status = 'ready';
    } catch (error) {
      this.clearSprites();
      this.status = 'error';
      this.error = String(error);
    }
  }

  private makeSprite(sheet: LoadedSpriteSheet, name: string, parent: Group): SkillSprite {
    const sprite = new SpriteRenderer({ ...sheet, texture: sheet.texture.clone() });
    const effect = { sprite, material: (sprite.visual.children[0] as Mesh).material as MeshBasicMaterial,
      clip: sheet.clips[`nine_dragons_${name}`]! };
    this.sprites.push(effect);
    sprite.visual.visible = false;
    parent.add(sprite.visual);
    return effect;
  }

  request(facing: Facing): boolean {
    if (this.disposed || this.status !== 'ready' || this.active || this.cooldown > 1e-9) return false;
    this.facing = facing;
    this.elapsed = this.previousElapsed = 0;
    this.cooldown = settings.cooldownSeconds;
    this.active = true;
    this.visual.visible = this.effects.visible = true;
    return true;
  }

  update(delta: number, allowed: boolean): void {
    if (this.disposed) return;
    this.cooldown = Math.max(0, this.cooldown - delta);
    if (!this.active) return;
    this.previousElapsed = this.elapsed;
    if (this.isCasting && !allowed) { this.reset(); return; }
    this.elapsed += delta;
    if (this.elapsed + 1e-9 >= settings.castSeconds + settings.auraSeconds) this.reset();
  }

  private phase(effect: SkillSprite, seconds: number, facing: Facing = 'right', offset = 0): void {
    const index = Math.floor(Math.max(0, seconds) * effect.clip.fps + 1e-9) + offset;
    const frame = effect.clip.frames[effect.clip.loop ? index % effect.clip.frames.length : Math.min(index, effect.clip.frames.length - 1)]!;
    effect.sprite.setFrame(frame, facing);
  }

  syncVisual(alpha: number, height: number): void {
    this.visual.visible = this.isCasting;
    this.effects.visible = this.active;
    if (!this.active || !this.caster || !this.seal || !this.burst || !this.aura) return;
    const time = this.previousElapsed + (this.elapsed - this.previousElapsed) * Math.max(0, Math.min(1, alpha));
    const centerY = height / 2, tau = Math.PI * 2, castScale = settings.castTimeScale;
    this.caster.sprite.visual.visible = this.isCasting;
    this.phase(this.caster, time, this.facing);
    this.seal.sprite.visual.visible = time < settings.castSeconds;
    this.seal.material.opacity = Math.min(1, time / (0.18 * castScale));
    this.seal.sprite.visual.position.set(0, settings.sealOffsetY, -0.05);
    this.seal.sprite.setFrame(this.seal.clip.frames[time < settings.chargeSeconds ? Math.min(1, Math.floor(time / (settings.chargeSeconds / 2)))
      : time < settings.burstStartSeconds ? 2 : 3]!, 'right');
    const reveal = Math.max(0, Math.min(1, (time - 0.13 * castScale) / (0.22 * castScale)));
    const orbit = Math.max(0, (time - settings.chargeSeconds) / (settings.burstStartSeconds - settings.chargeSeconds));
    const converge = time > settings.burstStartSeconds - 0.1 * castScale ? 1 - (time - settings.burstStartSeconds + 0.1 * castScale) / (0.1 * castScale) * 0.75 : 1;
    const activeGroup = Math.max(0, Math.min(2, Math.floor(orbit * 3)));
    for (let i = 0; i < this.dragons.length; i++) {
      const dragon = this.dragons[i]!, angle = i * tau / this.dragons.length + orbit * tau * 2;
      dragon.sprite.visual.visible = time >= 0.13 * castScale && time < settings.burstStartSeconds;
      if (!dragon.sprite.visual.visible) continue;
      const rx = settings.dragon.radiusX * reveal * converge, ry = settings.dragon.radiusY * reveal * converge;
      this.phase(dragon, time / castScale, 'right', i);
      dragon.material.opacity = reveal * (i % 3 === activeGroup ? 1 : 0.42);
      dragon.sprite.visual.position.set(Math.cos(angle) * rx, centerY - Math.sin(angle) * ry, Math.sin(angle) > 0 ? 0.06 : -0.04);
      dragon.sprite.visual.rotation.z = -Math.atan2(Math.cos(angle) * ry, -Math.sin(angle) * rx);
    }
    this.burst.sprite.visual.visible = time >= settings.burstStartSeconds && time < settings.castSeconds + 0.15;
    if (this.burst.sprite.visual.visible) {
      this.phase(this.burst, time - settings.burstStartSeconds);
      this.burst.material.opacity = Math.min(1, (settings.castSeconds + 0.15 - time) / 0.15);
      this.burst.sprite.visual.position.set(0, centerY, 0.14);
    }
    const age = time - settings.castSeconds;
    this.aura.sprite.visual.visible = age >= 0 && age < settings.auraSeconds;
    if (this.aura.sprite.visual.visible) {
      const grow = 1 - Math.pow(1 - Math.min(1, age / settings.growSeconds), 3);
      this.phase(this.aura, age);
      this.aura.sprite.visual.scale.setScalar(1 + (settings.ringScale - 1) * grow);
      this.aura.sprite.visual.position.set(0, centerY, 0.12);
      this.aura.sprite.visual.rotation.z = -age * tau * settings.rotationsPerSecond;
      this.aura.material.opacity = Math.min(1, age / 0.08) * Math.min(1, (settings.auraSeconds - age) / settings.fadeSeconds);
    }
  }

  // Cùng chính sách special hiện có: reset hiệu ứng, giữ hồi chiêu đã dùng.
  reset(): void {
    this.active = false;
    this.elapsed = this.previousElapsed = 0;
    this.visual.visible = this.effects.visible = false;
  }

  private clearSprites(): void {
    for (const effect of this.sprites) effect.sprite.dispose();
    for (const sheet of this.sheets) sheet.texture.dispose();
    this.sprites.length = this.sheets.length = this.dragons.length = 0;
    this.caster = this.seal = this.burst = this.aura = null;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.abort.abort();
    this.reset();
    this.clearSprites();
  }
}
