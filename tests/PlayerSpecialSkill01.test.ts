import { readFileSync } from 'node:fs';
import { Texture } from 'three';
import type { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import { describe, expect, it, vi } from 'vitest';
import { parseSpriteSheet } from '../src/animation/SpriteSheetLoader';
import settings from '../src/config/special-01.generated.json';
import { Player } from '../src/entities/Player';
import { PlayerSpecialSkill01 } from '../src/entities/PlayerSpecialSkill01';
import { ladder } from './movement.fixtures';

function sheet(name: string) {
  const base = new URL('../public/assets/characters/ninja/skills/special-01/', import.meta.url);
  const data = parseSpriteSheet(JSON.parse(readFileSync(new URL(`${name}.json`, base), 'utf8')));
  const png = readFileSync(new URL(data.image, base));
  return { ...data, texture: new Texture(), imageWidth: png.readUInt32BE(16), imageHeight: png.readUInt32BE(20) };
}
async function ready(skill = new PlayerSpecialSkill01()) {
  const cast = sheet('cast'), orb = sheet('orb'), explosion = sheet('explosion');
  await skill.load({ load: async (url) => url.endsWith('/cast.json') ? cast : url.endsWith('/orb.json') ? orb : explosion });
  return { skill, cast, orb, explosion };
}

describe('Minh Vương Bạo Viêm — animation, cooldown và solid impact, chưa damage/quái', () => {
  it('promote nguyên PNG đã duyệt và giữ cỡ/pivot/nhịp của caster', () => {
    const base = new URL('../public/assets/characters/ninja/skills/special-01/', import.meta.url);
    for (const name of ['cast', 'orb', 'explosion']) {
      expect(readFileSync(new URL(`${name}.png`, base))).toEqual(readFileSync(new URL(`../integration/task-009-special-01/candidate/${name}.png`, import.meta.url)));
    }
    const cast = sheet('cast'), orb = sheet('orb'), explosion = sheet('explosion');
    expect(cast.visual.width / 512).toBe(1 / 160);
    expect(cast.clips.special_01_cast!.frames[0]!.pivot).toEqual({ x: 192, y: 353 });
    expect(cast.clips.special_01_cast!.frames.length / cast.clips.special_01_cast!.fps).toBeCloseTo(0.7);
    expect(settings.releaseSeconds).toBe(0.36);
    expect(settings.cooldownSeconds).toBe(5);
    expect(settings.speed).toBe(4.5 * 2);
    expect(orb.clips.special_01_orb!.loop).toBe(true);
    expect(explosion.clips.special_01_explosion!.loop).toBe(false);
    expect(explosion.clips.special_01_explosion!.frames).toHaveLength(8);
    for (const data of [cast, orb, explosion]) data.texture.dispose();
  });

  it('cooldown bắt đầu ngay, ngắt/reset không hoàn lại, chỉ dùng lại sau5s', async () => {
    const { skill } = await ready();
    expect(skill.request('right')).toBe(true);
    expect(skill.cooldownRemaining).toBe(5);
    skill.update(0.2, false, { x: 0, y: 0 });
    expect(skill.isActive).toBe(false);
    expect(skill.effects.children).toHaveLength(0);
    expect(skill.cooldownRemaining).toBeCloseTo(4.8);
    skill.reset();
    expect(skill.request('right')).toBe(false);
    skill.update(4.799, false, { x: 0, y: 0 });
    expect(skill.request('right')).toBe(false);
    skill.update(0.001, false, { x: 0, y: 0 });
    expect(skill.request('left')).toBe(true);
    expect(skill.cooldownRemaining).toBe(5);
    skill.dispose();
  });

  it.each(['left', 'right'] as const)('tụ lực rồi thả một orb đúng tay, hướng%s khoá cả lần cast', async (facing) => {
    const { skill } = await ready();
    expect(skill.request(facing)).toBe(true);
    expect(skill.visual.children[1]!.visible).toBe(true);
    expect(skill.request(facing === 'left' ? 'right' : 'left')).toBe(false);
    skill.update(0.359, true, { x: 10, y: 2 });
    expect(skill.effects.children).toHaveLength(0);
    skill.update(0.001, true, { x: 10, y: 2 });
    skill.syncEffects(1);
    expect(skill.visual.children[1]!.visible).toBe(false);
    expect(skill.effects.children).toHaveLength(1);
    const orb = skill.effects.children[0]!;
    expect(orb.position.x).toBeCloseTo(10 + (facing === 'left' ? -1 : 1) * settings.releaseOffset.x);
    expect(orb.position.y).toBeCloseTo(2 + settings.releaseOffset.y);
    const mesh = orb.children[0]! as Mesh<PlaneGeometry, MeshBasicMaterial>;
    expect(mesh.geometry.getAttribute('uv').getX(0) > mesh.geometry.getAttribute('uv').getX(1)).toBe(facing === 'left');
    skill.update(0.341, true, { x: 10, y: 2 });
    expect(skill.isActive).toBe(false);
    expect(skill.effects.children).toHaveLength(1);
    skill.dispose();
  });

  it.each(['left', 'right'] as const)('nổ tại mặt solid gần nhất, quét qua tường mỏng hướng%s và tan hết', async (facing) => {
    const { skill } = await ready();
    const direction = facing === 'left' ? -1 : 1;
    skill.setWorld([
      { position: { x: direction * 6, y: settings.releaseOffset.y }, width: 0.1, height: 1 },
      { position: { x: direction * 2, y: settings.releaseOffset.y }, width: 0.01, height: 1 },
    ], { minX: -100, maxX: 100 });
    skill.request(facing); skill.update(0.36, true, { x: 0, y: 0 });
    const orb = skill.effects.children[0]!;
    const map = (orb.children[0]! as Mesh<PlaneGeometry, MeshBasicMaterial>).material.map!;
    const dispose = vi.spyOn(map, 'dispose');
    skill.update(0.3, true, { x: 0, y: 0 });
    expect(dispose).toHaveBeenCalledTimes(1);
    expect(skill.effects.children).toHaveLength(1);
    expect(skill.effects.children[0]).not.toBe(orb);
    expect(skill.effects.children[0]!.position.x).toBeCloseTo(direction * 1.995);
    const burstMesh = skill.effects.children[0]!.children[0]! as Mesh<PlaneGeometry, MeshBasicMaterial>;
    const burstDispose = vi.spyOn(burstMesh.material.map!, 'dispose');
    skill.update(0.6, true, { x: 0, y: 0 });
    expect(skill.effects.children).toHaveLength(0);
    expect(burstDispose).toHaveBeenCalledTimes(1);
    skill.dispose();
  });

  it('vật cản sát tay nổ ngay tại mặt chạm, không sinh orb ở phía bên kia', async () => {
    const { skill } = await ready();
    skill.setWorld([{ position: { x: 0.5, y: settings.releaseOffset.y }, width: 0.01, height: 1 }], { minX: -100, maxX: 100 });
    skill.request('right'); skill.update(0.36, true, { x: 0, y: 0 });
    expect(skill.effects.children).toHaveLength(1);
    expect(skill.effects.children[0]!.position.x).toBeCloseTo(0.495);
    skill.update(0.501, true, { x: 0, y: 0 });
    expect(skill.effects.children).toHaveLength(0);
    skill.dispose();
  });

  it('bay ở world/nội suy độc lập, ngoài map được dọn mà không nổ trong không khí', async () => {
    const { skill } = await ready();
    skill.setWorld([], { minX: -2, maxX: 2 });
    skill.request('right'); skill.update(0.36, true, { x: 0, y: 0 });
    skill.update(0.1, false, { x: 100, y: 100 });
    skill.syncEffects(0.5);
    expect(skill.effects.children[0]!.position.x).toBeCloseTo(settings.releaseOffset.x + settings.speed * 0.05);
    expect(skill.effects.children[0]!.position.y).toBeCloseTo(settings.releaseOffset.y);
    skill.update(0.6, false, { x: 100, y: 100 });
    expect(skill.effects.children).toHaveLength(0);
    skill.dispose();
  });

  it('chỉ đứng trên đất, không chồng action; animation không đổi body, respawn giữ cooldown', async () => {
    const player = new Player();
    await ready(player.specialSkill1);
    player.requestSpecialSkill1(); expect(player.specialSkill1.isActive).toBe(false);
    player.body.isGrounded = true;
    player.movement.stance = 'crouching';
    expect(player.requestSpecialSkill1()).toBe(false); expect(player.specialSkill1.cooldownRemaining).toBe(0);
    player.movement.stance = 'standing'; player.movement.activeClimbable = ladder;
    player.requestSpecialSkill1(); expect(player.specialSkill1.cooldownRemaining).toBe(0);
    player.movement.activeClimbable = null;
    const busy = vi.spyOn(player.shuriken, 'isActive', 'get').mockReturnValue(true);
    player.requestSpecialSkill1(); expect(player.specialSkill1.cooldownRemaining).toBe(0);
    busy.mockRestore();
    const body = structuredClone(player.body);
    expect(player.requestSpecialSkill1()).toBe(true); expect(player.specialSkill1.isActive).toBe(true);
    const sword = vi.spyOn(player.attack, 'request'), star = vi.spyOn(player.shuriken, 'request');
    player.requestAttack(); player.requestShuriken();
    expect(sword).not.toHaveBeenCalled(); expect(star).not.toHaveBeenCalled();
    player.updateAnimation(0.36, false);
    expect(player.body).toEqual(body);
    expect(player.specialSkill1.effects.children).toHaveLength(1);
    player.respawn({ x: 2, y: 3 });
    expect(player.specialSkill1.isActive).toBe(false);
    expect(player.specialSkill1.effects.children).toHaveLength(0);
    expect(player.specialSkill1.cooldownRemaining).toBeGreaterThan(0);
    player.dispose();
  });

  it('lỗi tải không tiêu hao cooldown và dispose thu sheet tới muộn', async () => {
    const cast = sheet('cast'), orb = sheet('orb');
    const spies = [cast, orb].map((s) => vi.spyOn(s.texture, 'dispose'));
    const failed = new PlayerSpecialSkill01();
    await failed.load({ load: async (url) => {
      if (url.endsWith('/explosion.json')) throw new Error('missing explosion');
      return url.endsWith('/cast.json') ? cast : orb;
    } });
    expect(failed.status).toBe('error'); expect(failed.request('right')).toBe(false);
    expect(failed.cooldownRemaining).toBe(0);
    for (const spy of spies) expect(spy).toHaveBeenCalledTimes(1);
    failed.dispose();
    const late = new PlayerSpecialSkill01(), sheets = [sheet('cast'), sheet('orb'), sheet('explosion')];
    const lateSpies = sheets.map((s) => vi.spyOn(s.texture, 'dispose'));
    const resolvers: ((value: ReturnType<typeof sheet>) => void)[] = [];
    const loading = late.load({ load: () => new Promise((resolve) => { resolvers.push(resolve); }) });
    late.dispose();
    resolvers.forEach((resolve, i) => resolve(sheets[i]!)); await loading;
    for (const spy of lateSpies) expect(spy).toHaveBeenCalledTimes(1);
    const loader = { load: vi.fn(async () => sheet('cast')) };
    await late.load(loader); expect(loader.load).not.toHaveBeenCalled();
  });

  it('reset/dispose thu charge, orb và texture nguồn đúng một lần', async () => {
    const { skill, cast, orb, explosion } = await ready();
    const sources = [cast, orb, explosion].map((s) => vi.spyOn(s.texture, 'dispose'));
    const chargeMesh = skill.visual.children[1]!.children[0]! as Mesh<PlaneGeometry, MeshBasicMaterial>;
    const charge = vi.spyOn(chargeMesh.material.map!, 'dispose');
    skill.request('right'); skill.update(0.36, true, { x: 0, y: 0 });
    const mesh = skill.effects.children[0]!.children[0]! as Mesh<PlaneGeometry, MeshBasicMaterial>;
    const flight = vi.spyOn(mesh.material.map!, 'dispose');
    skill.reset(); expect(flight).toHaveBeenCalledTimes(1); expect(charge).not.toHaveBeenCalled();
    skill.dispose(); skill.dispose();
    for (const spy of [...sources, charge, flight]) expect(spy).toHaveBeenCalledTimes(1);
  });
});

