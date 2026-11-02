import { readFileSync } from 'node:fs';
import { Texture } from 'three';
import type { Mesh } from 'three';
import { describe, expect, it, vi } from 'vitest';
import { parseSpriteSheet } from '../src/animation/SpriteSheetLoader';
import { PlayerAttack } from '../src/entities/PlayerAttack';
import { Player } from '../src/entities/Player';
import plan from '../integration/task-009-player-attacks/combo-plan.json';

function sheet(index: number) {
  const name = `attack_${index + 1}`;
  const base = new URL('../public/assets/characters/ninja/attacks/', import.meta.url);
  const data = parseSpriteSheet(JSON.parse(readFileSync(new URL(`${name}.json`, base), 'utf8')));
  const png = readFileSync(new URL(data.image, base));
  return { ...data, texture: new Texture(), imageWidth: png.readUInt32BE(16), imageHeight: png.readUInt32BE(20) };
}

async function ready() {
  const sheets = [sheet(0), sheet(1), sheet(2)];
  const attack = new PlayerAttack();
  await attack.load({ load: async (url) => sheets[Number(/attack_(\d)/.exec(url)![1]) - 1]! });
  return { attack, sheets };
}

describe('combo animation bằng click, chưa damage', () => {
  it('đúng frame đã duyệt, scale160px/unit và pivot chân không đổi world origin', () => {
    for (const [index, approved] of plan.clips.entries()) {
      const data = sheet(index);
      expect(data.clips[approved.name]!.frames).toHaveLength(approved.frames.length);
      const candidate = parseSpriteSheet(JSON.parse(readFileSync(new URL(`../integration/task-009-player-attacks/candidate/${approved.name}.json`, import.meta.url), 'utf8')));
      expect(data.clips[approved.name]!.frames).toEqual(approved.frames.map((frame) => candidate.clips[approved.name]!.frames[frame]));
      expect(data.visual.width / 512).toBe(0.00625);
      expect(data.visual.height / 512).toBe(0.00625);
      expect(data.clips[approved.name]!.frames[0]!.pivot).toEqual({ x: 192, y: 353 });
      data.texture.dispose();
    }
  });

  it('một click chỉ đòn1; giữ không click thêm không tự phát2/3', async () => {
    const { attack } = await ready();
    attack.request('right'); attack.update(0, true);
    expect(attack.step).toBe(0);
    attack.update(0.251, true);
    expect(attack.isActive).toBe(false);
    attack.update(2, true);
    expect(attack.isActive).toBe(false);
    attack.dispose();
  });

  it('buffer ba click thành1→2→3, không lật giữa đòn và không tích luỹ vô hạn', async () => {
    const { attack } = await ready();
    expect(attack.request('left', 1)).toBe(true);
    expect(attack.request('right', 1.01)).toBe(true);
    expect(attack.request('left', 1.02)).toBe(true);
    expect(attack.request('right', 1.03)).toBe(false);
    attack.update(0, true);
    const first = attack.visual.children[0]!.children[0]! as Mesh;
    expect(first.geometry.getAttribute('uv').getX(0)).toBeGreaterThan(first.geometry.getAttribute('uv').getX(1));
    attack.update(0.251, true); expect(attack.step).toBe(1);
    attack.update(0.215, true); expect(attack.step).toBe(2);
    attack.update(0.263, true); expect(attack.isActive).toBe(false);
    attack.dispose();
  });

  it.each([[0.499, 1], [0.5, 0], [0.501, 0]])('khoảng nghỉ %ss bắt đầu đòn index%s theo thời điểm click', async (gap, step) => {
    const { attack } = await ready();
    attack.request('right', 10); attack.update(0.3, true);
    // Thời gian click độc lập delta bị giới hạn của game loop.
    attack.request('right', 10 + gap!); attack.update(0, true);
    expect(attack.step).toBe(step);
    attack.dispose();
  });

  it('click tiếp sau đòn3 về1, huỷ tư thế/respawn không mang buffer sang lượt mới', async () => {
    const { attack } = await ready();
    for (const time of [1, 1.2, 1.4]) { attack.request('right', time); attack.update(0.3, true); }
    attack.request('right', 1.6); expect(attack.step).toBe(0);
    attack.request('right', 1.61); attack.update(0, false);
    expect(attack.visual.visible).toBe(false);
    attack.request('right', 1.62); expect(attack.step).toBe(0);
    attack.cancel(); expect(attack.isActive).toBe(false);
    attack.dispose();
  });

  it('gate chỉ đứng trên đất; animation attack không sửa collider/vận tốc', () => {
    const player = new Player();
    player.body.isGrounded = true;
    expect(player.canAttack).toBe(true);
    const before = structuredClone(player.body);
    player.updateAnimation(0.01, false);
    expect(player.body).toEqual(before);
    player.movement.stance = 'crouching'; expect(player.canAttack).toBe(false);
    player.movement.stance = 'standing'; player.body.isGrounded = false; expect(player.canAttack).toBe(false);
    player.dispose();
  });

  it('thu hồi texture khi lỗi tải và không tải lại sau dispose', async () => {
    const one = sheet(0), three = sheet(2);
    const a = vi.spyOn(one.texture, 'dispose'), c = vi.spyOn(three.texture, 'dispose');
    const attack = new PlayerAttack();
    await attack.load({ load: async (url) => {
      if (url.includes('attack_2')) throw new Error('missing PNG');
      return url.includes('attack_1') ? one : three;
    } });
    expect(attack.status).toBe('error');
    expect(attack.request('right')).toBe(false);
    expect(a).toHaveBeenCalledTimes(1); expect(c).toHaveBeenCalledTimes(1);
    attack.dispose();
    const loader = { load: vi.fn(async () => sheet(0)) };
    const disposed = new PlayerAttack(); disposed.dispose(); await disposed.load(loader);
    expect(loader.load).not.toHaveBeenCalled();
  });

  it('dispose sau tải thành công thu texture đúng một lần', async () => {
    const { attack, sheets } = await ready();
    const spies = sheets.map(({ texture }) => vi.spyOn(texture, 'dispose'));
    attack.dispose(); attack.dispose();
    for (const spy of spies) expect(spy).toHaveBeenCalledTimes(1);
  });

  it('dispose trong lúc tải vẫn thu hồi các texture đến muộn', async () => {
    const sheets = [sheet(0), sheet(1), sheet(2)];
    const spies = sheets.map(({ texture }) => vi.spyOn(texture, 'dispose'));
    const resolvers: ((value: ReturnType<typeof sheet>) => void)[] = [];
    const attack = new PlayerAttack();
    const loading = attack.load({ load: () => new Promise((resolve) => { resolvers.push(resolve); }) });
    attack.dispose();
    for (const [index, resolve] of resolvers.entries()) resolve(sheets[index]!);
    await loading;
    for (const spy of spies) expect(spy).toHaveBeenCalledTimes(1);
    expect(attack.isActive).toBe(false);
  });
});
