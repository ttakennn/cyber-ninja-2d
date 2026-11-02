import { readFileSync } from 'node:fs';

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const props = read('../public/assets/environments/map01/props-v2/props.json').props;
const sign = read('../public/assets/environments/map01/ui-polish-rc3/asset-manifest.json');
const planters = {
  large: { image: 'assets/environments/map01/foreground/individual/planters_large.png', pixelSize: [354, 268], sourceRect: { x: 8, y: 8, width: 338, height: 252 } },
  mixed: { image: 'assets/environments/map01/foreground/individual/planters_mixed.png', pixelSize: [369, 274], sourceRect: { x: 17, y: 23, width: 344, height: 243 } },
  tropical: { image: 'assets/environments/map01/foreground/individual/planters_tropical.png', pixelSize: [324, 266], sourceRect: { x: 33, y: 27, width: 283, height: 231 } },
  amber: { image: 'assets/environments/map01/expansion-z45-rc1/individual/z4-flowerpot-amber.png', pixelSize: [160, 192], sourceRect: { x: 0, y: 26, width: 160, height: 166 } },
};

function placePlanter(level, id, assetId, x, footY, width) {
  const asset = planters[assetId];
  level.environment.decorations.push({ id, ...asset, worldPosition: { x, y: footY - 0.08 },
    worldSize: { width, height: width * asset.sourceRect.height / asset.sourceRect.width },
    anchor: { x: 0.5, y: 1 }, collision: false, layer: 'behind-player', z: -0.17 });
}

// Kích thước target là quyết định bố trí; alpha chỉ dùng căn hình vào target đó.
export function placeProp(level, id, assetId, x, footY, width, height, obstacle = false, { flipX = false, footInset = 0.02 } = {}) {
  const asset = props.find((entry) => entry.id === assetId);
  if (!asset) throw new Error(`Thiếu prop RC3: ${assetId}`);
  const [left, top, right, bottom] = asset.alphaBounds;
  const fullWidth = width * asset.sizePx.width / (right - left + 1);
  const fullHeight = height * asset.sizePx.height / (bottom - top + 1);
  level.environment.decorations = level.environment.decorations.filter((entry) => entry.id !== id);
  level.environment.decorations.push({ id, image: `assets/environments/map01/props-v2/${asset.image}`,
    pixelSize: [asset.sizePx.width, asset.sizePx.height],
    worldPosition: { x: x - (flipX ? -1 : 1) * ((left + right + 1) / 2 - asset.sizePx.width / 2) / asset.sizePx.width * fullWidth,
      y: footY - footInset - (asset.sizePx.height - 1 - bottom) / asset.sizePx.height * fullHeight },
    worldSize: { width: fullWidth, height: fullHeight }, anchor: { x: 0.5, y: 1 }, collision: false, layer: 'behind-player', z: -0.15,
    ...(flipX ? { flipX: true } : {}) });
  if (obstacle) level.solids.push({ id, position: { x, y: footY + height / 2 }, width, height });
}

