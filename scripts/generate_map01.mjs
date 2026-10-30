import { writeFileSync } from 'node:fs';

// Công cụ authoring riêng cho graybox này; runtime chỉ đọc JSON, không suy collider từ tile.
const solids = [
  { id: 'street', position: { x: 20, y: -3.25 }, width: 40, height: 1.5 },
  { id: 'street-crate', position: { x: 7.5, y: -2 }, width: 1, height: 1 },
  { id: 'passage-roof', position: { x: 14.5, y: 1 }, width: 5, height: 5 },
  { id: 'raised-step', position: { x: 22.5, y: -2 }, width: 3, height: 1 },
  { id: 'balcony', position: { x: 33.25, y: 0.75 }, width: 6.5, height: 0.5 },
  { id: 'balcony-crate', position: { x: 34, y: 1.25 }, width: 1, height: 0.5 },
  { id: 'upper-roof', position: { x: 42.5, y: 1.5 }, width: 11, height: 1 },
  { id: 'roof-2', position: { x: 54, y: 2.5 }, width: 8, height: 1 },
  { id: 'roof-3', position: { x: 64, y: 3 }, width: 8, height: 1 },
  { id: 'roof-4', position: { x: 75, y: 2.5 }, width: 10, height: 1 },
];
const columns = 160;
const rows = 32;
const origin = { x: 0, y: 11.5 };
const grid = () => Array.from({ length: rows }, () => Array(columns).fill(null));
const background = grid();
const terrain = grid();
const markers = grid();
function paint(cells, left, bottom, right, top, tile) {
  for (let row = (origin.y - top) * 2; row < (origin.y - bottom) * 2; row += 1) {
    for (let column = left * 2; column < right * 2; column += 1) cells[row][column] = tile;
  }
}
for (const [left, right, top] of [[0, 10, 5], [11, 18, 7], [19, 25, 4], [26, 37, 8], [37, 48, 6], [50, 58, 7], [60, 68, 8], [70, 80, 6]]) {
  const bottom = left >= 37 ? 1 : -2.5;
  paint(background, left, bottom, right, top, 5);
  for (let x = left + 1; x < right - 0.5; x += 2) paint(background, x, top - 2, x + 0.5, top - 1.5, 6);
}
for (const solid of solids) {
  const left = solid.position.x - solid.width / 2;
  const right = solid.position.x + solid.width / 2;
  const bottom = solid.position.y - solid.height / 2;
  const top = solid.position.y + solid.height / 2;
  const crate = solid.id.endsWith('crate');
  paint(terrain, left, bottom, right, top, crate ? 2 : 1);
  if (!crate) paint(terrain, left, top - 0.5, right, top, solid.id === 'street' ? 0 : 4);
  if (solid.id === 'passage-roof') paint(terrain, left, bottom, right, bottom + 0.5, 3);
}
// Biển tạm ở lối vào hẻm và cột đích cyan; không có logic chiến thắng.
paint(markers, 27, 0, 27.5, 0.5, 7);
paint(markers, 77.5, 3, 78.5, 5, 6);
paint(markers, 77.5, 5, 78.5, 5.5, 7);
const data = {
  version: 1, id: 'map01', spawn: { x: 2, y: -1.7 },
  cameraBounds: { minX: 0, maxX: 80, minY: -4.5, maxY: 11.5 }, cameraFollowY: true, deathY: -8,
  solids,
  climbables: [{ id: 'alley-ladder', kind: 'ladder', position: { x: 29, y: 0.75 }, width: 1, height: 6.5 }],
  visuals: [{ shapeId: 'alley-ladder', kind: 'ladder', color: '#6bafa9', opacity: 0.12, structureOpacity: 1, rungSpacing: 0.4 }],
  tilemap: { origin, columns, rows, tileSize: { width: 0.5, height: 0.5 },
    tileset: { image: 'assets/environments/test-tileset.svg', imageWidth: 128, imageHeight: 64, tileWidth: 32, tileHeight: 32 },
    layers: [{ id: 'background', opacity: 0.55, cells: background }, { id: 'terrain', cells: terrain }, { id: 'markers', cells: markers }] },
};
let output = JSON.stringify(data, null, 2);
for (const layer of data.tilemap.layers) {
  const expanded = JSON.stringify(layer.cells, null, 2).split('\n').map((line, index) => index ? `        ${line}` : line).join('\n');
  output = output.replace(expanded, `[\n${layer.cells.map((row) => `          ${JSON.stringify(row)}`).join(',\n')}\n        ]`);
}
writeFileSync(new URL('../src/world/levels/map-01-graybox.json', import.meta.url), `${output}\n`);
