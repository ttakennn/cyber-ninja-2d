import { LinearFilter, NearestFilter, SRGBColorSpace, TextureLoader } from 'three';
import type { Texture } from 'three';
import type { AnimationClips, SpriteFrame } from './AnimationClip';

export interface SpriteVisualConfig {
  readonly width: number;
  readonly height: number;
  readonly offset: Readonly<{ x: number; y: number }>;
  readonly scale: Readonly<{ x: number; y: number }>;
  readonly anchor: Readonly<{ x: number; y: number }>;
}

export interface SpriteSheetDefinition {
  readonly image: string;
  readonly kind: 'development' | 'production';
  readonly filter: 'nearest' | 'linear';
  readonly visual: SpriteVisualConfig;
  readonly clips: AnimationClips;
}

export interface LoadedSpriteSheet extends SpriteSheetDefinition {
  readonly texture: Texture;
  readonly imageWidth: number;
  readonly imageHeight: number;
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Metadata phải là object');
  return value as Record<string, unknown>;
}

function number(value: unknown, min: number, fallback?: number): number {
  const result = value === undefined ? fallback : value;
  if (typeof result !== 'number' || !Number.isFinite(result) || result < min) {
    throw new Error('Giá trị số trong metadata không hợp lệ');
  }
  return result;
}

function point(value: unknown, x: number, y: number, min: number): { x: number; y: number } {
  const data = value === undefined ? {} : object(value);
  return { x: number(data.x, min, x), y: number(data.y, min, y) };
}

export function parseSpriteSheet(value: unknown): SpriteSheetDefinition {
  const data = object(value);
  if (data.version !== 1 || typeof data.image !== 'string' || !data.image.trim() ||
    !['development', 'production'].includes(String(data.kind)) ||
    !['nearest', 'linear'].includes(String(data.filter))) throw new Error('Định dạng atlas không hợp lệ');
  const frameWidth = number(data.frameWidth, 1);
  const frameHeight = number(data.frameHeight, 1);
  const columns = number(data.columns, 1);
  if (![frameWidth, frameHeight, columns].every(Number.isInteger)) throw new Error('Kích thước lưới phải là số nguyên');
  const visual = object(data.visual);
  const anchor = point(visual.anchor, 0.5, 0, 0);
  if (anchor.x > 1 || anchor.y > 1) throw new Error('Anchor phải nằm trong khoảng 0..1');
  const definitions = object(data.clips);
  const clips: Record<string, AnimationClips[string]> = Object.create(null);

  for (const [name, value] of Object.entries(definitions)) {
    const clip = object(value);
    if (!name || typeof clip.loop !== 'boolean' || !Array.isArray(clip.frames) || !clip.frames.length) {
      throw new Error(`Clip không hợp lệ: ${name}`);
    }
    const frames: SpriteFrame[] = clip.frames.map((entry: unknown) => {
      const indexed = typeof entry === 'number';
      if (indexed && (!Number.isInteger(entry) || entry < 0)) throw new Error('Chỉ số frame không hợp lệ');
      const frame: Record<string, unknown> = indexed ? { x: entry % columns * frameWidth, y: Math.floor(entry / columns) * frameHeight } : object(entry);
      const width = number(frame.width, 1, frameWidth);
      const height = number(frame.height, 1, frameHeight);
      const sourceWidth = number(frame.sourceWidth, 1, frameWidth);
      const sourceHeight = number(frame.sourceHeight, 1, frameHeight);
      const offsetX = number(frame.offsetX, 0, 0);
      const offsetY = number(frame.offsetY, 0, 0);
      const x = number(frame.x, 0);
      const y = number(frame.y, 0);
      if (![x, y, width, height, sourceWidth, sourceHeight, offsetX, offsetY].every(Number.isInteger) ||
        offsetX + width > sourceWidth || offsetY + height > sourceHeight) throw new Error('Vùng cắt frame không hợp lệ');
      const pivot = frame.pivot === undefined ? undefined : point(frame.pivot, sourceWidth / 2, sourceHeight, 0);
      if (pivot && (pivot.x > sourceWidth || pivot.y > sourceHeight)) throw new Error('Pivot vượt kích thước nguồn');
      return { x, y, width, height, sourceWidth, sourceHeight, offsetX, offsetY, pivot };
    });
    clips[name] = {
      name, frames, fps: number(clip.fps, Number.MIN_VALUE), loop: clip.loop,
      speed: number(clip.speed, Number.MIN_VALUE, 1),
    };
  }
  if (!Object.keys(clips).length) throw new Error('Atlas không có animation');
  return {
    image: data.image,
    kind: data.kind as SpriteSheetDefinition['kind'],
    filter: data.filter as SpriteSheetDefinition['filter'],
    visual: {
      width: number(visual.width, Number.MIN_VALUE), height: number(visual.height, Number.MIN_VALUE),
      offset: point(visual.offset, 0, 0, -Infinity),
      scale: point(visual.scale, 1, 1, Number.MIN_VALUE), anchor,
    },
    clips,
  };
}

export class SpriteSheetLoader {
  constructor(
    private readonly fetchMetadata: typeof fetch = (input, init) => fetch(input, init),
    private readonly loadTexture: (url: string) => Promise<Texture> = (url) => new TextureLoader().loadAsync(url),
    private readonly baseUrl = typeof document === 'undefined' ? 'http://localhost/' : document.baseURI,
  ) {}

  async load(metadataUrl: string, signal?: AbortSignal): Promise<LoadedSpriteSheet> {
    const url = new URL(metadataUrl, this.baseUrl);
    const response = await this.fetchMetadata(url.href, { signal });
    if (!response.ok) throw new Error(`Không tải được metadata (${response.status})`);
    const sheet = parseSpriteSheet(await response.json());
    signal?.throwIfAborted();
    const texture = await this.loadTexture(new URL(sheet.image, url).href);
    try {
      // TextureLoader không hủy được ảnh đang tải: giải phóng ngay nếu lifecycle đã kết thúc.
      signal?.throwIfAborted();
      const image = texture.image as { width: number; height: number };
      const imageWidth = number(image?.width, 1);
      const imageHeight = number(image?.height, 1);
      for (const clip of Object.values(sheet.clips)) {
        for (const frame of clip.frames) {
          if (frame.x + frame.width > imageWidth || frame.y + frame.height > imageHeight) {
            throw new Error(`Frame vượt kích thước PNG: ${clip.name}`);
          }
        }
      }
      texture.colorSpace = SRGBColorSpace;
      texture.magFilter = sheet.filter === 'nearest' ? NearestFilter : LinearFilter;
      texture.minFilter = texture.magFilter;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
      return { ...sheet, texture, imageWidth, imageHeight };
    } catch (error) {
      texture.dispose();
      throw error;
    }
  }
}