export function applyMap01Polish(level) {
  level.environment.decorations = level.environment.decorations.filter(({ id }) => id !== 'props-scooter-red-0' && id !== 'props-sign-pho-247-1' && id !== 'rc2-balcony-planter');
  const gate = level.environment.decorations.find(({ id }) => id === 'foreground-street_shop_awning-9');
  if (!gate) throw new Error('Thiếu cổng Zone1 để tích hợp biển Phố Sài Gòn');
  gate.worldSize = { ...gate.worldSize, height: 3.8 };
  gate.worldPosition = { x: 4.7, y: -2.5 - 9 / 330 * gate.worldSize.height };
  level.environment.decorations.push({ id: 'polish-sign-pho-sai-gon', image: sign.image, pixelSize: sign.pixelSize, sourceRect: sign.sourceRect,
    worldPosition: { x: 4.7, y: 0.45 }, worldSize: { width: 3.4, height: 0.75 }, anchor: { x: 0.5, y: 1 },
    collision: false, layer: 'behind-player', z: -0.08, ledBorder: { colors: ['#78fff3', '#fa7cfd'], period: 0.8 } });
  const crate = level.solids.find(({ id }) => id === 'street-crate');
  if (!crate) throw new Error('Thiếu collider thùng Zone1 để đổi vị trí với ghế');
  crate.position.x = 21.5;
  placeProp(level, 'polish-crate-2', 'crate-wood', 22.5, -2.5, 1, 1, true);
  placeProp(level, 'polish-crate-3', 'crate-wood', 23.5, -2.5, 1, 1, true);
  placeProp(level, 'rc2-street-crate', 'crate-wood', 21.5, -2.5, 1, 1);
  placeProp(level, 'rc2-bench', 'street-bench', 8.5, -2.5, 2.5, 1, true);
  const flowerScale = 1.5;
  placePlanter(level, 'polish-balcony-mixed', 'mixed', 32.3125, 1, 1.35 * flowerScale);
  placePlanter(level, 'polish-balcony-tropical', 'tropical', 34.1875, 1, 1.35 * flowerScale);
  placeProp(level, 'polish-street-lamp', 'street-lamp', 9.8, -2.5, 1.3, 2.7, false, { flipX: true });
  const rooftopScale = 1.5;
  placeProp(level, 'props-rooftop-water-tank-5', 'rooftop-water-tank', 39.4, 2, 1.37 * rooftopScale, 2.2 * rooftopScale);
  level.environment.decorations = level.environment.decorations.filter(({ id }) => id !== 'foreground-railing_cross-11');
  // Ghép chồng trụ đầu: mép alpha của ảnh còn khoảng rỗng bên ngoài trụ.
  for (const [id, x] of [['polish-roof-railing-1', 44.1], ['polish-roof-railing-2', 45.9]]) {
    level.environment.decorations.push({ id, image: 'assets/environments/map01/foreground/individual/railing_cross.png', pixelSize: [364, 187],
      sourceRect: { x: 10, y: 8, width: 346, height: 171 }, worldPosition: { x, y: 1.98 }, worldSize: { width: 2.2, height: 1.2 },
      anchor: { x: 0.5, y: 1 }, collision: false, layer: 'behind-player', z: -0.15,
      ...(id === 'polish-roof-railing-1' ? { flipX: true } : {}) });
  }
  placeProp(level, 'props-satellite-dish-6', 'satellite-dish', 55, 3, 1.79 * rooftopScale, 2.1 * rooftopScale);
  placeProp(level, 'props-antenna-7', 'antenna', 63.2, 3.5, 1.53 * rooftopScale, 2.2 * rooftopScale);
  placeProp(level, 'props-rooftop-water-tank-8', 'rooftop-water-tank', 75.6, 3, 1.37 * rooftopScale, 2.2 * rooftopScale);
  for (const [index, [x, y]] of [[51.9875, 3], [52.67, 3], [57.0125, 3], [61.4625, 3.5], [64.9, 3.5], [65.6125, 3.5], [71.2875, 3], [72, 3], [78.175, 3]].entries()) {
    placeProp(level, `polish-roof-pot-${index}`, 'potted-plant', x, y, 0.65 * flowerScale, 0.65 * flowerScale, false, { footInset: 0.08 });
  }
  placePlanter(level, 'polish-roof-large', 'large', 52.55, 3, 1.4 * flowerScale);
  placePlanter(level, 'polish-roof-amber-1', 'amber', 56.75, 3, 0.7 * flowerScale);
  placeProp(level, 'polish-roof-planter-box', 'planter-box', 65.8, 3.5, 1.2 * flowerScale, 0.625 * flowerScale, false, { footInset: 0.08 });
  level.environment.decorations.find(({ id }) => id === 'polish-roof-planter-box').z = -0.18;
  placePlanter(level, 'polish-roof-tropical', 'tropical', 72, 3, 1.5 * flowerScale);
  placePlanter(level, 'polish-roof-amber-2', 'amber', 77.5, 3, 0.75 * flowerScale);
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
    const vineWidth = Math.min(solid.width - 0.08, (solid.height - 0.1) * 470 / 378);
    const vineHeight = vineWidth * 378 / 470;
    level.environment.decorations.push({ id: `polish-stair-vines-${index}`, image: 'assets/environments/map01/foreground/individual/vine_canopy_01.png',
      pixelSize: [470, 378], worldPosition: { x: solid.position.x, y: -2.5 + solid.height - 0.1 - vineHeight },
      worldSize: { width: vineWidth, height: vineHeight }, anchor: { x: 0.5, y: 1 },
      collision: false, layer: 'behind-player', z: -0.12 });
  }
}
