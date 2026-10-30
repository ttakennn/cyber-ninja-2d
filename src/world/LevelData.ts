import type { AABB, ClimbableZone, Vector2 } from '../physics/Collision';
import { parseTilemapData } from './TilemapData';
import type { TilemapData } from './TilemapData';

export interface LevelSolid extends AABB {
  readonly id: string;
}

export interface CameraBounds {
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
}

export type LevelVisual = Readonly<{
  shapeId: string;
  color: number;
  opacity: number;
}> & (Readonly<{ kind: 'rectangle' }> | Readonly<{ kind: 'ladder'; rungSpacing: number; structureOpacity: number }>);

export interface LevelData {
  readonly version: 1;
  readonly id: string;
  readonly spawn: Readonly<Vector2>;
  readonly solids: readonly LevelSolid[];
  readonly climbables: readonly ClimbableZone[];
  readonly visuals: readonly LevelVisual[];
  readonly tilemap?: TilemapData;
  readonly cameraBounds?: CameraBounds;
  readonly cameraFollowY?: boolean;
  readonly deathY?: number;
}

function fail(path: string, message: string): never {
  throw new Error(`Dữ liệu level không hợp lệ: ${path} ${message}`);
}

function object(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(path, 'phải là object');
  return value as Record<string, unknown>;
}

function list(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) fail(path, 'phải là mảng');
  return value;
}

function text(value: unknown, path: string): string {
  if (typeof value !== 'string' || !value.trim()) fail(path, 'phải là chuỗi không rỗng');
  return value;
}

function finite(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) fail(path, 'phải là số hữu hạn');
  return value;
}

function position(value: unknown, path: string): Vector2 {
  const point = object(value, path);
  return { x: finite(point.x, `${path}.x`), y: finite(point.y, `${path}.y`) };
}

function rectangle(value: unknown, path: string): LevelSolid {
  const data = object(value, path);
  const result = {
    id: text(data.id, `${path}.id`), position: position(data.position, `${path}.position`),
    width: finite(data.width, `${path}.width`), height: finite(data.height, `${path}.height`),
  };
  if (result.width <= 0) fail(`${path}.width`, 'phải lớn hơn 0');
  if (result.height <= 0) fail(`${path}.height`, 'phải lớn hơn 0');
  if (![result.position.x - result.width / 2, result.position.x + result.width / 2,
    result.position.y - result.height / 2, result.position.y + result.height / 2].every(Number.isFinite)) {
    fail(path, 'có biên hình chữ nhật vượt phạm vi số hữu hạn');
  }
  return result;
}

function color(value: unknown, path: string): number {
  if (typeof value === 'string' && /^#[\da-f]{6}$/i.test(value)) return Number.parseInt(value.slice(1), 16);
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 0xffffff) return value;
  return fail(path, 'phải là #RRGGBB hoặc số nguyên 0..16777215');
}

