import { Group } from 'three';
import { AnimationController } from '../animation/AnimationController';
import type { AnimationClips, Facing } from '../animation/AnimationClip';
import { SpriteSheetLoader } from '../animation/SpriteSheetLoader';
import { gameConfig } from '../config/game.config';
import { SpriteRenderer } from '../rendering/SpriteRenderer';

const names = ['attack_1', 'attack_2', 'attack_3'] as const;

export class PlayerAttack {
  readonly visual = new Group();
  status: 'loading' | 'ready' | 'error' = 'loading';
  error = '';
  private sprites: SpriteRenderer[] = [];
  private controller: AnimationController | null = null;
  private activeStep = -1;
  private lastRequested = -1;
  private clock = 0;
  private lastClick = -Infinity;
  private facing: Facing = 'right';
  private readonly queue: { step: number; facing: Facing }[] = [];
  private readonly abort = new AbortController();
  private loading: Promise<void> | null = null;
  private disposed = false;

  constructor() { this.visual.visible = false; }

  get isActive(): boolean { return this.activeStep >= 0; }
  get step(): number { return this.activeStep; }

  load(loader: Pick<SpriteSheetLoader, 'load'> = new SpriteSheetLoader()): Promise<void> {
    if (this.disposed) return Promise.resolve();
    return this.loading ??= this.loadAssets(loader);
  }

  private async loadAssets(loader: Pick<SpriteSheetLoader, 'load'>): Promise<void> {
    const results = await Promise.allSettled(names.map((name) => loader.load(
      `assets/characters/ninja/attacks/${name}.json`, this.abort.signal)));
    if (this.disposed || results.some((result) => result.status === 'rejected')) {
      for (const result of results) if (result.status === 'fulfilled') result.value.texture.dispose();
      if (!this.disposed) {
        this.status = 'error';
        const failed = results.find((result) => result.status === 'rejected');
        this.error = String(failed?.status === 'rejected' ? failed.reason : 'Không tải được attack');
      }
      return;
    }
    const clips: Record<string, AnimationClips[string]> = {};
    try {
      for (const [index, result] of results.entries()) {
        if (result.status !== 'fulfilled') continue;
        const clip = result.value.clips[names[index]!];
        if (!clip || clip.loop) throw new Error(`Thiếu clip attack không lặp: ${names[index]}`);
        clips[clip.name] = clip;
      }
      this.controller = new AnimationController(clips, names[0]);
      for (const result of results) if (result.status === 'fulfilled') {
        const sprite = new SpriteRenderer(result.value);
        sprite.visual.visible = false;
        this.sprites.push(sprite);
        this.visual.add(sprite.visual);
      }
      this.status = 'ready';
    } catch (error) {
      for (const sprite of this.sprites) sprite.dispose();
      for (const result of results.slice(this.sprites.length)) if (result.status === 'fulfilled') result.value.texture.dispose();
      this.sprites = [];
      this.controller = null;
      this.status = 'error';
      this.error = String(error);
    }
  }

  request(facing: Facing, time = this.clock): boolean {
    if (this.disposed || this.status !== 'ready') return false;
    if (time - this.lastClick >= gameConfig.player.comboResetSeconds - 1e-9) {
      this.queue.length = 0;
      this.lastRequested = -1;
    }
    this.lastClick = time;
    // Giữ tối đa hai đòn chờ, tránh click nhanh tích luỹ combo dài ngoài ý muốn.
    if (this.queue.length >= 2) return false;
    this.lastRequested = (this.lastRequested + 1) % names.length;
    this.queue.push({ step: this.lastRequested, facing });
    if (!this.isActive) this.startNext();
    return true;
  }

  update(delta: number, allowed: boolean): void {
    if (!allowed || this.disposed) { this.cancel(); return; }
    this.clock += delta;
    if (!this.controller) return;
    if (!this.isActive) this.startNext();
    if (this.isActive && this.controller.update(delta)) {
      this.activeStep = -1;
      this.startNext();
    }
    this.visual.visible = this.isActive;
    for (const [index, sprite] of this.sprites.entries()) {
      sprite.visual.visible = index === this.activeStep;
      if (index === this.activeStep) sprite.setFrame(this.controller.frame, this.facing);
    }
  }

  private startNext(): void {
    const next = this.queue.shift();
    if (!next || !this.controller) return;
    this.activeStep = next.step;
    this.facing = next.facing;
    this.controller.play(names[next.step]!, true);
  }

  cancel(): void {
    this.activeStep = -1;
    this.lastRequested = -1;
    this.lastClick = -Infinity;
    this.queue.length = 0;
    this.visual.visible = false;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.abort.abort();
    this.cancel();
    for (const sprite of this.sprites) sprite.dispose();
    this.sprites = [];
    this.visual.removeFromParent();
    this.visual.clear();
  }
}
