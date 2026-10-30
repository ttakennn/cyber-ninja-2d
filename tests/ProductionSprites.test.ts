import { readFileSync } from 'node:fs';
import { Group, Mesh, Texture } from 'three';
import { afterEach, describe, expect, it } from 'vitest';
import { parseSpriteSheet, SpriteSheetLoader } from '../src/animation/SpriteSheetLoader';
import { gameConfig } from '../src/config/game.config';
import { Player } from '../src/entities/Player';
import { PlayerAnimator } from '../src/entities/PlayerAnimator';
import { SpriteRenderer } from '../src/rendering/SpriteRenderer';
import { dt, floor, ladder, noInput } from './movement.fixtures';
import { PhysicsWorld } from '../src/physics/PhysicsWorld';

const metadataUrl = new URL(`../public/${gameConfig.player.spriteMetadata}`, import.meta.url);
const metadata = JSON.parse(readFileSync(metadataUrl, 'utf8'));
const sheet = parseSpriteSheet(metadata);
const png = readFileSync(new URL(sheet.image, metadataUrl));
const imageWidth = png.readUInt32BE(16);
const imageHeight = png.readUInt32BE(20);
const required = ['idle', 'run', 'jump', 'fall', 'land', 'crouch', 'climbUp', 'climbDown'];
const climbing = { mode: 'climbing', stance: 'standing' } as const;
const players: Player[] = [];

function body(velocityY = 0) {
  return { position: { x: 0, y: 2 }, velocity: { x: 0, y: velocityY }, width: 0.8, height: 1.6, isGrounded: false };
}

function texture(): Texture {
  const result = new Texture();
  result.image = { width: imageWidth, height: imageHeight };
  return result;
}

async function player(): Promise<Player> {
  const result = new Player();
  players.push(result);
  await result.loadSprite({ load: async () => ({ ...sheet, texture: texture(), imageWidth, imageHeight }) });
  return result;
}

afterEach(() => {
  for (const player of players) player.dispose();
  players.length = 0;
});

describe('atlas production tại đúng đường dẫn runtime', () => {
  it('đọc PNG RGBA đúng kích thước và đủ tám clip cần tích hợp', () => {
    expect(sheet.kind).toBe('production');
    expect(sheet.image).toBe('flame-ninja-atlas.png');
    expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    expect([imageWidth, imageHeight, png[24], png[25]]).toEqual([3136, 1968, 8, 6]);
    for (const name of required) expect(sheet.clips[name]?.frames.length).toBeGreaterThan(0);
    expect(sheet.clips.climbUp!.frames).toHaveLength(8);
    expect(sheet.clips.climbDown!.frames).toHaveLength(8);
    expect(sheet.clips.climbUp!.frames).not.toEqual(sheet.clips.climbDown!.frames);
    expect(sheet.clips.hurt).toBeDefined();
    expect(sheet.clips.crouchEnter).toBeDefined();
    expect(Object.keys(sheet.clips).some((name) => /attack/i.test(name))).toBe(false);
  });

  it('kiểm tra toàn bộ frame, gồm cả dữ liệu tùy chọn, không chỉ các file legacy', () => {
    for (const clip of Object.values(sheet.clips)) {
      expect(clip.frames.length).toBeGreaterThan(0);
      for (const frame of clip.frames) {
        expect([frame.width, frame.height, frame.sourceWidth, frame.sourceHeight]).toEqual([384, 320, 384, 320]);
        expect(frame.pivot).toEqual({ x: 192, y: 289 });
        expect(frame.x).toBeGreaterThanOrEqual(4);
        expect(frame.y).toBeGreaterThanOrEqual(4);
        expect(frame.x + frame.width + 4).toBeLessThanOrEqual(imageWidth);
        expect(frame.y + frame.height + 4).toBeLessThanOrEqual(imageHeight);
      }
    }
    expect(sheet.visual.width / 384 * sheet.visual.scale.x).toBeCloseTo(0.00625, 12);
    expect(sheet.visual.height / 320 * sheet.visual.scale.y).toBeCloseTo(0.00625, 12);
  });

  it('tải JSON cấu hình và giải PNG tương đối, giữ nguyên runtime validation', async () => {
    let imageUrl = '';
    const loader = new SpriteSheetLoader(async (url) => {
      expect(String(url)).toBe(`https://game.example/play/${gameConfig.player.spriteMetadata}`);
      return new Response(JSON.stringify(metadata));
    }, async (url) => {
      imageUrl = url;
      return texture();
    }, 'https://game.example/play/');
    const result = new Player();
    players.push(result);
    await result.loadSprite(loader);
    expect(imageUrl).toBe('https://game.example/play/assets/characters/ninja/flame-ninja-atlas.png');
    expect(result.spriteStatus).toBe('production');
    expect(result.spriteError).toBe('');
    expect(result.body.width).toBe(0.8);
    expect(result.body.height).toBe(1.6);
  });

  it('fallback an toàn nếu PNG production không có hoặc frame vượt ảnh', async () => {
    const result = new Player();
    players.push(result);
    await result.loadSprite(new SpriteSheetLoader(async () => new Response(JSON.stringify(metadata)), async () => {
      throw new Error('PNG thiếu');
    }));
    expect(result.spriteStatus).toBe('fallback');
    expect(result.visual.getObjectByName('player-placeholder')?.visible).toBe(true);
    const invalid = texture();
    invalid.image = { width: 100, height: 100 };
    const loader = new SpriteSheetLoader(async () => new Response(JSON.stringify(metadata)), async () => invalid);
    await expect(loader.load('/animations.json')).rejects.toThrow('PNG');
  });
});

