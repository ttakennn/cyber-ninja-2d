import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../integration/task-009-special-01/', import.meta.url);
const destination = new URL('../public/assets/characters/ninja/skills/special-01/', import.meta.url);
const read = (name) => JSON.parse(readFileSync(new URL(name, root), 'utf8'));
const art = read('art-plan.json'), atlas = read('atlas.json'), plan = read('runtime-plan.json');
const frame = (pose) => ({ x: pose.rect[0], y: pose.rect[1], width: pose.rect[2], height: pose.rect[3],
  sourceWidth: pose.rect[2], sourceHeight: pose.rect[3], offsetX: 0, offsetY: 0, pivot: { x: pose.pivot[0], y: pose.pivot[1] } });
const assets = [];
mkdirSync(destination, { recursive: true });
for (const name of ['cast', 'orb', 'explosion']) {
  const definition = atlas.assets[name], spec = art[name];
  const frames = name === 'cast' ? definition.frames.flatMap((pose, index) => {
    const count = spec.frameMs[index] / plan.animationTickMs;
    if (!Number.isInteger(count) || count <= 0) throw new Error(`Timing cast không hợp lệ: ${index}`);
    return Array.from({ length: count }, () => frame(pose));
  }) : definition.frames.map(frame);
  const size = name === 'cast' ? 3.2 : (name === 'orb' ? plan.orbFrameWidthPx : plan.explosionFrameWidthPx) / 160;
  const image = `${name}.png`, metadata = `${name}.json`;
  const sheet = { version: 1, kind: 'production', image, filter: 'linear', frameWidth: definition.frameSize[0],
    frameHeight: definition.frameSize[1], columns: spec.columns,
    visual: { width: size, height: size, offset: { x: 0, y: 0 }, scale: { x: 1, y: 1 }, anchor: { x: 0.5, y: 0 } },
    clips: { [`special_01_${name}`]: { fps: name === 'cast' ? 1000 / plan.animationTickMs : spec.fps, loop: name === 'orb', frames } } };
  copyFileSync(new URL(definition.image, root), new URL(image, destination));
  writeFileSync(new URL(metadata, destination), `${JSON.stringify(sheet, null, 2)}\n`);
  assets.push({ source: definition.image, image, metadata, sha256: createHash('sha256').update(readFileSync(new URL(image, destination))).digest('hex') });
}
const cast = art.cast, pivot = cast.pivot;
const offset = (point) => ({ x: (point[0] - pivot[0]) / 160, y: (pivot[1] - point[1]) / 160 });
let chargeTime = 0;
const settings = { cooldownSeconds: plan.cooldownSeconds, speed: plan.flightSpeedPxPerSecond / 160,
  releaseSeconds: cast.frameMs.slice(0, cast.releaseFrame).reduce((sum, ms) => sum + ms, 0) / 1000,
  releaseOffset: offset(cast.releasePoint),
  charge: cast.chargePoints.map((point, index) => ({ untilSeconds: (chargeTime += cast.frameMs[index] / 1000),
    offset: offset(point), scale: cast.chargeWidths[index] / plan.orbFrameWidthPx })) };
writeFileSync(new URL('../src/config/special-01.generated.json', import.meta.url), `${JSON.stringify(settings, null, 2)}\n`);
writeFileSync(new URL('manifest.json', destination), `${JSON.stringify({ status: plan.status,
  plan: 'integration/task-009-special-01/runtime-plan.json', art: 'integration/task-009-special-01/atlas.json',
  cooldownStart: plan.cooldownStart, damage: plan.damage, collision: 'LEVEL_SOLIDS_POINT_SWEEP', assets, settings }, null, 2)}\n`);
