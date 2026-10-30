import { readFileSync, writeFileSync } from 'node:fs';

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const level = read('../src/world/levels/map-01-graybox.json');
const source = read('./map01-environment-pilot.input.json');
const props = read('../public/assets/environments/map01/props/props.json').props;
const foreground = read('../public/assets/environments/map01/foreground/foreground.json').assets;
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
level.environment = { backgrounds: source.backgrounds.map((layer) => ({ ...layer, bottomOffset: layer.repeatX ? 1.5 : 0 })), decorations };
level.tilemap.tileset = { image: `${base}tilesets/terrain-64-atlas.png`, imageWidth: 1024, imageHeight: 1024, tileWidth: 64, tileHeight: 64 };
const grid = () => Array.from({ length: level.tilemap.rows }, () => Array(level.tilemap.columns).fill(null));
const terrain = grid();
const masonry = grid();
const details = grid();
const markers = grid();
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
    // Khối tối, chỉ hai chi tiết đặt tay; không lát cửa sổ/biển sáng toàn mái hầm.
    paint(masonry, left, bottom, right, top, 12);
  } else {
    paint(terrain, left, bottom, right, top, solid.id.endsWith('crate') ? 2 : 12);
    if (!solid.id.endsWith('crate')) paint(terrain, left, top - 0.5, right, top, 11);
  }
}
paint(details, 13.5, 1.5, 14, 2, 8);
paint(details, 16, 0, 16.5, 0.5, 8);
paint(markers, 27, 0, 27.5, 0.5, 10);
paint(markers, 77.5, 3, 78.5, 5.5, 10);
level.tilemap.layers = [
  { id: 'terrain', tint: '#a5afc8', cells: terrain },
  { id: 'passage-masonry', tint: '#2d3a54', cells: masonry },
  { id: 'hand-placed-details', cells: details },
  { id: 'markers', cells: markers },
];
let output = JSON.stringify(level, null, 2);
for (const layer of level.tilemap.layers) {
  const expanded = JSON.stringify(layer.cells, null, 2).split('\n').map((line, index) => index ? `        ${line}` : line).join('\n');
  output = output.replace(expanded, `[\n${layer.cells.map((row) => `          ${JSON.stringify(row)}`).join(',\n')}\n        ]`);
}
writeFileSync(new URL('../src/world/levels/map-01-visual-pilot.json', import.meta.url), `${output}\n`);