describe('leo theo hai bộ pose thật', () => {
  it('chọn ClimbUp/ClimbDown từ vận tốc thực, không dùng Up đảo chiều', () => {
    const animator = new PlayerAnimator(sheet.clips);
    const state = body(2.8);
    animator.update(dt, state, false, climbing);
    expect(animator.controller.name).toBe('climbUp');
    state.velocity.y = -2.8;
    animator.update(dt, state, false, climbing);
    expect(animator.controller.name).toBe('climbDown');
    expect(sheet.clips.climbDown!.frames).toContain(animator.controller.frame);
    expect(sheet.clips.climbUp!.frames).not.toContain(animator.controller.frame);
  });

  it.each([1, -1])('nhả phím giữ nguyên clip và frame đang leo theo hướng %s', (direction) => {
    const animator = new PlayerAnimator(sheet.clips);
    const state = body(direction);
    for (let step = 0; step < 30; step += 1) animator.update(dt, state, false, climbing);
    const frame = animator.controller.frame;
    const name = animator.controller.name;
    expect(animator.controller.frameIndex).toBe(5);
    state.velocity.y = direction * 1e-8;
    for (let step = 0; step < 120; step += 1) animator.update(dt, state, false, climbing);
    expect(animator.controller.frame).toBe(frame);
    expect(animator.controller.name).toBe(name);
    expect(animator.climbDirection).toBe('idle');
  });

  it('vào thang đứng yên chọn một pose leo rồi tiếp tục đúng hướng', () => {
    const animator = new PlayerAnimator(sheet.clips);
    const state = body();
    animator.update(dt, state, false, climbing);
    expect(animator.controller.name).toBe('climbUp');
    expect(animator.controller.frameIndex).toBe(0);
    state.velocity.y = -1;
    animator.update(dt, state, false, climbing);
    expect(animator.controller.name).toBe('climbDown');
    expect(animator.climbDirection).toBe('down');
  });

  it('tiến cùng số frame theo cùng quãng đường dù tốc độ leo khác nhau', () => {
    const indices = [0.5, 1, 2].map((speed) => {
      const animator = new PlayerAnimator(sheet.clips);
      const state = body(speed);
      const steps = 60 / speed;
      for (let step = 0; step < steps; step += 1) animator.update(dt, state, false, climbing);
      return animator.controller.frameIndex;
    });
    expect(indices).toEqual([2, 2, 2]);
  });

  it('không reset clip mỗi bước và không phát pose chuyển cúi/hurt ngoài phạm vi', () => {
    const animator = new PlayerAnimator(sheet.clips);
    const state = body(1);
    for (let step = 0; step < 18; step += 1) animator.update(dt, state, false, climbing);
    expect(animator.controller.frameIndex).toBe(3);
    state.isGrounded = true;
    state.velocity.y = 0;
    for (let step = 0; step < 60; step += 1) {
      animator.update(dt, state, false, { mode: 'grounded', stance: 'crouching' });
      expect(animator.controller.name).toBe('crouch');
      expect(sheet.clips.crouch!.frames).toContain(animator.controller.frame);
    }
  });

  it('thiếu clip theo hướng dùng generic climb; đổi atlas cũ trong lúc leo vẫn hợp lệ', () => {
    const legacy = Object.fromEntries(Object.entries(sheet.clips).filter(([name]) => name !== 'climbUp' && name !== 'climbDown'));
    const animator = new PlayerAnimator(legacy);
    const state = body(-2.8);
    animator.update(dt, state, false, climbing);
    expect(animator.controller.name).toBe('climb');
    animator.setClips(sheet.clips);
    animator.update(dt, state, false, climbing);
    expect(animator.controller.name).toBe('climbDown');
    animator.setClips(legacy);
    expect(animator.controller.name).toBe('climb');
  });

  it.each([-1, 1])('ngừng animation tại biên khi vẫn giữ hướng leo %s', async (direction) => {
    const result = await player();
    const world = new PhysicsWorld(-28, [floor], [ladder]);
    result.setPosition(0, 0.8);
    result.body.isGrounded = true;
    for (let step = 0; step < 300; step += 1) {
      const landed = result.updateMovement(world, dt, { ...noInput, enterClimb: step === 0, vertical: direction });
      result.updateAnimation(dt, landed);
    }
    expect(result.body.velocity.y).toBe(0);
    const frame = result.animator.controller.frame;
    const before = structuredClone(result.body);
    for (let step = 0; step < 60; step += 1) {
      const landed = result.updateMovement(world, dt, { ...noInput, vertical: direction });
      result.updateAnimation(dt, landed);
    }
    expect(result.animator.controller.frame).toBe(frame);
    expect(result.body).toEqual(before);
  });
});

