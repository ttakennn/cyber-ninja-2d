import { readFileSync } from 'node:fs';
import { Texture } from 'three';
import { describe, expect, it } from 'vitest';
import type { AnimationClips } from '../src/animation/AnimationClip';
import { parseSpriteSheet } from '../src/animation/SpriteSheetLoader';
import { Player } from '../src/entities/Player';
import { PlayerAnimator } from '../src/entities/PlayerAnimator';
import { PhysicsWorld } from '../src/physics/PhysicsWorld';
import { TestLevel } from '../src/world/TestLevel';
import { clips } from './animation.fixtures';
import { dt, floor, noInput } from './movement.fixtures';

const movementClips: AnimationClips = {
  ...clips,
  crouch: { ...clips.idle!, name: 'crouch' },
  climb: { ...clips.run!, name: 'climb' },
};
const metadata = JSON.parse(readFileSync(new URL('../public/assets/characters/ninja/development-animations.json', import.meta.url), 'utf8'));

describe('animation cúi và leo', () => {
  it('atlas mới giữ nguyên năm clip cũ, thêm hai pose tùy chọn', () => {
    const sheet = parseSpriteSheet(metadata);
    expect(sheet.clips.crouch?.frames).toHaveLength(2);
    expect(sheet.clips.climb?.frames).toHaveLength(4);
    expect(Object.keys(sheet.clips)).toHaveLength(7);
    expect(Object.values(sheet.clips).flatMap((clip) => clip.frames)).toHaveLength(23);
  });

  it('cúi dùng pose riêng và khi đứng lại chọn Idle/Run theo vận tốc', () => {
    const player = new Player();
    const world = new PhysicsWorld(-28, [floor]);
    player.animator.setClips(movementClips);
    player.setPosition(0, 0.8);
    player.body.isGrounded = true;
    let landed = player.updateMovement(world, dt, { ...noInput, crouch: true });
    player.updateAnimation(dt, landed);
    expect(player.animator.controller.name).toBe('crouch');
    landed = player.updateMovement(world, dt, { ...noInput, horizontal: 1 });
    player.updateAnimation(dt, landed);
    expect(player.animator.controller.name).toBe('run');
    landed = player.updateMovement(world, dt, noInput);
    player.updateAnimation(dt, landed);
    expect(player.animator.controller.name).toBe('idle');
    player.dispose();
  });

  it('dừng frame khi leo đứng yên và tiếp tục từ frame đó khi leo tiếp', () => {
    const animator = new PlayerAnimator(movementClips);
    const body = { position: { x: 0, y: 2 }, velocity: { x: 0, y: 2.8 }, width: 0.8, height: 1.6, isGrounded: false };
    const movement = { mode: 'climbing', stance: 'standing' } as const;
    animator.update(0.15, body, false, movement);
    const frame = animator.controller.frameIndex;
    expect(frame).toBe(1);
    body.velocity.y = 0;
    for (let step = 0; step < 100; step += 1) animator.update(dt, body, false, movement);
    expect(animator.controller.frameIndex).toBe(frame);
    body.velocity.y = -2.8;
    animator.update(0.05, body, false, movement);
    expect(animator.controller.frameIndex).toBe(2);
    body.velocity.y = -1;
    animator.update(0.1, body, false, { ...movement, mode: 'airborne' });
    expect(animator.controller.name).toBe('fall');
    expect(animator.controller.frameIndex).toBe(1);
    body.velocity.y = 11;
    animator.update(dt, body, false, { ...movement, mode: 'airborne' });
    expect(animator.controller.name).toBe('jump');
  });

  it('atlas cũ thiếu crouch/climb vẫn tải thành công và có visual dự phòng', async () => {
    const player = new Player();
    const sheet = parseSpriteSheet(metadata);
    const legacyClips = Object.fromEntries(Object.entries(sheet.clips).filter(([name]) => name !== 'crouch' && name !== 'climb'));
    const texture = new Texture();
    await player.loadSprite({ load: async () => ({ ...sheet, clips: legacyClips, texture, imageWidth: 384, imageHeight: 560 }) });
    expect(player.spriteStatus).toBe('development');
    expect(player.animator.controller.hasClip('crouch')).toBe(false);
    const world = new PhysicsWorld(-28, [floor]);
    player.setPosition(0, 0.8);
    player.body.isGrounded = true;
    player.capturePreviousPosition();
    const landed = player.updateMovement(world, dt, { ...noInput, crouch: true });
    player.updateAnimation(dt, landed);
    player.syncVisual(1);
    expect(player.animator.controller.name).toBe('idle');
    expect(player.visual.children[1]?.scale.y).toBeCloseTo(0.9 / 1.6);
    player.animator.update(dt, player.body, false, { mode: 'climbing', stance: 'standing' });
    expect(player.animator.controller.name).toBe('fall');
    player.dispose();
  });

  it('đổi sang atlas cũ ngay trong Crouch/Climb chọn fallback thay vì lỗi tải', () => {
    const animator = new PlayerAnimator(movementClips);
    const body = { position: { x: 0, y: 0.45 }, velocity: { x: 0, y: 0 }, width: 0.8, height: 0.9, isGrounded: true };
    animator.update(dt, body, false, { mode: 'grounded', stance: 'crouching' });
    expect(animator.controller.name).toBe('crouch');
    animator.setClips(clips);
    expect(animator.controller.name).toBe('idle');
    animator.setClips(movementClips);
    body.isGrounded = false;
    body.velocity.y = 2.8;
    animator.update(dt, body, false, { mode: 'climbing', stance: 'standing' });
    expect(animator.controller.name).toBe('climb');
    animator.setClips(clips);
    expect(animator.controller.name).toBe('fall');
    expect(body.velocity.y).toBe(2.8);
  });

  it('nội suy đổi chiều cao giữ chân sprite và collider tại cùng đáy nền', async () => {
    const player = new Player();
    const sheet = parseSpriteSheet(metadata);
    await player.loadSprite({ load: async () => ({ ...sheet, texture: new Texture(), imageWidth: 384, imageHeight: 560 }) });
    const world = new PhysicsWorld(-28, [floor]);
    player.setPosition(0, 0.8);
    player.body.isGrounded = true;
    for (const crouch of [true, false, true, false]) {
      player.capturePreviousPosition();
      const landed = player.updateMovement(world, dt, { ...noInput, crouch });
      player.updateAnimation(dt, landed);
      const bodyBeforeRender = structuredClone(player.body);
      for (const alpha of [0, 0.25, 0.5, 0.75, 1]) {
        player.syncVisual(alpha);
        const sprite = player.visual.children[1]!;
        expect(player.visual.position.y - player.renderHeight / 2).toBeCloseTo(0, 10);
        expect(player.visual.position.y + sprite.position.y).toBeCloseTo(0, 10);
        expect(player.body).toEqual(bodyBeforeRender);
      }
    }
    player.dispose();
  });

  it('sân thử nghiệm có hầm, thang không rắn và sàn cao có thể tới được', () => {
    const level = new TestLevel();
    expect(level.colliders).toHaveLength(4);
    expect(level.climbables).toHaveLength(1);
    const world = new PhysicsWorld(-28, level.colliders, level.climbables);
    const player = new Player();
    player.setPosition(-2.4, -1.7);
    player.body.isGrounded = true;
    for (let step = 0; step < 135; step += 1) {
      player.updateMovement(world, dt, { ...noInput, crouch: true, horizontal: -1 });
      expect(world.canOccupy(player.body)).toBe(true);
    }
    expect(player.body.position.x + player.body.width / 2).toBeLessThan(-7);
    player.updateMovement(world, dt, noInput);
    expect(player.movement.stance).toBe('standing');
    player.setPosition(8, -1.7);
    player.body.isGrounded = true;
    player.updateMovement(world, dt, { ...noInput, enterClimb: true });
    for (let step = 0; step < 180; step += 1) player.updateMovement(world, dt, { ...noInput, vertical: 1 });
    for (let step = 0; step < 20; step += 1) {
      player.updateMovement(world, dt, { ...noInput, horizontal: 1 });
      expect(world.canOccupy(player.body)).toBe(true);
    }
    for (let step = 0; step < 60; step += 1) player.updateMovement(world, dt, noInput);
    expect(player.body.position.y - player.body.height / 2).toBeCloseTo(1.2);
    expect(player.movement.mode).toBe('grounded');
    player.dispose();
    level.dispose();
  });
});
