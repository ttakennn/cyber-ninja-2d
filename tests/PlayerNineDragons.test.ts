import { readFileSync } from 'node:fs';
import { Texture } from 'three';
import type { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import { describe, expect, it, vi } from 'vitest';
import { parseSpriteSheet } from '../src/animation/SpriteSheetLoader';
import settings from '../src/config/nine-dragons.generated.json';
import { Player } from '../src/entities/Player';
import { PlayerNineDragons } from '../src/entities/PlayerNineDragons';
import { dt, noInput, setup } from './movement.fixtures';

const names = ['cast', 'dragon', 'seal', 'burst', 'aura'];
function sheet(name: string) {
  const base = new URL('../public/assets/characters/ninja/skills/nine-dragons/', import.meta.url);
  const data = parseSpriteSheet(JSON.parse(readFileSync(new URL(`${name}.json`, base), 'utf8')));
  const png = readFileSync(new URL(data.image, base));
  return { ...data, texture: new Texture(), imageWidth: png.readUInt32BE(16), imageHeight: png.readUInt32BE(20) };
}
async function ready(skill = new PlayerNineDragons()) {
  const sheets = names.map(sheet);
  await skill.load({ load: async (url) => sheets[names.findIndex((name) => url.endsWith(`/${name}.json`))]! });
  return { skill, sheets };
}
const mesh = (visual: { children: readonly unknown[] }) => visual.children[0] as Mesh<PlaneGeometry, MeshBasicMaterial>;

describe('Cửu Long — art đã duyệt, cast và aura; chưa damage', () => {
  it('giữ nguyên PNG/cỡ/pivot, nén đủ pose trong1s và lựa chọn Q/2.0/1.0', () => {
    const base = new URL('../public/assets/characters/ninja/skills/nine-dragons/', import.meta.url);
    for (const name of names) {
      expect(readFileSync(new URL(`${name}.png`, base))).toEqual(readFileSync(new URL(`../integration/task-009-nine-dragons/candidate/${name}.png`, import.meta.url)));
      const data = sheet(name);
      for (const clip of Object.values(data.clips)) for (const frame of clip.frames) {
        expect(frame.x + frame.width).toBeLessThanOrEqual(data.imageWidth);
        expect(frame.y + frame.height).toBeLessThanOrEqual(data.imageHeight);
      }
      data.texture.dispose();
    }
    const cast = sheet('cast'), burst = sheet('burst');
    const clip = cast.clips.nine_dragons_cast!;
    expect(cast.visual.width / 512).toBe(1 / 160);
    expect(clip.frames.every((frame) => frame.pivot?.x === 192 && frame.pivot.y === 353)).toBe(true);
    expect(clip.frames.length / clip.fps).toBeCloseTo(1);
    expect(new Set(clip.frames.map((frame) => `${frame.x}:${frame.y}`)).size).toBe(8);
    expect(settings.chargeSeconds).toBeCloseTo(0.25);
    expect(burst.clips.nine_dragons_burst!.frames.length / burst.clips.nine_dragons_burst!.fps).toBeCloseTo(1 - settings.burstStartSeconds);
    expect([settings.key, settings.ringScale, settings.thickness, settings.cooldownSeconds]).toEqual(['Q', 2, 1, 12]);
    cast.texture.dispose(); burst.texture.dispose();
  });

  it.each(['left', 'right'] as const)('cast1s hướng%s, aura7s theo tâm người, grow/fade rồi tắt sáng', async (facing) => {
    const { skill } = await ready();
    expect(skill.request(facing)).toBe(true);
    skill.syncVisual(1, 1.6);
    expect(skill.glowStrength).toBeGreaterThan(0.9);
    const caster = mesh(skill.visual.children[0]!);
    const uv = caster.geometry.getAttribute('uv');
    expect(uv.getX(0) > uv.getX(1)).toBe(facing === 'left');
    expect(skill.request('right')).toBe(false);
    skill.update(0.999, true); expect(skill.isCasting).toBe(true);
    skill.update(0.001, true); skill.syncVisual(1, 1.6);
    expect(skill.isCasting).toBe(false); expect(skill.visual.visible).toBe(false);
    expect(skill.auraRemaining).toBeCloseTo(7);
    const aura = skill.effects.children[2]!;
    skill.update(0.25, false); skill.syncVisual(1, 0.9);
    expect(aura.visible).toBe(true);
    expect(aura.scale.x).toBeCloseTo(2);
    expect(aura.position.y).toBeCloseTo(0.45);
    skill.update(6.575, false); skill.syncVisual(1, 1.6);
    expect(skill.auraRemaining).toBeCloseTo(0.175);
    expect(mesh(aura).material.opacity).toBeCloseTo(0.5);
    expect(skill.glowStrength).toBeGreaterThan(0.44);
    expect(skill.glowStrength).toBeLessThanOrEqual(0.5);
    skill.update(0.175, false); skill.syncVisual(1, 1.6);
    expect(skill.isActive).toBe(false); expect(skill.effects.visible).toBe(false);
    expect(skill.glowStrength).toBe(0);
    expect(skill.cooldownRemaining).toBeCloseTo(4);
    skill.dispose();
  });

  it('ngắt cast/reset không hoàn cooldown, dùng lại sau đủ12s', async () => {
    const { skill } = await ready();
    skill.request('right'); skill.update(0.2, false);
    expect(skill.isActive).toBe(false);
    expect(skill.cooldownRemaining).toBeCloseTo(11.8);
    skill.reset(); expect(skill.request('left')).toBe(false);
    skill.update(11.799, false); expect(skill.request('left')).toBe(false);
    skill.update(0.001, false); expect(skill.request('left')).toBe(true);
    skill.dispose();
  });

  it('chỉ đứng grounded, khoá movement/action trong cast, mở lại khi aura, respawn giữ cooldown', async () => {
    const player = new Player({ x: 0, y: 0.8 }), { world } = setup();
    await ready(player.nineDragons);
    expect(player.requestNineDragons()).toBe(false);
    player.body.isGrounded = true; player.movement.stance = 'crouching';
    expect(player.requestNineDragons()).toBe(false);
    player.movement.stance = 'standing';
    const busy = vi.spyOn(player.specialSkill1, 'isActive', 'get').mockReturnValue(true);
    expect(player.requestNineDragons()).toBe(false); busy.mockRestore();
    player.body.velocity.x = -3;
    expect(player.requestNineDragons()).toBe(true);
    expect(player.animator.facing).toBe('left');
    expect(player.body.velocity.x).toBe(0);
    const sword = vi.spyOn(player.attack, 'request'), star = vi.spyOn(player.shuriken, 'request');
    player.requestAttack(); player.requestShuriken();
    expect(sword).not.toHaveBeenCalled(); expect(star).not.toHaveBeenCalled();
    expect(player.requestSpecialSkill1()).toBe(false);
    player.updateMovement(world, dt, { ...noInput, horizontal: 1, crouch: true, jump: true, enterClimb: true });
    expect(player.body.position.x).toBe(0); expect(player.body.height).toBe(1.6);
    expect(player.movement.activeClimbable).toBeNull();
    player.updateAnimation(1, false);
    player.updateMovement(world, dt, { ...noInput, horizontal: 1 });
    expect(player.body.position.x).toBeGreaterThan(0);
    player.requestAttack(); expect(sword).toHaveBeenCalledTimes(1);
    player.respawn({ x: 2, y: 0.8 });
    expect(player.nineDragons.isActive).toBe(false);
    expect(player.nineDragons.glowStrength).toBe(0);
    expect(player.nineDragons.cooldownRemaining).toBeGreaterThan(0);
    player.dispose();
  });

  it('lỗi tải không tiêu cooldown; dispose thu sheet tới muộn đúng một lần', async () => {
    const failed = new PlayerNineDragons(), assets = names.map(sheet);
    const spies = assets.map((data) => vi.spyOn(data.texture, 'dispose'));
    await failed.load({ load: async (url) => {
      const i = names.findIndex((name) => url.endsWith(`/${name}.json`));
      if (i === 4) throw new Error('missing aura');
      return assets[i]!;
    } });
    expect(failed.status).toBe('error'); expect(failed.error).toContain('missing aura');
    expect(failed.request('right')).toBe(false); expect(failed.cooldownRemaining).toBe(0);
    failed.dispose();
    for (const spy of spies.slice(0, 4)) expect(spy).toHaveBeenCalledTimes(1);
    assets[4]!.texture.dispose();
    const late = new PlayerNineDragons(), pending = names.map(sheet);
    const lateSpies = pending.map((data) => vi.spyOn(data.texture, 'dispose'));
    const resolve: ((value: ReturnType<typeof sheet>) => void)[] = [];
    const loading = late.load({ load: () => new Promise((done) => { resolve.push(done); }) });
    late.dispose(); resolve.forEach((done, i) => done(pending[i]!)); await loading;
    for (const spy of lateSpies) expect(spy).toHaveBeenCalledTimes(1);
  });

  it('không tạo thêm texture theo lần cast; dispose cả nguồn và clone đúng một lần', async () => {
    const { skill, sheets } = await ready();
    const textures = [...skill.visual.children, ...skill.effects.children].map((visual) => mesh(visual).material.map!);
    expect(new Set(textures).size).toBe(13);
    const spies = [...sheets.map((data) => data.texture), ...textures].map((texture) => vi.spyOn(texture, 'dispose'));
    skill.request('right'); skill.update(12, true); skill.request('left'); skill.syncVisual(1, 1.6);
    expect([...skill.visual.children, ...skill.effects.children].map((visual) => mesh(visual).material.map)).toEqual(textures);
    skill.dispose(); skill.dispose();
    for (const spy of spies) expect(spy).toHaveBeenCalledTimes(1);
    expect(skill.visual.children).toHaveLength(0); expect(skill.effects.children).toHaveLength(0);
  });
});
