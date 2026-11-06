import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(readFileSync(resolve(repo, 'integration/task-010-boss-khan/combo-x-forward/approved-plan.json'), 'utf8'));
if (plan.status !== 'USER_APPROVED_PRODUCTION_ART') throw new Error('Artwork chưa được chốt');
const source = resolve(repo, plan.sourceReview), target = resolve(repo, plan.destination);
const approved = JSON.parse(readFileSync(resolve(source, 'atlas.json'), 'utf8'));
const base = JSON.parse(readFileSync(resolve(target, 'atlas.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(resolve(target, 'production.json'), 'utf8'));
const combo = resolve(target, 'combo');
mkdirSync(resolve(combo, 'sheets'), { recursive: true });
mkdirSync(resolve(combo, 'assets'), { recursive: true });
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
for (const name of plan.approvedSheets) {
  const png = resolve(combo, `sheets/${name}.png`);
  const json = resolve(combo, `sheets/${name}.json`);
  copyFileSync(resolve(source, `candidate/${name}.png`), png);
  const metadata = JSON.parse(readFileSync(resolve(source, `candidate/${name}.json`), 'utf8'));
  metadata.image = `sheets/${name}.png`;
  writeFileSync(json, JSON.stringify(metadata, null, 2)+'\n');
  manifest.files[`combo/sheets/${name}.png`] = hash(png);
  manifest.files[`combo/sheets/${name}.json`] = hash(json);
  const contact = `${name}-contact.png`;
  copyFileSync(resolve(source, contact), resolve(combo, contact));
  manifest.files[`combo/${contact}`] = hash(resolve(combo, contact));
  approved.assets[name].image = `sheets/${name}.png`;
  base.assets[name] = { ...approved.assets[name], image: `combo/sheets/${name}.png` };
}
for (const name of ['boss-khan-v1.png', 'ninja-idle.png']) {
  copyFileSync(resolve(source, 'assets', name), resolve(combo, 'assets', name));
  manifest.files[`combo/assets/${name}`] = hash(resolve(combo, 'assets', name));
}
approved.status = plan.status;
base.combo = { timelineMs: approved.timelineMs, bodySequence: approved.bodySequence, status: plan.status };
writeFileSync(resolve(combo, 'atlas.json'), JSON.stringify(approved, null, 2)+'\n');
writeFileSync(resolve(combo, 'review-data.js'), 'window.bossKhanAnimationReview='+JSON.stringify(approved)+';\n');
let html = readFileSync(resolve(source, 'preview.html'), 'utf8');
html = html.replace('Candidate chờ bạn duyệt.', 'Hoạt ảnh combo đã được người dùng chốt.');
writeFileSync(resolve(combo, 'preview.html'), html);
writeFileSync(resolve(target, 'atlas.json'), JSON.stringify(base, null, 2)+'\n');
manifest.approvedCombo = plan.sourceReview;
writeFileSync(resolve(target, 'production.json'), JSON.stringify(manifest, null, 2)+'\n');
console.log('Published approved Boss Khan combo without regenerating PNGs.');
