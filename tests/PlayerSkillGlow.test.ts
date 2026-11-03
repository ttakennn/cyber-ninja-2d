import { Group, Mesh, MeshBasicMaterial, PlaneGeometry, ShaderMaterial, Texture } from 'three';
import { describe, expect, it, vi } from 'vitest';
import { PlayerSkillGlow } from '../src/rendering/PlayerSkillGlow';

describe('ánh sáng Ninja khi có Cửu Long', () => {
  it('phi tiêu, charge/orb và nổ ở world cũng sáng, cùng fade/tắt và thu lớp sáng khi projectile biến mất', () => {
    const player = new Group(), effects = [new Group(), new Group(), new Group()];
    const texture = new Texture(); texture.image = { width: 512, height: 512 };
    const geometry = new PlaneGeometry(1, 1), material = new MeshBasicMaterial({ map: texture });
    const sources = effects.map((root) => { const source = new Mesh(geometry, material); root.add(source); return source; });
    const glow = new PlayerSkillGlow(player);
    glow.sync(null, 1, effects);
    const overlays = sources.map((source) => source.getObjectByName('nine-dragons-character-glow') as Mesh);
    for (const overlay of overlays) expect(overlay.visible).toBe(true);
    glow.sync(null, 0.4, effects);
    for (const overlay of overlays) expect((overlay.material as ShaderMaterial).uniforms.uPower!.value).toBe(0.4);
    effects[1]!.visible = false; glow.sync(null, 0.4, effects);
    expect(overlays[1]!.visible).toBe(false);
    const dispose = vi.spyOn(overlays[0]!.material as ShaderMaterial, 'dispose');
    sources[0]!.removeFromParent(); glow.sync(null, 0, effects);
    expect(dispose).toHaveBeenCalledTimes(1);
    expect(overlays[0]!.parent).toBeNull();
    for (const overlay of overlays.slice(1)) expect(overlay.visible).toBe(false);
    glow.dispose(); expect(dispose).toHaveBeenCalledTimes(1);
    geometry.dispose(); material.dispose(); texture.dispose();
  });

  it('bám geometry/UV gốc, chỉ sáng sprite chọn, reset không sửa material/texture và dispose không thu tài nguyên gốc', () => {
    const root = new Group(), character = new Group(), texture = new Texture();
    texture.image = { width: 2048, height: 1024 };
    const geometry = new PlaneGeometry(1, 1), material = new MeshBasicMaterial({ map: texture });
    const source = new Mesh(geometry, material);
    character.add(source); root.add(character);
    const originals = [geometry, material, texture].map((object) => vi.spyOn(object, 'dispose'));
    const glow = new PlayerSkillGlow(root);
    glow.sync(character, 1);
    const overlay = source.getObjectByName('nine-dragons-character-glow') as Mesh;
    expect(overlay.geometry).toBe(geometry);
    expect(source.material).toBe(material); expect(material.map).toBe(texture);
    const dispose = vi.spyOn(overlay.material as ShaderMaterial, 'dispose');
    glow.sync(character, 0.5); expect(source.children).toHaveLength(1);
    glow.sync(null, 0); expect(overlay.visible).toBe(false);
    character.removeFromParent(); glow.sync(null, 0);
    expect(dispose).toHaveBeenCalledTimes(1); expect(source.children).toHaveLength(0);
    glow.dispose(); glow.dispose();
    for (const spy of originals) expect(spy).not.toHaveBeenCalled();
    geometry.dispose(); material.dispose(); texture.dispose();
  });
});
