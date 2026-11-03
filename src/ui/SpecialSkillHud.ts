import { Vector3 } from 'three';
import type { Camera } from 'three';
import type { Player } from '../entities/Player';
import settings from '../config/special-01.generated.json';
import nineDragons from '../config/nine-dragons.generated.json';

export class SpecialSkillHud {
  private readonly card = document.createElement('section');
  private readonly callout = document.createElement('div');
  private readonly state: HTMLElement;
  private readonly countdown: HTMLElement;
  private readonly track: HTMLElement;
  private readonly fill: HTMLElement;
  private readonly projected = new Vector3();
  private animation: Animation | null = null;
  private lastState = '';
  private readonly cooldownSeconds: number;

  constructor(container: HTMLElement, private readonly skillId: 'specialSkill1' | 'nineDragons' = 'specialSkill1', calloutContainer: HTMLElement = container) {
    const formation = skillId === 'nineDragons', name = formation ? nineDragons.name : 'Minh Vương Bạo Viêm';
    this.cooldownSeconds = formation ? nineDragons.cooldownSeconds : settings.cooldownSeconds;
    this.card.className = 'skill-entry';
    this.card.setAttribute('aria-label', `Kỹ năng ${name}`);
    this.card.dataset.state = 'loading';
    this.card.innerHTML = `<div class="skill-heading"><kbd>${formation ? nineDragons.key : 'E'}</kbd><strong>${name}</strong></div>
      <div class="skill-status"><span data-state-text>Đang tải kỹ năng</span><span class="skill-count" data-countdown>…</span></div>
      <div class="skill-track" role="progressbar" aria-label="Hồi chiêu ${name}" aria-valuemin="0" aria-valuemax="${this.cooldownSeconds}" aria-valuenow="0"><i></i></div>`;
    this.state = this.card.querySelector<HTMLElement>('[data-state-text]')!;
    this.countdown = this.card.querySelector<HTMLElement>('[data-countdown]')!;
    this.track = this.card.querySelector<HTMLElement>('.skill-track')!;
    this.fill = this.track.querySelector<HTMLElement>('i')!;
    this.callout.className = 'skill-callout';
    this.callout.innerHTML = `<span>${name}</span>`;
    this.callout.hidden = true;
    this.callout.setAttribute('aria-hidden', 'true');
    container.append(this.card);
    calloutContainer.append(this.callout);
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
    const skill = player[this.skillId];
    const casting = this.skillId === 'nineDragons' ? player.nineDragons.isCasting : skill.isActive;
    const aura = this.skillId === 'nineDragons' && skill.isActive && !casting;
    const remaining = Math.max(0, Math.ceil(skill.cooldownRemaining * 10 - 1e-8) / 10);
    const state = skill.status === 'loading' ? 'loading' : skill.status === 'error' ? 'error'
      : casting ? 'casting' : aura ? 'aura' : remaining > 0 ? 'cooldown' : 'ready';
    const key = `${state}:${remaining}`;
    if (key !== this.lastState) {
      this.lastState = key;
      this.card.dataset.state = state;
      this.state.textContent = state === 'loading' ? 'Đang tải kỹ năng' : state === 'error' ? 'Chưa tải được · F3'
        : state === 'casting' ? 'Đang thi triển' : state === 'aura' ? 'Vòng lửa đang tồn tại' : state === 'cooldown' ? 'Đang hồi chiêu' : 'Có thể thi triển';
      this.countdown.textContent = state === 'loading' ? '…' : state === 'error' ? 'Lỗi'
        : remaining > 0 ? remaining.toFixed(1).replace('.', ',') + 's' : 'Sẵn sàng';
      const progress = skill.status === 'ready' ? Math.max(0, Math.min(this.cooldownSeconds, this.cooldownSeconds - remaining)) : 0;
      this.fill.style.transform = `scaleX(${progress / this.cooldownSeconds})`;
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

