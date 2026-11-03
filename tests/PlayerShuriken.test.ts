import { readFileSync } from 'node:fs';
import { Texture } from 'three';
import type { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import { describe, expect, it, vi } from 'vitest';
import { parseSpriteSheet } from '../src/animation/SpriteSheetLoader';
import settings from '../src/config/fire-shuriken.generated.json';
import { Player } from '../src/entities/Player';
import { PlayerShuriken } from '../src/entities/PlayerShuriken';
import { PhysicsWorld } from '../src/physics/PhysicsWorld';
import { dt, floor, roof, noInput } from './movement.fixtures';

function sheet(name: string) {
  const base = new URL('../public/assets/characters/ninja/skills/fire-shuriken/', import.meta.url);
  const data = parseSpriteSheet(JSON.parse(readFileSync(new URL(`${name}.json`, base), 'utf8')));
  const png = readFileSync(new URL(data.image, base));
  return { ...data, texture: new Texture(), imageWidth: png.readUInt32BE(16), imageHeight: png.readUInt32BE(20) };
}

async function ready(skill = new PlayerShuriken()) {
  const actor = sheet('throw'), crouch = sheet('crouch-throw'), projectile = sheet('projectile');
  await skill.load({ load: async (url) => url.endsWith('/throw.json') ? actor : url.endsWith('/crouch-throw.json') ? crouch : projectile });
  return { skill, actor, crouch, projectile };
}

describe('phóng phi tiêu bằng animation đã duyệt, chưa damage/quái', () => {
  it('giữ PNG đã duyệt, scale nhân vật và timing/release của sáu pose', () => {
    const actor = sheet('throw'), crouch = sheet('crouch-throw'), projectile = sheet('projectile');
    const base = new URL('../public/assets/characters/ninja/skills/fire-shuriken/', import.meta.url);
    expect(readFileSync(new URL('throw.png', base))).toEqual(readFileSync(new URL('../integration/task-009-fire-shuriken/throw/throw-atlas.png', import.meta.url)));
    expect(readFileSync(new URL('projectile.png', base))).toEqual(readFileSync(new URL('../integration/task-009-fire-shuriken/fire-shuriken-atlas.png', import.meta.url)));
    expect(readFileSync(new URL('crouch-throw.png', base))).toEqual(readFileSync(new URL('../integration/task-009-fire-shuriken/crouch-throw/crouch-throw-atlas.png', import.meta.url)));
    expect(crouch.visual.width / 512).toBe(1 / 160);
    expect(crouch.clips.crouch_throw!.frames[0]!.pivot).toEqual({ x: 192, y: 353 });
    expect(crouch.clips.crouch_throw!.frames.length / crouch.clips.crouch_throw!.fps).toBeCloseTo(0.55);
    expect(actor.visual.width / 512).toBe(1 / 160);
    expect(actor.clips.throw!.frames[0]!.pivot).toEqual({ x: 192, y: 353 });
    // 17/20/13/14/18/28 slot5ms: mỗi lần đổi pose đúng nhịp preview.
    const frames = actor.clips.throw!.frames;
    expect([0, 17, 37, 50, 64, 82].map((i) => [frames[i]!.x, frames[i]!.y])).toEqual([
      [0, 0], [512, 0], [1024, 0], [0, 512], [512, 512], [1024, 512],
    ]);
    expect(frames.length / actor.clips.throw!.fps).toBeCloseTo(0.55);
    expect(settings.releaseSeconds).toBe(0.25);
    expect(settings.crouch.releaseSeconds).toBe(0.25);
    expect(settings.speed).toBe(5.625 * 2);
    expect(projectile.visual.width).toBe(96 / 160);
    actor.texture.dispose(); crouch.texture.dispose(); projectile.texture.dispose();
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

  it('phi tiêu ở world, nội suy độc lập nhân vật và không còn TTL650ms', async () => {
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
    expect(skill.projectiles.children).toHaveLength(1);
    expect(dispose).not.toHaveBeenCalled();
    skill.reset();
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
    player.requestShuriken(); expect(player.shuriken.isActive).toBe(true);
    expect(player.canAttack).toBe(false);
    player.shuriken.cancel();
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

  it.each(['left', 'right'] as const)('cúi phóng dùng pose riêng, không co sprite và thả thấp theo tay %s', async (facing) => {
    const { skill } = await ready();
    skill.request(facing, true);
    expect(skill.visual.children[0]!.visible).toBe(false);
    expect(skill.visual.children[1]!.visible).toBe(true);
    expect(skill.visual.children[1]!.scale.y).toBe(1);
    skill.update(0.25, true, { x: 10, y: 2 }, true);
    skill.syncProjectiles(1);
    const flight = skill.projectiles.children[0]!;
    expect(flight.position.x).toBeCloseTo(10 + (facing === 'left' ? -1 : 1) * settings.crouch.releaseOffset.x);
    expect(flight.position.y).toBeCloseTo(2 + settings.crouch.releaseOffset.y);
    expect(settings.crouch.releaseOffset.y).toBeLessThan(settings.releaseOffset.y);
    skill.dispose();
  });

  it('nhả cúi dưới mái vẫn phóng thấp, headroom và collider không đổi', async () => {
    const player = new Player({ x: 0, y: 0.8 });
    const world = new PhysicsWorld(-28, [floor, roof]);
    player.body.isGrounded = true;
    player.updateMovement(world, dt, { ...noInput, crouch: true });
    player.updateMovement(world, dt, noInput);
    expect(player.movement.standingBlocked).toBe(true);
    expect(player.movement.stance).toBe('crouching');
    await ready(player.shuriken);
    player.shuriken.setWorld([floor, roof]);
    const before = structuredClone(player.body);
    player.requestShuriken(); player.updateAnimation(0.25, false);
    expect(player.shuriken.projectiles.children).toHaveLength(1);
    expect(player.body).toEqual(before);
    expect(player.canAttack).toBe(false);
    player.dispose();
  });

  it('đổi stance trước release huỷ pose, đổi sau release không xoá phi tiêu đã bay', async () => {
    const { skill } = await ready();
    skill.request('right', true); skill.update(0.249, true, { x: 0, y: 0 }, true);
    skill.update(0.01, true, { x: 0, y: 0 }, false);
    expect(skill.isActive).toBe(false);
    expect(skill.projectiles.children).toHaveLength(0);
    skill.request('right', true); skill.update(0.25, true, { x: 0, y: 0 }, true);
    skill.update(0.01, true, { x: 0, y: 0 }, false);
    expect(skill.isActive).toBe(false);
    expect(skill.projectiles.children).toHaveLength(1);
    skill.dispose();
  });

  it.each(['left', 'right'] as const)('quét trúng tường mỏng hai chiều, không xuyên vật cản %s', async (facing) => {
    const { skill } = await ready();
    const direction = facing === 'left' ? -1 : 1;
    skill.setWorld([{ position: { x: direction * 5, y: settings.releaseOffset.y }, width: 0.01, height: 1 }], { minX: -100, maxX: 100 });
    skill.request(facing); skill.update(0.25, true, { x: 0, y: 0 });
    const mesh = skill.projectiles.children[0]!.children[0]! as Mesh<PlaneGeometry, MeshBasicMaterial>;
    const dispose = vi.spyOn(mesh.material.map!, 'dispose');
    skill.update(1, true, { x: 0, y: 0 });
    expect(skill.projectiles.children).toHaveLength(0);
    expect(dispose).toHaveBeenCalledTimes(1);
    skill.dispose(); expect(dispose).toHaveBeenCalledTimes(1);
  });

  it.each(['left', 'right'] as const)('vật cản sát người/trong điểm thả không bị bỏ qua %s', async (facing) => {
    const { skill } = await ready();
    skill.setWorld([{ position: { x: (facing === 'left' ? -1 : 1) * 0.6, y: settings.crouch.releaseOffset.y }, width: 0.02, height: 1 }], { minX: -100, maxX: 100 });
    skill.request(facing, true); skill.update(0.25, true, { x: 0, y: 0 }, true);
    expect(skill.projectiles.children).toHaveLength(0);
    skill.dispose();
  });

  it('chỉ solid đúng độ cao chặn, không suy vật cản từ visual hoặc mái phía trên', async () => {
    const { skill } = await ready();
    skill.setWorld([{ position: { x: 4, y: 3 }, width: 0.1, height: 0.5 }], { minX: -100, maxX: 100 });
    skill.request('right', true); skill.update(0.25, true, { x: 0, y: 0 }, true);
    skill.update(1, true, { x: 0, y: 0 }, true);
    expect(skill.projectiles.children).toHaveLength(1);
    skill.dispose();
  });

  it('đồ trang trí có collider chặn phi tiêu; đồ trang trí thuần ảnh không được đưa vào collider', async () => {
    const level = JSON.parse(readFileSync(new URL('../src/world/levels/playground.json', import.meta.url), 'utf8'));
    const { skill } = await ready();
    skill.setWorld(level.solids);
    // Cúi tại mặt sàn -2.5: tâm phi tiêu đi qua khối obstacle, thang chỉ là climbable.
    skill.request('right', true); skill.update(0.25, true, { x: 0, y: -2.5 }, true);
    skill.update(0.4, true, { x: 0, y: -2.5 }, true);
    expect(skill.projectiles.children).toHaveLength(0);
    skill.setWorld([], { minX: -100, maxX: 100 });
    skill.request('right', true); skill.update(0.25, true, { x: 0, y: -2.5 }, true);
    skill.update(1, true, { x: 0, y: -2.5 }, true);
    expect(skill.projectiles.children).toHaveLength(1);
    skill.dispose();
  });

  it.each(['left', 'right'] as const)('không hết hạn theo thời gian, chỉ dọn khi cả sprite ra ngoài biên %s', async (facing) => {
    const { skill } = await ready();
    skill.setWorld([], { minX: -10, maxX: 10 });
    skill.request(facing); skill.update(0.25, true, { x: 0, y: 0 });
    skill.update(0.8, true, { x: 0, y: 0 });
    expect(skill.projectiles.children).toHaveLength(1);
    skill.update(0.1, true, { x: 0, y: 0 });
    expect(skill.projectiles.children).toHaveLength(0);
    skill.dispose();
  });

  it('biên dọn bao gồm collider ở ngoài camera bounds, không cắt phi tiêu giữa map', async () => {
    const { skill } = await ready();
    skill.setWorld([{ position: { x: 20, y: 100 }, width: 2, height: 1 }], { minX: -10, maxX: 10 });
    skill.request('right'); skill.update(0.25, true, { x: 0, y: 0 });
    skill.update(1, true, { x: 0, y: 0 });
    expect(skill.projectiles.children).toHaveLength(1);
    skill.update(1, true, { x: 0, y: 0 });
    expect(skill.projectiles.children).toHaveLength(0);
    skill.dispose();
  });

  it('lỗi tải thu hồi sheet đã tải, giữ skill không hoạt động', async () => {
    const actor = sheet('throw'), crouch = sheet('crouch-throw'), dispose = vi.spyOn(actor.texture, 'dispose');
    const crouchDispose = vi.spyOn(crouch.texture, 'dispose');
    const skill = new PlayerShuriken();
    await skill.load({ load: async (url) => {
      if (url.endsWith('/projectile.json')) throw new Error('missing projectile');
      return url.endsWith('/crouch-throw.json') ? crouch : actor;
    } });
    expect(skill.status).toBe('error');
    expect(skill.error).toContain('missing projectile');
    expect(skill.request('right')).toBe(false);
    expect(dispose).toHaveBeenCalledTimes(1);
    expect(crouchDispose).toHaveBeenCalledTimes(1);
    skill.dispose();
  });

  it('dispose lúc tải và sau khi có phi tiêu giải phóng từng texture đúng một lần', async () => {
    const late = new PlayerShuriken(), sheets = [sheet('throw'), sheet('crouch-throw'), sheet('projectile')];
    const spies = sheets.map((s) => vi.spyOn(s.texture, 'dispose'));
    const resolvers: ((value: ReturnType<typeof sheet>) => void)[] = [];
    const loading = late.load({ load: () => new Promise((resolve) => { resolvers.push(resolve); }) });
    late.dispose();
    resolvers.forEach((resolve, i) => resolve(sheets[i]!)); await loading;
    for (const spy of spies) expect(spy).toHaveBeenCalledTimes(1);
    const { skill, actor, crouch, projectile } = await ready();
    const a = vi.spyOn(actor.texture, 'dispose'), c = vi.spyOn(crouch.texture, 'dispose'), p = vi.spyOn(projectile.texture, 'dispose');
    skill.request('right'); skill.update(0.25, true, { x: 0, y: 0 });
    const mesh = skill.projectiles.children[0]!.children[0]! as Mesh<PlaneGeometry, MeshBasicMaterial>;
    const flight = vi.spyOn(mesh.material.map!, 'dispose');
    skill.dispose(); skill.dispose();
    for (const spy of [a, c, p, flight]) expect(spy).toHaveBeenCalledTimes(1);
    const load = vi.fn(async () => sheet('throw'));
    await skill.load({ load }); expect(load).not.toHaveBeenCalled();
  });
});

