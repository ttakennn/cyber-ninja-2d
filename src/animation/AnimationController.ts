import type { AnimationClip, AnimationClips, SpriteFrame } from './AnimationClip';

export class AnimationController {
  private clip: AnimationClip;
  private elapsed = 0;
  private speed = 1;
  private finished = false;
  private index = 0;

  constructor(private readonly clips: AnimationClips, initialClip: string) {
    for (const clip of Object.values(clips)) {
      if (!clip.frames.length || !Number.isFinite(clip.fps) || clip.fps <= 0 ||
        !Number.isFinite(clip.speed ?? 1) || (clip.speed ?? 1) <= 0) {
        throw new Error(`Animation không hợp lệ: ${clip.name}`);
      }
    }
    this.clip = this.getClip(initialClip);
  }

  get name(): string { return this.clip.name; }
  get frameIndex(): number { return this.index; }
  get frame(): SpriteFrame { return this.clip.frames[this.index]!; }
  get isComplete(): boolean { return this.finished; }
  get duration(): number { return this.clip.frames.length / this.clip.fps / (this.clip.speed ?? 1); }

  hasClip(name: string): boolean { return Object.hasOwn(this.clips, name); }

  play(name: string, restart = false, preservePhase = false): void {
    const next = this.getClip(name);
    if (next === this.clip && !restart) return;
    const phase = preservePhase && !restart && this.clip.loop && next.loop
      ? (this.elapsed * this.clip.fps / this.clip.frames.length) % 1 : 0;
    this.clip = next;
    this.elapsed = phase * next.frames.length / next.fps;
    this.index = Math.min(next.frames.length - 1, Math.floor(phase * next.frames.length + 1e-9));
    this.finished = false;
  }

  setPlaybackSpeed(speed: number): void {
    if (!Number.isFinite(speed) || speed < 0) throw new Error('Tốc độ phát phải hữu hạn và không âm');
    this.speed = speed;
  }

  // Trả tên clip đúng một lần khi hoàn tất; caller chỉ truyền delta mô phỏng cố định.
  update(delta: number): string | null {
    if (!Number.isFinite(delta) || delta < 0) throw new Error('Delta animation không hợp lệ');
    if (this.finished) return null;
    this.elapsed += delta * this.speed * (this.clip.speed ?? 1);
    const frames = this.elapsed * this.clip.fps;
    const frameIndex = Math.floor(frames + 1e-9);
    if (this.clip.loop) {
      this.index = frameIndex % this.clip.frames.length;
      // Giữ bộ đếm nhỏ cả khi clip lặp chạy trong thời gian dài.
      this.elapsed %= this.clip.frames.length / this.clip.fps;
      return null;
    }
    this.index = Math.min(frameIndex, this.clip.frames.length - 1);
    if (frameIndex < this.clip.frames.length) return null;
    this.finished = true;
    return this.clip.name;
  }

  private getClip(name: string): AnimationClip {
    const clip = Object.hasOwn(this.clips, name) ? this.clips[name] : undefined;
    if (!clip) throw new Error(`Không tìm thấy animation: ${name}`);
    return clip;
  }
}