describe('hướng vẽ, tỷ lệ nguồn và pivot chân', () => {
  it.each(['left', 'right'] as const)('leo không lật ảnh do facing %s, rời thang khôi phục hướng bên hông', async (facing) => {
    const result = await player();
    result.animator.facing = facing;
    const world = new PhysicsWorld(-28, [floor], [ladder]);
    result.setPosition(0, 0.8);
    result.body.isGrounded = true;
    let landed = result.updateMovement(world, dt, { ...noInput, enterClimb: true, vertical: 1 });
    result.updateAnimation(dt, landed);
    result.syncVisual(1);
    const group = result.visual.children[1] as Group;
    const mesh = group.children[0] as Mesh;
    const uv = mesh.geometry.getAttribute('uv');
    expect(result.animator.facing).toBe(facing);
    expect(result.animator.renderFacing).toBe('right');
    expect(uv.getX(0)).toBeLessThan(uv.getX(1));
    landed = result.updateMovement(world, dt, { ...noInput, detachJump: true });
    result.updateAnimation(dt, landed);
    result.syncVisual(1);
    expect(result.animator.controller.name).toBe('jump');
    expect(result.animator.renderFacing).toBe(facing);
    expect(uv.getX(0) < uv.getX(1)).toBe(facing === 'right');
  });

  it('mọi frame dùng cùng tỷ lệ và cùng điểm chân, không co giãn theo pose', () => {
    const renderer = new SpriteRenderer({ ...sheet, texture: texture(), imageWidth, imageHeight });
    const mesh = renderer.visual.children[0] as Mesh;
    const geometry = mesh.geometry;
    const material = mesh.material;
    for (const name of required) {
      for (const frame of sheet.clips[name]!.frames) {
        renderer.setFrame(frame, 'right');
        expect(mesh.scale.x).toBeCloseTo(2.4);
        expect(mesh.scale.y).toBe(2);
        const pivotX = mesh.position.x + (frame.pivot!.x - frame.width / 2) * 0.00625;
        const pivotY = mesh.position.y + (frame.height / 2 - frame.pivot!.y) * 0.00625;
        expect(pivotX).toBeCloseTo(0, 10);
        expect(pivotY).toBeCloseTo(0, 10);
        expect(mesh.geometry).toBe(geometry);
        expect(mesh.material).toBe(material);
      }
    }
    renderer.dispose();
  });

  it('cúi có pose thật không scale theo collider, nội suy vẫn giữ điểm chân', async () => {
    const result = await player();
    const world = new PhysicsWorld(-28, [floor]);
    result.setPosition(0, 0.8);
    result.body.isGrounded = true;
    const group = result.visual.children[1] as Group;
    const mesh = group.children[0] as Mesh;
    for (const crouch of [true, false, true, false]) {
      result.capturePreviousPosition();
      const landed = result.updateMovement(world, dt, { ...noInput, crouch });
      result.updateAnimation(dt, landed);
      const before = structuredClone(result.body);
      for (const alpha of [0, 0.5, 1]) {
        result.syncVisual(alpha);
        expect(group.scale.y).toBe(1);
        expect([mesh.scale.x, mesh.scale.y]).toEqual([2.4, 2]);
        expect(result.visual.position.y + group.position.y).toBeCloseTo(0, 10);
        expect(result.body).toEqual(before);
      }
      expect(result.body.width).toBe(0.8);
      expect(result.body.height).toBe(crouch ? 0.9 : 1.6);
      expect(result.animator.controller.name).toBe(crouch ? 'crouch' : 'idle');
    }
  });
});
