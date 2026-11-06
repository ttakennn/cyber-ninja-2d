import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(readFileSync(resolve(repo, 'integration/task-010-boss-khan/entrance/approved-plan.json'), 'utf8'));
if (plan.status !== 'USER_APPROVED_PRODUCTION_ART') throw new Error('Artwork chưa được chốt');
const source = resolve(repo, plan.sourceReview), target = resolve(repo, plan.destination);
const approved = JSON.parse(readFileSync(resolve(source, 'atlas.json'), 'utf8'));
const base = JSON.parse(readFileSync(resolve(target, 'atlas.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(resolve(target, 'production.json'), 'utf8'));
const entrance = resolve(target, 'entrance');
mkdirSync(resolve(entrance, 'sheets'), { recursive: true });
mkdirSync(resolve(entrance, 'assets'), { recursive: true });
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const files = manifest.files;
for (const name of plan.approvedSheets) {
  for (const extension of ['png', 'json']) {
    const relative = `candidate/${name}.${extension}`;
    const destination = resolve(entrance, `sheets/${name}.${extension}`);
    if (extension === 'png') copyFileSync(resolve(source, relative), destination);
    else {
      const metadata = JSON.parse(readFileSync(resolve(source, relative), 'utf8'));
      metadata.image = `sheets/${name}.png`;
      writeFileSync(destination, JSON.stringify(metadata, null, 2)+'\n');
    }
    files[`entrance/sheets/${name}.${extension}`] = hash(destination);
  }
  const contact = `${name}-contact.png`;
  copyFileSync(resolve(source, contact), resolve(entrance, contact));
  files[`entrance/${contact}`] = hash(resolve(entrance, contact));
  approved.assets[name].image = `sheets/${name}.png`;
  base.assets[name] = { ...approved.assets[name], image: `entrance/sheets/${name}.png` };
}
for (const name of ['boss-khan-v1.png', 'ninja-idle.png']) {
  copyFileSync(resolve(source, 'assets', name), resolve(entrance, 'assets', name));
  files[`entrance/assets/${name}`] = hash(resolve(entrance, 'assets', name));
}
approved.status = plan.status;
approved.approvedSequence = 'entrance';
base.entrance = { timelineMs: approved.timelineMs, bodySequence: approved.bodySequence, status: plan.status };
writeFileSync(resolve(entrance, 'atlas.json'), JSON.stringify(approved, null, 2)+'\n');
writeFileSync(resolve(entrance, 'review-data.js'), 'window.bossKhanAnimationReview='+JSON.stringify(approved)+';\n');
let html = readFileSync(resolve(source, 'preview.html'), 'utf8');
html = html.replace('Art candidate chờ bạn duyệt.', 'Hoạt ảnh xuất hiện đã được người dùng chốt.');
writeFileSync(resolve(entrance, 'preview.html'), html);
writeFileSync(resolve(target, 'atlas.json'), JSON.stringify(base, null, 2)+'\n');
manifest.approvedEntrance = plan.sourceReview;
manifest.files = files;
writeFileSync(resolve(target, 'production.json'), JSON.stringify(manifest, null, 2)+'\n');
console.log('Published approved Boss Khan entrance without regenerating PNGs.');
