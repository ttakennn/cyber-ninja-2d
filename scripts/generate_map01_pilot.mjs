import { readFileSync, writeFileSync } from 'node:fs';

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const level = read('../src/world/levels/map-01-graybox.json');
const source = read('./map01-environment-pilot.input.json');
const props = read('../public/assets/environments/map01/props/props.json').props;
const foreground = read('../public/assets/environments/map01/foreground/foreground.json').assets;
const production = read('../integration/map01-production-additions.json');
const base = 'assets/environments/map01/';
const decorations = source.decorations.map((entry) => {
  const match = /^(props|foreground)-(.+)-\d+$/.exec(entry.id);
  if (!match) throw new Error(`ID placement không hợp lệ: ${entry.id}`);
  const catalog = match[1] === 'props' ? props : foreground;
  const asset = catalog.find((candidate) => candidate.id === match[2]);
  if (!asset) throw new Error(`Không có metadata cho ${entry.id}`);
  const size = asset.sizePx ?? asset.pixelSize;
  return { ...entry, image: `${base}${match[1]}/${asset.image}`, pixelSize: [size.width, size.height] };
});
// Hiệu chỉnh placement nhìn thấy qua Three.js, không sửa kích thước/PNG hay gameplay.
for (const decoration of decorations) {
  if (decoration.id === 'foreground-street_shop_awning-9') decoration.worldPosition = { x: 4.7, y: -2.5 };
  if (decoration.id === 'props-sign-pho-247-1') decoration.worldPosition = { x: 4.7, y: -0.8 };
  if (decoration.id === 'foreground-railing_cross-11') decoration.worldPosition = { x: 46, y: 2 };
}
function facade(id, assetId, x, y, layer = 'behind-player') {
  const asset = foreground.find((entry) => entry.id === assetId);
  if (!asset || !asset.artReviewStatus.startsWith('APPROVED_')) throw new Error(`Asset chưa duyệt: ${assetId}`);
  decorations.push({ id, image: `${base}foreground/${asset.image}`, pixelSize: [asset.pixelSize.width, asset.pixelSize.height],
    worldPosition: { x, y }, worldSize: asset.worldSize, anchor: { x: 0.5, y: 1 }, collision: false, layer, z: layer === 'foreground' ? 2 : -0.1 });
}
facade('facade-shutter', 'shutter_shop', 13.4, -1.5);
facade('facade-shop', 'street_shop_awning', 15.55, -1.5);
facade('facade-light', 'wall_light_amber', 14.5, 2);
facade('foreground-vine_strip_01-12', 'vine_strip_01', 2.8, -4.15, 'foreground');
facade('foreground-vine_strip_01-13', 'vine_strip_01', 39.5, -4.15, 'foreground');
for (const solid of level.solids.filter(({ id }) => id === 'upper-roof' || /^roof-\d$/.test(id))) {
  const left = solid.position.x - solid.width / 2;
  const right = solid.position.x + solid.width / 2;
  const top = solid.position.y + solid.height / 2;
  // Tách trụ trái 0..80px, thân 80..465px, trụ phải 465..525px.
  // Mỗi mái chỉ có hai end-cap; phần dư cắt UV thân, không ép/chồng module.
  const scale = 3.8 / 525;
  let cursor = left;
  const strip = (x, pixels) => {
    const width = pixels * scale;
    facade(`foreground-parapet_wall-${decorations.length}`, 'parapet_wall', cursor + width / 2, top - 0.8686);
    const entry = decorations.at(-1);
    entry.worldSize = { width, height: 0.8686 };
    entry.sourceRect = { x, y: 0, width: pixels, height: 120 };
    cursor += width;
  };
  strip(0, 80);
  const bodyEnd = right - 60 * scale;
  while (bodyEnd - cursor > 1e-8) {
    strip(80, Math.min(385, (bodyEnd - cursor) / scale));
  }
  strip(465, 60);
}
level.environment = { backgrounds: source.backgrounds.map((layer) => layer.id === 'buildings-near'
  ? { ...layer, verticalAnchor: 'world', worldBottom: -2.7, worldHeight: 8, bottomOffset: 0 }
  : { ...layer, bottomOffset: 0 }), decorations: [...decorations, ...production.decorations] };
level.visuals[0] = { ...level.visuals[0], color: '#3e536e', opacity: 0, structureOpacity: 0.9, railHighlight: '#8b98aa' };
level.tilemap.tileset = { image: `${base}tilesets/terrain-64-atlas.png`, imageWidth: 1024, imageHeight: 1024, tileWidth: 64, tileHeight: 64 };
const grid = () => Array.from({ length: level.tilemap.rows }, () => Array(level.tilemap.columns).fill(null));
const terrain = grid();
const masonry = grid();
const details = grid();
const markers = grid();
const edges = grid();
const foundation = grid();
function paint(cells, left, bottom, right, top, id) {
  const { origin, tileSize } = level.tilemap;
  for (let row = (origin.y - top) / tileSize.height; row < (origin.y - bottom) / tileSize.height; row += 1) {
    for (let column = (left - origin.x) / tileSize.width; column < (right - origin.x) / tileSize.width; column += 1) cells[row][column] = id;
  }
}
for (const solid of level.solids) {
  const left = solid.position.x - solid.width / 2;
  const right = solid.position.x + solid.width / 2;
  const bottom = solid.position.y - solid.height / 2;
  const top = solid.position.y + solid.height / 2;
  if (solid.id === 'passage-roof') {
    // RC1 thay fill/pilaster tạm, giữ mép solid và decal cửa/đèn riêng.
    paint(edges, left, top - 0.5, right, top, 11);
    paint(edges, left, bottom, right, bottom + 0.5, 11);
  } else {
    paint(solid.id.endsWith('crate') ? edges : terrain, left, bottom, right, top, solid.id.endsWith('crate') ? 2 : 3);
    if (!solid.id.endsWith('crate')) paint(edges, left, top - 0.5, right, top, 11);
  }
}
paint(markers, 27, 0, 27.5, 0.5, 10);
paint(markers, 77.5, 3, 78.5, 5.5, 10);
paint(foundation, 0, -4.5, 40, -4, 3);
level.tilemap.layers = [
  { id: 'terrain', tint: '#687da6', sampleInset: 20, cells: terrain },
  { id: 'passage-masonry', tint: '#687da6', sampleInset: 20, cells: masonry },
  { id: 'hand-placed-details', cells: details },
  { id: 'roof-edges', tint: '#a5afc8', cells: edges },
  { id: 'markers', cells: markers },
  { id: 'street-foundation', tint: '#182656', sampleInset: 20, cells: foundation },
];
let output = JSON.stringify(level, null, 2);
for (const layer of level.tilemap.layers) {
  const expanded = JSON.stringify(layer.cells, null, 2).split('\n').map((line, index) => index ? `        ${line}` : line).join('\n');
  output = output.replace(expanded, `[\n${layer.cells.map((row) => `          ${JSON.stringify(row)}`).join(',\n')}\n        ]`);
}
const destination = new URL('../src/world/levels/map-01-visual-pilot.json', import.meta.url);
if (process.argv.includes('--check')) {
  if (readFileSync(destination, 'utf8') !== `${output}\n`) throw new Error('JSON pilot không khớp generator');
} else writeFileSync(destination, `${output}\n`);
