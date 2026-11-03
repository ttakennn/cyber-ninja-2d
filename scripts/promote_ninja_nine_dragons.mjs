import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../integration/task-009-nine-dragons/', import.meta.url);
const destination = new URL('../public/assets/characters/ninja/skills/nine-dragons/', import.meta.url);
const read = (name) => JSON.parse(readFileSync(new URL(name, root), 'utf8'));
const art = read('art-plan.json'), atlas = read('atlas.json'), plan = read('runtime-plan.json');
const castTimeScale = plan.castSeconds / (art.timing.totalMs / 1000);
if (!Number.isFinite(castTimeScale) || castTimeScale <= 0) throw new Error('Thời gian cast Cửu Long không hợp lệ');
const world = (pixels) => pixels / art.referenceCamera.cssPxPerWorldUnit;
const frame = (pose) => ({ x: pose.rect[0], y: pose.rect[1], width: pose.rect[2], height: pose.rect[3],
  sourceWidth: pose.rect[2], sourceHeight: pose.rect[3], offsetX: 0, offsetY: 0, pivot: { x: pose.pivot[0], y: pose.pivot[1] } });
const timeline = (poses, durations) => poses.flatMap((pose, i) => {
  const count = durations[i] / plan.animationTickMs;
  if (!Number.isInteger(count) || count <= 0) throw new Error(`Timing không hợp lệ: ${i}`);
  return Array.from({ length: count }, () => frame(pose));
});
if (plan.thickness !== 1) throw new Error('Bản runtime này chỉ promote độ dày1.0 đã chốt');
const assets = [];
mkdirSync(destination, { recursive: true });
for (const name of ['cast', 'dragon', 'seal', 'burst', 'aura']) {
  const definition = atlas.assets[name], spec = art[name];
  const frames = name === 'cast' ? timeline(definition.frames, spec.frameMs)
    : name === 'burst' ? timeline(art.aura.handoffFrames.map((i) => definition.frames[i]), art.aura.handoffFrameMs)
    : definition.frames.map(frame);
  const size = name === 'cast' ? art.character.visualWorldSize[0]
    : world(art.preview[name === 'dragon' ? 'dragonFrameWidthPx' : name === 'seal' ? 'sealFrameWidthPx' : 'burstFrameWidthPx']);
  const image = `${name}.png`, metadata = `${name}.json`;
  const sheet = { version: 1, kind: 'production', image, filter: 'linear', frameWidth: definition.frameSize[0],
    frameHeight: definition.frameSize[1], columns: spec.columns,
    visual: { width: size, height: size, offset: { x: 0, y: 0 }, scale: { x: 1, y: 1 }, anchor: { x: 0.5, y: 0 } },
    clips: { [`nine_dragons_${name}`]: { fps: name === 'cast' || name === 'burst' ? 1000 / plan.animationTickMs / castTimeScale : (spec.fps ?? 1),
      loop: name === 'dragon' || name === 'aura', frames } } };
  copyFileSync(new URL(definition.image, root), new URL(image, destination));
  writeFileSync(new URL(metadata, destination), `${JSON.stringify(sheet, null, 2)}\n`);
  assets.push({ source: definition.image, image, metadata, sha256: createHash('sha256').update(readFileSync(new URL(image, destination))).digest('hex') });
}
const settings = { name: art.name, key: plan.input.replace(/^Key/, ''), cooldownSeconds: plan.cooldownSeconds,
  castSeconds: plan.castSeconds, castTimeScale, chargeSeconds: art.timing.chargeMs / 1000 * castTimeScale,
  burstStartSeconds: (art.timing.chargeMs + art.timing.orbitMs) / 1000 * castTimeScale,
  auraSeconds: art.aura.durationMs / 1000, fadeSeconds: art.aura.fadeOutMs / 1000, growSeconds: art.aura.growMs / 1000,
  ringScale: plan.ringScale, thickness: plan.thickness, rotationsPerSecond: art.aura.rotationsPerSecond,
  dragon: { count: art.dragon.instanceCount, radiusX: world(98), radiusY: world(70) },
  sealOffsetY: -world(4),
  glow: { brightness: art.characterGlow.brightness, saturation: art.characterGlow.saturation,
    rimColor: art.characterGlow.rimColor, haloColor: art.characterGlow.haloColor,
    rimRadiusPx: art.characterGlow.rimBlurPx * art.character.pixelsPerWorldUnit / art.referenceCamera.cssPxPerWorldUnit,
    haloRadiusPx: art.characterGlow.haloBlurPx * art.character.pixelsPerWorldUnit / art.referenceCamera.cssPxPerWorldUnit,
    pulseHz: art.characterGlow.pulseHz, pulseMinimum: art.characterGlow.pulseMinimum } };
writeFileSync(new URL('../src/config/nine-dragons.generated.json', import.meta.url), `${JSON.stringify(settings, null, 2)}\n`);
writeFileSync(new URL('manifest.json', destination), `${JSON.stringify({ status: plan.status,
  plan: 'integration/task-009-nine-dragons/runtime-plan.json', art: 'integration/task-009-nine-dragons/atlas.json',
  cooldownStart: plan.cooldownStart, movementLock: plan.movementLock, auraAnchor: plan.auraAnchor,
  additionalSkillGlow: plan.additionalSkillGlow,
  damage: plan.damage, collision: 'NONE_VISUAL_ONLY', assets, settings }, null, 2)}\n`);
