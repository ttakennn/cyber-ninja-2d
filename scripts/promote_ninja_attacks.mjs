import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../integration/task-009-player-attacks/', import.meta.url);
const destination = new URL('../public/assets/characters/ninja/attacks/', import.meta.url);
const plan = JSON.parse(readFileSync(new URL('combo-plan.json', root), 'utf8'));
mkdirSync(destination, { recursive: true });
const assets = [];
for (const { name, frames } of plan.clips) {
  const sheet = JSON.parse(readFileSync(new URL(`candidate/${name}.json`, root), 'utf8'));
  const original = sheet.clips[name];
  sheet.clips[name] = { ...original, speed: (original.speed ?? 1) * plan.playbackSpeedMultiplier, frames: frames.map((index) => {
    if (!original.frames[index]) throw new Error(`Thiếu frame ${name}/${index}`);
    return original.frames[index];
  }) };
  copyFileSync(new URL(`candidate/${sheet.image}`, root), new URL(sheet.image, destination));
  writeFileSync(new URL(`${name}.json`, destination), `${JSON.stringify(sheet, null, 2)}\n`);
  assets.push({ name, image: sheet.image, metadata: `${name}.json`, approvedFrameIndices: frames,
    sha256: createHash('sha256').update(readFileSync(new URL(sheet.image, destination))).digest('hex') });
}
writeFileSync(new URL('manifest.json', destination), `${JSON.stringify({ status: 'USER_APPROVED_ART_ANIMATION_ONLY',
  source: 'integration/task-009-player-attacks/candidate/', plan: 'integration/task-009-player-attacks/combo-plan.json',
  playbackSpeedMultiplier: plan.playbackSpeedMultiplier,
  damage: 'NOT_IMPLEMENTED', assets }, null, 2)}\n`);