export function parseLevelData(value: unknown): LevelData {
  const data = object(value, 'level');
  if (data.version !== 1) fail('version', 'phải bằng 1');
  const id = text(data.id, 'id');
  const spawn = position(data.spawn, 'spawn');
  let cameraBounds: CameraBounds | undefined;
  if (data.cameraBounds !== undefined) {
    const bounds = object(data.cameraBounds, 'cameraBounds');
    cameraBounds = {
      minX: finite(bounds.minX, 'cameraBounds.minX'), maxX: finite(bounds.maxX, 'cameraBounds.maxX'),
      minY: finite(bounds.minY, 'cameraBounds.minY'), maxY: finite(bounds.maxY, 'cameraBounds.maxY'),
    };
    if (cameraBounds.minX >= cameraBounds.maxX || !Number.isFinite(cameraBounds.maxX - cameraBounds.minX)) fail('cameraBounds', 'cần minX < maxX và chiều rộng hữu hạn');
    if (cameraBounds.minY >= cameraBounds.maxY || !Number.isFinite(cameraBounds.maxY - cameraBounds.minY)) fail('cameraBounds', 'cần minY < maxY và chiều cao hữu hạn');
    if (spawn.x < cameraBounds.minX || spawn.x > cameraBounds.maxX || spawn.y < cameraBounds.minY || spawn.y > cameraBounds.maxY) {
      fail('spawn', 'phải nằm trong cameraBounds');
    }
  }
  if (data.cameraFollowY !== undefined && typeof data.cameraFollowY !== 'boolean') fail('cameraFollowY', 'phải là boolean');
  const deathY = data.deathY === undefined ? undefined : finite(data.deathY, 'deathY');
  if (deathY !== undefined && deathY >= spawn.y) fail('deathY', 'phải thấp hơn tâm spawn để tránh hồi sinh lặp');
  const solids = list(data.solids, 'solids').map((value, index) => rectangle(value, `solids[${index}]`));
  const climbables = list(data.climbables, 'climbables').map((value, index): ClimbableZone => {
    const path = `climbables[${index}]`;
    const zone = object(value, path);
    if (zone.kind !== 'ladder' && zone.kind !== 'scaffolding') fail(`${path}.kind`, 'phải là ladder hoặc scaffolding');
    return { ...rectangle(value, path), kind: zone.kind };
  });
  const shapes = new Map<string, AABB>();
  for (const shape of [...solids, ...climbables]) {
    if (shapes.has(shape.id)) fail('id', `bị trùng: ${shape.id}`);
    shapes.set(shape.id, shape);
  }
  const visuals = list(data.visuals, 'visuals').map((value, index): LevelVisual => {
    const path = `visuals[${index}]`;
    const visual = object(value, path);
    const shapeId = text(visual.shapeId, `${path}.shapeId`);
    const shape = shapes.get(shapeId);
    if (!shape) fail(`${path}.shapeId`, `không tồn tại: ${shapeId}`);
    const kind = visual.kind;
    if (kind !== 'rectangle' && kind !== 'ladder') fail(`${path}.kind`, 'phải là rectangle hoặc ladder');
    const opacity = visual.opacity === undefined ? 1 : finite(visual.opacity, `${path}.opacity`);
    if (opacity < 0 || opacity > 1) fail(`${path}.opacity`, 'phải nằm trong 0..1');
    const base = { shapeId, color: color(visual.color, `${path}.color`), opacity };
    if (kind === 'rectangle') return { ...base, kind };
    if (!climbables.some((zone) => zone.id === shapeId)) fail(`${path}.shapeId`, 'phải tham chiếu vùng leo khi vẽ ladder');
    const rungSpacing = visual.rungSpacing === undefined ? 0.4 : finite(visual.rungSpacing, `${path}.rungSpacing`);
    if (rungSpacing <= 0) fail(`${path}.rungSpacing`, 'phải lớn hơn 0');
    if (Math.ceil(Math.max(0, shape.height - 0.2) / rungSpacing) > 4096) fail(path, 'vượt giới hạn 4096 bậc thang');
    // opacity giữ nghĩa nền vùng leo của Task 005; ray/bậc có opacity riêng.
    const structureOpacity = visual.structureOpacity === undefined ? 1 : finite(visual.structureOpacity, `${path}.structureOpacity`);
    if (structureOpacity < 0 || structureOpacity > 1) fail(`${path}.structureOpacity`, 'phải nằm trong 0..1');
    return { ...base, kind, rungSpacing, structureOpacity };
  });
  return { version: 1, id, spawn, solids, climbables, visuals,
    ...(cameraBounds === undefined ? {} : { cameraBounds }),
    ...(data.cameraFollowY === undefined ? {} : { cameraFollowY: data.cameraFollowY as boolean }),
    ...(deathY === undefined ? {} : { deathY }),
    ...(data.tilemap === undefined ? {} : { tilemap: parseTilemapData(data.tilemap) }) };
}
