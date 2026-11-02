import { readFileSync } from 'node:fs';
import { LinearFilter, NearestFilter, SRGBColorSpace, Texture } from 'three';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SpriteSheetLoader, parseSpriteSheet } from '../src/animation/SpriteSheetLoader';
import type { LoadedSpriteSheet } from '../src/animation/SpriteSheetLoader';
import { Player } from '../src/entities/Player';

const metadata = JSON.parse(readFileSync(new URL('../public/assets/characters/ninja/development-animations.json', import.meta.url), 'utf8'));
const makeTexture = (): Texture => {
  const texture = new Texture();
  texture.image = { width: 384, height: 560 };
  return texture;
};
const makeSheet = (): LoadedSpriteSheet => ({
  ...parseSpriteSheet(metadata), texture: makeTexture(), imageWidth: 384, imageHeight: 560,
});
const response = (value: unknown = metadata): typeof fetch => async () => new Response(JSON.stringify(value));

afterEach(() => vi.unstubAllGlobals());

describe('hợp đồng atlas và tải tài nguyên', () => {
  it('không gọi fetch mặc định với this trỏ vào loader', async () => {
    const browserFetch = vi.fn(function (this: unknown) {
      expect(this).not.toBeInstanceOf(SpriteSheetLoader);
      return Promise.resolve(new Response(JSON.stringify(metadata)));
    });
    vi.stubGlobal('fetch', browserFetch);
    const loader = new SpriteSheetLoader(undefined, async () => makeTexture());
    const sheet = await loader.load('/animations.json');
    expect(browserFetch).toHaveBeenCalledOnce();
    sheet.texture.dispose();
  });

  it('đọc atlas thử nghiệm thật với năm clip và 17 frame có thông tin trim/pivot', () => {
    const sheet = parseSpriteSheet(metadata);
    expect(sheet.kind).toBe('development');
    expect(Object.keys(sheet.clips).slice(0, 5)).toEqual(['idle', 'run', 'jump', 'fall', 'land']);
    expect(Object.values(sheet.clips).slice(0, 5).flatMap((clip) => clip.frames)).toHaveLength(17);
    const frames = Object.values(sheet.clips).flatMap((clip) => clip.frames);
    expect(new Set(frames.map((frame) => frame.width)).size).toBeGreaterThan(1);
    for (const frame of frames) {
      expect(frame.pivot).toEqual({ x: 32, y: 72 });
      expect(frame.offsetY + frame.height).toBe(72);
    }
  });

  it('hỗ trợ chỉ số frame theo lưới và kích thước frame cấu hình', () => {
    const sheet = parseSpriteSheet({ ...metadata, clips: {
      idle: { frames: [0, 1, 6], fps: 5, loop: true },
    } });
    expect(sheet.clips.idle!.frames.map((frame) => [frame.x, frame.y, frame.width, frame.height]))
      .toEqual([[0, 0, 64, 80], [64, 0, 64, 80], [0, 80, 64, 80]]);
  });

  it.each(['nearest', 'linear'] as const)('áp dụng bộ lọc %s và URL tương đối', async (filter) => {
    const texture = makeTexture();
    const load = vi.fn(async () => texture);
    const loader = new SpriteSheetLoader(response({ ...metadata, filter }), load, 'https://game.example/demo/');
    const sheet = await loader.load('assets/ninja/animations.json');
    expect(load).toHaveBeenCalledWith('https://game.example/demo/assets/ninja/ninja-atlas.png');
    expect(texture.magFilter).toBe(filter === 'nearest' ? NearestFilter : LinearFilter);
    expect(texture.minFilter).toBe(texture.magFilter);
    expect(texture.generateMipmaps).toBe(false);
    expect(texture.colorSpace).toBe(SRGBColorSpace);
    sheet.texture.dispose();
  });

  it('báo lỗi khi metadata không tồn tại hoặc PNG không tải được', async () => {
    const imageLoader = vi.fn(async () => makeTexture());
    const missing = new SpriteSheetLoader(async () => new Response('', { status: 404 }), imageLoader);
    await expect(missing.load('/missing.json')).rejects.toThrow('404');
    expect(imageLoader).not.toHaveBeenCalled();
    const brokenImage = new SpriteSheetLoader(response(), async () => { throw new Error('PNG không tồn tại'); });
    await expect(brokenImage.load('/animations.json')).rejects.toThrow('PNG không tồn tại');
  });

  it('từ chối metadata lỗi trước khi tải texture', async () => {
    const imageLoader = vi.fn(async () => makeTexture());
    const invalid = new SpriteSheetLoader(response({ ...metadata, clips: {
      idle: { frames: [0], fps: 0, loop: true },
    } }), imageLoader);
    await expect(invalid.load('/animations.json')).rejects.toThrow();
    expect(imageLoader).not.toHaveBeenCalled();
    expect(() => parseSpriteSheet({ ...metadata, columns: 0 })).toThrow();
    expect(() => parseSpriteSheet({ ...metadata, clips: {
      idle: { frames: [{ x: 0, y: 0, width: 1000 }], fps: 5, loop: true },
    } })).toThrow();
  });

  it('giải phóng texture nếu kích thước ảnh không chứa được frame', async () => {
    const texture = makeTexture();
    texture.image = { width: 1, height: 1 };
    const dispose = vi.spyOn(texture, 'dispose');
    const loader = new SpriteSheetLoader(response(), async () => texture);
    await expect(loader.load('/animations.json')).rejects.toThrow('PNG');
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  it('giải phóng ảnh trả về muộn sau khi yêu cầu bị hủy', async () => {
    const abort = new AbortController();
    const texture = makeTexture();
    const dispose = vi.spyOn(texture, 'dispose');
    const loader = new SpriteSheetLoader(response(), async () => {
      abort.abort();
      return texture;
    });
    await expect(loader.load('/animations.json', abort.signal)).rejects.toThrow();
    expect(dispose).toHaveBeenCalledTimes(1);
  });
});

describe('fallback và lifecycle của sprite nhân vật', () => {
  it('giữ placeholder và hoạt động nhảy khi tài nguyên không có', async () => {
    const player = new Player();
    await player.loadSprite({ load: async () => { throw new Error('Không có asset'); } });
    expect(player.spriteStatus).toBe('fallback');
    expect(player.spriteError).toBe('Không có asset');
    expect(player.visual.getObjectByName('player-placeholder')?.visible).toBe(true);
    player.body.isGrounded = true;
    expect(player.jump()).toBe(true);
    expect(player.body.width).toBe(0.8);
    expect(player.body.height).toBe(1.6);
    player.dispose();
  });

  it('đổi sang sprite sau tải thành công mà không thay đổi vị trí hoặc collider', async () => {
    const player = new Player();
    player.setPosition(5, 2);
    const before = structuredClone(player.body);
    const sheet = makeSheet();
    const dispose = vi.spyOn(sheet.texture, 'dispose');
    await player.loadSprite({ load: async () => sheet });
    expect(player.spriteStatus).toBe('development');
    expect(player.visual.getObjectByName('player-placeholder')?.visible).toBe(false);
    expect(player.body).toEqual(before);
    expect(dispose).not.toHaveBeenCalled();
    player.dispose();
    player.dispose();
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  it('quay về placeholder nếu atlas thiếu clip bắt buộc', async () => {
    const player = new Player();
    const sheet = makeSheet();
    const dispose = vi.spyOn(sheet.texture, 'dispose');
    await player.loadSprite({ load: async () => ({ ...sheet, clips: { idle: sheet.clips.idle! } }) });
    expect(player.spriteStatus).toBe('fallback');
    expect(player.visual.children.filter((child) => child !== player.attack.visual && child !== player.shuriken.visual)).toHaveLength(1);
    expect(dispose).toHaveBeenCalledTimes(1);
    player.dispose();
  });

  it('không gắn sprite và không rò texture khi player đã dispose trong lúc tải', async () => {
    const player = new Player();
    const sheet = makeSheet();
    const dispose = vi.spyOn(sheet.texture, 'dispose');
    let finish!: (sheet: LoadedSpriteSheet) => void;
    const pending = player.loadSprite({ load: () => new Promise((resolve) => { finish = resolve; }) });
    expect(player.spriteStatus).toBe('loading');
    player.dispose();
    finish(sheet);
    await pending;
    expect(dispose).toHaveBeenCalledTimes(1);
    expect(player.visual.children).toHaveLength(0);
  });

  it('bỏ kết quả tải cũ khi có yêu cầu mới hoàn tất trước', async () => {
    const player = new Player();
    const oldSheet = makeSheet();
    const oldDispose = vi.spyOn(oldSheet.texture, 'dispose');
    let finish!: (sheet: LoadedSpriteSheet) => void;
    const oldRequest = player.loadSprite({ load: () => new Promise((resolve) => { finish = resolve; }) });
    const currentSheet = makeSheet();
    const currentDispose = vi.spyOn(currentSheet.texture, 'dispose');
    await player.loadSprite({ load: async () => ({ ...currentSheet, kind: 'production' }) });
    finish(oldSheet);
    await oldRequest;
    expect(player.spriteStatus).toBe('production');
    expect(oldDispose).toHaveBeenCalledTimes(1);
    expect(currentDispose).not.toHaveBeenCalled();
    player.dispose();
    expect(currentDispose).toHaveBeenCalledTimes(1);
  });
});
