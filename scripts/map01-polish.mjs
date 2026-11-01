import { readFileSync } from 'node:fs';

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const props = read('../public/assets/environments/map01/props-v2/props.json').props;
const sign = read('../public/assets/environments/map01/ui-polish-rc3/asset-manifest.json');

// Kích thước target là quyết định bố trí; alpha chỉ dùng căn hình vào target đó.
export function placeProp(level, id, assetId, x, footY, width, height, obstacle = false) {
  const asset = props.find((entry) => entry.id === assetId);
  if (!asset) throw new Error(`Thiếu prop RC3: ${assetId}`);
  const [left, top, right, bottom] = asset.alphaBounds;
  const fullWidth = width * asset.sizePx.width / (right - left + 1);
  const fullHeight = height * asset.sizePx.height / (bottom - top + 1);
  level.environment.decorations = level.environment.decorations.filter((entry) => entry.id !== id);
  level.environment.decorations.push({ id, image: `assets/environments/map01/props-v2/${asset.image}`,
    pixelSize: [asset.sizePx.width, asset.sizePx.height],
    worldPosition: { x: x - ((left + right + 1) / 2 - asset.sizePx.width / 2) / asset.sizePx.width * fullWidth,
      y: footY - 0.02 - (asset.sizePx.height - 1 - bottom) / asset.sizePx.height * fullHeight },
    worldSize: { width: fullWidth, height: fullHeight }, anchor: { x: 0.5, y: 1 }, collision: false, layer: 'behind-player', z: -0.15 });
  if (obstacle) level.solids.push({ id, position: { x, y: footY + height / 2 }, width, height });
}

export function applyMap01Polish(level) {
  level.environment.decorations = level.environment.decorations.filter(({ id }) => id !== 'props-scooter-red-0' && id !== 'props-sign-pho-247-1');
  const gate = level.environment.decorations.find(({ id }) => id === 'foreground-street_shop_awning-9');
  if (!gate) throw new Error('Thiếu cổng Zone1 để tích hợp biển Phố Sài Gòn');
  gate.worldSize = { ...gate.worldSize, height: 3.8 };
  gate.worldPosition = { x: 4.7, y: -2.5 - 9 / 330 * gate.worldSize.height };
  level.environment.decorations.push({ id: 'polish-sign-pho-sai-gon', image: sign.image, pixelSize: sign.pixelSize, sourceRect: sign.sourceRect,
    worldPosition: { x: 4.7, y: 0.45 }, worldSize: { width: 3.4, height: 0.75 }, anchor: { x: 0.5, y: 1 },
    collision: false, layer: 'behind-player', z: -0.08, ledBorder: { colors: ['#78fff3', '#fa7cfd'], period: 0.8 } });
  placeProp(level, 'polish-crate-2', 'crate-wood', 9.1, -2.5, 1, 1, true);
  placeProp(level, 'polish-crate-3', 'crate-wood', 10.7, -2.5, 1, 1, true);
  placeProp(level, 'rc2-street-crate', 'crate-wood', 7.5, -2.5, 1, 1);
  placeProp(level, 'rc2-bench', 'street-bench', 22.5, -2.5, 2.5, 1, true);
  placeProp(level, 'rc2-balcony-planter', 'planter-box', 34, 1, 1.5, 0.65, true);
  placeProp(level, 'polish-street-lamp', 'street-lamp', 25.4, -2.5, 1.3, 2.7);
  placeProp(level, 'props-rooftop-water-tank-5', 'rooftop-water-tank', 39.4, 2, 1.37, 2.2);
  level.environment.decorations = level.environment.decorations.filter(({ id }) => id !== 'foreground-railing_cross-11');
  for (const [id, x] of [['polish-roof-railing-1', 44.1], ['polish-roof-railing-2', 46.6]]) {
    level.environment.decorations.push({ id, image: 'assets/environments/map01/foreground/individual/railing_cross.png', pixelSize: [364, 187],
      sourceRect: { x: 10, y: 8, width: 346, height: 171 }, worldPosition: { x, y: 1.98 }, worldSize: { width: 2.2, height: 1.2 },
      anchor: { x: 0.5, y: 1 }, collision: false, layer: 'behind-player', z: -0.15 });
    level.solids.push({ id, position: { x, y: 2.6 }, width: 2.2, height: 1.2 });
  }
  placeProp(level, 'props-satellite-dish-6', 'satellite-dish', 55, 3, 1.79, 2.1);
  placeProp(level, 'props-antenna-7', 'antenna', 63.2, 3.5, 1.53, 2.2);
  placeProp(level, 'props-rooftop-water-tank-8', 'rooftop-water-tank', 75.6, 3, 1.37, 2.2);
  for (const [index, [x, y]] of [[51.1, 3], [52.5, 3], [57.3, 3], [60.9, 3.5], [65.5, 3.5], [66.9, 3.5], [71, 3], [72.3, 3], [78.8, 3]].entries()) {
    placeProp(level, `polish-roof-pot-${index}`, 'potted-plant', x, y, 0.65, 0.65);
  }
}

export function applyStairPolish(level) {
  level.environment.decorations = level.environment.decorations.filter(({ id }) => id !== 'rc2-z4-stairs');
  for (const [index, solid] of level.solids.filter(({ id }) => id.startsWith('z4-step-')).entries()) {
    level.environment.decorations.push({ id: `polish-stair-face-${index}`, image: 'assets/environments/map01/production/atlases/architecture-0.png',
      pixelSize: [1536, 1728], sourceRect: { x: 512, y: 1664 - solid.height * 128, width: 128, height: solid.height * 128 },
      worldPosition: { x: solid.position.x, y: -2.5 }, worldSize: { width: solid.width, height: solid.height },
      anchor: { x: 0.5, y: 1 }, collision: false, layer: 'behind-player', z: -0.25 });
    level.environment.decorations.push({ id: `polish-stair-cap-${index}`, image: 'assets/environments/map01/revision-rc2/z4-return-steps.png',
      pixelSize: [576, 512], sourceRect: { x: index * 192, y: 512 - solid.height * 128, width: 192, height: 24 },
      worldPosition: { x: solid.position.x, y: -2.5 + solid.height - 24 / 128 }, worldSize: { width: solid.width, height: 24 / 128 },
      anchor: { x: 0.5, y: 1 }, collision: false, layer: 'behind-player', z: -0.24 });
  }
}
