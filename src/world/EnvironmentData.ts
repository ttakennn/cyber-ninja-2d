import type { Vector2 } from '../physics/Collision';

interface EnvironmentImage {
  readonly id: string;
  readonly image: string;
  readonly pixelSize: readonly [number, number];
  readonly z: number;
}

export interface EnvironmentBackground extends EnvironmentImage {
  readonly parallaxX: number;
  readonly parallaxY: number;
  readonly repeatX: boolean;
  readonly worldHeight: number;
  readonly bottomOffset: number;
  readonly verticalAnchor?: 'camera' | 'world';
  readonly worldBottom?: number;
}

export interface EnvironmentDecoration extends EnvironmentImage {
  readonly worldPosition: Readonly<Vector2>;
  readonly worldSize: Readonly<{ width: number; height: number }>;
  readonly anchor: Readonly<{ x: 0.5; y: 1 }>;
  readonly collision: false;
  readonly layer?: 'background' | 'behind-player' | 'foreground';
  readonly parallaxX?: number;
  readonly ledBorder?: Readonly<{ colors: readonly [number, number]; period: number }>;
  readonly sourceRect?: Readonly<{ x: number; y: number; width: number; height: number }>;
}

export interface EnvironmentData {
  readonly backgrounds: readonly EnvironmentBackground[];
  readonly decorations: readonly EnvironmentDecoration[];
}

function fail(path: string, message: string): never {
  throw new Error(`Dữ liệu level không hợp lệ: ${path} ${message}`);
}

function object(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(path, 'phải là object');
  return value as Record<string, unknown>;
}

function number(value: unknown, path: string, min = -Infinity, max = Infinity): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) fail(path, `phải là số hữu hạn trong ${min}..${max}`);
  return value;
}

function image(value: Record<string, unknown>, path: string, ids: Set<string>, dimensions: Map<string, string>): EnvironmentImage {
  if (typeof value.id !== 'string' || !value.id.trim()) fail(`${path}.id`, 'phải là chuỗi không rỗng');
  if (ids.has(value.id)) fail(`${path}.id`, `bị trùng: ${value.id}`);
  ids.add(value.id);
  if (typeof value.image !== 'string' || !value.image.trim()) fail(`${path}.image`, 'phải là đường dẫn ảnh không rỗng');
  if (!Array.isArray(value.pixelSize) || value.pixelSize.length !== 2) fail(`${path}.pixelSize`, 'phải có [width, height] pixel');
  const pixelSize: [number, number] = [number(value.pixelSize[0], `${path}.pixelSize[0]`, 1), number(value.pixelSize[1], `${path}.pixelSize[1]`, 1)];
  if (!pixelSize.every(Number.isSafeInteger)) fail(`${path}.pixelSize`, 'phải là số nguyên dương an toàn');
  const declared = `${pixelSize[0]}x${pixelSize[1]}`;
  if (dimensions.has(value.image) && dimensions.get(value.image) !== declared) fail(`${path}.pixelSize`, 'không nhất quán với cùng đường dẫn ảnh');
  dimensions.set(value.image, declared);
  const z = number(value.z, `${path}.z`);
  if (z <= -90 || z >= 10) fail(`${path}.z`, 'phải nằm giữa -90 và 10 để ở trong frustum');
  return { id: value.id, image: value.image, pixelSize, z };
}

