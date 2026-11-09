import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const repo = new URL('../', import.meta.url);
const plan = JSON.parse(readFileSync(new URL('integration/ninja-animation-library/production-plan.json', repo), 'utf8'));
if (plan.status !== 'USER_APPROVED_PRODUCTION_ART') throw new Error('Chỉ publish art đã được người dùng chốt.');
const out = new URL(plan.productionDirectory+'/', repo);
const sheets = {}, manifests = {}, files = [];
for (const group of plan.groups) {
  const source = new URL(group.source+'/', repo), destination = new URL(group.id+'/', out);
  mkdirSync(destination, { recursive: true });
  const names = group.files;
  if (!Array.isArray(names) || !names.length) throw new Error('Thiếu danh sách file đã duyệt: '+group.id);
  for (const name of names) {
    const origin = group.fileSources?.[name] ? new URL(group.fileSources[name], repo) : new URL(name, source), target = new URL(name, destination), bytes = readFileSync(origin);
    copyFileSync(origin, target);
    files.push({ path:group.id+'/'+name, source:group.fileSources?.[name] ?? group.source+'/'+name, sha256:createHash('sha256').update(bytes).digest('hex') });
    if (!name.endsWith('.json')) continue;
    const value = JSON.parse(bytes.toString('utf8'));
    if (value.clips && value.image) sheets[group.id+'/'+name.replace(/\.json$/,'')] = { image:group.id+'/'+value.image, metadata:group.id+'/'+name, sheet:value };
    else if (name === 'manifest.json') manifests[group.id] = value;
  }
}
for (const entrance of plan.entrances) {
  const authoring = JSON.parse(readFileSync(new URL(entrance.plan, repo), 'utf8'));
  const destination = new URL(entrance.path.replace(/preview\.html$/,''), out);
  const atlas = JSON.parse(readFileSync(new URL('atlas.json', destination), 'utf8'));
  atlas.status = authoring.status;
  writeFileSync(new URL('atlas.json', destination), JSON.stringify(atlas,null,2)+'\n');
  writeFileSync(new URL('review-data.js', destination), 'window.fireEntrance='+JSON.stringify(atlas)+';\n');
  for (const asset of Object.values(atlas.assets)) files.push({ path:entrance.path.replace(/preview\.html$/,'')+asset.image,
    source:entrance.plan.replace(/art-plan\.json$/,'')+asset.source, sha256:asset.sha256 });
}
const production = { status:plan.status, character:plan.character, plan:'integration/ninja-animation-library/production-plan.json',
  artApproval:plan.idleRelease?.status==='USER_AUTHORIZED_RELEASE_AFTER_SELF_REVIEW'?'USER_APPROVED_BASE_WITH_DELEGATED_IDLE_RELEASE':'USER_APPROVED', idleRelease:plan.idleRelease, runtimeAcceptance:'NOT_RUN_THIS_TASK', climb:plan.climb, files, entrances:plan.entrances,
  notes:[plan.note,'Các manifest/JSON copy nguyên file; đường source/plan lịch sử tính từ repo, không tự chỉnh gameplay.'] };
writeFileSync(new URL('production.json', out), JSON.stringify(production,null,2)+'\n');
writeFileSync(new URL('review-data.js', out), 'window.ninjaLibrary='+JSON.stringify({production,sheets,manifests})+';\n');
copyFileSync(new URL('integration/ninja-climb/climb-poses.png', repo), new URL('locomotion/climb-poses.png', out));
console.log('Published approved Ninja animation files and preview metadata; source PNG bytes preserved, runtime unchanged.');

