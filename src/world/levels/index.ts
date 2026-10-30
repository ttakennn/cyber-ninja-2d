import playground from './playground.json';
import small from './small.json';
import tiles from './tiles.json';
import graybox from './map-01-graybox.json';
import map01 from './map-01-visual-pilot.json';

const levels: Readonly<Record<string, unknown>> = { playground, small, tiles, map01, 'map01-graybox': graybox };

export function getLevelData(id = 'playground'): unknown {
  if (!Object.hasOwn(levels, id)) throw new Error(`Không tìm thấy level "${id}". Có thể chọn: ${Object.keys(levels).join(', ')}`);
  return levels[id];
}