export function parseEnvironmentData(value: unknown): EnvironmentData {
  const data = object(value, 'environment');
  if (!Array.isArray(data.backgrounds) || data.backgrounds.length > 8) fail('environment.backgrounds', 'phải là mảng tối đa 8 layer');
  if (!Array.isArray(data.decorations) || data.decorations.length > 256) fail('environment.decorations', 'phải là mảng tối đa 256 vật trang trí');
  const ids = new Set<string>();
  const dimensions = new Map<string, string>();
  let previousZ = -90;
  const backgrounds = Array.from(data.backgrounds, (entry, index): EnvironmentBackground => {
    const path = `environment.backgrounds[${index}]`;
    const layer = object(entry, path);
    const base = image(layer, path, ids, dimensions);
    if (base.z >= -1 || base.z <= previousZ) fail(`${path}.z`, 'background phải tăng từ sau ra trước và ở sau terrain (Z < -1)');
    previousZ = base.z;
    const parallaxX = number(layer.parallaxX, `${path}.parallaxX`, 0, 1);
    const parallaxY = number(layer.parallaxY, `${path}.parallaxY`, 0, 1);
    if (typeof layer.repeatX !== 'boolean') fail(`${path}.repeatX`, 'phải là boolean');
    if (!layer.repeatX && (parallaxX !== 0 || parallaxY !== 0)) fail(path, 'ảnh cover không lặp phải cố định theo camera (parallax bằng 0)');
    const worldHeight = number(layer.worldHeight, `${path}.worldHeight`, Number.MIN_VALUE);
    const bottomOffset = layer.bottomOffset === undefined ? 0 : number(layer.bottomOffset, `${path}.bottomOffset`);
    if (!layer.repeatX && bottomOffset !== 0) fail(`${path}.bottomOffset`, 'ảnh cover cố định dùng offset bằng 0');
    const verticalAnchor = layer.verticalAnchor;
    if (verticalAnchor !== undefined && verticalAnchor !== 'camera' && verticalAnchor !== 'world') fail(`${path}.verticalAnchor`, 'phải là camera hoặc world');
    if (verticalAnchor === 'world' && !layer.repeatX) fail(`${path}.verticalAnchor`, 'world chỉ dùng cho layer lặp ngang');
    const worldBottom = verticalAnchor === 'world' ? number(layer.worldBottom, `${path}.worldBottom`) : undefined;
    if (verticalAnchor !== 'world' && layer.worldBottom !== undefined) fail(`${path}.worldBottom`, 'chỉ dùng với verticalAnchor world');
    if (verticalAnchor === 'world' && (parallaxY !== 0 || bottomOffset !== 0)) fail(path, 'world không dùng parallaxY hoặc bottomOffset');
    if (!Number.isFinite(worldHeight * base.pixelSize[0] / base.pixelSize[1])) fail(`${path}.worldHeight`, 'làm chiều rộng ảnh tràn số');
    return { ...base, parallaxX, parallaxY, repeatX: layer.repeatX, worldHeight, bottomOffset,
      ...(verticalAnchor === undefined ? {} : { verticalAnchor }), ...(worldBottom === undefined ? {} : { worldBottom }) };
  });
  const decorations = Array.from(data.decorations, (entry, index): EnvironmentDecoration => {
    const path = `environment.decorations[${index}]`;
    const prop = object(entry, path);
    const base = image(prop, path, ids, dimensions);
    if (prop.layer !== undefined && prop.layer !== 'background' && prop.layer !== 'behind-player' && prop.layer !== 'foreground') fail(`${path}.layer`, 'phải là background, behind-player hoặc foreground');
    if (prop.layer === 'background' ? base.z >= -1 : prop.layer === 'foreground' ? base.z <= 1 || base.z >= 9 : base.z <= -0.45 || base.z >= 0) fail(`${path}.z`, 'background cần Z < -1; behind-player cần -0.45 < Z < 0; foreground cần 1 < Z < 9');
    if (prop.parallaxX !== undefined && prop.layer !== 'background') fail(`${path}.parallaxX`, 'chỉ dùng với lớp background');
    const parallaxX = prop.parallaxX === undefined ? undefined : number(prop.parallaxX, `${path}.parallaxX`, 0, 1);
    if (prop.collision !== false) fail(`${path}.collision`, 'phải bằng false, collider khai báo riêng');
    const point = object(prop.worldPosition, `${path}.worldPosition`);
    const worldPosition = { x: number(point.x, `${path}.worldPosition.x`), y: number(point.y, `${path}.worldPosition.y`) };
    const size = object(prop.worldSize, `${path}.worldSize`);
    const worldSize = { width: number(size.width, `${path}.worldSize.width`, Number.MIN_VALUE), height: number(size.height, `${path}.worldSize.height`, Number.MIN_VALUE) };
    const anchor = object(prop.anchor, `${path}.anchor`);
    if (anchor.x !== 0.5 || anchor.y !== 1) fail(`${path}.anchor`, 'pilot dùng bottom-center (x=0.5, y=1)');
    if (![worldPosition.x - worldSize.width / 2, worldPosition.x + worldSize.width / 2, worldPosition.y + worldSize.height].every(Number.isFinite)) fail(path, 'biên vật trang trí tràn số');
    let sourceRect: EnvironmentDecoration['sourceRect'];
    if (prop.sourceRect !== undefined) {
      const rect = object(prop.sourceRect, `${path}.sourceRect`);
      sourceRect = { x: number(rect.x, `${path}.sourceRect.x`, 0), y: number(rect.y, `${path}.sourceRect.y`, 0),
        width: number(rect.width, `${path}.sourceRect.width`, Number.MIN_VALUE), height: number(rect.height, `${path}.sourceRect.height`, Number.MIN_VALUE) };
      if (sourceRect.x + sourceRect.width > base.pixelSize[0] || sourceRect.y + sourceRect.height > base.pixelSize[1]) fail(`${path}.sourceRect`, 'vượt kích thước ảnh');
    }
    let ledBorder: EnvironmentDecoration['ledBorder'];
    if (prop.ledBorder !== undefined) {
      const led = object(prop.ledBorder, `${path}.ledBorder`);
      if (!Array.isArray(led.colors) || led.colors.length !== 2) fail(`${path}.ledBorder.colors`, 'cần hai màu #RRGGBB');
      const colors = led.colors.map((color, index) => {
        if (typeof color !== 'string' || !/^#[0-9a-f]{6}$/i.test(color)) fail(`${path}.ledBorder.colors[${index}]`, 'cần màu #RRGGBB');
        return Number.parseInt(color.slice(1), 16);
      }) as [number, number];
      ledBorder = { colors, period: number(led.period, `${path}.ledBorder.period`, 0.1, 10) };
    }
    return { ...base, worldPosition, worldSize, anchor: { x: 0.5, y: 1 }, collision: false,
      ...(sourceRect === undefined ? {} : { sourceRect }),
      ...(parallaxX === undefined ? {} : { parallaxX }),
      ...(ledBorder === undefined ? {} : { ledBorder }),
      ...(prop.layer === undefined ? {} : { layer: prop.layer }) };
  });
  return { backgrounds, decorations };
}
