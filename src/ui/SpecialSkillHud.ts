import { Vector3 } from 'three';
import type { Camera } from 'three';
import type { Player } from '../entities/Player';
import settings from '../config/special-01.generated.json';

export class SpecialSkillHud {
  private readonly card = document.createElement('aside');
  private readonly callout = document.createElement('div');
  private readonly state: HTMLElement;
  private readonly countdown: HTMLElement;
  private readonly track: HTMLElement;
  private readonly fill: HTMLElement;
  private readonly projected = new Vector3();
  private animation: Animation | null = null;
  private lastState = '';

  constructor(container: HTMLElement) {
    this.card.className = 'skill-hud';
    this.card.setAttribute('aria-label', 'Kỹ năng Minh Vương Bạo Viêm');
    this.card.dataset.state = 'loading';
    this.card.innerHTML = `<div class="skill-heading"><kbd>E</kbd><div><span class="skill-caption">TUYỆT KỸ · HỆ HOẢ</span><strong>Minh Vương Bạo Viêm</strong></div></div>
      <div class="skill-status"><span data-state-text>Đang tải kỹ năng</span><span class="skill-count" data-countdown>…</span></div>
      <div class="skill-track" role="progressbar" aria-label="Hồi chiêu Minh Vương Bạo Viêm" aria-valuemin="0" aria-valuemax="${settings.cooldownSeconds}" aria-valuenow="0"><i></i></div>`;
    this.state = this.card.querySelector<HTMLElement>('[data-state-text]')!;
    this.countdown = this.card.querySelector<HTMLElement>('[data-countdown]')!;
    this.track = this.card.querySelector<HTMLElement>('.skill-track')!;
    this.fill = this.track.querySelector<HTMLElement>('i')!;
    this.callout.className = 'skill-callout';
    this.callout.innerHTML = '<span>Minh Vương Bạo Viêm</span>';
    this.callout.hidden = true;
    this.callout.setAttribute('aria-hidden', 'true');
    container.append(this.card, this.callout);
  }

  showCastName(): void {
    this.hideCastName();
    this.callout.hidden = false;
    const animation = this.callout.animate([
      { opacity: 1, transform: 'translate(-50%, -100%) translateY(0)' },
      { opacity: 0, transform: 'translate(-50%, -100%) translateY(-20px)' },
    ], { duration: 1500, easing: 'ease-out', fill: 'forwards' });
    this.animation = animation;
    animation.onfinish = () => { if (this.animation === animation) this.hideCastName(); };
  }

  update(player: Player, camera: Camera): void {
    const skill = player.specialSkill1;
    const remaining = Math.max(0, Math.ceil(skill.cooldownRemaining * 10 - 1e-8) / 10);
    const state = skill.status === 'loading' ? 'loading' : skill.status === 'error' ? 'error'
      : skill.isActive ? 'casting' : remaining > 0 ? 'cooldown' : 'ready';
    const key = `${state}:${remaining}`;
    if (key !== this.lastState) {
      this.lastState = key;
      this.card.dataset.state = state;
      this.state.textContent = state === 'loading' ? 'Đang tải kỹ năng' : state === 'error' ? 'Chưa tải được · F3'
        : state === 'casting' ? 'Đang thi triển' : state === 'cooldown' ? 'Đang hồi chiêu' : 'Có thể thi triển';
      this.countdown.textContent = state === 'loading' ? '…' : state === 'error' ? 'Lỗi'
        : remaining > 0 ? remaining.toFixed(1).replace('.', ',') + 's' : 'Sẵn sàng';
      const progress = skill.status === 'ready' ? Math.max(0, Math.min(settings.cooldownSeconds, settings.cooldownSeconds - remaining)) : 0;
      this.fill.style.transform = `scaleX(${progress / settings.cooldownSeconds})`;
      this.track.setAttribute('aria-valuenow', String(progress));
      this.track.setAttribute('aria-valuetext', skill.status === 'ready'
        ? remaining > 0 ? `Còn ${this.countdown.textContent}` : 'Sẵn sàng' : (this.state.textContent ?? ''));
    }
    if (!this.animation) return;
    // Renderer đã cập nhật camera matrices; dùng vị trí/chiều cao nội suy của nhân vật.
    this.projected.copy(player.visual.position);
    this.projected.y += player.renderHeight / 2 + 0.22;
    this.projected.project(camera);
    this.callout.hidden = Math.abs(this.projected.x) > 1 || Math.abs(this.projected.y) > 1 || Math.abs(this.projected.z) > 1;
    this.callout.style.left = `clamp(145px, ${(this.projected.x * 0.5 + 0.5) * 100}%, calc(100% - 145px))`;
    this.callout.style.top = `clamp(70px, ${(-this.projected.y * 0.5 + 0.5) * 100}%, calc(100% - 20px))`;
  }

  hideCastName(): void {
    if (this.animation) {
      this.animation.onfinish = null;
      this.animation.cancel();
      this.animation = null;
    }
    this.callout.hidden = true;
  }

  dispose(): void {
    this.hideCastName();
    this.card.remove();
    this.callout.remove();
  }
}

