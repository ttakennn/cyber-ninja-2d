import playground from './playground.json';
import small from './small.json';
import tiles from './tiles.json';

const levels: Readonly<Record<string, unknown>> = { playground, small, tiles };

export function getLevelData(id = 'playground'): unknown {
  if (!Object.hasOwn(levels, id)) throw new Error(`Không tìm thấy level "${id}". Có thể chọn: ${Object.keys(levels).join(', ')}`);
  return levels[id];
}
