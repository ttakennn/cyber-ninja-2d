import { readFileSync } from 'node:fs';
import { Texture } from 'three';
import type { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import { describe, expect, it, vi } from 'vitest';
import { parseSpriteSheet } from '../src/animation/SpriteSheetLoader';
import settings from '../src/config/fire-shuriken.generated.json';
import { Player } from '../src/entities/Player';
import { PlayerShuriken } from '../src/entities/PlayerShuriken';

function sheet(name: string) {
  const base = new URL('../public/assets/characters/ninja/skills/fire-shuriken/', import.meta.url);
  const data = parseSpriteSheet(JSON.parse(readFileSync(new URL(`${name}.json`, base), 'utf8')));
  const png = readFileSync(new URL(data.image, base));
  return { ...data, texture: new Texture(), imageWidth: png.readUInt32BE(16), imageHeight: png.readUInt32BE(20) };
}

async function ready(skill = new PlayerShuriken()) {
  const actor = sheet('throw'), projectile = sheet('projectile');
  await skill.load({ load: async (url) => url.endsWith('/throw.json') ? actor : projectile });
  return { skill, actor, projectile };
}

describe('phóng phi tiêu bằng animation đã duyệt, chưa damage/collision', () => {
  it('giữ PNG đã duyệt, scale nhân vật và timing/release của sáu pose', () => {
    const actor = sheet('throw'), projectile = sheet('projectile');
    const base = new URL('../public/assets/characters/ninja/skills/fire-shuriken/', import.meta.url);
    expect(readFileSync(new URL('throw.png', base))).toEqual(readFileSync(new URL('../integration/task-009-fire-shuriken/throw/throw-atlas.png', import.meta.url)));
    expect(readFileSync(new URL('projectile.png', base))).toEqual(readFileSync(new URL('../integration/task-009-fire-shuriken/fire-shuriken-atlas.png', import.meta.url)));
    expect(actor.visual.width / 512).toBe(1 / 160);
    expect(actor.clips.throw!.frames[0]!.pivot).toEqual({ x: 192, y: 353 });
    // 17/20/13/14/18/28 slot5ms: mỗi lần đổi pose đúng nhịp preview.
    const frames = actor.clips.throw!.frames;
    expect([0, 17, 37, 50, 64, 82].map((i) => [frames[i]!.x, frames[i]!.y])).toEqual([
      [0, 0], [512, 0], [1024, 0], [0, 512], [512, 512], [1024, 512],
    ]);
    expect(frames.length / actor.clips.throw!.fps).toBeCloseTo(0.55);
    expect(settings.releaseSeconds).toBe(0.25);
    expect(projectile.visual.width).toBe(96 / 160);
    actor.texture.dispose(); projectile.texture.dispose();
  });

  it.each(['left', 'right'] as const)('một click thả đúng một lần từ tay, hướng%s khoá trong đòn', async (facing) => {
    const { skill } = await ready();
    expect(skill.request(facing)).toBe(true);
    expect(skill.request(facing === 'left' ? 'right' : 'left')).toBe(false);
    skill.update(0.249, true, { x: 10, y: 2 });
    expect(skill.projectiles.children).toHaveLength(0);
    skill.update(0.001, true, { x: 10, y: 2 });
    expect(skill.projectiles.children).toHaveLength(1);
    skill.syncProjectiles(1);
    const visual = skill.projectiles.children[0]!;
    expect(visual.position.x).toBeCloseTo(10 + (facing === 'left' ? -1 : 1) * settings.releaseOffset.x);
    expect(visual.position.y).toBeCloseTo(2 + settings.releaseOffset.y);
    const mesh = visual.children[0]! as Mesh<PlaneGeometry, MeshBasicMaterial>;
    const uv = mesh.geometry.getAttribute('uv');
    expect(uv.getX(0) > uv.getX(1)).toBe(facing === 'left');
    skill.update(0.301, true, { x: 10, y: 2 });
    expect(skill.isActive).toBe(false);
    expect(skill.projectiles.children).toHaveLength(1);
    skill.dispose();
  });

  it('phi tiêu ở world, nội suy độc lập nhân vật và tự giải phóng sau thời gian bay', async () => {
    const { skill } = await ready();
    skill.request('right'); skill.update(0.25, true, { x: 10, y: 2 });
    const visual = skill.projectiles.children[0]!;
    skill.update(0.1, false, { x: 200, y: 50 });
    skill.syncProjectiles(0.5);
    expect(visual.position.x).toBeCloseTo(10 + settings.releaseOffset.x + settings.speed * 0.05);
    expect(visual.position.y).toBeCloseTo(2 + settings.releaseOffset.y);
    expect(skill.isActive).toBe(false);
    const mesh = visual.children[0]! as Mesh<PlaneGeometry, MeshBasicMaterial>;
    const dispose = vi.spyOn(mesh.material.map!, 'dispose');
    skill.update(0.551, true, { x: 200, y: 50 });
    expect(skill.projectiles.children).toHaveLength(0);
    expect(dispose).toHaveBeenCalledTimes(1);
    skill.dispose();
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  it('huỷ trước frame mở tay không sinh phi tiêu, delta lớn không bỏ mất sự kiện release', async () => {
    const { skill } = await ready();
    skill.request('right'); skill.update(0.249, true, { x: 0, y: 0 });
    skill.update(0.01, false, { x: 0, y: 0 });
    expect(skill.projectiles.children).toHaveLength(0);
    skill.request('right'); skill.update(0.551, true, { x: 0, y: 0 });
    expect(skill.isActive).toBe(false);
    expect(skill.projectiles.children).toHaveLength(1);
    skill.reset();
    expect(skill.projectiles.children).toHaveLength(0);
    skill.dispose();
  });

  it('gate theo stance hiện có, không chồng combo và không thay body', async () => {
    const player = new Player();
    await ready(player.shuriken);
    player.requestShuriken(); expect(player.shuriken.isActive).toBe(false);
    player.body.isGrounded = true;
    player.movement.stance = 'crouching';
    player.requestShuriken(); expect(player.shuriken.isActive).toBe(false);
    player.movement.stance = 'standing';
    const attackActive = vi.spyOn(player.attack, 'isActive', 'get').mockReturnValue(true);
    player.requestShuriken(); expect(player.shuriken.isActive).toBe(false);
    attackActive.mockRestore();
    const before = structuredClone(player.body);
    player.requestShuriken(); expect(player.shuriken.isActive).toBe(true);
    const request = vi.spyOn(player.attack, 'request');
    player.requestAttack(); expect(request).not.toHaveBeenCalled();
    player.updateAnimation(0.25, false);
    expect(player.body).toEqual(before);
    expect(player.shuriken.projectiles.children).toHaveLength(1);
    player.respawn({ x: 2, y: 3 });
    expect(player.shuriken.projectiles.children).toHaveLength(0);
    expect(player.shuriken.isActive).toBe(false);
    player.dispose();
  });

  it('lỗi tải thu hồi sheet đã tải, giữ skill không hoạt động', async () => {
    const actor = sheet('throw'), dispose = vi.spyOn(actor.texture, 'dispose');
    const skill = new PlayerShuriken();
    await skill.load({ load: async (url) => {
      if (url.endsWith('/projectile.json')) throw new Error('missing projectile');
      return actor;
    } });
    expect(skill.status).toBe('error');
    expect(skill.error).toContain('missing projectile');
    expect(skill.request('right')).toBe(false);
    expect(dispose).toHaveBeenCalledTimes(1);
    skill.dispose();
  });

  it('dispose lúc tải và sau khi có phi tiêu giải phóng từng texture đúng một lần', async () => {
    const late = new PlayerShuriken(), sheets = [sheet('throw'), sheet('projectile')];
    const spies = sheets.map((s) => vi.spyOn(s.texture, 'dispose'));
    const resolvers: ((value: ReturnType<typeof sheet>) => void)[] = [];
    const loading = late.load({ load: () => new Promise((resolve) => { resolvers.push(resolve); }) });
    late.dispose();
    resolvers.forEach((resolve, i) => resolve(sheets[i]!)); await loading;
    for (const spy of spies) expect(spy).toHaveBeenCalledTimes(1);
    const { skill, actor, projectile } = await ready();
    const a = vi.spyOn(actor.texture, 'dispose'), p = vi.spyOn(projectile.texture, 'dispose');
    skill.request('right'); skill.update(0.25, true, { x: 0, y: 0 });
    const mesh = skill.projectiles.children[0]!.children[0]! as Mesh<PlaneGeometry, MeshBasicMaterial>;
    const flight = vi.spyOn(mesh.material.map!, 'dispose');
    skill.dispose(); skill.dispose();
    for (const spy of [a, p, flight]) expect(spy).toHaveBeenCalledTimes(1);
    const load = vi.fn(async () => sheet('throw'));
    await skill.load({ load }); expect(load).not.toHaveBeenCalled();
  });
});

