import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(readFileSync(resolve(repo, 'integration/task-010-boss-khan/skill3-moon-cross/approved-plan.json'), 'utf8'));
if (plan.status !== 'USER_APPROVED_PRODUCTION_ART') throw new Error('Artwork chưa được chốt');
const source = resolve(repo, plan.sourceReview), target = resolve(repo, plan.destination);
const approved = JSON.parse(readFileSync(resolve(source, 'atlas.json'), 'utf8'));
const base = JSON.parse(readFileSync(resolve(target, 'atlas.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(resolve(target, 'production.json'), 'utf8'));
const skill = resolve(target, 'moon-cross');
mkdirSync(resolve(skill, 'sheets'), { recursive: true });
mkdirSync(resolve(skill, 'assets'), { recursive: true });
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
for (const name of plan.approvedSheets) {
  const png = resolve(skill, `sheets/${name}.png`);
  const json = resolve(skill, `sheets/${name}.json`);
  copyFileSync(resolve(source, `candidate/${name}.png`), png);
  const metadata = JSON.parse(readFileSync(resolve(source, `candidate/${name}.json`), 'utf8'));
  metadata.image = `sheets/${name}.png`;
  writeFileSync(json, JSON.stringify(metadata, null, 2)+'\n');
  manifest.files[`moon-cross/sheets/${name}.png`] = hash(png);
  manifest.files[`moon-cross/sheets/${name}.json`] = hash(json);
  copyFileSync(resolve(source, `${name}-contact.png`), resolve(skill, `${name}-contact.png`));
  manifest.files[`moon-cross/${name}-contact.png`] = hash(resolve(skill, `${name}-contact.png`));
  approved.assets[name].image = `sheets/${name}.png`;
  base.assets[name] = { ...approved.assets[name], image: `moon-cross/sheets/${name}.png` };
}
for (const name of ['boss-khan-v1.png', 'ninja-idle.png']) {
  const dest = resolve(skill, `assets/${name}`);
  copyFileSync(resolve(source, `assets/${name}`), dest);
  manifest.files[`moon-cross/assets/${name}`] = hash(dest);
}
approved.status = plan.status;
base.moonCross = { timelineMs: approved.timelineMs, bodySequence: approved.bodySequence, status: plan.status };
writeFileSync(resolve(skill, 'atlas.json'), JSON.stringify(approved, null, 2)+'\n');
writeFileSync(resolve(skill, 'review-data.js'), 'window.bossKhanAnimationReview='+JSON.stringify(approved)+';\n');
writeFileSync(resolve(skill, 'preview.html'), readFileSync(resolve(source, 'preview.html'), 'utf8'));
writeFileSync(resolve(target, 'atlas.json'), JSON.stringify(base, null, 2)+'\n');
manifest.approvedMoonCross = plan.sourceReview;
writeFileSync(resolve(target, 'production.json'), JSON.stringify(manifest, null, 2)+'\n');
console.log('Published approved Boss Khan moon cross without regenerating PNGs.');
