import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../integration/task-009-fire-shuriken/', import.meta.url);
const destination = new URL('../public/assets/characters/ninja/skills/fire-shuriken/', import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, root), 'utf8'));
const plan = read('runtime-plan.json'), actor = read('throw/atlas.json'), projectile = read('atlas.json');
const frame = (rect, pivot) => ({ x: rect[0], y: rect[1], width: rect[2], height: rect[3],
  sourceWidth: rect[2], sourceHeight: rect[3], offsetX: 0, offsetY: 0, pivot: { x: pivot[0], y: pivot[1] } });
// Giữ timing từng pose bằng các slot 5ms; không đổi controller animation dùng chung.
const poses = actor.frames.flatMap((pose, index) => {
  const count = actor.frameMs[index] / plan.animationTickMs;
  if (!Number.isInteger(count) || count <= 0) throw new Error(`Timing pose không hợp lệ: ${index}`);
  return Array.from({ length: count }, () => frame(pose.rect, pose.pivot));
});
const visual = (width, height) => ({ width, height, offset: { x: 0, y: 0 }, scale: { x: 1, y: 1 }, anchor: { x: 0.5, y: 0 } });
const sheets = [
  { id: 'throw', source: 'throw/throw-atlas.png', sheet: { version: 1, kind: 'production', image: 'throw.png', filter: 'linear',
    frameWidth: 512, frameHeight: 512, columns: 3, visual: visual(3.2, 3.2),
    clips: { throw: { fps: 1000 / plan.animationTickMs, loop: false, frames: poses } } } },
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
const settings = {
  releaseSeconds: actor.frameMs.slice(0, actor.releaseFrame).reduce((sum, value) => sum + value, 0) / 1000,
  releaseOffset: { x: (actor.releasePoint[0] - actor.pivot[0]) / 160, y: (actor.pivot[1] - actor.releasePoint[1]) / 160 },
  speed: plan.projectileSpeedPxPerSecond / 160, lifetime: plan.projectileLifetimeMs / 1000,
};
writeFileSync(new URL('../src/config/fire-shuriken.generated.json', import.meta.url), `${JSON.stringify(settings, null, 2)}\n`);
writeFileSync(new URL('manifest.json', destination), `${JSON.stringify({ status: plan.status, plan: 'integration/task-009-fire-shuriken/runtime-plan.json',
  artSource: 'integration/task-009-fire-shuriken/', damage: 'NOT_IMPLEMENTED', collision: 'NOT_IMPLEMENTED', assets, settings }, null, 2)}\n`);
