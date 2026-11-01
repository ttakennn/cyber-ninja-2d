import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const level = read('../src/world/levels/map-01-visual-pilot.json');
const plan = read('../integration/five-zone-design/level-extension.plan.json');
const master = read('../integration/five-zone-design/map01-five-zones.master.json');
const manifest = read('../integration/five-zone-design/asset-manifest.json');
const reuse = read('../integration/five-zone-design/runtime-reuse-additions.json');
const revision = read('../integration/map01-revision-rc2/map-revision-plan.json');
const streetLayout = read('../integration/map01-street-layout.json');
const replacementMap = read('../integration/z45-atlas-rc1/replacement-map.json');
const replacementEntries = read('../integration/z45-atlas-rc1/environment-replacements-atlas.json').decorations;
const replacements = new Map(replacementEntries.map((entry) => [entry.id, entry]));
if (replacements.size !== replacementEntries.length) throw new Error('Replacement ID bị trùng');
const check = process.argv.includes('--check');
const output = (path, text) => {
  const file = new URL(path, import.meta.url);
  if (check) {
    if (!existsSync(file) || readFileSync(file, 'utf8') !== text) throw new Error(`Đầu ra không khớp: ${path}`);
  } else writeFileSync(file, text);
};
const folder = '../public/assets/environments/map01/five-zone-graybox/';
if (!check) mkdirSync(new URL(folder, import.meta.url), { recursive: true });
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const catalog = [];
const placeholders = new Map();
for (const asset of manifest.assets.filter(({ runtimeReady }) => !runtimeReady)) {
  if (replacementMap.entries.some((entry) => entry.assetId === asset.id)) continue;
  const [width, height] = asset.pixelSize;
  const title = asset.text ?? asset.id;
  const font = Math.min(40, width / Math.max(title.length * 0.65, 9), height / 7);
  const gate = asset.id === 'z5-yard-gate';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect x="2" y="2" width="${width - 4}" height="${height - 4}" fill="${gate ? 'none' : '#18212c'}" stroke="#8798ad" stroke-width="4" stroke-dasharray="12 8"/><g fill="#f7b25a" font-family="sans-serif" text-anchor="middle" font-size="${font}"><text x="${width / 2}" y="${height * 0.22}">GRAYBOX</text><text x="${width / 2}" y="${height * 0.50}">${escape(title)}</text><text x="${width / 2}" y="${height * 0.78}" font-size="${font * 0.7}">CHỜ ASSET — KHÔNG COLLISION</text></g></svg>\n`;
  output(`${folder}${asset.id}.svg`, svg);
  const image = `assets/environments/map01/five-zone-graybox/${asset.id}.svg`;
  placeholders.set(asset.id, { image, pixelSize: asset.pixelSize });
  catalog.push({ id: asset.id, image, pixelSize: asset.pixelSize, status: 'GRAYBOX_PLACEHOLDER_NOT_PRODUCTION',
    replacesPlannedImage: asset.plannedImage, sha256: createHash('sha256').update(svg).digest('hex') });
}
level.id = plan.proposedLevelId;
level.solids.push(...plan.appendSolids);
level.climbables.push(...plan.appendClimbables);
level.cameraBounds.maxX = plan.cameraBounds.maxX;
const map = level.tilemap;
if (map.rows !== plan.tilemapPlan.rows || map.columns > plan.tilemapPlan.columns) throw new Error('Grid baseline không tương thích kế hoạch');
for (const layer of map.layers) for (const row of layer.cells) while (row.length < plan.tilemapPlan.columns) row.push(null);
map.columns = plan.tilemapPlan.columns;
const paint = (id, left, bottom, right, top, tile) => {
  const layer = map.layers.find((entry) => entry.id === id);
  if (!layer) throw new Error(`Thiếu layer ${id}`);
  for (let row = (map.origin.y - top) / map.tileSize.height; row < (map.origin.y - bottom) / map.tileSize.height; row += 1) {
    for (let column = (left - map.origin.x) / map.tileSize.width; column < (right - map.origin.x) / map.tileSize.width; column += 1) layer.cells[row][column] = tile;
  }
};
const ground = plan.appendSolids[0];
const left = ground.position.x - ground.width / 2;
const right = ground.position.x + ground.width / 2;
paint('terrain', left, -4, right, -2.5, 3);
paint('roof-edges', left, -3, right, -2.5, 11);
paint('street-foundation', left, -4.5, right, -4, 3);
paint('markers', 77.5, 3, 78.5, 5.5, null);
level.visuals.push({ kind: 'rectangle', shapeId: ground.id, color: '#182656', opacity: 1, bottom: -4.5, z: -0.6 });
for (const entry of reuse.decorations) {
  if (!existsSync(new URL(`../public/${entry.image}`, import.meta.url))) throw new Error(`Thiếu ảnh reuse: ${entry.image}`);
  level.environment.decorations.push(entry);
}
for (const placement of master.placements) {
  if (reuse.decorations.some(({ id }) => id === placement.id)) continue;
  const replacement = replacements.get(placement.id);
  const placeholder = replacement ? { image: replacement.image, pixelSize: replacement.pixelSize, sourceRect: replacement.sourceRect } : placeholders.get(placement.assetId);
  if (!placeholder) continue;
  level.environment.decorations.push({ id: placement.id, ...placeholder, worldPosition: placement.worldPosition,
    worldSize: placement.worldSize, anchor: placement.anchor, collision: false, layer: placement.layer, z: placement.z });
}
const replaced = new Set();
level.environment.decorations = level.environment.decorations.map((entry) => {
  const replacement = replacements.get(entry.id);
  if (!replacement) return entry;
  if (replaced.has(entry.id)) throw new Error(`Placement bị trùng: ${entry.id}`);
  if (!existsSync(new URL(`../public/${replacement.image}`, import.meta.url))) throw new Error(`Thiếu ảnh RC1: ${replacement.image}`);
  replaced.add(entry.id);
  return { ...entry, image: replacement.image, pixelSize: replacement.pixelSize, sourceRect: replacement.sourceRect };
});
if (replaced.size !== replacements.size || replacementMap.entries.some(({ placementId }) => !replaced.has(placementId))) throw new Error('Chưa resolve đủ replacement RC1');
if (catalog.length) output(`${folder}catalog.json`, `${JSON.stringify({ status: 'GRAYBOX_ONLY', assets: catalog }, null, 2)}\n`);
level.solids.push(...revision.appendSolids);
level.visuals = level.visuals.filter(({ shapeId }) => shapeId !== ground.id);
level.environment.decorations = level.environment.decorations.filter(({ id }) => !revision.removeDecorationIds.includes(id)
  && !revision.appendDecorations.some((entry) => entry.id === id));
level.environment.decorations.push(...revision.appendDecorations);
// PNG có 42/95 hàng alpha rỗng dưới chân; hạ cả biển Zone4 cùng nền (128 px/unit).
for (const entry of level.environment.decorations) {
  if (/^rc2-street-\d+$/.test(entry.id)) {
    entry.worldPosition = { ...entry.worldPosition, y: -3.5 };
    entry.worldSize = { ...entry.worldSize, height: 1 };
    entry.sourceRect = { x: 0, y: 0, width: entry.worldSize.width * 128, height: 128 };
  }
  const bottomPadding = entry.id.startsWith('rc2-zone4-shops-backdrop-') || ['rc2-noodle-sign', 'rc2-market-sign'].includes(entry.id) ? 42
    : entry.id.startsWith('rc2-zone5-yard-backdrop-') ? 95 : 0;
  if (bottomPadding) entry.worldPosition = { ...entry.worldPosition, y: entry.worldPosition.y - bottomPadding / 128 };
}
for (const layer of map.layers) for (const region of revision.tilemapEdits.suppressStreetSkinRegions) {
  paint(layer.id, region.minX, region.minY, region.maxX, region.maxY, null);
}
// Một dãy phố hữu hạn: ảnh nền cũ và nhà Zone4/5 cùng mặt phẳng, tỷ lệ và parallax.
const near = level.environment.backgrounds.find(({ id }) => id === streetLayout.backgroundId);
if (!near) throw new Error(`Thiếu background phố: ${streetLayout.backgroundId}`);
const merged = level.environment.decorations.filter(({ id }) => streetLayout.mergeDecorationIds.includes(id));
if (merged.length !== streetLayout.mergeDecorationIds.length) throw new Error('Thiếu decoration để ghép dãy phố');
level.environment.backgrounds = level.environment.backgrounds.filter(({ id }) => id !== near.id);
level.environment.decorations = level.environment.decorations.filter(({ id }) => !streetLayout.mergeDecorationIds.includes(id));
const streetScale = streetLayout.scale;
const streetHeightScale = streetScale * streetLayout.heightScale;
const nearWidth = near.worldHeight * near.pixelSize[0] / near.pixelSize[1];
let streetIndex = 0;
for (const [left, right] of streetLayout.baseSpans) for (let x = left; x < right - 1e-9; x += nearWidth) {
  const width = Math.min(nearWidth, right - x);
  level.environment.decorations.push({ id: `street-mix-near-${streetIndex++}`, image: near.image, pixelSize: near.pixelSize,
    worldPosition: { x: (x + width / 2) * streetScale,
      y: streetLayout.groundY - streetLayout.nearBottomPaddingPixels / near.pixelSize[1] * near.worldHeight * streetHeightScale },
    worldSize: { width: width * streetScale, height: near.worldHeight * streetHeightScale }, anchor: { x: 0.5, y: 1 },
    collision: false, layer: 'background', z: near.z, parallaxX: near.parallaxX,
    sourceRect: { x: 0, y: 0, width: Math.min(near.pixelSize[0], width / nearWidth * near.pixelSize[0]), height: near.pixelSize[1] } });
}
for (const entry of merged) {
  const heightScale = entry.id.startsWith('rc2-zone5-yard-backdrop-') ? streetScale * streetLayout.zone5HeightScale : streetHeightScale;
  level.environment.decorations.push({ ...entry, id: `street-mix-${entry.id}`,
    layer: 'background', z: near.z, parallaxX: near.parallaxX,
    worldPosition: { x: entry.worldPosition.x * streetScale, y: streetLayout.groundY + (entry.worldPosition.y - streetLayout.groundY) * heightScale },
    worldSize: { width: entry.worldSize.width * streetScale, height: entry.worldSize.height * heightScale } });
}
let json = JSON.stringify(level, null, 2);
for (const layer of map.layers) {
  const expanded = JSON.stringify(layer.cells, null, 2).split('\n').map((line, index) => index ? `        ${line}` : line).join('\n');
  json = json.replace(expanded, `[\n${layer.cells.map((row) => `          ${JSON.stringify(row)}`).join(',\n')}\n        ]`);
}
output('../src/world/levels/map-01-five-zones.json', `${json}\n`);
