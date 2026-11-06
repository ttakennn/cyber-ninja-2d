import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(readFileSync(resolve(repo, 'integration/task-010-boss-khan/animation/approved-plan.json'), 'utf8'));
if (plan.status !== 'USER_APPROVED_PRODUCTION_ART') throw new Error('Artwork chưa được chốt');
const source = resolve(repo, plan.sourceReview), target = resolve(repo, plan.destination);
const data = JSON.parse(readFileSync(resolve(source, 'atlas.json'), 'utf8'));
const files = ['assets/boss-khan-v1.png','assets/ninja-idle.png'];
for (const sheet of plan.approvedSheets) files.push(data.assets[sheet].image, data.assets[sheet].image.replace(/\.png$/, '.json'), sheet+'-contact.png');
const hashes = {};
for (const file of files) {
  mkdirSync(dirname(resolve(target, file)), { recursive: true });
  copyFileSync(resolve(source, file), resolve(target, file));
  hashes[file] = createHash('sha256').update(readFileSync(resolve(source, file))).digest('hex');
}
data.status = plan.status;
data.approvedClips = plan.approvedClips;
data.assets = Object.fromEntries(plan.approvedSheets.map(name => [name, data.assets[name]]));
data.clips = Object.fromEntries(plan.approvedClips.map(name => [name, data.clips[name]]));
writeFileSync(resolve(target, 'atlas.json'), JSON.stringify(data, null, 2)+'\n');
writeFileSync(resolve(target, 'review-data.js'), 'window.bossKhanAnimationReview='+JSON.stringify(data)+';\n');
let html = readFileSync(resolve(source, 'preview.html'), 'utf8');
html = html.replace('Candidate để duyệt art.', 'Bộ động tác cơ bản đã được người dùng chốt.')
  .replace('Động tác cơ bản', 'Động tác cơ bản đã chốt');
writeFileSync(resolve(target, 'preview.html'), html);
writeFileSync(resolve(target, 'production.json'), JSON.stringify({ ...plan, files: hashes, runtimeValidation: 'NOT_RUN' }, null, 2)+'\n');
console.log('Published approved Boss Khan motion art without regenerating PNGs.');
