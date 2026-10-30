import type { Vector2 } from '../physics/Collision';

export interface TilesetData {
  readonly image: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly tileWidth: number;
  readonly tileHeight: number;
}

export interface TileLayerData {
  readonly id: string;
  readonly opacity: number;
  readonly tint?: number;
  readonly cells: readonly (readonly (number | null)[])[];
}

export interface TilemapData {
  readonly origin: Readonly<Vector2>;
  readonly columns: number;
  readonly rows: number;
  readonly tileSize: Readonly<{ width: number; height: number }>;
  readonly tileset: TilesetData;
  readonly layers: readonly TileLayerData[];
}

function fail(path: string, message: string): never {
  throw new Error(`Dữ liệu level không hợp lệ: ${path} ${message}`);
}

function object(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(path, 'phải là object');
  return value as Record<string, unknown>;
}

function finite(value: unknown, path: string, positive = false): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || (positive && value <= 0)) {
    fail(path, positive ? 'phải là số hữu hạn lớn hơn 0' : 'phải là số hữu hạn');
  }
  return value;
}

function integer(value: unknown, path: string): number {
  const result = finite(value, path, true);
  if (!Number.isSafeInteger(result)) fail(path, 'phải là số nguyên dương an toàn');
  return result;
}

export function parseTilemapData(value: unknown): TilemapData {
  const data = object(value, 'tilemap');
  const point = object(data.origin, 'tilemap.origin');
  const origin = { x: finite(point.x, 'tilemap.origin.x'), y: finite(point.y, 'tilemap.origin.y') };
  const columns = integer(data.columns, 'tilemap.columns');
  const rows = integer(data.rows, 'tilemap.rows');
  const size = object(data.tileSize, 'tilemap.tileSize');
  const tileSize = { width: finite(size.width, 'tilemap.tileSize.width', true), height: finite(size.height, 'tilemap.tileSize.height', true) };
  if (!Number.isFinite(origin.x + columns * tileSize.width) || !Number.isFinite(origin.y - rows * tileSize.height)) {
    fail('tilemap', 'có biên lưới vượt phạm vi số hữu hạn');
  }
  const atlas = object(data.tileset, 'tilemap.tileset');
  if (typeof atlas.image !== 'string' || !atlas.image.trim()) fail('tilemap.tileset.image', 'phải là đường dẫn ảnh không rỗng');
  const tileset = {
    image: atlas.image,
    imageWidth: integer(atlas.imageWidth, 'tilemap.tileset.imageWidth'),
    imageHeight: integer(atlas.imageHeight, 'tilemap.tileset.imageHeight'),
    tileWidth: integer(atlas.tileWidth, 'tilemap.tileset.tileWidth'),
    tileHeight: integer(atlas.tileHeight, 'tilemap.tileset.tileHeight'),
  };
  if (tileset.imageWidth % tileset.tileWidth || tileset.imageHeight % tileset.tileHeight) {
    fail('tilemap.tileset', 'kích thước ảnh phải chia hết cho kích thước tile, không có margin/spacing');
  }
  const tileCount = tileset.imageWidth / tileset.tileWidth * (tileset.imageHeight / tileset.tileHeight);
  if (!Number.isSafeInteger(tileCount)) fail('tilemap.tileset', 'số tile vượt phạm vi số nguyên an toàn');
  if (!Array.isArray(data.layers) || !data.layers.length || data.layers.length > 8) fail('tilemap.layers', 'phải có 1..8 layer');
  if (columns * rows * data.layers.length > 65536) fail('tilemap', 'vượt giới hạn 65536 ô tính trên toàn bộ layer');
  const ids = new Set<string>();
  const layers = Array.from(data.layers, (value, layerIndex): TileLayerData => {
    const path = `tilemap.layers[${layerIndex}]`;
    const layer = object(value, path);
    if (typeof layer.id !== 'string' || !layer.id.trim()) fail(`${path}.id`, 'phải là chuỗi không rỗng');
    if (ids.has(layer.id)) fail(`${path}.id`, `bị trùng: ${layer.id}`);
    ids.add(layer.id);
    const opacity = layer.opacity === undefined ? 1 : finite(layer.opacity, `${path}.opacity`);
    if (opacity < 0 || opacity > 1) fail(`${path}.opacity`, 'phải nằm trong 0..1');
    const tint = typeof layer.tint === 'string' && /^#[\da-f]{6}$/i.test(layer.tint) ? Number.parseInt(layer.tint.slice(1), 16) : layer.tint;
    if (tint !== undefined && (typeof tint !== 'number' || !Number.isInteger(tint) || tint < 0 || tint > 0xffffff)) fail(`${path}.tint`, 'phải là #RRGGBB hoặc số nguyên 0..16777215');
    if (!Array.isArray(layer.cells) || layer.cells.length !== rows) fail(`${path}.cells`, `phải có đúng ${rows} hàng`);
    const cells = Array.from(layer.cells, (value, row) => {
      const rowPath = `${path}.cells[${row}]`;
      if (!Array.isArray(value) || value.length !== columns) fail(rowPath, `phải có đúng ${columns} cột`);
      return Array.from(value, (tile: unknown, column) => {
        if (tile === null) return null;
        if (typeof tile !== 'number' || !Number.isInteger(tile) || tile < 0 || tile >= tileCount) {
          fail(`${rowPath}[${column}]`, `phải là null hoặc ID tile nguyên 0..${tileCount - 1}`);
        }
        return tile;
      });
    });
    return { id: layer.id, opacity, cells, ...(tint === undefined ? {} : { tint: tint as number }) };
  });
  return { origin, columns, rows, tileSize, tileset, layers };
}

// row tăng xuống dưới; origin là góc trên trái, kết quả là tâm tile trong world.
export function tilePosition(map: TilemapData, column: number, row: number): Vector2 {
  if (!Number.isInteger(column) || column < 0 || column >= map.columns ||
    !Number.isInteger(row) || row < 0 || row >= map.rows) throw new Error(`Ô tile ngoài lưới: [${row}][${column}]`);
  return { x: map.origin.x + (column + 0.5) * map.tileSize.width, y: map.origin.y - (row + 0.5) * map.tileSize.height };
}
