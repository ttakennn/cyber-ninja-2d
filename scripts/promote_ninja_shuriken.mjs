import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../integration/task-009-fire-shuriken/', import.meta.url);
const destination = new URL('../public/assets/characters/ninja/skills/fire-shuriken/', import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, root), 'utf8'));
const plan = read('runtime-plan.json'), actor = read('throw/atlas.json'), crouch = read('crouch-throw/atlas.json'), projectile = read('atlas.json');
const frame = (rect, pivot) => ({ x: rect[0], y: rect[1], width: rect[2], height: rect[3],
  sourceWidth: rect[2], sourceHeight: rect[3], offsetX: 0, offsetY: 0, pivot: { x: pivot[0], y: pivot[1] } });
// Giữ timing từng pose bằng các slot 5ms; không đổi controller animation dùng chung.
const poses = (definition) => definition.frames.flatMap((pose, index) => {
  const count = definition.frameMs[index] / plan.animationTickMs;
  if (!Number.isInteger(count) || count <= 0) throw new Error(`Timing pose không hợp lệ: ${index}`);
  return Array.from({ length: count }, () => frame(pose.rect, pose.pivot));
});
const visual = (width, height) => ({ width, height, offset: { x: 0, y: 0 }, scale: { x: 1, y: 1 }, anchor: { x: 0.5, y: 0 } });
const sheets = [
  { id: 'throw', source: 'throw/throw-atlas.png', sheet: { version: 1, kind: 'production', image: 'throw.png', filter: 'linear',
    frameWidth: 512, frameHeight: 512, columns: 3, visual: visual(3.2, 3.2),
    clips: { throw: { fps: 1000 / plan.animationTickMs, loop: false, frames: poses(actor) } } } },
  { id: 'crouch-throw', source: 'crouch-throw/crouch-throw-atlas.png', sheet: { version: 1, kind: 'production', image: 'crouch-throw.png', filter: 'linear',
    frameWidth: 512, frameHeight: 512, columns: 3, visual: visual(3.2, 3.2),
    clips: { crouch_throw: { fps: 1000 / plan.animationTickMs, loop: false, frames: poses(crouch) } } } },
  { id: 'projectile', source: projectile.image, sheet: { version: 1, kind: 'production', image: 'projectile.png', filter: 'linear',
    frameWidth: 627, frameHeight: 627, columns: 2, visual: visual(plan.projectileFrameWidthPx / 160, plan.projectileFrameWidthPx / 160),
    clips: { projectile: { fps: projectile.fpsPreview, loop: true, frames: projectile.frames.map((pose) => frame(pose.rect, pose.pivot)) } } } },
];
mkdirSync(destination, { recursive: true });
const assets = [];
for (const { id, source, sheet } of sheets) {
  copyFileSync(new URL(source, root), new URL(sheet.image, destination));
  writeFileSync(new URL(`${id}.json`, destination), `${JSON.stringify(sheet, null, 2)}\n`);
  assets.push({ source, image: sheet.image, metadata: `${id}.json`, sha256: createHash('sha256').update(readFileSync(new URL(sheet.image, destination))).digest('hex') });
}
const release = (definition) => ({
  releaseSeconds: definition.frameMs.slice(0, definition.releaseFrame).reduce((sum, value) => sum + value, 0) / 1000,
  releaseOffset: { x: (definition.releasePoint[0] - definition.pivot[0]) / 160, y: (definition.pivot[1] - definition.releasePoint[1]) / 160 },
});
const settings = { ...release(actor), crouch: release(crouch), speed: plan.projectileSpeedPxPerSecond / 160 };
writeFileSync(new URL('../src/config/fire-shuriken.generated.json', import.meta.url), `${JSON.stringify(settings, null, 2)}\n`);
writeFileSync(new URL('manifest.json', destination), `${JSON.stringify({ status: plan.status, plan: 'integration/task-009-fire-shuriken/runtime-plan.json',
  artSource: 'integration/task-009-fire-shuriken/', damage: 'NOT_IMPLEMENTED', collision: 'LEVEL_SOLIDS_POINT_SWEEP',
  enemies: 'DEFERRED', cleanup: 'OUTSIDE_LEVEL_X_EXTENT', assets, settings }, null, 2)}\n`);
